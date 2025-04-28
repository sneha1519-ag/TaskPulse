import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { dbConnect } from '@/db/db-connect';
import { User, Task } from '@/db/models';

// GET - Get admin analytics data (admin only)
export async function GET(req) {
  try {
    // Verify admin user
    const session = await auth();
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Connect to the database
    await dbConnect();
    
    // Get tasks with assigned users
    const tasks = await Task.find().populate({
      path: 'assignedTo',
      select: 'id firstName lastName email'
    });
    
    // Get all users except admins
    const users = await User.find(
      { role: { $ne: 'admin' } },
      'id firstName lastName email'
    );
    
    // Group tasks by priority
    const tasksByPriority = {
      low: tasks.filter(task => task.priority === 'low'),
      medium: tasks.filter(task => task.priority === 'medium'),
      high: tasks.filter(task => task.priority === 'high'),
      urgent: tasks.filter(task => task.priority === 'urgent'),
    };
    
    // Group tasks by status
    const tasksByStatus = {
      pending: tasks.filter(task => task.status === 'pending'),
      in_progress: tasks.filter(task => task.status === 'in_progress'),
      completed: tasks.filter(task => task.status === 'completed'),
      cancelled: tasks.filter(task => task.status === 'cancelled'),
    };
    
    // Generate task completion trend (last 6 months)
    const taskCompletionTrend = generateTaskCompletionTrend(tasks);
    
    // Generate task distribution by user
    const taskDistributionByUser = generateTaskDistributionByUser(tasks, users);
    
    // Get recent activity
    const recentActivity = await getRecentActivity();
    
    return NextResponse.json({
      tasksByPriority,
      tasksByStatus,
      taskCompletionTrend,
      taskDistributionByUser,
      allTasks: tasks,
      recentActivity,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

// Helper function to generate task completion trend for last 6 months
function generateTaskCompletionTrend(tasks) {
  const months = [];
  const today = new Date();
  
  // Generate last 6 months
  for (let i = 5; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = month.toLocaleString('default', { month: 'short' });
    months.push({
      name: monthName,
      month: month.getMonth(),
      year: month.getFullYear(),
    });
  }
  
  // Count tasks for each month
  return months.map(monthData => {
    const { month, year, name } = monthData;
    
    // Tasks created in this month
    const createdTasks = tasks.filter(task => {
      const createdDate = new Date(task.createdAt);
      return createdDate.getMonth() === month && createdDate.getFullYear() === year;
    });
    
    // Tasks completed in this month
    const completedTasks = tasks.filter(task => {
      if (task.status !== 'completed') return false;
      const updatedDate = new Date(task.updatedAt);
      return updatedDate.getMonth() === month && updatedDate.getFullYear() === year;
    });
    
    return {
      name,
      Created: createdTasks.length,
      Completed: completedTasks.length,
    };
  });
}

// Helper function to generate task distribution by user
function generateTaskDistributionByUser(tasks, users) {
  return users.map(user => {
    const userTasks = tasks.filter(task => task.assignedTo && task.assignedTo._id.toString() === user._id.toString());
    const completedTasks = userTasks.filter(task => task.status === 'completed');
    
    return {
      name: `${user.firstName} ${user.lastName}`,
      tasks: userTasks.length,
      completed: completedTasks.length,
    };
  });
}

// Helper function to get recent activity
async function getRecentActivity() {
  // For simplicity, we'll create dummy recent activity data
  // In a real app, you might have an activity log table
  const recentEvents = [
    { id: 1, user: 'Jane Smith', action: 'completed', task: 'Update documentation', time: '2 hours ago' },
    { id: 2, user: 'John Doe', action: 'created', task: 'Design new landing page', time: '3 hours ago' },
    { id: 3, user: 'Emma Wilson', action: 'updated', task: 'API integration', time: '5 hours ago' },
    { id: 4, user: 'Robert Johnson', action: 'cancelled', task: 'Legacy code refactoring', time: '1 day ago' },
    { id: 5, user: 'Michael Brown', action: 'assigned', task: 'Mobile app testing', time: '1 day ago' },
  ];
  
  return recentEvents;
} 