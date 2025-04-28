import { NextResponse } from 'next/server';
import { dbConnect } from '@/db/db-connect';
import { Task, User } from '@/db/models';
import { auth } from '@/auth';

export async function PATCH(request, { params }) {
  try {
    // Await the params to ensure they are available
    const { taskId } = await params;
    const { status } = await request.json();

    console.log('Updating task:', taskId, 'to status:', status);

    // Connect to database
    await dbConnect();

    // Find the task
    const task = await Task.findById(taskId).populate('assignedTo');
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    console.log('Current task status:', task.status);
    console.log('Task priority:', task.priority);
    console.log('Assigned user:', task.assignedTo);

    // Update task status
    const previousStatus = task.status;
    task.status = status;
    
    // If task is cancelled, remove it from user's tasks
    if (status === 'cancelled') {
      console.log('Task is being cancelled');
      // Remove the task from user's tasks
      await User.findByIdAndUpdate(
        task.assignedTo._id,
        { $pull: { tasks: taskId } }
      );
      console.log('Task removed from user\'s tasks');
    }
    // If task is completed, calculate and award points
    else if (status === 'completed' && previousStatus !== 'completed') {
      console.log('Task is being marked as completed');
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

      console.log('Points to award:', pointsToAward);

      // Update user's points
      const user = await User.findById(task.assignedTo._id);
      if (user) {
        console.log('Current user points before update:', user.points);
        const newPoints = (user.points || 0) + pointsToAward;
        console.log('Calculated new points:', newPoints);
        
        // Update user points using findByIdAndUpdate to ensure atomic update
        const updatedUser = await User.findByIdAndUpdate(
          user._id,
          { $set: { points: newPoints } },
          { new: true }
        );
        
        console.log('User after update:', updatedUser);
        console.log('User points updated in database');
      } else {
        console.log('User not found for points update');
      }

      // Set completedAt timestamp
      task.completedAt = new Date();
    } else {
      console.log('Task status is being updated to:', status);
    }

    await task.save();
    console.log('Task status updated in database');

    // Get the updated user points
    const updatedUser = await User.findById(task.assignedTo._id);
    console.log('Final user points from database:', updatedUser.points);

    return NextResponse.json({ 
      message: 'Task status updated successfully',
      task,
      userPoints: updatedUser.points
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 