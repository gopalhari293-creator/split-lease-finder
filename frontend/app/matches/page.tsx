'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { matchService } from '../../services/matchService';
import { MatchItem, CombinedMatch } from '../../types';
import { RoommateCard } from '../../components/cards/RoommateCard';
import { CombinedMatchCard } from '../../components/cards/CombinedMatchCard';
import { Sparkles, Users, Building2, Layers, Loader2 } from 'lucide-react';

export default function MatchesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'roommates' | 'combined'>('all');
  const [roommateMatches, setRoommateMatches] = useState<MatchItem[]>([]);
  const [combinedMatches, setCombinedMatches] = useState<CombinedMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rmData, cbData] = await Promise.all([
          matchService.getMatches(),
          matchService.getCombinedMatches(),
        ]);
        setRoommateMatches(rmData);
        setCombinedMatches(cbData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>AI Compatibility Engine</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">Your Compatibility Matches</h1>
        <p className="text-sm text-slate-500 max-w-xl">
          Based on your budget, cleanliness, schedule, and housing preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {[
          { id: 'all', label: 'All Matches', icon: Layers },
          { id: 'roommates', label: `Roommates (${roommateMatches.length})`, icon: Users },
          { id: 'combined', label: `Combined Matches (${combinedMatches.length})`, icon: Building2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="min-h-[50vh] flex items-center justify-center text-slate-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
          <span className="text-sm font-semibold">Calculating compatibility scores...</span>
        </div>
      ) : (
        <div className="space-y-10">
          {/* COMBINED MATCHES SECTION */}
          {(activeTab === 'all' || activeTab === 'combined') && combinedMatches.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-violet-600" /> Combined Roommate + Apartment Matches
              </h2>
              <div className="space-y-6">
                {combinedMatches.map((m) => (
                  <CombinedMatchCard key={m.id} match={m} onStartChat={() => router.push('/messages')} />
                ))}
              </div>
            </div>
          )}

          {/* ROOMMATE MATCHES SECTION */}
          {(activeTab === 'all' || activeTab === 'roommates') && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-600" /> Roommate Compatibility
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roommateMatches.map((item) => (
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
          )}
        </div>
      )}
    </div>
  );
}
