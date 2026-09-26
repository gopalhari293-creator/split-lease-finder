'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import { Mail, ArrowRight, Loader2, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authService.forgotPassword(email);
      showToast(res.message, 'success');
      if (res.data?.resetToken) {
        setResetToken(res.data.resetToken);
      }
    } catch (err: any) {
      showToast(err.message || 'Error processing request.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 mx-auto flex items-center justify-center">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Forgot Password</h2>
          <p className="text-xs text-slate-500">Enter your registered email to receive reset instructions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 gradient-bg text-white font-bold rounded-xl shadow-lg hover:opacity-95 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Send Reset Link</span>}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {resetToken && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 space-y-2">
            <p className="font-bold">Development Reset Shortcut:</p>
            <p className="break-all font-mono text-[11px] bg-white p-2 rounded border border-emerald-200">
              {resetToken}
            </p>
            <Link
              href={`/reset-password?token=${resetToken}`}
              className="inline-block font-bold text-emerald-700 underline mt-1"
            >
              Click here to set new password →
            </Link>
          </div>
        )}

        <div className="text-center text-xs text-slate-500">
          Remembered your password?{' '}
          <Link href="/login" className="font-bold text-brand-600 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
