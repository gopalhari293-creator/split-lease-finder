'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apartmentService } from '../../../services/apartmentService';
import { savedApartmentService } from '../../../services/savedApartmentService';
import { messageService } from '../../../services/messageService';
import { Apartment } from '../../../types';
import { RoommateCard } from '../../../components/cards/RoommateCard';
import { useToast } from '../../../context/ToastContext';
import {
  MapPin,
  DollarSign,
  BedDouble,
  Bath,
  Maximize2,
  Calendar,
  Shield,
  Heart,
  MessageSquare,
  Users,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../../lib/utils';

export default function ApartmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = params.id as string;

  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [compatibleRoommates, setCompatibleRoommates] = useState<any[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await apartmentService.getApartmentById(id);
        setApartment(data.apartment);
        setIsSaved(!!data.apartment?.isSaved);
        setCompatibleRoommates(data.compatibleRoommates || []);
        if (data.apartment?.images?.length) {
          setSelectedImage(data.apartment.images[0]);
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to load apartment details.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleSaveToggle = async () => {
    if (!apartment) return;
    const nextStatus = !isSaved;
    setIsSaved(nextStatus);

    try {
      if (nextStatus) {
        await savedApartmentService.saveApartment(apartment._id);
        showToast('Saved apartment to your favorites!', 'success');
      } else {
        await savedApartmentService.removeSavedApartment(apartment._id);
        showToast('Removed from saved list.', 'info');
      }
    } catch (err: any) {
      setIsSaved(!nextStatus);
      showToast(err.message || 'Failed to update saved state.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
        <span className="text-sm font-semibold">Loading apartment details...</span>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-700">Apartment not found</h2>
        <button
          onClick={() => router.push('/apartments')}
          className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Apartments
        </button>
      </div>
    );
  }

  const rentPerRoommate = Math.round(apartment.monthlyRent / 2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <button
        onClick={() => router.back()}
        className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" /> Back to apartment search
      </button>

      {/* Main Header & Image Gallery */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
              <MapPin className="w-4 h-4 text-brand-500" />
              <span>{apartment.address}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900">{apartment.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveToggle}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold border transition-all ${
                isSaved
                  ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
              <span>{isSaved ? 'Saved to Favorites' : 'Save Apartment'}</span>
            </button>

            <button
              onClick={() => router.push('/roommates')}
              className="px-6 py-3 gradient-bg text-white text-xs font-extrabold rounded-2xl shadow-lg hover:opacity-95 flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Find Roommates for this Spot
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 aspect-[16/10] rounded-3xl overflow-hidden bg-slate-100 shadow-md border border-slate-200 relative">
            <img
              src={selectedImage || apartment.images?.[0]}
              alt={apartment.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl text-white">
              <span className="text-2xl font-black">{formatCurrency(apartment.monthlyRent)}</span>
              <span className="text-xs text-slate-300 font-medium"> /month total</span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto">
            {apartment.images?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative rounded-2xl overflow-hidden aspect-[16/10] lg:aspect-[16/9] w-full border-2 transition-all ${
                  selectedImage === img ? 'border-brand-500 scale-[1.02] shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Key specs row */}
          <div className="grid grid-cols-4 gap-3 bg-white p-6 rounded-3xl border border-slate-200 text-center shadow-card">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bedrooms</span>
              <span className="text-xl font-black text-slate-900 flex items-center justify-center gap-1 mt-1">
                <BedDouble className="w-5 h-5 text-brand-500" /> {apartment.bedrooms}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bathrooms</span>
              <span className="text-xl font-black text-slate-900 flex items-center justify-center gap-1 mt-1">
                <Bath className="w-5 h-5 text-violet-500" /> {apartment.bathrooms}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Area</span>
              <span className="text-xl font-black text-slate-900 flex items-center justify-center gap-1 mt-1">
                <Maximize2 className="w-5 h-5 text-emerald-500" /> {apartment.sqft} sqft
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Est. Split</span>
              <span className="text-xl font-black text-brand-600 flex items-center justify-center gap-1 mt-1">
                {formatCurrency(rentPerRoommate)}/mo
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-lg">About this Property</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{apartment.description}</p>
          </div>

          {/* Amenities */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Amenities & Features</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {apartment.amenities?.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column sidebar card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
              Lease & Property Specifications
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Available Date:</span>
                <span className="font-bold text-slate-900">{formatDate(apartment.availableDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Lease Term:</span>
                <span className="font-bold text-slate-900">{apartment.leaseDuration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Furnishing:</span>
                <span className="font-bold text-slate-900">{apartment.furnished ? 'Furnished' : 'Unfurnished'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pet Policy:</span>
                <span className="font-bold text-slate-900">{apartment.petPolicy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Parking:</span>
                <span className="font-bold text-slate-900">{apartment.parking}</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Split Rent Breakdown
              </div>
              <p className="text-xs text-emerald-700">
                With 2 roommates, each person pays approx <strong>{formatCurrency(rentPerRoommate)}/month</strong>.
              </p>
            </div>

            <button
              onClick={() => router.push('/messages')}
              className="w-full py-3.5 gradient-bg text-white font-bold rounded-2xl shadow-lg hover:opacity-95 flex items-center justify-center gap-2 text-xs"
            >
              <MessageSquare className="w-4 h-4" /> Contact Landlord / Start Chat
            </button>
          </div>
        </div>
      </div>

      {/* COMPATIBLE ROOMMATES FOR THIS APARTMENT */}
      {compatibleRoommates.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <div>
            <span className="text-xs font-extrabold text-brand-600 uppercase tracking-wider">Group Leasing</span>
            <h2 className="text-2xl font-black text-slate-900">Roommates Looking in this Area</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {compatibleRoommates.slice(0, 3).map((item) => (
              <RoommateCard
                key={item.profile._id}
                profile={item.profile}
                user={item.user}
                compatibilityScore={item.combinedMatch?.combinedScore || 88}
                categoryScores={{ budget: 90, lifestyle: 88, location: 95, schedule: 85, preferences: 90 }}
                whyItWorks={item.combinedMatch?.whyItWorks || ['Budget aligns with this property']}
                onMessage={() => router.push('/messages')}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
