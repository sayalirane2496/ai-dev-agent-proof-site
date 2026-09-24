import React, { useState, useMemo } from 'react';
import { CATEGORIES, PRODUCTS } from '../data/mockData';
import { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';
import { FoodTypeBadge } from './FoodTypeBadge';
import { Search, Flame, Star, Sparkles, Filter, Check } from 'lucide-react';

interface MenuSectionProps {
  onAddToCart: (product: Product) => void;
  onIncrement: (product: Product) => void;
  onDecrement: (product: Product) => void;
  onOpenCustomizer: (product: Product) => void;
  cartItemQuantities: Record<string, number>;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  onAddToCart,
  onIncrement,
  onDecrement,
  onOpenCustomizer,
  cartItemQuantities,
  searchQuery,
  onSearchChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [onlyBestsellers, setOnlyBestsellers] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Dietary filter
      if (dietaryFilter === 'veg' && !item.isVeg) return false;
      if (dietaryFilter === 'nonveg' && item.isVeg) return false;

      // Bestseller filter
      if (onlyBestsellers && item.badge !== 'Bestseller' && item.badge !== 'Flame-Grilled') {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [selectedCategory, dietaryFilter, onlyBestsellers, searchQuery]);

  return (
    <section id="menu" className="py-10 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-6">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#D62300] block mb-1">
            Flame-Grilled & Hand-Crafted
          </span>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl font-black font-display text-[#241812]">
              EXPLORE THE KING’S MENU
            </h2>

            {/* In-Menu Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search Whopper, Fries, Shakes..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#F6F0E6] border border-[#DDD3C2] rounded-xl text-sm text-[#241812] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D62300] focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Filter Bar (Veg / Non-Veg, Bestsellers) */}
        <div className="flex items-center justify-between gap-3 pb-4 mb-6 border-b border-[#ECE4D5] overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            {/* All toggle */}
            <button
              onClick={() => setDietaryFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                dietaryFilter === 'all'
                  ? 'bg-[#241812] text-white shadow-xs'
                  : 'bg-[#F2ECE0] text-[#59483F] hover:bg-[#E8DFC2]'
              }`}
            >
              All Items
            </button>

            {/* Veg Only Toggle */}
            <button
              onClick={() => setDietaryFilter(dietaryFilter === 'veg' ? 'all' : 'veg')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                dietaryFilter === 'veg'
                  ? 'bg-[#008738] text-white border-[#008738] shadow-xs'
                  : 'bg-white border-[#008738]/40 text-[#008738] hover:bg-[#EAF7EE]'
              }`}
            >
              <FoodTypeBadge isVeg={true} size="sm" />
              <span>Veg Only</span>
            </button>

            {/* Non-Veg Only Toggle */}
            <button
              onClick={() => setDietaryFilter(dietaryFilter === 'nonveg' ? 'all' : 'nonveg')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                dietaryFilter === 'nonveg'
                  ? 'bg-[#B91C1C] text-white border-[#B91C1C] shadow-xs'
                  : 'bg-white border-[#B91C1C]/40 text-[#B91C1C] hover:bg-[#FDF2F2]'
              }`}
            >
              <FoodTypeBadge isVeg={false} size="sm" />
              <span>Non-Veg Only</span>
            </button>

            {/* Bestseller Toggle */}
            <button
              onClick={() => setOnlyBestsellers(!onlyBestsellers)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                onlyBestsellers
                  ? 'bg-[#FFB703] text-[#241812] border-[#FFB703] shadow-xs'
                  : 'bg-[#F2ECE0] border-[#DDD3C2] text-[#59483F] hover:bg-[#E8DFC2]'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-[#FFB703] text-[#FFB703]" />
              <span>Bestsellers</span>
            </button>
          </div>

          <div className="text-xs text-[#59483F] font-semibold whitespace-nowrap">
            Showing <span className="font-extrabold text-[#241812]">{filteredProducts.length}</span> items
          </div>
        </div>

        {/* Layout: Sticky Category Navigation on Desktop + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sticky Category Navigation (Desktop) / Horizontal Slider (Mobile) */}
          <aside className="lg:col-span-3 lg:sticky lg:top-28">
            {/* Mobile / Tablet Horizontal Category Scroll */}
            <div className="lg:hidden flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#D62300] text-white shadow-md'
                      : 'bg-[#F4EFE6] text-[#59483F] hover:bg-[#EBE2D3]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Desktop Vertical Sticky Category List */}
            <div className="hidden lg:block bg-white rounded-3xl p-3 border border-[#EBE3D3] shadow-xs space-y-1">
              <div className="px-3 py-2 text-[11px] font-black uppercase tracking-wider text-[#786458]">
                Categories
              </div>
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#D62300] text-white shadow-sm'
                        : 'text-[#59483F] hover:bg-[#F8F4EC] hover:text-[#241812]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold tabular-nums ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#F2ECE0] text-[#786458]'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* BK Promise Box */}
            <div className="hidden lg:block mt-4 bg-gradient-to-br from-[#241812] to-[#3B291F] text-white p-4 rounded-3xl space-y-2">
              <div className="flex items-center gap-2 text-[#FFB703] font-black text-xs uppercase tracking-wider">
                <Flame className="w-4 h-4" />
                <span>The Flame Promise</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Since 1954, every Whopper is grilled over real flames at 400°C for that authentic charred taste.
              </p>
            </div>
          </aside>

          {/* Right Column: Products Grid */}
          <main className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EBE3D3]">
                <div className="w-16 h-16 bg-[#F6F0E6] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  🍔
                </div>
                <h3 className="font-display font-extrabold text-xl text-[#241812]">
                  No flame-grilled matches found
                </h3>
                <p className="text-sm text-stone-500 max-w-md mx-auto mt-1 mb-6">
                  We couldn’t find any items matching your selected filters or search query.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setDietaryFilter('all');
                    setOnlyBestsellers(false);
                    onSearchChange('');
                  }}
                  className="px-5 py-2.5 bg-[#D62300] text-white font-bold text-xs rounded-xl shadow cursor-pointer hover:bg-red-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantityInCart={cartItemQuantities[product.id] || 0}
                    onAddToCart={onAddToCart}
                    onIncrement={onIncrement}
                    onDecrement={onDecrement}
                    onOpenCustomizer={onOpenCustomizer}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
};
