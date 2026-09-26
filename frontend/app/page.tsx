'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Users,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Calculator,
  MessageSquare,
  Search,
  Zap,
} from 'lucide-react';
import { CompatibilityBadge } from '../components/ui/CompatibilityBadge';

export default function LandingPage() {
  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Decorative Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-brand-400/20 via-violet-400/20 to-indigo-400/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-bold mb-6 animate-pulse">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Smart Roommate & Apartment Finder</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Find the right roommate.{' '}
            <span className="gradient-text">Find the right home.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Finding an apartment is easy. Finding the right person to share it with is difficult. SplitLease combines lifestyle compatibility + apartment discovery in one place.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white gradient-bg rounded-2xl shadow-xl shadow-brand-500/25 hover:opacity-95 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <span>Find My Match</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/apartments"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 shadow-sm hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Building2 className="w-5 h-5 text-slate-500" />
              <span>Explore Apartments</span>
            </Link>
          </div>

          {/* Visual Equation Card */}
          <div className="mt-16 max-w-4xl mx-auto bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-7 items-center gap-4 text-center">
              {/* Person 1 */}
              <div className="md:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt="Alex"
                  className="w-12 h-12 rounded-xl object-cover border-2 border-brand-300"
                />
                <div className="text-left">
                  <h4 className="font-bold text-slate-900 text-sm">Alex R.</h4>
                  <p className="text-xs text-slate-500">₹15,000 Max Budget</p>
                </div>
              </div>

              <span className="text-2xl font-black text-brand-500">+</span>

              {/* Person 2 */}
              <div className="md:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80"
                  alt="Sarah"
                  className="w-12 h-12 rounded-xl object-cover border-2 border-violet-300"
                />
                <div className="text-left">
                  <h4 className="font-bold text-slate-900 text-sm">Sarah C.</h4>
                  <p className="text-xs text-slate-500">₹16,000 Max Budget</p>
                </div>
              </div>

              <span className="text-2xl font-black text-violet-500">+</span>

              {/* Apartment */}
              <div className="md:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=200&q=80"
                  alt="Apartment"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="text-left">
                  <h4 className="font-bold text-slate-900 text-sm">Downtown 2BR</h4>
                  <p className="text-xs text-emerald-600 font-semibold">₹30,000 /mo</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black">
                  =
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    SplitLease Combined Match Result
                  </p>
                  <p className="text-sm font-extrabold text-slate-900">
                    94% Compatibility • Rent split: ₹15,000/mo each
                  </p>
                </div>
              </div>

              <CompatibilityBadge score={94} size="md" interactive={false} />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold text-brand-600 uppercase tracking-widest">Simple 4-Step Flow</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">How SplitLease Works</h2>
          <p className="text-slate-600 mt-3 text-base">
            We bridge the gap between roommate compatibility and property listings so you never compromise on home harmony.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: '01',
              title: 'Create Profile',
              desc: 'Set your budget, preferred move-in date, and location preferences in under 2 minutes.',
              icon: Users,
              color: 'text-brand-600 bg-brand-50',
            },
            {
              step: '02',
              title: 'Set Lifestyle Specs',
              desc: 'Define sleep schedules, cleanliness standards, work habits, pets, and guest preferences.',
              icon: Sparkles,
              color: 'text-violet-600 bg-violet-50',
            },
            {
              step: '03',
              title: 'Discover Matches',
              desc: 'Browse compatible roommates & verified 2+ bedroom apartment listings side-by-side.',
              icon: Building2,
              color: 'text-emerald-600 bg-emerald-50',
            },
            {
              step: '04',
              title: 'Connect & Split Lease',
              desc: 'Chat directly, schedule group viewings, and split rent effortlessly on the right apartment.',
              icon: Calculator,
              color: 'text-indigo-600 bg-indigo-50',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-lg transition-all relative group"
              >
                <span className="text-4xl font-black text-slate-200 group-hover:text-brand-300 transition-colors">
                  {item.step}
                </span>
                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center my-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CORE DIFFERENTIATOR / FEATURES */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
                The SplitLease Advantage
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Don't just find an apartment. Find the <span className="gradient-text">right person</span> to share it with.
              </h2>
              <p className="text-slate-400 text-base leading-relaxed">
                Traditional apartment sites leave roomies to figure out compatibility on their own. SplitLease measures 15+ lifestyle factors to guarantee your home is peaceful, clean, and financially aligned.
              </p>

              <div className="space-y-4 pt-4">
                {[
                  'Transparent weighted compatibility scoring (0–100%)',
                  'Combined budget calculator vs monthly apartment rent',
                  'End-to-end messaging & group conversation tools',
                  'Verified profiles & lifestyle preference filters',
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-brand-400" />
                    </div>
                    <span className="text-sm font-semibold text-slate-200">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature visual card */}
            <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                <span className="text-sm font-bold text-slate-300">Compatibility Breakdown</span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">
                  92% Match Score
                </span>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Budget Fit (₹10,000 - ₹20,000/mo)', score: 95, color: 'bg-emerald-500' },
                  { label: 'Cleanliness & Schedule', score: 90, color: 'bg-brand-500' },
                  { label: 'Location & Move-in Date', score: 94, color: 'bg-violet-500' },
                  { label: 'Pet & Guest Preferences', score: 88, color: 'bg-indigo-500' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-300">
                      <span>{item.label}</span>
                      <span className="font-bold text-white">{item.score}%</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="gradient-bg text-white rounded-3xl p-10 sm:p-14 text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black">Ready to find your perfect living match?</h2>
            <p className="text-brand-100 text-base">
              Join thousands of students and professionals who found great roommates and split rent on beautiful apartments.
            </p>
            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 font-extrabold rounded-2xl shadow-lg hover:bg-brand-50 transition-all text-base"
              >
                <span>Create Free Profile Today</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
