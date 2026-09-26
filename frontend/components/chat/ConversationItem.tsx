'use client';

import React from 'react';
import { Conversation } from '../../types';

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onClick,
}) => {
  const { otherUser, lastMessage, lastMessageAt } = conversation;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-start gap-3 border ${
        isSelected
          ? 'bg-brand-50/80 border-brand-200 shadow-sm'
          : 'hover:bg-slate-50 border-transparent'
      }`}
    >
      <img
        src={otherUser.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + otherUser.name}
        alt={otherUser.name}
        className="w-11 h-11 rounded-2xl object-cover shrink-0 border border-slate-200"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <h4 className="font-bold text-sm text-slate-900 truncate">{otherUser.name}</h4>
          <span className="text-[10px] text-slate-400 font-medium shrink-0">
            {lastMessageAt ? new Date(lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
          </span>
        </div>
        <p className="text-xs text-slate-500 truncate font-medium">
          {lastMessage || 'No messages yet.'}
        </p>
      </div>
    </button>
  );
};
