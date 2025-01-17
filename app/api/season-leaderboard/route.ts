import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('https://api-gateway.skymavis.com/origins/v2/season-leaderboards', {
      headers: {
        'Accept': 'application/json',
        'X-API-Key': 'OB0nEil4bH2KdbG0Pab13O8vMs5mwj7l'
      }
    });

    if (response.status === 200) {
      return NextResponse.json(response.data);
    } else {
      throw new Error('Failed to fetch leaderboard data');
    }
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return new NextResponse('Error fetching leaderboard', { status: 500 });
  }
}
