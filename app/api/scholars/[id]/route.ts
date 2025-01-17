import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/utils/config/connect';
import Scholar from '@/utils/models/scholars';
import BattleLog from '@/utils/models/battleLogs';
import { ObjectId } from 'mongodb';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    await connectToDatabase();

    console.log('Updating scholar with ID:', params.id);  // Add logging
    console.log('Update data:', body);  // Add logging

    if (!params.id) {
      console.error('No scholar ID provided');  // Add logging
      return NextResponse.json(
        { error: 'Scholar ID is required' },
        { status: 400 }
      );
    }

    // Ensure valid ObjectId
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid scholar ID' },
        { status: 400 }
      );
    }

    const scholar = await Scholar.findByIdAndUpdate(
      params.id,
      { 
        $set: {
          name: body.name,
          'share.manager': body.share.manager,
          'share.scholar': body.share.scholar,
        }
      },
      { new: true }
    );

    if (!scholar) {
      return NextResponse.json(
        { error: 'Scholar not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(scholar, { status: 200 });
  } catch (error: any) {
    console.error('Error updating scholar:', error);
    return NextResponse.json(
      { error: 'Failed to update scholar', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    // Ensure valid ObjectId
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid scholar ID' },
        { status: 400 }
      );
    }

    // First, delete all associated battle logs
    await BattleLog.deleteMany({ scholar: new ObjectId(params.id) });

    // Then delete the scholar
    const scholar = await Scholar.findByIdAndDelete(params.id);

    if (!scholar) {
      return NextResponse.json(
        { error: 'Scholar not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Scholar and associated data deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting scholar:', error);
    return NextResponse.json(
      { error: 'Failed to delete scholar', details: error.message },
      { status: 500 }
    );
  }
}

