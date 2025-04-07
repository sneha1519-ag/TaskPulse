import { NextResponse } from 'next/server';
import { dbConnect } from '@/db/db-connect';
import { Invitation, User } from '@/db/models';
import bcrypt from 'bcryptjs';

// POST - Accept invitation and create user account
export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { token, firstName, lastName, password } = body;

    // Validate required fields
    if (!token || !firstName || !lastName || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    // Connect to the database
    await dbConnect();

    // Find the invitation by token
    const invitation = await Invitation.findOne({ token });

    if (!invitation) {
      return NextResponse.json({ error: 'Invalid invitation token' }, { status: 400 });
    }

    // Check if invitation has expired
    if (invitation.status === 'expired' || new Date() > invitation.expiresAt) {
      invitation.status = 'expired';
      await invitation.save();
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email: invitation.email });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Create a new user
    const user = new User({
      email: invitation.email,
      firstName,
      lastName,
      password, // Will be hashed by the pre-save hook in the user model
      role: 'user', // Default role for invited users
      isActive: true
    });

    await user.save();

    // Update invitation status
    invitation.status = 'accepted';
    await invitation.save();

    return NextResponse.json({
      message: 'Account created successfully',
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 