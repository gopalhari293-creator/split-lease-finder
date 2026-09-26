'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Mail, Lock, ArrowRight, Loader2, Users } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('Logged in successfully!', 'success');
      router.push('/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillTestUser = () => {
    setEmail('alex@splitlease.com');
    setPassword('password123');
  };

  const fillAdminUser = () => {
    setEmail('admin@splitlease.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gradient-bg mx-auto flex items-center justify-center text-white shadow-md">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Welcome back</h2>
          <p className="text-xs text-slate-500">Log in to manage your roommate matches & saved apartments</p>
        </div>

        {/* Demo Quick Fill Helper */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Quick Demo Accounts:</span>
          <div className="flex gap-2">
            <button
              onClick={fillTestUser}
              type="button"
              className="px-2.5 py-1 bg-brand-50 text-brand-700 font-bold rounded-lg hover:bg-brand-100"
            >
              Test User
            </button>
            <button
              onClick={fillAdminUser}
              type="button"
              className="px-2.5 py-1 bg-purple-50 text-purple-700 font-bold rounded-lg hover:bg-purple-100"
            >
              Admin
            </button>
          </div>
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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-brand-600 hover:underline font-semibold">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 gradient-bg text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 hover:opacity-95 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Log In</span>}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          Don't have a SplitLease account?{' '}
          <Link href="/register" className="font-bold text-brand-600 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
