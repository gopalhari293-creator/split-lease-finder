'use client';

import React from 'react';
import Link from 'next/link';
import { CombinedMatch } from '../../types';
import { Sparkles, Users, Building2, CheckCircle2, MessageSquare, DollarSign, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface CombinedMatchCardProps {
  match: CombinedMatch;
  onStartChat?: (recipientId: string) => void;
}

export const CombinedMatchCard: React.FC<CombinedMatchCardProps> = ({ match, onStartChat }) => {
  const { matchedRoommate, apartment } = match;

  return (
    <div className="bg-white rounded-3xl border-2 border-brand-100 shadow-xl overflow-hidden hover:border-brand-300 transition-all duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-violet-600 to-indigo-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
          <span className="font-extrabold text-sm uppercase tracking-wider">Perfect Pair & Home Match</span>
        </div>
        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-white border border-white/30">
          {match.combinedScore}% Combined Match
        </div>
      </div>

      {/* Main Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Roommate Section */}
        <div className="md:col-span-5 flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <img
            src={matchedRoommate.user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + matchedRoommate.user.name}
            alt={matchedRoommate.user.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-200"
          />
          <div>
            <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block">Matched Roommate</span>
            <h4 className="font-bold text-slate-900 text-base">{matchedRoommate.user.name}</h4>
            <p className="text-xs text-slate-500">
              Max Budget: {formatCurrency(matchedRoommate.profile.budgetMax)}/mo
            </p>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{match.roommateScore}% Roommate Compatibility</span>
            </div>
          </div>
        </div>

        {/* Plus Sign Icon */}
        <div className="hidden md:flex items-center justify-center col-span-1 text-slate-300 font-bold text-xl">
          +
        </div>

        {/* Apartment Section */}
        <div className="md:col-span-6 flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <img
            src={apartment.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
            alt={apartment.title}
            className="w-16 h-16 rounded-2xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider block">Recommended Apartment</span>
            <h4 className="font-bold text-slate-900 text-sm truncate">{apartment.title}</h4>
            <p className="text-xs font-semibold text-slate-700">{formatCurrency(apartment.monthlyRent)}/mo total</p>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-violet-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{match.apartmentFitScore}% Apartment Fit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Breakdown & Why it works */}
      <div className="px-6 py-4 bg-gradient-to-b from-white to-slate-50/50 border-t border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-2 rounded-xl font-medium border border-emerald-100">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>
              Your estimated split: <strong className="font-bold">{formatCurrency(match.rentPerPerson)}/mo</strong> per person
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 font-medium">
            {match.whyItWorks.slice(0, 2).map((reason, idx) => (
              <span key={idx} className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                ✓ {reason}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <Link
            href={`/apartments/${apartment._id}`}
            className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
          >
            <Building2 className="w-3.5 h-3.5" /> View Apartment
          </Link>
          <span className="text-slate-300">•</span>
          <Link
            href={`/roommates/${matchedRoommate.profile._id}`}
            className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
          >
            <Users className="w-3.5 h-3.5" /> View Roommate
          </Link>
        </div>

        {onStartChat && (
          <button
            onClick={() => onStartChat(matchedRoommate.user.id || matchedRoommate.user._id!)}
            className="px-4 py-2 text-xs font-bold text-white gradient-bg rounded-xl shadow-md hover:opacity-95 flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Start Group Chat for this Apartment
          </button>
        )}
      </div>
    </div>
  );
};
