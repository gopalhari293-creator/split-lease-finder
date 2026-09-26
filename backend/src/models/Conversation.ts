import { Schema, model, Document, Types } from 'mongoose';

export interface IConversation extends Document {
  participants: Types.ObjectId[];
  lastMessage: string;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessage: { type: String, default: '' },
    lastMessageAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

export const Conversation = model<IConversation>('Conversation', conversationSchema);
