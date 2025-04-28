import { NextResponse } from 'next/server';
import { dbConnect } from '@/db/db-connect';
import { User } from '@/db/models';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        await dbConnect();

        const { email, password } = await req.json();

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check if user is an admin
        if (user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Access denied. Admin privileges required.' },
                { status: 403 }
            );
        }

        // Return success response
        return NextResponse.json(
            { 
                message: 'Login successful',
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
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