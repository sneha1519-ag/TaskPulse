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

// Function to generate a random password (6-8 digits)
const generatePassword = () => {
  // Generate a random number between 100000 and 99999999 (6-8 digits)
  return Math.floor(100000 + Math.random() * 90000000).toString();
};

// Function to send invitation email with credentials
async function sendInvitationEmail(email, password) {
  // Send email using Resend
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: [email],
    subject: 'You have been invited to join our platform',
    html: `
      <h1>You've been invited!</h1>
      <p>You have been invited to join our platform. Here are your login credentials:</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${password}</p>
      <p>Please use these credentials to login to our platform.</p>
      <p>For security reasons, we recommend changing your password after your first login.</p>
    `,
  });
  
  if (error) {
    console.log("Email Error - ", error);
    return { success: false, error };
  } else {
    console.log("Email Data - ", data);
    return { success: true, data };
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

    // Validate email
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Connect to the database
    await dbConnect();

    // Check if the user already exists
    let existingUser = await User.findOne({ email });
    let newUser = false;
    let password = '';

    if (!existingUser) {
      // Generate a random password
      password = generatePassword();
      // Store password as plain text (no hashing)

      // Create a new user
      const firstName = email.split('@')[0];
      const lastName = 'User';

      existingUser = new User({
        email,
        firstName,
        lastName,
        password: password, // Store password in plain text
        role: 'user',
        isActive: true
      });

      await existingUser.save();
      newUser = true;
    }

    // Create a new invitation token (for tracking purposes)
    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expire in 7 days
    
    const invitation = new Invitation({
      email,
      invitedBy: new mongoose.Types.ObjectId(session.user.id),
      token,
      expiresAt,
      status: 'pending'
    });
    
    await invitation.save();

    // Send the invitation email with credentials
    if (newUser) {
      await sendInvitationEmail(email, password);
    } else {
      // For existing users, we could send a different notification
      // But for now, we'll just return success without sending an email
    }

    return NextResponse.json(
      { 
        message: newUser ? 'User created and invitation sent successfully' : 'User already exists',
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
    
    // Check if the user is authenticated and is an admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to the database
    await dbConnect();

    // Get all invitations
    const invitations = await Invitation.find().populate('invitedBy', 'firstName lastName email');

    return NextResponse.json({ invitations }, { status: 200 });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 