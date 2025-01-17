'use server';

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB URI and client instance
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI is not defined in the environment variables.');
}

// Declare the global variable type for _mongoClientPromise
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Reuse the MongoDB client connection between requests
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
  global._mongoClientPromise = clientPromise;
} else {
  clientPromise = global._mongoClientPromise;
}

// Export the BattleLog type so it can be used elsewhere
export type BattleLog = {
  _items: {
    gameData: {
      uuid: string;
      gameMode: string;
      opponentType: string;
      players: Array<{
        userID: string;
        rank: number;
        tier: string;
        elo: number;
        vstar: number;
        team: {
          id: string;
          name: string;
          fighters: Array<{
            axieID: string;
            axieType: string;
            name: string;
            position: string;
          }>;
        };
        totalCardPlayed: number;
      }>;
      startedAt: string;
      endedAt: string;
      winner: string;
      turnEndAt: string;
    };
    rewardMeta: {
      rewards: any;
      deltaRewards: any;
    };
  }[];
};

// Export the ScholarData type
export type ScholarData = {
  firstName: string;
  lastName: string;
  axieId: string;
  managerShare: number;
  scholarShare: number;
};

export async function saveBattleLogs(battleLogs: BattleLog, scholarData: ScholarData) {
  if (!battleLogs?._items || battleLogs._items.length === 0) {
    console.log('No battle logs to save');
    return;
  }

  try {
    const client = await clientPromise;
    const database = client.db('scholar-info');
    const battleLogsCollection = database.collection('battle-logs');

    // Merge scholarData into the battle logs
    const logsToInsert = battleLogs._items.map(log => {
      const playersWithScholarData = log.gameData.players.map(player => {
        // Check if the player's axieId matches the scholar's axieId
        if (player.team.fighters.some(fighter => fighter.axieID === scholarData.axieId)) {
          return {
            ...player,
            scholarFirstName: scholarData.firstName,
            scholarLastName: scholarData.lastName,
            scholarAxieId: scholarData.axieId,
            managerShare: scholarData.managerShare,
            scholarShare: scholarData.scholarShare,
          };
        }
        return player;
      });

      return {
        uuid: log.gameData.uuid,
        gameMode: log.gameData.gameMode,
        opponentType: log.gameData.opponentType,
        players: playersWithScholarData,
        startedAt: log.gameData.startedAt,
        endedAt: log.gameData.endedAt,
        winner: log.gameData.winner,
        turnEndAt: log.gameData.turnEndAt,
        rewards: log.rewardMeta.rewards,
        deltaRewards: log.rewardMeta.deltaRewards,
        scholarData: scholarData, // Include the full scholarData
      };
    });

    // Insert logs into MongoDB using insertMany
    const result = await battleLogsCollection.insertMany(logsToInsert);
    console.log(`Inserted ${result.insertedCount} battle logs`);

    console.log('All battle logs have been saved to the database');
  } catch (error) {
    console.error('Error saving battle logs:', error);
  }
}

export default saveBattleLogs;