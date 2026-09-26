'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { roommateService } from '../../../services/roommateService';
import { messageService } from '../../../services/messageService';
import { MatchItem } from '../../../types';
import { CompatibilityBadge } from '../../../components/ui/CompatibilityBadge';
import { useToast } from '../../../context/ToastContext';
import {
  MapPin,
  DollarSign,
  Calendar,
  Briefcase,
  UserCheck,
  MessageSquare,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../../lib/utils';

export default function RoommateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = params.id as string;

  const [data, setData] = useState<MatchItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const result = await roommateService.getRoommateById(id);
        setData(result);
      } catch (err: any) {
        showToast(err.message || 'Roommate profile not found.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleStartChat = async () => {
    if (!data?.user) return;
    setConnecting(true);
    try {
      await messageService.createConversation(
        data.user.id || data.user._id!,
        `Hi ${data.user.name.split(' ')[0]}! I saw your roommate profile on SplitLease with a ${data.compatibilityScore}% match.`
      );
      showToast('Conversation started! Redirecting to chat...', 'success');
      router.push('/messages');
    } catch (err: any) {
      showToast(err.message || 'Failed to start chat.', 'error');
    } finally {
      setConnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
        <span className="text-sm font-semibold">Loading roommate specs...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-700">Roommate not found</h2>
        <button
          onClick={() => router.push('/roommates')}
          className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Roommates
        </button>
      </div>
    );
  }

  const { profile, user, compatibilityScore, categoryScores, whyItWorks } = data;
  const lifestyle = profile.lifestyle || {};

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <button
        onClick={() => router.back()}
        className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" /> Back to matches
      </button>

      {/* Main Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.name}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-brand-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black">{user.name}</h1>
                <span className="text-sm text-slate-300 font-medium">, {profile.age}</span>
              </div>
              <p className="text-xs text-brand-300 flex items-center gap-1.5 mt-1">
                <Briefcase className="w-4 h-4" />
                {profile.occupation || 'Professional'} {profile.universityOrCompany ? `@ ${profile.universityOrCompany}` : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <CompatibilityBadge score={compatibilityScore} categoryScores={categoryScores} size="lg" />
            <button
              onClick={handleStartChat}
              disabled={connecting}
              className="px-6 py-3 gradient-bg text-white font-bold rounded-2xl text-xs shadow-lg hover:opacity-95 flex items-center gap-2"
            >
              {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
              Start Conversation
            </button>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="p-6 bg-slate-50 border-b border-slate-100 text-sm text-slate-700 italic">
            "{user.bio}"
          </div>
        )}

        {/* Key Specs */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Housing Specs */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-2">
              Housing & Budget Specs
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Budget Range:</span>
                <span className="font-bold text-emerald-600">
                  {formatCurrency(profile.budgetMin)} – {formatCurrency(profile.budgetMax)} /mo
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Locations:</span>
                <span className="font-bold text-slate-900">{profile.preferredLocations?.join(', ') || 'Flexible'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Move-in Timeline:</span>
                <span className="font-bold text-slate-900">{formatDate(profile.moveInDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Lease Term:</span>
                <span className="font-bold text-slate-900">{profile.leaseDuration}</span>
              </div>
            </div>
          </div>

          {/* Lifestyle Specs */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-2">
              Lifestyle & Home Habits
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Cleanliness Standard:</span>
                <span className="font-bold text-brand-600">{lifestyle.cleanliness} / 5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sleep Schedule:</span>
                <span className="font-bold text-slate-900">{lifestyle.sleepSchedule}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Work Schedule:</span>
                <span className="font-bold text-slate-900">{lifestyle.workSchedule}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Smoking / Pets:</span>
                <span className="font-bold text-slate-900">{lifestyle.smoking} • {lifestyle.pets}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Why it works section */}
        {whyItWorks && whyItWorks.length > 0 && (
          <div className="p-8 bg-brand-50/50 border-t border-brand-100 space-y-3">
            <h4 className="text-xs font-extrabold text-brand-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-600" /> Why this match works for you
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {whyItWorks.map((reason, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-3 rounded-xl border border-brand-100 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
