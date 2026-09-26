import { Schema, model, Document, Types } from 'mongoose';

export interface ILifestyle {
  cleanliness: number; // 1-5
  sleepSchedule: string; // Early bird, Night owl, Flexible
  workSchedule: string; // Work from home, In-office, Hybrid, Student
  smoking: string; // Non-smoker, Outside only, Smoker
  drinking: string; // Non-drinker, Socially, Regularly
  pets: string; // No pets, Has dog, Has cat, Pet friendly
  guests: string; // Rarely, Weekends only, Frequent
  socialLevel: number; // 1-5
  noiseTolerance: number; // 1-5
  cookingHabits: string; // Rarely cook, Cook often, Meal prep
  foodPreferences: string[];
  sharingPreferences: string[];
  personality: string[];
  roomPreference: string; // Private room, Shared room, Any
  parkingNeeded: boolean;
  furnishedPreference: string; // Furnished, Unfurnished, Flexible
  genderPreference: string; // Any, Same gender, Female only, Male only
}

export interface IRoommateProfile extends Document {
  user: Types.ObjectId;
  age: number;
  gender: string;
  occupation: string;
  universityOrCompany: string;
  preferredLocations: string[];
  budgetMin: number;
  budgetMax: number;
  moveInDate: Date;
  leaseDuration: string;
  lifestyle: ILifestyle;
  profileCompletionScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const roommateProfileSchema = new Schema<IRoommateProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    age: { type: Number, default: 24 },
    gender: { type: String, default: 'Prefer not to say' },
    occupation: { type: String, default: '' },
    universityOrCompany: { type: String, default: '' },
    preferredLocations: [{ type: String }],
    budgetMin: { type: Number, default: 500 },
    budgetMax: { type: Number, default: 1500 },
    moveInDate: { type: Date, default: () => new Date() },
    leaseDuration: { type: String, default: '12 months' },
    lifestyle: {
      cleanliness: { type: Number, default: 4 },
      sleepSchedule: { type: String, default: 'Flexible' },
      workSchedule: { type: String, default: 'Hybrid' },
      smoking: { type: String, default: 'Non-smoker' },
      drinking: { type: String, default: 'Socially' },
      pets: { type: String, default: 'Pet friendly' },
      guests: { type: String, default: 'Weekends only' },
      socialLevel: { type: Number, default: 3 },
      noiseTolerance: { type: Number, default: 3 },
      cookingHabits: { type: String, default: 'Cook often' },
      foodPreferences: [{ type: String }],
      sharingPreferences: [{ type: String }],
      personality: [{ type: String }],
      roomPreference: { type: String, default: 'Private room' },
      parkingNeeded: { type: Boolean, default: false },
      furnishedPreference: { type: String, default: 'Flexible' },
      genderPreference: { type: String, default: 'Any' },
    },
    profileCompletionScore: { type: Number, default: 80 },
  },
  { timestamps: true }
);

export const RoommateProfile = model<IRoommateProfile>('RoommateProfile', roommateProfileSchema);
