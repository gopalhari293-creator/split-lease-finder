import { Schema, model, Document, Types } from 'mongoose';

export interface IApartment extends Document {
  title: string;
  images: string[];
  location: string;
  address: string;
  monthlyRent: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  furnished: boolean;
  amenities: string[];
  availableDate: Date;
  leaseDuration: string;
  description: string;
  apartmentType: string;
  parking: string;
  petPolicy: string;
  isFeatured: boolean;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const apartmentSchema = new Schema<IApartment>(
  {
    title: { type: String, required: true, trim: true },
    images: [{ type: String }],
    location: { type: String, required: true, index: true },
    address: { type: String, required: true },
    monthlyRent: { type: Number, required: true, index: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    sqft: { type: Number, default: 800 },
    furnished: { type: Boolean, default: false },
    amenities: [{ type: String }],
    availableDate: { type: Date, default: () => new Date() },
    leaseDuration: { type: String, default: '12 months' },
    description: { type: String, required: true },
    apartmentType: { type: String, default: 'Apartment' },
    parking: { type: String, default: 'Available ($)' },
    petPolicy: { type: String, default: 'Pets allowed' },
    isFeatured: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Apartment = model<IApartment>('Apartment', apartmentSchema);
