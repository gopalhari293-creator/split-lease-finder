'use client';

import React from 'react';
import { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
  isSelf: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isSelf }) => {
  return (
    <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} mb-3`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isSelf
            ? 'gradient-bg text-white rounded-br-none shadow-md shadow-brand-500/10'
            : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/60'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
      <span className="text-[10px] text-slate-400 mt-1 px-1">
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};
