'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/authService';
import {
  User as UserIcon,
  Sparkles,
  Save,
  Briefcase,
  DollarSign,
  MapPin,
  Calendar,
  Home,
  Loader2,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, refreshUser, updateProfileState } = useAuth();
  const { showToast } = useToast();

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    isEmailVisible: false,
    isPhoneVisible: false,
    age: 25,
    gender: 'Prefer not to say',
    occupation: '',
    universityOrCompany: '',
    preferredLocations: ['Downtown Austin'],
    budgetMin: 800,
    budgetMax: 1400,
    moveInDate: new Date().toISOString().split('T')[0],
    leaseDuration: '12 months',
    lifestyle: {
      cleanliness: 4,
      sleepSchedule: 'Early bird',
      workSchedule: 'Hybrid',
      smoking: 'Non-smoker',
      drinking: 'Socially',
      pets: 'Pet friendly',
      guests: 'Weekends only',
      socialLevel: 3,
      noiseTolerance: 3,
      cookingHabits: 'Cook often',
      roomPreference: 'Private room',
      parkingNeeded: false,
      furnishedPreference: 'Flexible',
      genderPreference: 'Any',
    },
  });

  useEffect(() => {
    if (user && profile) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        phone: user.phone || '',
        isEmailVisible: !!user.isEmailVisible,
        isPhoneVisible: !!user.isPhoneVisible,
        age: profile.age || 25,
        gender: profile.gender || 'Prefer not to say',
        occupation: profile.occupation || '',
        universityOrCompany: profile.universityOrCompany || '',
        preferredLocations: profile.preferredLocations?.length ? profile.preferredLocations : ['Downtown Austin'],
        budgetMin: profile.budgetMin || 800,
        budgetMax: profile.budgetMax || 1400,
        moveInDate: profile.moveInDate ? new Date(profile.moveInDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        leaseDuration: profile.leaseDuration || '12 months',
        lifestyle: {
          cleanliness: profile.lifestyle?.cleanliness || 4,
          sleepSchedule: profile.lifestyle?.sleepSchedule || 'Early bird',
          workSchedule: profile.lifestyle?.workSchedule || 'Hybrid',
          smoking: profile.lifestyle?.smoking || 'Non-smoker',
          drinking: profile.lifestyle?.drinking || 'Socially',
          pets: profile.lifestyle?.pets || 'Pet friendly',
          guests: profile.lifestyle?.guests || 'Weekends only',
          socialLevel: profile.lifestyle?.socialLevel || 3,
          noiseTolerance: profile.lifestyle?.noiseTolerance || 3,
          cookingHabits: profile.lifestyle?.cookingHabits || 'Cook often',
          roomPreference: profile.lifestyle?.roomPreference || 'Private room',
          parkingNeeded: profile.lifestyle?.parkingNeeded || false,
          furnishedPreference: profile.lifestyle?.furnishedPreference || 'Flexible',
          genderPreference: profile.lifestyle?.genderPreference || 'Any',
        },
      });
    }
  }, [user, profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authService.updateProfile(formData);
      updateProfileState(res.user, res.profile);
      showToast('Profile specs updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateLifestyle = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      lifestyle: {
        ...prev.lifestyle,
        [key]: value,
      },
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Roommate Profile & Lifestyle Specs</h1>
          <p className="text-sm text-slate-500">
            Keep your budget, schedule, and home habits up to date for precise compatibility matching.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 gradient-bg text-white font-bold rounded-2xl text-xs shadow-lg hover:opacity-95 flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* BASIC & BIO */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
            <UserIcon className="w-5 h-5 text-brand-600" /> Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value, 10) || 20 })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Occupation</label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company / School</label>
              <input
                type="text"
                value={formData.universityOrCompany}
                onChange={(e) => setFormData({ ...formData, universityOrCompany: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">About Me (Bio)</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell roommates about your interests, routines, and lifestyle..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* BUDGET & LOCATIONS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
            <DollarSign className="w-5 h-5 text-emerald-600" /> Budget & Neighborhood Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Min Budget (₹/mo)</label>
              <input
                type="number"
                value={formData.budgetMin}
                onChange={(e) => setFormData({ ...formData, budgetMin: parseInt(e.target.value, 10) || 5000 })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Max Budget (₹/mo)</label>
              <input
                type="number"
                value={formData.budgetMax}
                onChange={(e) => setFormData({ ...formData, budgetMax: parseInt(e.target.value, 10) || 20000 })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-brand-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Lease Length</label>
              <select
                value={formData.leaseDuration}
                onChange={(e) => setFormData({ ...formData, leaseDuration: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="6 months">6 months</option>
                <option value="12 months">12 months</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>
        </div>

        {/* LIFESTYLE SLIDERS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-5 h-5 text-violet-600" /> Lifestyle Compatibility Controls
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Cleanliness Standard</span>
                <span className="text-brand-600">{formData.lifestyle.cleanliness} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.lifestyle.cleanliness}
                onChange={(e) => updateLifestyle('cleanliness', parseInt(e.target.value, 10))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Social Level</span>
                <span className="text-violet-600">{formData.lifestyle.socialLevel} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.lifestyle.socialLevel}
                onChange={(e) => updateLifestyle('socialLevel', parseInt(e.target.value, 10))}
                className="w-full accent-violet-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sleep Schedule</label>
              <select
                value={formData.lifestyle.sleepSchedule}
                onChange={(e) => updateLifestyle('sleepSchedule', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="Early bird">Early bird</option>
                <option value="Night owl">Night owl</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Smoking</label>
              <select
                value={formData.lifestyle.smoking}
                onChange={(e) => updateLifestyle('smoking', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="Non-smoker">Non-smoker</option>
                <option value="Outside only">Outside only</option>
                <option value="Smoker">Smoker</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pets</label>
              <select
                value={formData.lifestyle.pets}
                onChange={(e) => updateLifestyle('pets', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="No pets">No pets</option>
                <option value="Has dog">Has dog</option>
                <option value="Has cat">Has cat</option>
                <option value="Pet friendly">Pet friendly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Room Pref</label>
              <select
                value={formData.lifestyle.roomPreference}
                onChange={(e) => updateLifestyle('roomPreference', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="Private room">Private room</option>
                <option value="Shared room">Shared room</option>
                <option value="Any">Any</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
