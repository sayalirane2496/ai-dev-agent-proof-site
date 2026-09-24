'use client';

import React, { useState } from 'react';
import { PRODUCTS } from '@/features/catalog/mock-fallback';
import { Product } from '@/lib/types';
import { FoodTypeBadge } from '@/components/storefront/FoodTypeBadge';
import { Search, X, Plus, Sparkles } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onOpenCustomizer: (product: Product) => void;
  products?: Product[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  onOpenCustomizer,
  products = PRODUCTS,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : products.slice(0, 6); // default to bestsellers

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-[#FDFBF7] rounded-3xl w-full max-w-xl shadow-2xl border border-[#E8DFD0] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="p-4 border-b border-[#ECE3D5] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#D62300]" />
          <input
            type="text"
            placeholder="Search Whopper, Fries, Shake, Wings, Coffee..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 text-sm sm:text-base font-medium text-[#241812] placeholder-stone-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search Chips */}
        <div className="px-4 py-2.5 bg-[#FAF7F2] border-b border-[#ECE3D5] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider whitespace-nowrap">
            Popular:
          </span>
          {['Veg Whopper', 'Chicken Whopper', 'Peri Peri Fries', 'Cold Coffee', 'Paneer Royale'].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-[#DDD3C2] hover:bg-[#F2ECE0] text-[#59483F] whitespace-nowrap transition-colors cursor-pointer"
              >
                {tag}
              </button>
            )
          )}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto custom-scrollbar p-4 space-y-2.5 flex-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#786458] px-1">
            {query.trim() ? `Search Results (${results.length})` : 'Popular Flame-Grilled Choices'}
          </div>

          {results.length === 0 ? (
            <div className="text-center py-10 text-stone-500">
              <p className="font-semibold text-sm">No items found for "{query}"</p>
              <p className="text-xs text-stone-400 mt-1">Try searching for Whopper, Veg, or Fries</p>
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                className="bg-white p-3 rounded-2xl border border-[#EAE2D5] flex items-center justify-between gap-3 hover:border-[#D62300]/50 transition-colors shadow-xs"
              >
                <div
                  className="flex items-center gap-3 min-w-0 cursor-pointer"
                  onClick={() => {
                    onOpenCustomizer(product);
                    onClose();
                  }}
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <FoodTypeBadge isVeg={product.isVeg} size="sm" />
                      <h4 className="font-extrabold text-xs sm:text-sm text-[#241812] truncate">
                        {product.name}
                      </h4>
                    </div>
                    <span className="font-extrabold text-xs text-[#D62300] tabular-nums mt-0.5 block">
                      ₹{product.price}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onOpenCustomizer(product);
                      onClose();
                    }}
                    className="text-xs font-bold text-stone-500 hover:text-[#D62300] px-2 py-1 cursor-pointer"
                  >
                    Customise
                  </button>
                  <button
                    onClick={() => {
                      onAddToCart(product);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-[#D62300] hover:bg-[#B81D00] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    + ADD
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
