'use client';

import React from 'react';
import Link from 'next/link';
import { RoommateProfile, User, CategoryScores } from '../../types';
import { CompatibilityBadge } from '../ui/CompatibilityBadge';
import { MapPin, DollarSign, Calendar, MessageSquare, UserCheck, Briefcase } from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';

interface RoommateCardProps {
  profile: RoommateProfile;
  user: User;
  compatibilityScore: number;
  categoryScores?: CategoryScores;
  whyItWorks?: string[];
  onConnect?: (userId: string) => void;
  onMessage?: (userId: string) => void;
}

export const RoommateCard: React.FC<RoommateCardProps> = ({
  profile,
  user,
  compatibilityScore,
  categoryScores,
  whyItWorks,
  onConnect,
  onMessage,
}) => {
  const lifestyle = profile.lifestyle || {};

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Header Banner */}
      <div className="p-6 pb-4 relative bg-gradient-to-b from-slate-50 to-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.name}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors">
                  {user.name}
                </h3>
                <span className="text-sm font-medium text-slate-500">, {profile.age}</span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {profile.occupation || 'Professional'} {profile.universityOrCompany ? `@ ${profile.universityOrCompany}` : ''}
              </p>
            </div>
          </div>

          <CompatibilityBadge
            score={compatibilityScore}
            categoryScores={categoryScores}
            whyItWorks={whyItWorks}
            size="sm"
          />
        </div>

        {/* Bio snippet */}
        {user.bio && (
          <p className="text-xs text-slate-600 line-clamp-2 mt-3 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            "{user.bio}"
          </p>
        )}
      </div>

      {/* Main Metadata */}
      <div className="px-6 py-3 space-y-2 border-t border-b border-slate-100 bg-white flex-1">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700">
            <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-semibold">{formatCurrency(profile.budgetMin)} – {formatCurrency(profile.budgetMax)}</span>
            <span className="text-slate-400 text-[10px]">/mo</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-700 truncate">
            <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
            <span className="truncate">{profile.preferredLocations?.[0] || 'Flexible'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="w-4 h-4 text-violet-500 shrink-0" />
            <span>Move-in: {formatDate(profile.moveInDate)}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600">
            <UserCheck className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>{lifestyle.roomPreference || 'Private room'}</span>
          </div>
        </div>

        {/* Lifestyle Highlights Chips */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {lifestyle.smoking === 'Non-smoker' && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
              Non-smoker
            </span>
          )}
          {lifestyle.sleepSchedule && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-brand-50 text-brand-700">
              {lifestyle.sleepSchedule}
            </span>
          )}
          {lifestyle.pets && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700">
              {lifestyle.pets}
            </span>
          )}
          {lifestyle.cleanliness && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-violet-50 text-violet-700">
              Cleanliness {lifestyle.cleanliness}/5
            </span>
          )}
        </div>
      </div>

      {/* Footer CTAs */}
      <div className="p-4 bg-slate-50 flex items-center justify-between gap-2">
        <Link
          href={`/roommates/${profile._id}`}
          className="flex-1 py-2 text-center text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
        >
          View Profile
        </Link>
        {onMessage && (
          <button
            onClick={() => onMessage(user.id || user._id!)}
            className="flex-1 py-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-white gradient-bg rounded-xl shadow-sm hover:opacity-95 transition-opacity"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Message
          </button>
        )}
      </div>
    </div>
  );
};
