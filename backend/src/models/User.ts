import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
  bio?: string;
  phone?: string;
  isEmailVisible: boolean;
  isPhoneVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    phone: { type: String, default: '' },
    isEmailVisible: { type: Boolean, default: false },
    isPhoneVisible: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
