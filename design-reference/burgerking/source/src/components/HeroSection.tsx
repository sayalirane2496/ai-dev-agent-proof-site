import React, { useState } from 'react';
import { HERO_IMAGE } from '../data/mockData';
import { Flame, ArrowRight, ShieldCheck, Sparkles, Clock, MapPin } from 'lucide-react';
import { RestaurantLocation } from '../types';

interface HeroSectionProps {
  onOrderNow: () => void;
  onExploreMenu: () => void;
  selectedLocation: RestaurantLocation;
  onOpenLocation: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOrderNow,
  onExploreMenu,
  selectedLocation,
  onOpenLocation,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeFlavorTag, setActiveFlavorTag] = useState<'flame' | 'cheese' | 'sesame'>('flame');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden bg-gradient-to-b from-[#F7F2E8] via-[#FDFBF7] to-[#FDFBF7] pt-8 md:pt-14 pb-12 border-b border-[#EBE3D3]"
    >
      {/* Background Decorative Ambient Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[850px] h-[450px] bg-gradient-to-tr from-[#FFB703]/20 via-[#ED7117]/15 to-[#D62300]/10 rounded-full blur-3xl pointer-events-none -z-0 flame-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Bold Appetizing Copy & Ordering Fast Track */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Delivery Quick Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE2D3] border border-[#DDD3C2] text-xs font-semibold text-[#241812]">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#008738] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#008738]"></span>
              </span>
              <span className="font-bold text-[#D62300]">Delivering Hot</span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-600 truncate max-w-[170px] sm:max-w-none">
                {selectedLocation.locality} ({selectedLocation.etaMin})
              </span>
              <button
                onClick={onOpenLocation}
                className="text-[#D62300] underline font-bold cursor-pointer hover:text-red-700"
              >
                Change
              </button>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black font-display tracking-tight text-[#241812] leading-[1.02]">
                YOUR CRAVING. <br />
                <span className="text-[#D62300] drop-shadow-sm">YOUR KING.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-[#59483F] font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Big burgers. Bold Indian spices. 100% flame-grilled patties and fresh toasted buns, delivered straight to your door.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
              <button
                onClick={onOrderNow}
                className="w-full sm:w-auto px-8 py-4 bg-[#D62300] hover:bg-[#B81D00] text-white font-extrabold text-base md:text-lg rounded-2xl shadow-lg hover:shadow-xl shadow-red-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2.5 group"
              >
                <Flame className="w-5 h-5 fill-white" />
                <span>ORDER NOW</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreMenu}
                className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-[#F3ECE0] text-[#241812] font-bold text-base rounded-2xl border-2 border-[#DDD3C2] transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <span>EXPLORE MENU</span>
              </button>
            </div>

            {/* Indian Trust & Quality Proof Points */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-[#E8DFC2] max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-left">
                <div className="w-8 h-8 rounded-full bg-[#FFF0E8] flex items-center justify-center text-[#D62300] shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#241812] block leading-tight">Flame Grilled</span>
                  <span className="text-[10px] text-stone-500 font-medium">Real smoke flavour</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-left">
                <div className="w-8 h-8 rounded-full bg-[#EBF8EE] flex items-center justify-center text-[#008738] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#241812] block leading-tight">Separate Veg</span>
                  <span className="text-[10px] text-stone-500 font-medium">Dedicated kitchen</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-left">
                <div className="w-8 h-8 rounded-full bg-[#FFF7E0] flex items-center justify-center text-[#ED7117] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#241812] block leading-tight">30-Min Fast</span>
                  <span className="text-[10px] text-stone-500 font-medium">Insulated delivery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase with Interactive Micro-Tilt */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Interactive Showcase Frame */}
            <div
              className="relative w-full max-w-[500px] lg:max-w-none aspect-[16/10] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-900 transition-transform duration-200 ease-out select-none"
              style={{
                transform: `perspective(1000px) rotateX(${-mousePos.y * 0.4}deg) rotateY(${mousePos.x * 0.4}deg)`,
              }}
            >
              <img
                src={HERO_IMAGE}
                alt="Burger King Flame-Grilled Double Whopper"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />

              {/* Scrim Overlay for Contrast & Typography */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Floating Live Badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-lg border border-white flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D62300] text-white flex items-center justify-center font-black text-base">
                  👑
                </div>
                <div className="text-left leading-tight pr-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#D62300] block">
                    Flame-Grilled Royalty
                  </span>
                  <span className="text-xs font-black text-[#241812]">
                    The Double Whopper®
                  </span>
                </div>
              </div>

              {/* Price & Quick Add Button inside Hero */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <div>
                  <span className="text-xs font-medium text-stone-300 block">Flame-Grilled Chicken / Veg</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black font-display text-white">₹219</span>
                    <span className="text-xs text-stone-400 line-through">₹249</span>
                  </div>
                </div>

                <button
                  onClick={onOrderNow}
                  className="px-4 py-2 bg-[#FFB703] hover:bg-[#FFA500] text-[#241812] font-black text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>CUSTOMIZE</span>
                </button>
              </div>
            </div>

            {/* Floating Tag Chips */}
            <div className="hidden sm:flex absolute -bottom-5 right-6 bg-[#241812] text-white px-4 py-2 rounded-2xl shadow-xl border border-stone-700 items-center gap-2 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#FFB703]" />
              <span>Real Sesame Seed Bun · 100% Cheddar Melt</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
