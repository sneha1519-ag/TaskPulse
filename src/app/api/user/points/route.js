import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { User } from "@/db/models";
import {dbConnect} from "@/db/db-connect.js";

export async function POST(request) {
  try {
    // Connect to the database
    await dbConnect();
    console.log('Points API: Connected to database');

    // Get the authenticated session
    const session = await auth();
    console.log('Points API: Session retrieved', session ? 'valid' : 'invalid');
    
    if (!session || !session.user) {
      console.log('Points API: No valid session found, checking headers');
      // Continue with header-based authentication
    }

    // Parse request body
    const body = await request.json();
    const { points } = body;
    console.log(`Points API: Request to add ${points} points`);
    
    if (!points || isNaN(points)) {
      console.error('Points API: Invalid points value', points);
      return NextResponse.json({ error: "Invalid points value" }, { status: 400 });
    }

    // Get user from headers or session
    const userEmail = request.headers.get('x-user-email') || session?.user?.email;
    const userId = request.headers.get('x-user-id') || session?.user?.id;

    console.log(`Points API: Looking up user with email: ${userEmail}, id: ${userId}`);

    if (!userEmail && !userId) {
      console.error('Points API: User identification missing');
      return NextResponse.json({ error: "User identification missing" }, { status: 400 });
    }

    // Find the user and update points
    let query = {};
    if (userId) {
      query._id = userId;
    } else {
      query.email = userEmail;
    }

    console.log('Points API: User query', query);

    // Find the user and update points
    const user = await User.findOne(query);
    
    if (!user) {
      console.error('Points API: User not found with query', query);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(`Points API: Found user ${user.firstName} ${user.lastName}, current points: ${user.points || 0}`);

    // Update user points (add to existing)
    const previousPoints = user.points || 0;
    user.points = previousPoints + points;
    await user.save();

    console.log(`Points API: Updated user points from ${previousPoints} to ${user.points}`);

    return NextResponse.json({ 
      success: true, 
      points: user.points,
      message: `Added ${points} points to user account`
    });
  } catch (error) {
    console.error("Error updating user points:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 