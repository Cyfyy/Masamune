import mongoose, { Schema, Document } from 'mongoose';
import { IScholar } from './scholars';

export interface IBattleLog extends Document {
  scholar: IScholar['_id'];
  axieId: string;
  uuid?: string;
  gameMode?: string;
  players: Array<{
    userID: string;
    rank: string;
    tier: number;
    elo: number;
    vstar: number;
    team: {
      id: number;
      name: string;
      fighters: Array<{
        axieID: number;
        axieType: string;
        name?: string;
        position: number;
      }>;
      remainPercentTotalHp: number;
    };
    topRank?: number;
    totalCardPlayed: number;
  }>;
  startedAt?: Date;
  endedAt?: Date;
  winner?: number;
  turnEndAt?: number;
  rewardMeta?: {
    rewards: Array<{
      userId: string;
      oldVstar?: number;
      newVstar?: number;
      oldElo?: number;
      newElo?: number;
      result: string;
      items?: Array<{
        itemID: string;
        quantity: number;
      }>;
    }>;
  };
}

const BattleLogSchema: Schema = new Schema(
  {
    scholar: { type: Schema.Types.ObjectId, ref: 'Scholar', required: true },
    axieId: { type: String, required: true },
    uuid: { type: String },
    gameMode: { type: String },
    players: [{
      userID: { type: String, required: true },
      rank: { type: String, required: true },
      tier: { type: Number, required: true },
      elo: { type: Number, required: true },
      vstar: { type: Number, required: true },
      team: {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        fighters: [{
          axieID: { type: Number, required: true },
          axieType: { type: String, required: true },
          name: { type: String },
          position: { type: Number, required: true },
        }],
        remainPercentTotalHp: { type: Number, required: true },
      },
      topRank: { type: Number },
      totalCardPlayed: { type: Number, required: true },
    }],
    startedAt: { type: Date },
    endedAt: { type: Date },
    winner: { type: Number },
    turnEndAt: { type: Number },
    rewardMeta: {
      rewards: [{
        userId: { type: String, required: true },
        oldVstar: { type: Number },
        newVstar: { type: Number },
        oldElo: { type: Number },
        newElo: { type: Number },
        result: { type: String, required: true },
        items: [{
          itemID: { type: String, required: true },
          quantity: { type: Number, required: true },
        }],
      }],
    },
  },
  {
    timestamps: true,
  }
);

const BattleLog = mongoose.models.BattleLog || mongoose.model<IBattleLog>('BattleLog', BattleLogSchema);

export default BattleLog;

