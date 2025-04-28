import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { dbConnect } from '@/db/db-connect';
import { User, Task } from '@/db/models';
import mongoose from 'mongoose';

// GET - Get user analytics data (admin only)
export async function GET(request, { params }) {
  try {
    const session = await auth();
    
    // Check if user is authenticated and is an admin
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = params.userId;
    
    // Connect to the database
    await dbConnect();
    
    // Get user details
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Get all tasks for this user
    const tasks = await Task.find({ assignedTo: userId });
    
    // Group tasks by priority
    const tasksByPriority = {
      low: tasks.filter(task => task.priority === 'low'),
      medium: tasks.filter(task => task.priority === 'medium'),
      high: tasks.filter(task => task.priority === 'high'),
      urgent: tasks.filter(task => task.priority === 'urgent')
    };
    
    // Group tasks by status
    const tasksByStatus = {
      pending: tasks.filter(task => task.status === 'pending'),
      in_progress: tasks.filter(task => task.status === 'in_progress'),
      completed: tasks.filter(task => task.status === 'completed'),
      cancelled: tasks.filter(task => task.status === 'cancelled')
    };
    
    // Generate performance metrics
    const totalTasks = tasks.length;
    const completedTasks = tasksByStatus.completed.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Calculate on-time completion rate (assuming tasks have dueDate)
    const onTimeCompletions = tasks.filter(task => 
      task.status === 'completed' && 
      task.dueDate && 
      new Date(task.updatedAt) <= new Date(task.dueDate)
    ).length;
    
    const onTimeRate = completedTasks > 0 ? (onTimeCompletions / completedTasks) * 100 : 0;
    
    // Generate overall performance metrics
    const performanceMetrics = {
      completionRate: completionRate,
      onTimeRate: onTimeRate,
      taskQuality: 85, // Placeholder value
      productivity: 78, // Placeholder value
      engagement: 92   // Placeholder value
    };
    
    // Generate monthly events data (last 6 months)
    const eventsByMonth = generateMonthlyEvents(tasks);
    
    // Generate task trends data (created vs completed over time)
    const taskTrends = generateTaskTrends(tasks);
    
    return NextResponse.json({
      tasksByPriority,
      tasksByStatus,
      performanceMetrics,
      eventsByMonth,
      taskTrends
    });
    
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to generate monthly events data
function generateMonthlyEvents(tasks) {
  const months = [];
  const today = new Date();
  
  // Generate last 6 months
  for (let i = 5; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = month.toLocaleString('default', { month: 'short' });
    
    // Count events in this month
    const eventsInMonth = tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate.getMonth() === month.getMonth() && 
             taskDate.getFullYear() === month.getFullYear();
    }).length;
    
    months.push({
      name: monthName,
      events: eventsInMonth
    });
  }
  
  return months;
}

// Helper function to generate task trends
function generateTaskTrends(tasks) {
  const months = [];
  const today = new Date();
  
  // Generate last 6 months
  for (let i = 5; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = month.toLocaleString('default', { month: 'short' });
    
    // Count created tasks in this month
    const createdTasks = tasks.filter(task => {
      const createdDate = new Date(task.createdAt);
      return createdDate.getMonth() === month.getMonth() && 
             createdDate.getFullYear() === month.getFullYear();
    }).length;
    
    // Count completed tasks in this month
    const completedTasks = tasks.filter(task => {
      if (task.status !== 'completed') return false;
      const completedDate = new Date(task.updatedAt);
      return completedDate.getMonth() === month.getMonth() && 
             completedDate.getFullYear() === month.getFullYear();
    }).length;
    
    months.push({
      name: monthName,
      created: createdTasks,
      completed: completedTasks
    });
  }
  
  return months;
} 