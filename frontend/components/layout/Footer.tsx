'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Heart, Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white">
                <Users className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Split<span className="text-brand-400">Lease</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Don't just find an apartment. Find the right person to share it with. Smart roommate matching & apartment discovery combined.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> Safe & Verified
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" /> AI Compatibility
              </span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Discover</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/roommates" className="hover:text-white transition-colors">
                  Find Compatible Roommates
                </Link>
              </li>
              <li>
                <Link href="/apartments" className="hover:text-white transition-colors">
                  Search Available Apartments
                </Link>
              </li>
              <li>
                <Link href="/matches" className="hover:text-white transition-colors">
                  Combined Roommate + Apartment Matches
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-white transition-colors">
                  Compatibility Quiz
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  User Dashboard
                </Link>
              </li>
              <li>
                <Link href="/messages" className="hover:text-white transition-colors">
                  In-App Messaging
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-white transition-colors">
                  Saved Apartments
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Lifestyle Preferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Safety & Legal</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Trust & Safety Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Fair Housing Commitment
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SplitLease Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for roommate harmony worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};
