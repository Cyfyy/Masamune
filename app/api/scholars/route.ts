import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/utils/config/connect';
import Scholar from '@/utils/models/scholars';
import axios from 'axios';

export async function GET() {
  try {
    await connectToDatabase();
    const scholars = await Scholar.find({}).sort({ createdAt: -1 });
    return NextResponse.json(scholars, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/scholars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scholars', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, axieId, share } = body;

    if (!name || !axieId || !share || share.manager == null || share.scholar == null) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let scholar = await Scholar.findOne({ axieId });
    if (scholar) {
      return NextResponse.json(
        { error: 'Scholar with this Axie ID already exists' },
        { status: 400 }
      );
    }

    // Check if the scholar has battle logs before saving
    const response = await axios({
      method: 'get',
      url: `https://api-gateway.skymavis.com/origin/v2/community/users/${axieId}/battle-logs`,
      headers: { 
        'Accept': 'application/json', 
        'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || ''
      }
    });

    const battleLogs = response.data._items || [];
    if (battleLogs.length === 0) {
      return NextResponse.json(
        { error: 'No battle logs found for this Axie ID' },
        { status: 400 }
      );
    }

    scholar = new Scholar({
      name,
      axieId,
      share,
      totalSLP: 0,
      totalMoonshard: 0,
      createdAt: new Date(),
    });
    await scholar.save();

    // Fetch and save battle logs
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    if (!apiUrl) {
      console.error('NEXT_PUBLIC_API_URL is not set');
      return NextResponse.json(
        { error: 'Server configuration error', details: 'API URL is not set' },
        { status: 500 }
      );
    }

    try {
      await axios.post(`${apiUrl}/api/add-battle-logs`, { axieId });
    } catch (error) {
      console.error('Error saving battle logs:', error);
      // Even if saving battle logs fails, we've already saved the scholar, so we'll return a success response
      return NextResponse.json(
        { message: 'Scholar added successfully, but failed to save battle logs', scholar },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: 'Scholar added successfully', scholar },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in POST /api/scholars:', error);
    return NextResponse.json(
      { error: 'Failed to process the request', details: error.message },
      { status: 500 }
    );
  }
}

