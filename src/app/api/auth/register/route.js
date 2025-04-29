import { NextResponse } from 'next/server';
import { dbConnect } from '@/db/db-connect';
import { User } from '@/db/models';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const { email, password, firstName, lastName, role = 'user' } = await request.json();

        // Validate input
        if (!email || !password || !firstName || !lastName) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Connect to database
        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role
        });

        // Return user without password
        const { password: _, ...userWithoutPassword } = user.toObject();

        return NextResponse.json(
            { user: userWithoutPassword },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "An error occurred during registration" },
            { status: 500 }
        );
    }
} 