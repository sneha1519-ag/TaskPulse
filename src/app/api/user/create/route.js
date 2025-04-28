import { NextResponse } from 'next/server';
import { dbConnect } from '@/db/db-connect';
import { User } from '@/db/models';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        await dbConnect();

        const { email, password, firstName, lastName, role } = await req.json();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
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
            role: role || 'user',
        });

        return NextResponse.json(
            { message: 'User created successfully', user: { id: user._id, email: user.email } },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        );
    }
} 