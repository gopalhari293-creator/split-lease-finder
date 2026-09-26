import { Schema, model, Document, Types } from 'mongoose';

export interface ISavedApartment extends Document {
  user: Types.ObjectId;
  apartment: Types.ObjectId;
  createdAt: Date;
}

const savedApartmentSchema = new Schema<ISavedApartment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    apartment: { type: Schema.Types.ObjectId, ref: 'Apartment', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

savedApartmentSchema.index({ user: 1, apartment: 1 }, { unique: true });

export const SavedApartment = model<ISavedApartment>('SavedApartment', savedApartmentSchema);
