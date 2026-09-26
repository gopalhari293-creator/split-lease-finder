'use client';

import React, { useState, useEffect } from 'react';
import { apartmentService } from '../../services/apartmentService';
import { Apartment } from '../../types';
import { ApartmentCard } from '../../components/cards/ApartmentCard';
import { Search, Filter, LayoutGrid, List, Loader2, Building2 } from 'lucide-react';

export default function ApartmentsPage() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filters
  const [location, setLocation] = useState('');
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [bedrooms, setBedrooms] = useState('Any');
  const [petPolicy, setPetPolicy] = useState('Any');
  const [furnished, setFurnished] = useState('');

  const fetchApartments = async () => {
    setLoading(true);
    try {
      const data = await apartmentService.getApartments({
        location: location || undefined,
        minRent: minRent || undefined,
        maxRent: maxRent || undefined,
        bedrooms: bedrooms !== 'Any' ? bedrooms : undefined,
        petPolicy: petPolicy !== 'Any' ? petPolicy : undefined,
        furnished: furnished !== '' ? furnished : undefined,
      });
      setApartments(data.apartments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApartments();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Discover Available Apartments</h1>
          <p className="text-sm text-slate-500">
            Verified 2+ bedroom properties ideal for splitting leases with compatible roommates.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'grid' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'list' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Location / Zip</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Downtown Austin"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Max Rent ($/mo)</label>
            <input
              type="number"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value)}
              placeholder="e.g. 3000"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Bedrooms</label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="Any">Any Bedrooms</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Furnishing</label>
            <select
              value={furnished}
              onChange={(e) => setFurnished(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="">Any</option>
              <option value="true">Furnished Only</option>
              <option value="false">Unfurnished Only</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 gradient-bg text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 flex items-center justify-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" /> Search
            </button>
          </div>
        </div>
      </form>

      {/* APARTMENTS RESULT */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center text-slate-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
          <span className="text-sm font-semibold">Searching available properties...</span>
        </div>
      ) : apartments.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-base">No apartments found matching your filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try expanding your price range or search for a broader location.
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-6'}>
          {apartments.map((apt) => (
            <ApartmentCard key={apt._id} apartment={apt} />
          ))}
        </div>
      )}
    </div>
  );
}
