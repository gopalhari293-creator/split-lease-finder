'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { adminService } from '../../services/adminService';
import { apartmentService } from '../../services/apartmentService';
import { User, Apartment } from '../../types';
import {
  ShieldCheck,
  Users,
  Building2,
  MessageSquare,
  Sparkles,
  Trash2,
  Plus,
  Search,
  Loader2,
  X,
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'apartments'>('users');
  const [searchUser, setSearchUser] = useState('');

  // Create Apartment Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newApt, setNewApt] = useState({
    title: '',
    location: 'Downtown Austin',
    address: '',
    monthlyRent: 2200,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1000,
    description: '',
    amenities: 'Pool, Gym, In-unit Laundry',
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      showToast('Forbidden. Admin access required.', 'error');
      router.push('/dashboard');
      return;
    }

    const loadAdminData = async () => {
      try {
        const [statsData, usersData, aptData] = await Promise.all([
          adminService.getStats(),
          adminService.getUsers(),
          apartmentService.getApartments({ limit: 50 }),
        ]);

        setStats(statsData);
        setUsers(usersData.users || []);
        setApartments(aptData.apartments || []);
      } catch (err: any) {
        showToast(err.message || 'Failed to load admin metrics.', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'ADMIN') {
      loadAdminData();
    }
  }, [user, authLoading, router]);

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id && u.id !== id));
      showToast('User deleted successfully.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete user.', 'error');
    }
  };

  const handleCreateApartment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await apartmentService.createApartment({
        ...newApt,
        monthlyRent: Number(newApt.monthlyRent),
        bedrooms: Number(newApt.bedrooms),
        bathrooms: Number(newApt.bathrooms),
        sqft: Number(newApt.sqft),
        images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'],
        amenities: newApt.amenities.split(',').map((s) => s.trim()),
      });
      setApartments((prev) => [created, ...prev]);
      setShowAddModal(false);
      showToast('New apartment created successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to create apartment.', 'error');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
        <span className="text-sm font-semibold">Loading admin portal...</span>
      </div>
    );
  }

  const filteredUsers = users.filter(
    (u) => u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 p-8 rounded-3xl text-white shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-400/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black">Admin Management Dashboard</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-300 text-xs font-bold">
                System Admin
              </span>
            </div>
            <p className="text-xs text-purple-200 mt-1">Platform monitoring, user oversight & property management</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-2xl text-xs shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Apartment
        </button>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Users</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats?.totalUsers || 0}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Apartments</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats?.totalApartments || 0}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Matches</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats?.totalMatches || 0}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Messages</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats?.totalMessages || 0}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ADMIN TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users' ? 'bg-purple-900 text-white shadow' : 'bg-white text-slate-600 border hover:bg-slate-50'
          }`}
        >
          Users Management ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('apartments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'apartments' ? 'bg-purple-900 text-white shadow' : 'bg-white text-slate-600 border hover:bg-slate-50'
          }`}
        >
          Apartments Listings ({apartments.length})
        </button>
      </div>

      {/* USER MANAGEMENT TABLE */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Search user by name or email..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u._id || u.id} className="hover:bg-slate-50">
                    <td className="p-3 flex items-center gap-3 font-semibold text-slate-900">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full border" />
                      <span>{u.name}</span>
                    </td>
                    <td className="p-3 font-mono text-slate-600">{u.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleDeleteUser(u._id || u.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* APARTMENT LISTINGS VIEW */}
      {activeTab === 'apartments' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {apartments.map((apt) => (
              <div key={apt._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                <img src={apt.images?.[0]} alt={apt.title} className="w-14 h-14 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 truncate">{apt.title}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{apt.location}</p>
                  <p className="text-xs font-extrabold text-purple-700 mt-0.5">{formatCurrency(apt.monthlyRent)}/mo</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE APARTMENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-black text-lg text-slate-900">Create New Apartment</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateApartment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newApt.title}
                  onChange={(e) => setNewApt({ ...newApt, title: e.target.value })}
                  placeholder="e.g. Modern Eastside Condo"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Neighborhood</label>
                  <input
                    type="text"
                    required
                    value={newApt.location}
                    onChange={(e) => setNewApt({ ...newApt, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Monthly Rent ($)</label>
                  <input
                    type="number"
                    required
                    value={newApt.monthlyRent}
                    onChange={(e) => setNewApt({ ...newApt, monthlyRent: parseInt(e.target.value, 10) || 1000 })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Address</label>
                <input
                  type="text"
                  required
                  value={newApt.address}
                  onChange={(e) => setNewApt({ ...newApt, address: e.target.value })}
                  placeholder="123 Main St, Austin, TX"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newApt.description}
                  onChange={(e) => setNewApt({ ...newApt, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow"
              >
                Create Listing
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
