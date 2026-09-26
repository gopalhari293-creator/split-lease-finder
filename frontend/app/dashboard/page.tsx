'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { roommateService } from '../../services/roommateService';
import { apartmentService } from '../../services/apartmentService';
import { matchService } from '../../services/matchService';
import { RoommateCard } from '../../components/cards/RoommateCard';
import { ApartmentCard } from '../../components/cards/ApartmentCard';
import { CombinedMatchCard } from '../../components/cards/CombinedMatchCard';
import { MatchItem, Apartment, CombinedMatch } from '../../types';
import {
  Sparkles,
  Users,
  Building2,
  Heart,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  LayoutDashboard,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  const [recommendedRoommates, setRecommendedRoommates] = useState<MatchItem[]>([]);
  const [featuredApartments, setFeaturedApartments] = useState<Apartment[]>([]);
  const [combinedMatches, setCombinedMatches] = useState<CombinedMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    const loadData = async () => {
      try {
        const [roommatesData, apartmentsData, combinedData] = await Promise.all([
          roommateService.getRecommendations(),
          apartmentService.getApartments({ limit: 3 }),
          matchService.getCombinedMatches(),
        ]);

        setRecommendedRoommates(roommatesData);
        setFeaturedApartments(apartmentsData.apartments || []);
        setCombinedMatches(combinedData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
        <span className="text-sm font-semibold">Loading your SplitLease dashboard...</span>
      </div>
    );
  }

  const completionScore = profile?.profileCompletionScore || 85;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* WELCOME HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user?.name}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl border-2 border-brand-400 shadow-md object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black">Welcome back, {user?.name.split(' ')[0]}!</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Preferred Area: {profile?.preferredLocations?.[0] || 'Downtown Austin'} • Budget: ${profile?.budgetMin || 800}–${profile?.budgetMax || 1400}/mo
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 max-w-xs w-full">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-300">Profile Completion</span>
              <span className="text-brand-400">{completionScore}%</span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="h-full gradient-bg rounded-full" style={{ width: `${completionScore}%` }}></div>
            </div>
            {completionScore < 100 && (
              <Link href="/profile" className="text-[11px] text-brand-300 hover:underline mt-2 inline-block font-semibold">
                Complete profile specs →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Match Score', value: '92%', icon: Sparkles, color: 'text-brand-600 bg-brand-50' },
          { label: 'Roommate Matches', value: recommendedRoommates.length, icon: Users, color: 'text-violet-600 bg-violet-50' },
          { label: 'Saved Apartments', value: '8', icon: Heart, color: 'text-rose-600 bg-rose-50' },
          { label: 'Active Chats', value: '4', icon: MessageSquare, color: 'text-emerald-600 bg-emerald-50' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500">{stat.label}</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* QUICK ACTIONS */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/roommates"
          className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
        >
          <Users className="w-4 h-4 text-brand-600" /> Find Roommates
        </Link>
        <Link
          href="/apartments"
          className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
        >
          <Building2 className="w-4 h-4 text-violet-600" /> Find Apartments
        </Link>
        <Link
          href="/matches"
          className="flex items-center gap-2 px-5 py-3 gradient-bg text-white rounded-2xl text-xs font-extrabold shadow-md hover:opacity-95 transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300" /> View Combined Matches
        </Link>
        <Link
          href="/messages"
          className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
        >
          <MessageSquare className="w-4 h-4 text-emerald-600" /> Recent Messages
        </Link>
      </div>

      {/* FEATURED COMBINED MATCH HIGHLIGHT */}
      {combinedMatches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-brand-600 uppercase tracking-wider">Top Recommendation</span>
              <h2 className="text-2xl font-black text-slate-900">Combined Roommate + Apartment Match</h2>
            </div>
            <Link href="/matches" className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
              See All Combined Matches <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <CombinedMatchCard
            match={combinedMatches[0]}
            onStartChat={() => router.push('/messages')}
          />
        </div>
      )}

      {/* RECOMMENDED ROOMMATES GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-violet-600 uppercase tracking-wider">Lifestyle Compatible</span>
            <h2 className="text-2xl font-black text-slate-900">Recommended Roommates</h2>
          </div>
          <Link href="/roommates" className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
            Browse All Roommates <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedRoommates.slice(0, 3).map((item) => (
            <RoommateCard
              key={item.profile._id}
              profile={item.profile}
              user={item.user}
              compatibilityScore={item.compatibilityScore}
              categoryScores={item.categoryScores}
              whyItWorks={item.whyItWorks}
              onMessage={() => router.push('/messages')}
            />
          ))}
        </div>
      </div>

      {/* RECOMMENDED APARTMENTS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">Budget-Fit Housing</span>
            <h2 className="text-2xl font-black text-slate-900">Explore Apartments</h2>
          </div>
          <Link href="/apartments" className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
            View All Apartments <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredApartments.map((apt) => (
            <ApartmentCard key={apt._id} apartment={apt} />
          ))}
        </div>
      </div>
    </div>
  );
}
