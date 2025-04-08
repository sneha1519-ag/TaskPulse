import { NextResponse } from 'next/server';
import { dbConnect } from '@/db/db-connect';
import { Invitation, User } from '@/db/models';
import { auth } from '@/auth';
import crypto from 'crypto';
import { Resend } from 'resend';
import mongoose from 'mongoose';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Function to generate a random token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Function to send invitation email
async function sendInvitationEmail(email, token) {
  // Generate invitation link
  const invitationLink = `${process.env.NEXTAUTH_URL}/register?token=${token}`;

  // Send email using Resend
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: ['sneha221agarwal@gmail.com'],
    subject: 'Hello world',
    html: `
      <h1>You've been invited!</h1>
      <p>You have been invited to join our platform. Click the link below to register:</p>
      <a href="${invitationLink}">Accept Invitation</a>
      <p>This invitation will expire in 7 days.</p>
    `,
  });
  if (error) {
    console.log("Email Error - ", error);
  }else{
    console.log("Email Data - ", data)
  }
}

// POST - Create a new invitation
export async function POST(request) {
  try {
    // Authenticate the user
    const session = await auth();
    // Check if the user is authenticated and is an admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json();
    const { email } = body;
    // console.log("email - ", email);

    // Validate email
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Connect to the database
    const d = await dbConnect();
    // console.log("database - ", d);

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Check if an invitation already exists for this email
    let invitation = await Invitation.findOne({ email, status: 'pending' });
    // console.log("invitation - ",invitation);
    
    if (invitation) {
      // Generate a new token and update expiration if the invitation exists
      const token = generateToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expire in 7 days
      
      invitation.token = token;
      invitation.expiresAt = expiresAt;
      invitation.status = 'pending';
      await invitation.save();
    } else {
      // Create a new invitation
      const token = generateToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expire in 7 days
      
      invitation = new Invitation({
        email,
        invitedBy: new mongoose.Types.ObjectId(session.user.id),
        token,
        expiresAt,
        status: 'pending'
      });
      
      const final = await invitation.save();
      console.log("Final - ", final)
    }

    // Send the invitation email
    await sendInvitationEmail(email, invitation.token);

    return NextResponse.json(
      { 
        message: 'Invitation sent successfully',
        invitation: {
          email: invitation.email,
          status: invitation.status,
          expiresAt: invitation.expiresAt
        }
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - Get all invitations (admin only)
export async function GET(request) {
  try {
    // Authenticate the user
    const session = await auth();
    // console.log("Session - ", session);
    
    // Check if the user is authenticated and is an admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to the database
    const d = await dbConnect();
    // console.log("database - ", d);

    // Get all invitations
    const invitations = await Invitation.find().populate('invitedBy', 'firstName lastName email');
    // console.log("invitations - ", invitations);

    return NextResponse.json({ invitations }, { status: 200 });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 