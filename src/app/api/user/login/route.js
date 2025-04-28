import { NextResponse } from 'next/server';
import { dbConnect } from '@/db/db-connect';
import { User } from '@/db/models/index.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, resetPassword } = body;
    console.log('Login attempt with:', email);

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    console.log('Stored password format:', {
      length: user.password.length,
    });

    // For debugging only - show first and last few chars of password (REMOVE IN PRODUCTION)
    const maskedStoredPw = user.password.length > 8 
      ? `${user.password.substring(0, 4)}...${user.password.substring(user.password.length - 4)}`
      : '********';
    console.log('Masked stored password:', maskedStoredPw);

    // SPECIAL MODE: Reset password when resetPassword flag is true (REMOVE IN PRODUCTION)
    if (resetPassword === true) {
      console.log('RESETTING PASSWORD FOR:', email);
      
      // Update the user's password - no hashing
      user.password = password;
      user.lastLogin = new Date();
      await user.save();
      
      console.log('Password has been reset and user logged in');
      
      return NextResponse.json({
        message: 'Password reset successful',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        }
      });
    }

    // FORCE LOGIN FOR TESTING - REMOVE THIS IN PRODUCTION
    // This will allow any user to log in with the correct email and the password "test123"
    if (password === "test123") {
      console.log('Using test password override');
      
      // Update last login time
      user.lastLogin = new Date();
      await user.save();
      
      return NextResponse.json({
        message: 'Login successful (TEST MODE)',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        }
      });
    }

    // Validate password using direct comparison
    if (password === user.password) {
      console.log('Password matched directly');
      
      // Update last login time
      user.lastLogin = new Date();
      await user.save();
      
      return NextResponse.json({
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        }
      });
    } else {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 