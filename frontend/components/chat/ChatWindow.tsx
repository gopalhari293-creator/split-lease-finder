'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message } from '../../types';
import { messageService } from '../../services/messageService';
import { useAuth } from '../../context/AuthContext';
import { MessageBubble } from './MessageBubble';
import { Send, Loader2, Sparkles, Phone, Video } from 'lucide-react';

interface ChatWindowProps {
  conversation: Conversation;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversation }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const data = await messageService.getMessages(conversation.id);
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000); // Polling for messages
    return () => clearInterval(interval);
  }, [conversation.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    setSending(true);
    const content = inputText.trim();
    setInputText('');

    try {
      const newMsg = await messageService.sendMessage(conversation.id, content);
      setMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <img
            src={conversation.otherUser.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + conversation.otherUser.name}
            alt={conversation.otherUser.name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-200"
          />
          <div>
            <h3 className="font-bold text-slate-900 text-sm">{conversation.otherUser.name}</h3>
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active match
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <Video className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-white to-slate-50/30">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading conversation...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
            <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-700 text-sm">Say hello to {conversation.otherUser.name}!</h4>
            <p className="text-xs text-slate-500 max-w-xs">
              Discuss budget, move-in dates, or coordinate apartment viewings together.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const senderId = typeof msg.sender === 'string' ? msg.sender : msg.sender?._id;
            const isSelf = senderId === user?.id || senderId === user?._id;
            return <MessageBubble key={msg._id} message={msg} isSelf={isSelf} />;
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${conversation.otherUser.name}...`}
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || sending}
          className="p-3 gradient-bg text-white rounded-2xl disabled:opacity-50 hover:opacity-95 shadow-md shadow-brand-500/20 transition-all"
        >
          {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
};
