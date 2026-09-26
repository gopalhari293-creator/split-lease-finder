'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/authService';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  MapPin,
  Calendar,
  Briefcase,
  Home,
  Clock,
  Volume2,
  Smile,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
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
    if (profile) {
      setFormData({
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
  }, [profile]);

  const totalSteps = 6;
  const progressPercent = Math.round((step / totalSteps) * 100);

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await authService.updateProfile(formData);
      await refreshUser();
      showToast('Profile setup complete! Welcome to your dashboard.', 'success');
      router.push('/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Failed to save profile setup.', 'error');
    } finally {
      setLoading(false);
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
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Progress Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
              Step {step} of {totalSteps}
            </span>
            <h2 className="text-xl font-black">Roommate Compatibility Specs</h2>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-emerald-400">{progressPercent}%</span>
            <p className="text-[10px] text-slate-400">Completion</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5">
          <div
            className="h-full gradient-bg transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          {/* STEP 1: BASIC PROFILE */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-600" /> Basic Details
              </h3>
              <p className="text-xs text-slate-500">Tell potential roommates a bit about yourself.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value, 10) || 20 })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    placeholder="e.g. Software Engineer, Designer, Student"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company / University</label>
                  <input
                    type="text"
                    value={formData.universityOrCompany}
                    onChange={(e) => setFormData({ ...formData, universityOrCompany: e.target.value })}
                    placeholder="e.g. UT Austin, TechCorp"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: BUDGET & LOCATION */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" /> Budget & Location Range
              </h3>
              <p className="text-xs text-slate-500">Define your monthly rent budget per person and target neighborhoods.</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Min Budget ($/mo)</label>
                    <input
                      type="number"
                      value={formData.budgetMin}
                      onChange={(e) => setFormData({ ...formData, budgetMin: parseInt(e.target.value, 10) || 500 })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Max Budget ($/mo)</label>
                    <input
                      type="number"
                      value={formData.budgetMax}
                      onChange={(e) => setFormData({ ...formData, budgetMax: parseInt(e.target.value, 10) || 1500 })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-brand-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Neighborhoods (comma separated)</label>
                  <input
                    type="text"
                    value={formData.preferredLocations.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredLocations: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="e.g. Downtown Austin, East Austin, Hyde Park"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: TIMELINE */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-violet-600" /> Move-in Timeline & Lease Length
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Move-in Date</label>
                  <input
                    type="date"
                    value={formData.moveInDate}
                    onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Lease Duration</label>
                  <select
                    value={formData.leaseDuration}
                    onChange={(e) => setFormData({ ...formData, leaseDuration: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="6 months">6 months</option>
                    <option value="12 months">12 months</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: LIFESTYLE SLIDERS & SCHEDULE */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-600" /> Lifestyle & Habit Controls
              </h3>

              {/* Cleanliness Slider */}
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
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Relaxed</span>
                  <span>Spotless Clean</span>
                </div>
              </div>

              {/* Social Level Slider */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Social Interaction at Home</span>
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
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Keep to myself</span>
                  <span>Very social & friendly</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sleep Schedule</label>
                  <select
                    value={formData.lifestyle.sleepSchedule}
                    onChange={(e) => updateLifestyle('sleepSchedule', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="Early bird">Early bird</option>
                    <option value="Night owl">Night owl</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Schedule</label>
                  <select
                    value={formData.lifestyle.workSchedule}
                    onChange={(e) => updateLifestyle('workSchedule', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="Work from home">Work from home</option>
                    <option value="In-office">In-office</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Student">Student</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PETS, SMOKING, ROOM PREFS */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Home className="w-5 h-5 text-indigo-600" /> Habits & Room Preferences
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Smoking</label>
                  <select
                    value={formData.lifestyle.smoking}
                    onChange={(e) => updateLifestyle('smoking', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
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
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="No pets">No pets</option>
                    <option value="Has dog">Has dog</option>
                    <option value="Has cat">Has cat</option>
                    <option value="Pet friendly">Pet friendly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Guests</label>
                  <select
                    value={formData.lifestyle.guests}
                    onChange={(e) => updateLifestyle('guests', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="Rarely">Rarely</option>
                    <option value="Weekends only">Weekends only</option>
                    <option value="Frequent">Frequent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Room Preference</label>
                  <select
                    value={formData.lifestyle.roomPreference}
                    onChange={(e) => updateLifestyle('roomPreference', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="Private room">Private room</option>
                    <option value="Shared room">Shared room</option>
                    <option value="Any">Any</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW & SAVE */}
          {step === 6 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="text-center space-y-2 bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-xl font-black text-slate-900">All Set! Ready to find roommate matches</h3>
                <p className="text-xs text-slate-600">Review your key preferences below before finalizing.</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Budget Range:</span>
                  <span className="font-bold text-slate-900">${formData.budgetMin} – ${formData.budgetMax} /mo</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Locations:</span>
                  <span className="font-bold text-slate-900">{formData.preferredLocations.join(', ')}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Cleanliness & Habits:</span>
                  <span className="font-bold text-slate-900">
                    Cleanliness {formData.lifestyle.cleanliness}/5 • {formData.lifestyle.smoking} • {formData.lifestyle.pets}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1 || loading}
            className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-30 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {step < totalSteps ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 gradient-bg text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 flex items-center gap-1.5"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-8 py-3 bg-emerald-600 text-white text-sm font-extrabold rounded-xl shadow-lg hover:bg-emerald-700 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Complete Setup & View Matches</span>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
