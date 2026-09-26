import { Schema, model, Document, Types } from 'mongoose';

export interface ICategoryScores {
  budget: number;
  lifestyle: number;
  location: number;
  schedule: number;
  preferences: number;
}

export interface IMatch extends Document {
  user: Types.ObjectId;
  matchedUser: Types.ObjectId;
  apartment?: Types.ObjectId;
  compatibilityScore: number;
  categoryScores: ICategoryScores;
  matchType: 'ROOMMATE' | 'COMBINED';
  status: 'SUGGESTED' | 'CONNECTED' | 'SAVED' | 'PASSED';
  whyItWorks: string[];
  createdAt: Date;
}

const matchSchema = new Schema<IMatch>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    matchedUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    apartment: { type: Schema.Types.ObjectId, ref: 'Apartment' },
    compatibilityScore: { type: Number, required: true },
    categoryScores: {
      budget: { type: Number, default: 90 },
      lifestyle: { type: Number, default: 90 },
      location: { type: Number, default: 90 },
      schedule: { type: Number, default: 90 },
      preferences: { type: Number, default: 90 },
    },
    matchType: { type: String, enum: ['ROOMMATE', 'COMBINED'], default: 'ROOMMATE' },
    status: { type: String, enum: ['SUGGESTED', 'CONNECTED', 'SAVED', 'PASSED'], default: 'SUGGESTED' },
    whyItWorks: [{ type: String }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Match = model<IMatch>('Match', matchSchema);
