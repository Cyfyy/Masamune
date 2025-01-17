import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/utils/config/connect';
import Scholar from '@/utils/models/scholars';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { firstName, lastName, axieId, managerShare, scholarShare } = body;

  try {
    await connectToDatabase();

    // Check if the scholar already exists
    let scholar = await Scholar.findOne({ axieId });
    if (scholar) {
      return NextResponse.json(
        { error: 'Scholar with this Axie ID already exists' },
        { status: 400 }
      );
    }

    // Create a new scholar
    scholar = new Scholar({
      firstName,
      lastName,
      axieId,
      share: {
        manager: parseInt(managerShare),
        scholar: parseInt(scholarShare)
      }
    });
    await scholar.save();

    return NextResponse.json(
      { message: 'Scholar added successfully', scholar },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save scholar' }, { status: 500 });
  }
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

