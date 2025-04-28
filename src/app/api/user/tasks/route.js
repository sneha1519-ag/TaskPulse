import { NextResponse } from 'next/server';
import { dbConnect } from '@/db/db-connect';
import { Task, User } from '@/db/models';
import { auth } from '@/auth';
import { cookies } from 'next/headers';

// GET - Get tasks assigned to the current user
export async function GET(req) {
  try {
    // First try to authenticate with next-auth
    const session = await auth();
    let userEmail = session?.user?.email;
    let userId = session?.user?.id || session?.user?._id;
    
    // If no session auth, check for query params and headers
    if (!userEmail && !userId) {
      const url = new URL(req.url);
      
      // Check query parameters
      const emailParam = url.searchParams.get('email');
      const userIdParam = url.searchParams.get('userId');
      
      // Check headers
      const emailHeader = req.headers.get('X-User-Email');
      const userIdHeader = req.headers.get('X-User-ID');
      
      userEmail = emailParam || emailHeader;
      userId = userIdParam || userIdHeader;
      
      if (!userEmail && !userId) {
        return NextResponse.json(
          { error: 'Unauthorized - No valid user identification provided' },
          { status: 401 }
        );
      }
      
      console.log('Using header/query auth:', { userEmail, userId });
    } else {
      console.log('Using session auth:', { userEmail, userId });
    }
    
    await dbConnect();
    
    // Find the user by email, ID or both
    const userQuery = {
      $or: []
    };
    
    if (userEmail) userQuery.$or.push({ email: userEmail });
    if (userId) userQuery.$or.push({ _id: userId });
    
    if (userQuery.$or.length === 0) {
      return NextResponse.json(
        { error: 'Missing user identification' },
        { status: 400 }
      );
    }
    
    console.log('Finding user with query:', JSON.stringify(userQuery));
    const user = await User.findOne(userQuery);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found with provided credentials' },
        { status: 404 }
      );
    }
    
    console.log(`Fetching tasks for user: ${user.email} (${user._id})`);
    
    // Find all tasks assigned to the user
    const tasks = await Task.find({ assignedTo: user._id })
      .populate('assignedBy', 'firstName lastName email')
      .sort({ dueDate: 1 });
    
    console.log(`Found ${tasks.length} tasks for user ${user.email}`);
    
    // Group tasks by status
    const tasksByStatus = {
      pending: tasks.filter(task => task.status === 'pending'),
      in_progress: tasks.filter(task => task.status === 'in_progress'),
      completed: tasks.filter(task => task.status === 'completed'),
      cancelled: tasks.filter(task => task.status === 'cancelled')
    };
    
    // Group tasks by priority
    const tasksByPriority = {
      low: tasks.filter(task => task.priority === 'low'),
      medium: tasks.filter(task => task.priority === 'medium'),
      high: tasks.filter(task => task.priority === 'high'),
      urgent: tasks.filter(task => task.priority === 'urgent')
    };
    
    // Count tasks by status
    const taskCounts = {
      total: tasks.length,
      pending: tasksByStatus.pending.length,
      in_progress: tasksByStatus.in_progress.length,
      completed: tasksByStatus.completed.length,
      cancelled: tasksByStatus.cancelled.length
    };
    
    return NextResponse.json({
      tasks,
      tasksByStatus,
      tasksByPriority,
      taskCounts
    });
    
  } catch (error) {
    console.error('Error in GET /api/user/tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update task status (for user to mark as in progress, completed, etc.)
export async function PATCH(req) {
  try {
    // First try to authenticate with next-auth
    const session = await auth();
    let userEmail = session?.user?.email;
    let userId = session?.user?.id || session?.user?._id;
    
    // If no session auth, check for query params and headers
    if (!userEmail && !userId) {
      // Check headers
      const emailHeader = req.headers.get('X-User-Email');
      const userIdHeader = req.headers.get('X-User-ID');
      
      userEmail = emailHeader;
      userId = userIdHeader;
      
      if (!userEmail && !userId) {
        return NextResponse.json(
          { error: 'Unauthorized - No valid user identification provided' },
          { status: 401 }
        );
      }
    }
    
    // Get the request data
    const data = await req.json();
    const { taskId, status } = data;
    
    // Validate input
    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }
    
    if (!status || !['pending', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Find the user by email, ID or both
    const userQuery = {
      $or: []
    };
    
    if (userEmail) userQuery.$or.push({ email: userEmail });
    if (userId) userQuery.$or.push({ _id: userId });
    
    if (userQuery.$or.length === 0) {
      return NextResponse.json(
        { error: 'Missing user identification' },
        { status: 400 }
      );
    }
    
    const user = await User.findOne(userQuery);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found with provided credentials' },
        { status: 404 }
      );
    }
    
    console.log(`Updating task ${taskId} for user: ${user.email} (${user._id})`);
    
    // Find the task and ensure it belongs to the user
    const task = await Task.findOne({
      _id: taskId,
      assignedTo: user._id
    });
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found or not assigned to you' },
        { status: 404 }
      );
    }
    
    const previousStatus = task.status;
    
    // Update task status
    task.status = status;
    
    // If task is completed, set completedAt and award points
    if (status === 'completed' && !task.completedAt) {
      task.completedAt = new Date();
      
      // Check if this is a newly completed task (prevent double-awarding points)
      if (previousStatus !== 'completed') {
        // Award points based on task priority
        let pointsToAward = 0;
        
        switch(task.priority) {
          case 'low':
            pointsToAward = 5;
            break;
          case 'medium':
            pointsToAward = 7;
            break;
          case 'high':
          case 'urgent':
            pointsToAward = 10;
            break;
          default:
            pointsToAward = 5;
        }
        
        console.log(`Awarding ${pointsToAward} points for completing task with priority ${task.priority}`);
        
        // Update user points
        user.points = (user.points || 0) + pointsToAward;
        await user.save();
        
        console.log(`Updated user points to ${user.points}`);
      }
    } else if (status !== 'completed') {
      task.completedAt = null;
    }
    
    await task.save();
    
    console.log(`Task ${taskId} updated to status: ${status}`);
    
    return NextResponse.json({
      message: 'Task status updated successfully',
      task,
      userPoints: user.points
    });
    
  } catch (error) {
    console.error('Error in PATCH /api/user/tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
} 