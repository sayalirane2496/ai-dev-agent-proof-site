'use client';

import React, { useState } from 'react';
import { RestaurantLocation } from '@/lib/types';
import { POPULAR_LOCATIONS } from '@/features/catalog/mock-fallback';
import { MapPin, Navigation, Search, X, Check, Clock, Bike, Store } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: RestaurantLocation;
  onSelectLocation: (loc: RestaurantLocation) => void;
  orderMode: 'delivery' | 'pickup';
  onToggleOrderMode: (mode: 'delivery' | 'pickup') => void;
  locations?: RestaurantLocation[];
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  selectedLocation,
  onSelectLocation,
  orderMode,
  onToggleOrderMode,
  locations = POPULAR_LOCATIONS,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  if (!isOpen) return null;

  const filteredLocations = locations.filter(
    (loc) =>
      loc.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      onSelectLocation(locations[0]); // Select Andheri West
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-[#FDFBF7] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-[#EBE4D8] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#EAE2D5] flex items-center justify-between bg-white">
          <div>
            <h2 className="text-xl font-bold font-display text-[#241812]">
              Where should we deliver?
            </h2>
            <p className="text-xs text-[#59483F] font-medium mt-0.5">
              Select your location for accurate menu prices and hot delivery
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F4EFE6] text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Delivery / Takeaway Mode Switcher */}
        <div className="p-4 bg-[#F8F4EC] border-b border-[#EAE2D5]">
          <div className="grid grid-cols-2 p-1 bg-[#EBE3D3] rounded-2xl">
            <button
              onClick={() => onToggleOrderMode('delivery')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                orderMode === 'delivery'
                  ? 'bg-white text-[#D62300] shadow-sm'
                  : 'text-[#59483F] hover:text-[#241812]'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>Delivery (30 Mins)</span>
            </button>
            <button
              onClick={() => onToggleOrderMode('pickup')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                orderMode === 'pickup'
                  ? 'bg-white text-[#D62300] shadow-sm'
                  : 'text-[#59483F] hover:text-[#241812]'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Takeaway / Dine-In</span>
            </button>
          </div>
        </div>

        {/* Search Input and GPS Trigger */}
        <div className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search area, landmark or pin code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DDD3C2] rounded-xl text-sm text-[#241812] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D62300] focus:border-transparent transition-all"
            />
          </div>

          <button
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#F1EAE0] hover:bg-[#E8DFC2] text-[#D62300] font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer border border-[#DFD5C4]"
          >
            <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Detecting your GPS location...' : 'Use Current Location (GPS)'}</span>
          </button>
        </div>

        {/* Location List */}
        <div className="px-4 pb-4 overflow-y-auto custom-scrollbar flex-1 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#786458] px-1">
            Available Burger King Outlets Nearby
          </p>

          {filteredLocations.length === 0 ? (
            <div className="text-center py-8 text-stone-500">
              <MapPin className="w-8 h-8 mx-auto text-stone-300 mb-2" />
              <p className="text-sm font-semibold">No outlets found for "{searchQuery}"</p>
              <p className="text-xs text-stone-400 mt-1">Try searching Mumbai, Bengaluru, Delhi or Pune</p>
            </div>
          ) : (
            filteredLocations.map((loc) => {
              const isSelected = selectedLocation.id === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => {
                    onSelectLocation(loc);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#FFF8F5] border-[#D62300] ring-1 ring-[#D62300]'
                      : 'bg-white border-[#EAE3D6] hover:border-[#D62300]/50 hover:bg-[#FAF7F2]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#241812]">{loc.locality}</span>
                      <span className="text-[11px] font-semibold text-[#59483F] bg-[#F1EAE0] px-2 py-0.5 rounded-md">
                        {loc.city}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-1">{loc.address}</p>
                    <div className="flex items-center gap-3 text-xs text-stone-600 pt-0.5">
                      <span className="flex items-center gap-1 font-medium text-[#008738]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{loc.etaMin}</span>
                      </span>
                      <span className="text-stone-300">·</span>
                      <span className="font-medium text-stone-500">{loc.distanceKm} km away</span>
                      <span className="text-stone-300">·</span>
                      <span className="font-bold text-[#D62300]">★ {loc.rating}</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-[#D62300] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-stone-300 hover:border-stone-400" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Summary Footer */}
        <div className="p-4 bg-white border-t border-[#EAE2D5] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-500 font-medium block">Currently delivering to:</span>
            <span className="text-sm font-bold text-[#241812]">
              {selectedLocation.locality}, {selectedLocation.city}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#D62300] hover:bg-[#B81D00] text-white font-bold text-sm rounded-xl transition-all shadow cursor-pointer active:scale-95"
          >
            START ORDER
          </button>
        </div>
      </div>
    </div>
  );
};
