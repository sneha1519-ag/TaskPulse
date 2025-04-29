import { NextResponse } from 'next/server';
import { dbConnect } from '@/db/db-connect';
import { User } from '@/db/models';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await dbConnect();

    const { email, password } = await req.json();
    console.log('Login attempt for email:', email);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found with email:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user is a user (not an admin-only endpoint)
    if (user.role !== 'user') {
      console.log('Invalid role for user login. Role:', user.role);
      return NextResponse.json(
        { error: 'Invalid account type. Please use the correct login page.' },
        { status: 403 }
      );
    }

    console.log('Login successful for user:', email);
    
    // Return success response
    return NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          _id: user._id.toString(),
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          points: user.points || 0
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 