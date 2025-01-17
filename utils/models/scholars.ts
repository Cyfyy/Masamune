import mongoose, { Schema, Document } from 'mongoose';

export interface IScholar extends Document {
  name: string;
  axieId: string;
  share: {
    manager: number;
    scholar: number;
  };
  winrate: number;
  slp: number;
  axs: number;
  totalSLP: number;
  totalMoonshard: number;
  rank: number;
  createdAt: Date;
  updatedAt: Date;
}

const ScholarSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    axieId: { type: String, required: true, unique: true },
    share: {
      manager: { type: Number, required: true },
      scholar: { type: Number, required: true },
    },
    winrate: { type: Number, default: 0 },
    slp: { type: Number, default: 0 },
    axs: { type: Number, default: 0 },
    totalSLP: { type: Number, default: 0 },
    totalMoonshard: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Scholar = mongoose.models.Scholar || mongoose.model<IScholar>('Scholar', ScholarSchema);

export default Scholar;

