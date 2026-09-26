import { api } from './api';
import { Conversation, Message } from '../types';

export const messageService = {
  async getConversations(): Promise<Conversation[]> {
    const res = await api.get('/conversations');
    return res.data.data;
  },

  async createConversation(recipientId: string, initialMessage?: string) {
    const res = await api.post('/conversations', { recipientId, initialMessage });
    return res.data.data;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const res = await api.get(`/conversations/${conversationId}/messages`);
    return res.data.data;
  },

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    const res = await api.post(`/conversations/${conversationId}/messages`, { content });
    return res.data.data;
  },
};
