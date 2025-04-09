import { NextResponse } from 'next/server';
import { dbConnect } from '@/db/db-connect';
import { Invitation } from '@/db/models';

// GET - Verify invitation token
export async function GET(request) {
  try {
    // Get the token from the URL
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    console.log('Verifying token:', token);

    if (!token) {
      console.error('No token provided');
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Connect to the database
    try {
      await dbConnect();
      console.log('Database connected successfully');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }

    // Find the invitation by token
    const invitation = await Invitation.findOne({ token });
    console.log('Found invitation:', invitation ? 'yes' : 'no');

    if (!invitation) {
      console.error('Invalid token - no invitation found');
      return NextResponse.json({ error: 'Invalid invitation token' }, { status: 400 });
    }

    // Check if the invitation has expired
    const now = new Date();
    const isExpired = invitation.status === 'expired' || now > invitation.expiresAt;
    console.log('Invitation status:', invitation.status);
    console.log('Expiration check:', {
      now,
      expiresAt: invitation.expiresAt,
      isExpired
    });

    if (isExpired) {
      console.log('Marking invitation as expired');
      invitation.status = 'expired';
      await invitation.save();
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
    }

    // Return the invitation details
    const response = {
      invitation: {
        email: invitation.email,
        status: invitation.status,
        expiresAt: invitation.expiresAt
      }
    };
    console.log('Returning successful response:', response);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error in verify route:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
} 