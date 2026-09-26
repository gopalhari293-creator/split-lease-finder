'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { savedApartmentService } from '../../services/savedApartmentService';
import { Apartment } from '../../types';
import { ApartmentCard } from '../../components/cards/ApartmentCard';
import { Heart, Building2, Loader2 } from 'lucide-react';

export default function SavedApartmentsPage() {
  const router = useRouter();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      const data = await savedApartmentService.getSavedApartments();
      setApartments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleToggleSave = (id: string, isSaved: boolean) => {
    if (!isSaved) {
      setApartments((prev) => prev.filter((a) => a._id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold">
          <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
          <span>Your Favorites</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">Saved Apartments</h1>
        <p className="text-sm text-slate-500">
          Properties you've bookmarked to split lease or share with potential roommates.
        </p>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center text-slate-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
          <span className="text-sm font-semibold">Loading saved apartments...</span>
        </div>
      ) : apartments.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-base">No saved apartments yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any apartment listing to save it to your favorites list.
          </p>
          <button
            onClick={() => router.push('/apartments')}
            className="px-6 py-2.5 gradient-bg text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95"
          >
            Explore Apartments
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {apartments.map((apt) => (
            <ApartmentCard key={apt._id} apartment={apt} onToggleSave={handleToggleSave} />
          ))}
        </div>
      )}
    </div>
  );
}
