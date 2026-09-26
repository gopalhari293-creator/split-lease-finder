'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { messageService } from '../../services/messageService';
import { Conversation } from '../../types';
import { ConversationItem } from '../../components/chat/ConversationItem';
import { ChatWindow } from '../../components/chat/ChatWindow';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Search, Loader2, Sparkles } from 'lucide-react';

export default function MessagesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    const fetchConvs = async () => {
      try {
        const data = await messageService.getConversations();
        setConversations(data);
        if (data.length > 0 && !selectedConv) {
          setSelectedConv(data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchConvs();
  }, [user, authLoading]);

  const filtered = conversations.filter((c) =>
    c.otherUser?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
        <span className="text-sm font-semibold">Loading your conversations...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-0">
        {/* Sidebar Conversation List */}
        <div className="md:col-span-4 bg-white rounded-3xl border border-slate-200 p-4 flex flex-col h-full shadow-sm">
          <div className="pb-3 border-b border-slate-100 space-y-3">
            <h2 className="font-black text-xl text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-600" /> Messages
            </h2>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pt-3 space-y-1">
            {filtered.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No active chats found. Match with roommates to start chatting!
              </div>
            ) : (
              filtered.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isSelected={selectedConv?.id === conv.id}
                  onClick={() => setSelectedConv(conv)}
                />
              ))
            )}
          </div>
        </div>

        {/* Chat Window Main Content */}
        <div className="md:col-span-8 h-full flex flex-col">
          {selectedConv ? (
            <ChatWindow conversation={selectedConv} />
          ) : (
            <div className="h-full bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
              <Sparkles className="w-10 h-10 text-slate-300" />
              <h3 className="font-bold text-slate-700 text-base">Select a conversation to start messaging</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Discuss budgets, preferred neighborhoods, or arrange apartment viewings together.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
