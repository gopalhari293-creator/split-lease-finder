'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { roommateService } from '../../services/roommateService';
import { MatchItem } from '../../types';
import { RoommateCard } from '../../components/cards/RoommateCard';
import { Search, Filter, SlidersHorizontal, Loader2, Users } from 'lucide-react';

export default function RoommatesPage() {
  const router = useRouter();
  const [roommates, setRoommates] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [location, setLocation] = useState('');
  const [gender, setGender] = useState('All');
  const [maxBudget, setMaxBudget] = useState('2000');
  const [minScore, setMinScore] = useState('50');

  const fetchRoommates = async () => {
    setLoading(true);
    try {
      const data = await roommateService.getRoommates({
        location: location || undefined,
        gender: gender !== 'All' ? gender : undefined,
        maxBudget: maxBudget || undefined,
        minScore: minScore || undefined,
      });
      setRoommates(data.roommates || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoommates();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRoommates();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900">Discover Compatible Roommates</h1>
        <p className="text-sm text-slate-500">
          Filter potential roommates by location, budget, move-in date, and compatibility specs.
        </p>
      </div>

      {/* FILTER PANEL */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Location / City</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Austin, East Austin"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Max Budget ($/mo)</label>
            <select
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="1000">$1,000 /mo</option>
              <option value="1500">$1,500 /mo</option>
              <option value="2000">$2,000 /mo</option>
              <option value="3000">Any budget</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="All">All Genders</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Min Match Score</label>
            <select
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="50">50%+ Match</option>
              <option value="75">75%+ Match</option>
              <option value="85">85%+ Match</option>
              <option value="90">90%+ Top Matches</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="submit"
            className="px-6 py-2.5 gradient-bg text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 flex items-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" /> Apply Filters
          </button>
        </div>
      </form>

      {/* RESULTS GRID */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center text-slate-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
          <span className="text-sm font-semibold">Finding roommates...</span>
        </div>
      ) : roommates.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-base">No roommate profiles found matching criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your budget slider or location filter to see more roommate profiles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roommates.map((item) => (
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
      )}
    </div>
  );
}
