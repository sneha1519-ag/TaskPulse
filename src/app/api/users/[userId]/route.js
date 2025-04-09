import { NextResponse } from 'next/server';
import { dbConnect } from '@/db/db-connect';
import { User, Task, Event } from '@/db/models';
import { auth } from '@/auth';
import mongoose from 'mongoose';

// GET - Get user details by ID with their tasks and events (admin only)
export async function GET(request, { params }) {
  try {
    // Authenticate the user
    const session = await auth();
    
    // Check if the user is authenticated and is an admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = params;

    // Connect to the database
    await dbConnect();

    // Get user (excluding password)
    const user = await User.findById(userId, { password: 0 });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get tasks assigned to the user
    const tasks = await Task.find({ assignedTo: userId });
    
    // Group tasks by priority
    const tasksByPriority = {
      low: tasks.filter(task => task.priority === 'low'),
      medium: tasks.filter(task => task.priority === 'medium'),
      high: tasks.filter(task => task.priority === 'high'),
      urgent: tasks.filter(task => task.priority === 'urgent')
    };

    // Get count of tasks by status
    const taskCounts = {
      total: tasks.length,
      pending: tasks.filter(task => task.status === 'pending').length,
      in_progress: tasks.filter(task => task.status === 'in_progress').length,
      completed: tasks.filter(task => task.status === 'completed').length,
      cancelled: tasks.filter(task => task.status === 'cancelled').length,
    };

    // Get events for the user
    const events = await Event.find({ userId: userId });

    return NextResponse.json({ 
      user, 
      tasks, 
      tasksByPriority,
      taskCounts,
      events 
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a task for a specific user (admin only)
export async function POST(request, { params }) {
  try {
    // Authenticate the user
    const session = await auth();
    
    // Check if the user is authenticated and is an admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = params;
    const taskData = await request.json();

    // Connect to the database
    await dbConnect();

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create the task with proper handling of assignedBy
    const newTask = new Task({
      ...taskData,
      assignedTo: userId,
      assignedBy: new mongoose.Types.ObjectId(session.user.id) // Handle both formats
    });

    await newTask.save();

    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 