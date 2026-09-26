'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Settings, Shield, Bell, Lock } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Account preferences saved!', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Account Settings</h1>
        <p className="text-sm text-slate-500">Manage security settings and notification preferences.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-5 h-5 text-brand-600" /> Notifications & Alerts
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Email Match Alerts</span>
                <span className="text-[11px] text-slate-500">Get notified when a new high-compatibility roommate registers.</span>
              </div>
              <input
                type="checkbox"
                checked={matchAlerts}
                onChange={(e) => setMatchAlerts(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Message Digest</span>
                <span className="text-[11px] text-slate-500">Receive email summaries for unread messages.</span>
              </div>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded"
              />
            </label>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
            <Shield className="w-5 h-5 text-emerald-600" /> Privacy & Security
          </h3>

          <div className="space-y-2 text-xs text-slate-600">
            <p><strong>Account Role:</strong> {user?.role}</p>
            <p><strong>Email Address:</strong> {user?.email}</p>
            <p className="text-slate-400">Passwords & JWT credentials are secured using bcrypt + HTTP-only cookies.</p>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 gradient-bg text-white font-bold rounded-2xl text-xs shadow-md hover:opacity-95"
        >
          Save Preferences
        </button>
      </form>
    </div>
  );
}
