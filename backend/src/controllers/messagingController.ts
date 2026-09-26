import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { User } from '../models/User.js';

export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }

  const conversations = await Conversation.find({ participants: userId })
    .populate('participants', 'name email avatar role')
    .sort({ updatedAt: -1 })
    .exec();

  const formatted = conversations.map((conv) => {
    const otherParticipant = conv.participants.find((p) => p._id.toString() !== userId);
    return {
      id: conv._id,
      otherUser: otherParticipant,
      lastMessage: conv.lastMessage,
      lastMessageAt: conv.lastMessageAt,
      updatedAt: conv.updatedAt,
    };
  });

  res.status(200).json({
    success: true,
    data: formatted,
  });
};

export const createConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { recipientId, initialMessage } = req.body;

  if (!userId) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }

  if (userId === recipientId) {
    res.status(400).json({ success: false, message: 'Cannot start conversation with yourself.' });
    return;
  }

  const recipient = await User.findById(recipientId);
  if (!recipient) {
    res.status(404).json({ success: false, message: 'Recipient not found.' });
    return;
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [userId, recipientId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [userId, recipientId],
      lastMessage: initialMessage || 'Conversation started',
      lastMessageAt: new Date(),
    });
  }

  if (initialMessage) {
    await Message.create({
      conversation: conversation._id,
      sender: userId,
      content: initialMessage,
    });
    conversation.lastMessage = initialMessage;
    conversation.lastMessageAt = new Date();
    await conversation.save();
  }

  res.status(201).json({
    success: true,
    data: {
      id: conversation._id,
      otherUser: recipient,
      lastMessage: conversation.lastMessage,
    },
  });
};

export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { id: conversationId } = req.params;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    res.status(404).json({ success: false, message: 'Conversation not found.' });
    return;
  }

  const isParticipant = conversation.participants.some((p) => p.toString() === userId);
  if (!isParticipant && req.user?.role !== 'ADMIN') {
    res.status(403).json({ success: false, message: 'Forbidden. You are not a participant in this chat.' });
    return;
  }

  const messages = await Message.find({ conversation: conversationId })
    .populate('sender', 'name avatar')
    .sort({ createdAt: 1 })
    .exec();

  // Mark unread messages as read
  await Message.updateMany(
    { conversation: conversationId, sender: { $ne: userId }, read: false },
    { $set: { read: true } }
  );

  res.status(200).json({
    success: true,
    data: messages,
  });
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { id: conversationId } = req.params;
  const { content } = req.body;

  if (!content || !content.trim()) {
    res.status(400).json({ success: false, message: 'Message content cannot be empty.' });
    return;
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    res.status(404).json({ success: false, message: 'Conversation not found.' });
    return;
  }

  const isParticipant = conversation.participants.some((p) => p.toString() === userId);
  if (!isParticipant) {
    res.status(403).json({ success: false, message: 'Forbidden.' });
    return;
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: userId,
    content: content.trim(),
  });

  conversation.lastMessage = content.trim();
  conversation.lastMessageAt = new Date();
  await conversation.save();

  const populated = await Message.findById(message._id).populate('sender', 'name avatar');

  res.status(201).json({
    success: true,
    data: populated,
  });
};
