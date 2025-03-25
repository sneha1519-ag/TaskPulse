import {
    createEvent,
    deleteEvent,
    listEvents,
    updateEvent
} from '@/lib/google-calendar.js';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(req) {
  const session = await auth();
  
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const url = new URL(req.url);
  const timeMin = url.searchParams.get('timeMin') || new Date().toISOString();
  const timeMax = url.searchParams.get('timeMax') || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  
  try {
    const events = await listEvents(session.accessToken, timeMin, timeMax);
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await auth();
  
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const eventData = await req.json();
    const event = await createEvent(session.accessToken, eventData);
    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

export async function PUT(req) {
  const session = await auth();
  
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { eventId, eventData } = await req.json();
    const event = await updateEvent(session.accessToken, eventId, eventData);
    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await auth();
  
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { eventId } = await req.json();
    await deleteEvent(session.accessToken, eventId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}