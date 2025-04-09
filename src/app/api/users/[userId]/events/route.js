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
      startTime: eventData.startDateTime || eventData.start?.dateTime,
      endTime: eventData.endDateTime || eventData.end?.dateTime,
      userId: userId
    };

    console.log('Creating event with data:', transformedData);

    // Ensure dates are in proper ISO format
    try {
      if (transformedData.startTime) {
        transformedData.startTime = new Date(transformedData.startTime).toISOString();
      }
      if (transformedData.endTime) {
        transformedData.endTime = new Date(transformedData.endTime).toISOString();
      }
    } catch (e) {
      console.error('Error formatting event dates:', e);
    }

    // Create the event with proper handling of createdBy
    const newEvent = new Event({
      ...transformedData,
      createdBy: new mongoose.Types.ObjectId(session.user.id)
    });

    try {
      await newEvent.save();
      console.log('Event saved successfully:', newEvent);
      return NextResponse.json({ event: newEvent }, { status: 201 });
    } catch (error) {
      console.error('Error saving event:', error);
      return NextResponse.json({ error: error.message || 'Failed to create event' }, { status: 500 });
    }
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