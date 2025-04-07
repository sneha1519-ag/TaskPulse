import { NextResponse } from 'next/server';
import { dbConnect } from '@/db/db-connect';
import { Invitation } from '@/db/models';

// GET - Verify invitation token
export async function GET(request) {
  try {
    // Get the token from the URL
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Connect to the database
    await dbConnect();

    // Find the invitation by token
    const invitation = await Invitation.findOne({ token });

    if (!invitation) {
      return NextResponse.json({ error: 'Invalid invitation token' }, { status: 400 });
    }

    // Check if the invitation has expired
    if (invitation.status === 'expired' || new Date() > invitation.expiresAt) {
      invitation.status = 'expired';
      await invitation.save();
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
    }

    // Return the invitation details
    return NextResponse.json({
      invitation: {
        email: invitation.email,
        status: invitation.status,
        expiresAt: invitation.expiresAt
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error verifying invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 