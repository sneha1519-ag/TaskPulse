import { NextResponse } from 'next/server';
import { dbConnect } from '@/db/db-connect';
import { Invitation } from '@/db/models';
import { auth } from '@/auth';

// DELETE - Delete an invitation
export async function DELETE(request, { params }) {
  try {
    // Authenticate the user
    const session = await auth();
    
    // Check if the user is authenticated and is an admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    // Connect to the database
    await dbConnect();

    // Find and delete the invitation
    const invitation = await Invitation.findByIdAndDelete(id);

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Invitation deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update an invitation
export async function PATCH(request, { params }) {
  try {
    // Authenticate the user
    const session = await auth();
    
    // Check if the user is authenticated and is an admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    // Parse the request body
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!status || !['pending', 'expired'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }
    
    // Connect to the database
    await dbConnect();

    // Find and update the invitation
    const invitation = await Invitation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Invitation updated successfully',
      invitation
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 