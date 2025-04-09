import { NextResponse } from 'next/server';
import { dbConnect } from '@/db/db-connect';
import { Invitation, User } from '@/db/models';
import bcrypt from 'bcryptjs';

// POST - Accept invitation and create user account
export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { token } = body;

    console.log('Accepting invitation with token:', token);

    // Validate required fields
    if (!token) {
      console.error('No token provided in request body');
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Connect to the database
    let db;
    try {
      db = await dbConnect();
      console.log('Database connected successfully');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({ 
        error: 'Database connection error',
        details: dbError.message 
      }, { status: 500 });
    }

    // Find the invitation by token
    let invitation;
    try {
      invitation = await Invitation.findOne({ token });
      console.log('Found invitation:', invitation ? 'yes' : 'no');
      if (invitation) {
        console.log('Invitation details:', {
          email: invitation.email,
          status: invitation.status,
          expiresAt: invitation.expiresAt
        });
      }
    } catch (findError) {
      console.error('Error finding invitation:', findError);
      return NextResponse.json({ 
        error: 'Error finding invitation',
        details: findError.message 
      }, { status: 500 });
    }

    if (!invitation) {
      console.error('Invalid token - no invitation found');
      return NextResponse.json({ error: 'Invalid invitation token' }, { status: 400 });
    }

    // Check if invitation has expired
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
      try {
        invitation.status = 'expired';
        await invitation.save();
      } catch (saveError) {
        console.error('Error saving expired status:', saveError);
        return NextResponse.json({ 
          error: 'Error updating invitation status',
          details: saveError.message 
        }, { status: 500 });
      }
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
    }

    // Check if the user already exists
    let existingUser;
    try {
      existingUser = await User.findOne({ email: invitation.email });
      console.log('Existing user check:', existingUser ? 'found' : 'not found');
    } catch (userError) {
      console.error('Error checking existing user:', userError);
      return NextResponse.json({ 
        error: 'Error checking existing user',
        details: userError.message 
      }, { status: 500 });
    }

    if (existingUser) {
      console.log('User already exists, updating invitation status');
      try {
        // Update invitation status to accepted
        invitation.status = 'accepted';
        await invitation.save();
      } catch (saveError) {
        console.error('Error saving accepted status:', saveError);
        return NextResponse.json({ 
          error: 'Error updating invitation status',
          details: saveError.message 
        }, { status: 500 });
      }
      
      return NextResponse.json({
        message: 'User already exists',
        user: {
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          role: existingUser.role
        }
      }, { status: 200 });
    }

    // Generate a random password for the new user
    const password = Math.random().toString(36).slice(-8);
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
      console.log('Generated password and hashed it');
    } catch (hashError) {
      console.error('Error hashing password:', hashError);
      return NextResponse.json({ 
        error: 'Error creating user password',
        details: hashError.message 
      }, { status: 500 });
    }

    // Create a new user
    const user = new User({
      email: invitation.email,
      firstName: invitation.email.split('@')[0], // Use email prefix as first name
      lastName: 'User', // Default last name since it's required
      password: hashedPassword,
      role: 'user', // Default role for invited users
      isActive: true
    });

    try {
      console.log('Saving new user');
      await user.save();
    } catch (saveError) {
      console.error('Error saving new user:', saveError);
      return NextResponse.json({ 
        error: 'Error creating user account',
        details: saveError.message 
      }, { status: 500 });
    }

    try {
      console.log('Updating invitation status to accepted');
      invitation.status = 'accepted';
      await invitation.save();
    } catch (saveError) {
      console.error('Error saving accepted status:', saveError);
      return NextResponse.json({ 
        error: 'Error updating invitation status',
        details: saveError.message 
      }, { status: 500 });
    }

    const response = {
      message: 'Account created successfully',
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    };
    console.log('Returning successful response:', response);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error in accept route:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
} 