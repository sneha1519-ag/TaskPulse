import { NextResponse } from 'next/server';
import { dbConnect } from '@/db/db-connect';
import { User } from '@/db/models';
import { auth } from '@/auth';

export async function GET(request) {
  try {
    await dbConnect();
    console.log('GET /api/user/me - Attempting to get user data');
    
    const session = await auth();
    if (!session || !session.user?.email) {
      console.log('GET /api/user/me - No session found or no email in session');
      
      // Check headers for API-based auth
      const email = request.headers.get('X-User-Email');
      const userId = request.headers.get('X-User-ID');
      
      if (!email && !userId) {
        console.log('GET /api/user/me - No auth headers found either');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      console.log('GET /api/user/me - Using header auth:', { email, userId });
      
      // Try to find user by headers
      const userQuery = { $or: [] };
      if (email) userQuery.$or.push({ email });
      if (userId) userQuery.$or.push({ _id: userId });
      
      const user = await User.findOne(userQuery, { password: 0 });
      if (!user) {
        console.log('GET /api/user/me - User not found with header auth');
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      const userData = user.toObject();
      userData._id = userData._id.toString();
      userData.id = userData._id;
      
      console.log('GET /api/user/me - User found with header auth:', userData.email);
      return NextResponse.json({ user: userData }, { status: 200 });
    }
    
    console.log('GET /api/user/me - Session found, email:', session.user.email);
    const user = await User.findOne({ email: session.user.email }, { password: 0 });
    
    if (!user) {
      console.log('GET /api/user/me - User not found in database');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const userData = user.toObject();
    userData._id = userData._id.toString();
    userData.id = userData._id;
    
    console.log('GET /api/user/me - User found:', userData.email);
    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 