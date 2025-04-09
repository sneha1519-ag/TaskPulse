import { NextResponse } from 'next/server';
import { dbConnect } from '@/db/db-connect';
import { User, Event } from '@/db/models';
import { auth } from '@/auth';
import mongoose from 'mongoose';

// POST - Create an event for a specific user (admin only)
export async function POST(request, { params }) {
  try {
    // Authenticate the user
    const session = await auth();
    
    // Check if the user is authenticated and is an admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = params;
    const eventData = await request.json();

    // Connect to the database
    await dbConnect();

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Transform the data to match the Event model structure
    const transformedData = {
      title: eventData.title,
      description: eventData.description,
      location: eventData.location,
      startTime: eventData.start?.dateTime || new Date(eventData.startDateTime).toISOString(),
      endTime: eventData.end?.dateTime || new Date(eventData.endDateTime).toISOString(),
      userId: userId
    };

    // Create the event with proper handling of createdBy
    const newEvent = new Event({
      ...transformedData,
      createdBy: new mongoose.Types.ObjectId(session.user.id)
    });

    await newEvent.save();

    return NextResponse.json({ event: newEvent }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// GET - Get all events for a specific user (admin only)
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

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get events for the user
    const events = await Event.find({ userId: userId });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 