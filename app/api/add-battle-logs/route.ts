import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/utils/config/connect';
import Scholar, { IScholar } from '@/utils/models/scholars';
import BattleLog from '@/utils/models/battleLogs';
import axios from 'axios';

async function fetchAndSaveBattleLogs(axieId: string, scholar: IScholar, page: number = 1) {
  console.log('Fetching battle logs for Axie ID:', axieId, 'Page:', page);

  try {
    const response = await axios({
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api-gateway.skymavis.com/origin/v2/community/users/${axieId}/battle-logs?page=${page}&limit=20`,
      headers: { 
        'Accept': 'application/json', 
        'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || ''
      }
    });

    console.log('API Response:', JSON.stringify(response.data, null, 2));

    if (!response.data || !response.data._items || !Array.isArray(response.data._items)) {
      console.warn('Invalid API response structure');
      return { battleLogs: {}, totalPages: 0, totalSlp: 0, totalMoonshard: 0, wins: 0, totalMatches: 0 };
    }

    const battleLogs = response.data._items;
    
    console.log('Battle Logs:', JSON.stringify(battleLogs, null, 2));

    // Only delete existing logs if it's the first page
    if (page === 1) {
      await BattleLog.deleteMany({ axieId });
    }

    let totalSlp = 0;
    let totalMoonshard = 0;
    let wins = 0;
    let totalMatches = 0;

    // Group battle logs by date
    const groupedBattleLogs: { [key: string]: any[] } = {};

    const savedLogs = await Promise.all(battleLogs.map(async (log: any) => {
      if (!log || !log.gameData) {
        console.warn('Invalid log entry:', log);
        return null;
      }

      totalMatches++;
      if (log.gameData.winner === 0) {
        wins++;
      }

      const endedAt = new Date(log.gameData.endedAt * 1000);
      const dateKey = endedAt.toISOString().split('T')[0]; // YYYY-MM-DD format

      const battleLog = new BattleLog({
        scholar: scholar._id,
        axieId: axieId,
        uuid: log.gameData.uuid,
        gameMode: log.gameData.gameMode,
        players: Array.isArray(log.gameData.players) ? log.gameData.players.map((player: any) => ({
          userID: player.userID,
          rank: player.rank,
          tier: player.tier,
          elo: player.elo,
          vstar: player.vstar,
          team: player.team ? {
            id: player.team.id,
            name: player.team.name,
            fighters: Array.isArray(player.team.fighters) ? player.team.fighters.map((fighter: any) => ({
              axieID: fighter.axieID,
              axieType: fighter.axieType,
              name: fighter.name,
              position: fighter.position,
            })) : [],
            remainPercentTotalHp: player.team.remainPercentTotalHp,
          } : null,
          topRank: player.topRank,
          totalCardPlayed: player.totalCardPlayed,
        })) : [],
        startedAt: new Date(log.gameData.startedAt * 1000),
        endedAt: endedAt,
        winner: log.gameData.winner,
        turnEndAt: log.gameData.turnEndAt,
        rewardMeta: log.rewardMeta
      });

      // Calculate SLP and Moonshard gained
      if (log.rewardMeta && log.rewardMeta.rewards) {
        const playerReward = log.rewardMeta.rewards.find((reward: any) => reward.userId === axieId);
        if (playerReward && playerReward.items) {
          const slpReward = playerReward.items.find((item: any) => item.itemID === 'slp');
          const moonshardReward = playerReward.items.find((item: any) => item.itemID === 'moonshard');
          if (slpReward) {
            totalSlp += slpReward.quantity;
          }
          if (moonshardReward) {
            totalMoonshard += moonshardReward.quantity;
          }
        }
      }

      try {
        const savedLog = await battleLog.save();
        
        // Add the saved log to the grouped object
        if (!groupedBattleLogs[dateKey]) {
          groupedBattleLogs[dateKey] = [];
        }
        groupedBattleLogs[dateKey].push(savedLog);
        
        return savedLog;
      } catch (error) {
        console.error('Error saving battle log:', error);
        console.error('Battle log data:', JSON.stringify(battleLog.toObject(), null, 2));
        return null;
      }
    }));

    const successfulSaves = savedLogs.filter(log => log !== null);
    console.log(`Saved ${successfulSaves.length} battle logs for Axie ID:`, axieId);

    // Update scholar's SLP, Moonshard, and win rate
    scholar.totalSLP += totalSlp;
    scholar.totalMoonshard += totalMoonshard;
    scholar.winrate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;
    await scholar.save();

    return { 
      battleLogs: groupedBattleLogs, 
      totalPages: Math.ceil(response.data.total / 20),
      totalSlp,
      totalMoonshard,
      wins,
      totalMatches
    };
  } catch (error) {
    console.error('Error fetching or saving battle logs:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { axieId, page } = await req.json();
    console.log('Received Axie ID:', axieId, 'Page:', page);

    if (!axieId) {
      return NextResponse.json({ error: 'Axie ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    const scholar = await Scholar.findOne({ axieId });
    if (!scholar) {
      return NextResponse.json({ error: 'Scholar not found' }, { status: 404 });
    }

    const { battleLogs, totalPages, totalSlp, totalMoonshard, wins, totalMatches } = await fetchAndSaveBattleLogs(axieId, scholar, page || 1);

    if (Object.keys(battleLogs).length === 0) {
      return NextResponse.json({ 
        message: 'No battle logs found or saved', 
        battleLogs: {}, 
        totalPages,
        updatedScholar: scholar
      }, { status: 200 });
    }

    return NextResponse.json(
      { 
        message: 'Battle logs saved successfully', 
        battleLogs,
        totalPages,
        updatedScholar: scholar
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  } catch (error: any) {
    console.error('Error in POST /api/add-battle-logs:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Failed to save battle logs', details: error.message },
      { status: error.response?.status || 500 }
    );
  }
}

