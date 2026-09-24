import React, { useState } from 'react';
import { POPULAR_LOCATIONS } from '../data/mockData';
import { RestaurantLocation } from '../types';
import { MapPin, Navigation, Clock, Phone, Check, ExternalLink, Filter, Star } from 'lucide-react';

interface RestaurantFinderProps {
  onSelectRestaurant: (restaurant: RestaurantLocation) => void;
  currentSelectedId: string;
}

export const RestaurantFinder: React.FC<RestaurantFinderProps> = ({
  onSelectRestaurant,
  currentSelectedId,
}) => {
  const [cityFilter, setCityFilter] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<string>('All');

  const cities = ['All', 'Mumbai', 'Bengaluru', 'Delhi NCR', 'Gurugram', 'Pune'];
  const services = ['All', 'Delivery', 'Takeaway', 'Dine-In', 'Drive-Thru'];

  const filteredRestaurants = POPULAR_LOCATIONS.filter((r) => {
    if (cityFilter !== 'All' && r.city !== cityFilter) return false;
    if (selectedService !== 'All' && !r.services.includes(selectedService as any)) return false;
    return true;
  });

  return (
    <section id="restaurants" className="py-14 bg-[#F6F1E7] border-b border-[#E8DFD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#D62300] block mb-1">
              Find Your King
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-[#241812]">
              BURGER KING RESTAURANTS
            </h2>
            <p className="text-sm text-[#59483F] font-medium mt-1">
              Locate nearby outlets for hot delivery, takeaway, or royal dine-in.
            </p>
          </div>

          {/* City Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {cities.map((c) => (
              <button
                key={c}
                onClick={() => setCityFilter(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  cityFilter === c
                    ? 'bg-[#241812] text-white shadow-sm'
                    : 'bg-white text-[#59483F] hover:bg-[#F2ECE0] border border-[#DDD3C2]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Restaurant Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => {
            const isSelected = restaurant.id === currentSelectedId;
            return (
              <div
                key={restaurant.id}
                className={`bg-white rounded-3xl p-5 border transition-all duration-300 shadow-xs flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#D62300] ring-2 ring-[#D62300]/30 shadow-md'
                    : 'border-[#E3D9C8] hover:border-[#D62300]/50 hover:shadow-lg'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#D62300] bg-[#FFF0E8] px-2.5 py-0.5 rounded-full">
                      {restaurant.city}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#241812]">
                      <Star className="w-3.5 h-3.5 fill-[#FFB703] text-[#FFB703]" />
                      <span>{restaurant.rating}</span>
                      <span className="text-stone-400 font-normal">({restaurant.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Name & Address */}
                  <div>
                    <h3 className="font-display font-extrabold text-base sm:text-lg text-[#241812] leading-snug">
                      {restaurant.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {restaurant.address}
                    </p>
                  </div>

                  {/* Operational Details */}
                  <div className="space-y-1.5 text-xs text-[#59483F] pt-2 border-t border-stone-100">
                    <div className="flex items-center gap-2 text-[#008738] font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{restaurant.timing}</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-600 font-medium">
                      <Navigation className="w-3.5 h-3.5 text-[#D62300]" />
                      <span>{restaurant.distanceKm} km away · ETA: {restaurant.etaMin}</span>
                    </div>
                  </div>

                  {/* Service Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {restaurant.services.map((srv) => (
                      <span
                        key={srv}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F4EFE6] text-[#59483F]"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 mt-4 border-t border-[#EFE8DC] flex items-center gap-2">
                  <button
                    onClick={() => onSelectRestaurant(restaurant)}
                    className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#008738] text-white shadow-sm'
                        : 'bg-[#D62300] hover:bg-[#B81D00] text-white shadow hover:shadow-md'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>DELIVERING FROM HERE</span>
                      </>
                    ) : (
                      <span>ORDER HERE</span>
                    )}
                  </button>

                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl border border-[#DDD3C2] bg-[#FAF7F2] hover:bg-stone-100 text-[#59483F] transition-colors"
                    title="Get Directions on Google Maps"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
