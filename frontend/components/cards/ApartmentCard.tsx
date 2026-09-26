'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Apartment } from '../../types';
import { Heart, MapPin, BedDouble, Bath, Maximize2, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { savedApartmentService } from '../../services/savedApartmentService';
import { useToast } from '../../context/ToastContext';

interface ApartmentCardProps {
  apartment: Apartment;
  onToggleSave?: (id: string, isSaved: boolean) => void;
}

export const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment, onToggleSave }) => {
  const [isSaved, setIsSaved] = useState(!!apartment.isSaved);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const primaryImage =
    apartment.images?.[0] ||
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saving) return;

    setSaving(true);
    const newStatus = !isSaved;
    setIsSaved(newStatus);

    try {
      if (newStatus) {
        await savedApartmentService.saveApartment(apartment._id);
        showToast('Apartment saved to your favorites!', 'success');
      } else {
        await savedApartmentService.removeSavedApartment(apartment._id);
        showToast('Apartment removed from saved list.', 'info');
      }
      if (onToggleSave) onToggleSave(apartment._id, newStatus);
    } catch (err: any) {
      setIsSaved(!newStatus);
      showToast(err.message || 'Failed to update saved status', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Image container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={primaryImage}
          alt={apartment.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20"></div>

        {/* Featured Tag */}
        {apartment.isFeatured && (
          <span className="absolute top-3 left-3 bg-brand-600/90 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-md flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Featured Listing
          </span>
        )}

        {/* Save Heart Button */}
        <button
          onClick={handleSaveToggle}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all ${
            isSaved
              ? 'bg-rose-500 text-white shadow-md scale-110'
              : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
        </button>

        {/* Rent Tag */}
        <div className="absolute bottom-3 left-3 text-white">
          <span className="text-2xl font-black tracking-tight">{formatCurrency(apartment.monthlyRent)}</span>
          <span className="text-xs text-slate-200 font-medium">/month</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
            <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
            <span className="truncate">{apartment.address || apartment.location}</span>
          </div>

          <Link href={`/apartments/${apartment._id}`}>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors line-clamp-1">
              {apartment.title}
            </h3>
          </Link>
        </div>

        {/* Specs Badges */}
        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 text-xs font-medium">
          <div className="flex items-center justify-center gap-1.5">
            <BedDouble className="w-4 h-4 text-brand-500" />
            <span>{apartment.bedrooms} Beds</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 border-x border-slate-200">
            <Bath className="w-4 h-4 text-violet-500" />
            <span>{apartment.bathrooms} Baths</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Maximize2 className="w-4 h-4 text-emerald-500" />
            <span>{apartment.sqft} sqft</span>
          </div>
        </div>

        {/* Amenities tags */}
        <div className="flex flex-wrap gap-1.5">
          {apartment.furnished && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700">
              Furnished
            </span>
          )}
          {apartment.amenities?.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
              {amenity}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="pt-2">
          <Link
            href={`/apartments/${apartment._id}`}
            className="w-full block py-2.5 text-center text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors"
          >
            View Apartment & Matches
          </Link>
        </div>
      </div>
    </div>
  );
};
