import React, { useState } from 'react';
import { BurgerKingLogo } from './BurgerKingLogo';
import { RestaurantLocation } from '../types';
import { MapPin, ShoppingBag, Search, User, Crown, ChevronDown } from 'lucide-react';

interface HeaderProps {
  selectedLocation: RestaurantLocation;
  onOpenLocationModal: () => void;
  onOpenCart: () => void;
  cartItemsCount: number;
  cartSubtotal: number;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenSearch: () => void;
  onOpenRewards: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedLocation,
  onOpenLocationModal,
  onOpenCart,
  cartItemsCount,
  cartSubtotal,
  activeSection,
  onNavigate,
  onOpenSearch,
  onOpenRewards,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-[#FDFBF7]/95 backdrop-blur-md shadow-sm border-b border-[#EBE4D8]'
          : 'bg-[#FDFBF7] border-b border-[#EBE4D8]/60'
      }`}
    >
      {/* Upper Micro-Banner for Delivery Assurance */}
      <div className="bg-[#241812] text-white py-1 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="text-[#FFB703] font-bold">🔥 100% Flame-Grilled Beef-Free Kitchens</span>
            <span className="hidden sm:inline text-stone-400">·</span>
            <span className="hidden sm:inline text-stone-300">Separate Veg Preparation Lines Guaranteed</span>
          </div>
          <div className="flex items-center gap-3 text-stone-300 font-medium">
            <span className="hidden md:inline">Express 30-Min Delivery</span>
            <span className="text-[#FFB703] font-semibold">Free Delivery &gt; ₹299</span>
          </div>
        </div>
      </div>

      {/* Main One-Row Three-Zone Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Lockup */}
        <div onClick={() => onNavigate('home')}>
          <BurgerKingLogo size="md" />
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-medium text-sm text-[#59483F]">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors hover:text-[#D62300] cursor-pointer ${
              activeSection === 'home' ? 'text-[#D62300] font-bold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('menu')}
            className={`transition-colors hover:text-[#D62300] cursor-pointer ${
              activeSection === 'menu' ? 'text-[#D62300] font-bold' : ''
            }`}
          >
            Menu
          </button>
          <button
            onClick={() => onNavigate('offers')}
            className={`transition-colors hover:text-[#D62300] cursor-pointer ${
              activeSection === 'offers' ? 'text-[#D62300] font-bold' : ''
            }`}
          >
            Offers & Deals
          </button>
          <button
            onClick={() => onNavigate('combo-builder')}
            className={`transition-colors hover:text-[#D62300] cursor-pointer ${
              activeSection === 'combo-builder' ? 'text-[#D62300] font-bold' : ''
            }`}
          >
            Meal Builder
          </button>
          <button
            onClick={() => onNavigate('restaurants')}
            className={`transition-colors hover:text-[#D62300] cursor-pointer ${
              activeSection === 'restaurants' ? 'text-[#D62300] font-bold' : ''
            }`}
          >
            Restaurants
          </button>
          <button
            onClick={onOpenRewards}
            className={`flex items-center gap-1.5 text-[#241812] hover:text-[#ED7117] transition-colors cursor-pointer font-semibold ${
              activeSection === 'rewards' ? 'text-[#ED7117]' : ''
            }`}
          >
            <Crown className="w-4 h-4 text-[#FFB703] fill-[#FFB703]" />
            <span>King Rewards</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Location Selector Pill */}
          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#F3ECE0] hover:bg-[#EBE2D3] text-[#241812] transition-colors text-xs sm:text-sm font-medium border border-[#E3D8C6] cursor-pointer max-w-[140px] sm:max-w-[200px]"
            title="Change Delivery Location"
          >
            <MapPin className="w-3.5 h-3.5 text-[#D62300] shrink-0" />
            <div className="truncate text-left leading-tight">
              <span className="block font-bold truncate text-[11px] sm:text-xs">
                {selectedLocation.locality}
              </span>
              <span className="text-[10px] text-[#59483F] font-semibold">
                {selectedLocation.etaMin}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-[#59483F] shrink-0 opacity-70" />
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2.5 rounded-full hover:bg-[#F3ECE0] text-[#241812] transition-colors cursor-pointer"
            aria-label="Search Burgers and Sides"
            title="Search Menu"
          >
            <Search className="w-5 h-5 text-[#59483F]" />
          </button>

          {/* Rewards Profile Trigger (Desktop) */}
          <button
            onClick={onOpenRewards}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-[#F3ECE0] text-[#241812] font-semibold text-xs border border-transparent hover:border-[#E3D8C6] transition-colors cursor-pointer"
          >
            <User className="w-4 h-4 text-[#59483F]" />
            <span>Account</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 bg-[#D62300] hover:bg-[#B81D00] text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FFB703] text-[#241812] font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {cartItemsCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
            {cartSubtotal > 0 && (
              <span className="font-extrabold tabular-nums border-l border-red-400 pl-2">
                ₹{cartSubtotal}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
