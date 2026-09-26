'use client';

import React, { useState } from 'react';
import { Sparkles, ChevronDown, CheckCircle2 } from 'lucide-react';
import { CategoryScores } from '../../types';

interface CompatibilityBadgeProps {
  score: number;
  categoryScores?: CategoryScores;
  whyItWorks?: string[];
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const CompatibilityBadge: React.FC<CompatibilityBadgeProps> = ({
  score,
  categoryScores,
  whyItWorks,
  size = 'md',
  interactive = true,
}) => {
  const [open, setOpen] = useState(false);

  // Color scheme based on score
  let badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let pillBg = 'bg-emerald-500';
  if (score < 85 && score >= 75) {
    badgeBg = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    pillBg = 'bg-indigo-500';
  } else if (score < 75) {
    badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
    pillBg = 'bg-amber-500';
  }

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1',
    md: 'text-sm px-3 py-1.5 gap-1.5 font-bold',
    lg: 'text-base px-4 py-2 gap-2 font-extrabold',
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => interactive && categoryScores && setOpen(!open)}
        className={`flex items-center rounded-full border shadow-sm transition-all ${badgeBg} ${
          sizeClasses[size]
        } ${interactive ? 'hover:scale-105 cursor-pointer' : ''}`}
      >
        <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse" />
        <span>{score}% Match</span>
        {interactive && categoryScores && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
      </button>

      {/* Category breakdown popover */}
      {open && categoryScores && (
        <div
          className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Compatibility Breakdown
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${pillBg}`}>
              {score}% Total
            </span>
          </div>

          <div className="py-3 space-y-2.5">
            {Object.entries(categoryScores).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-700 capitalize">
                  <span>{key}</span>
                  <span className="font-bold text-slate-900">{value}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${pillBg}`}
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {whyItWorks && whyItWorks.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Why this match works
              </p>
              <ul className="space-y-1">
                {whyItWorks.slice(0, 3).map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
