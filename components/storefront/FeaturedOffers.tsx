'use client';

import React, { useState } from 'react';
import { OFFERS } from '@/features/catalog/mock-fallback';
import { OfferDeal } from '@/lib/types';
import { Tag, Sparkles, Check, ArrowRight } from 'lucide-react';

interface FeaturedOffersProps {
  onApplyCoupon: (offer: OfferDeal) => void;
  appliedCouponCode?: string;
  onSelectDealProduct?: (productId: string) => void;
  offers?: OfferDeal[];
}

export const FeaturedOffers: React.FC<FeaturedOffersProps> = ({
  onApplyCoupon,
  appliedCouponCode,
  offers = OFFERS,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filterTabs = [
    { id: 'all', label: 'All Offers' },
    { id: 'under99', label: 'Under ₹99' },
    { id: 'meals', label: 'Meal Upgrades' },
    { id: 'family', label: 'Family Feasts' },
    { id: 'exclusive', label: 'App Exclusive' },
  ];

  const filteredOffers = selectedCategory === 'all'
    ? offers
    : offers.filter((o) => o.category === selectedCategory);

  return (
    <section id="offers" className="py-12 bg-[#F6F1E7] border-b border-[#E8DFD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#D62300] font-bold text-xs uppercase tracking-wider mb-1">
              <Tag className="w-4 h-4" />
              <span>Royal Savings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-[#241812]">
              DEALS FIT FOR A KING
            </h2>
            <p className="text-sm text-[#59483F] font-medium mt-1">
              Handpicked savings, combo bundles, and exclusive Indian treats.
            </p>
          </div>

          {/* Filter Pills (Interactive Buttons) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-[#241812] text-white shadow-sm'
                    : 'bg-white/80 text-[#59483F] hover:bg-white hover:text-[#241812] border border-[#DDD3C2]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => {
            const isApplied = appliedCouponCode === offer.code;

            return (
              <div
                key={offer.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#E3D9C8] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Visual Header with Real Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-900">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 bg-[#FFB703] text-[#241812] text-[11px] font-black px-2.5 py-1 rounded-lg shadow uppercase tracking-wide">
                    {offer.discountBadge}
                  </div>

                  {/* Code Tag */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[#241812] font-mono text-[11px] font-black px-2.5 py-1 rounded-lg shadow border border-stone-200">
                    USE: {offer.code}
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-display font-extrabold text-lg sm:text-xl text-white leading-tight">
                      {offer.title}
                    </h3>
                  </div>
                </div>

                {/* Offer Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-xs sm:text-sm text-[#59483F] leading-relaxed">
                      {offer.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-stone-500 font-medium">
                      <span>Min. Order: ₹{offer.minOrder}</span>
                      <span>·</span>
                      <span className="text-[#008738] font-bold">Valid Today</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2 border-t border-[#EFE8DC] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                        Offer Code
                      </span>
                      <span className="font-mono text-xs font-bold text-[#241812]">
                        {offer.code}
                      </span>
                    </div>

                    <button
                      onClick={() => onApplyCoupon(offer)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                        isApplied
                          ? 'bg-[#008738] text-white shadow-sm'
                          : 'bg-[#D62300] hover:bg-[#B81D00] text-white shadow hover:shadow-md'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>APPLIED</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>APPLY DEAL</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
