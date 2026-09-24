import React from 'react';
import { BurgerKingLogo } from './BurgerKingLogo';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenRewards: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenRewards }) => {
  return (
    <footer className="bg-[#1C130E] text-stone-300 pt-12 pb-24 md:pb-12 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Top Row: Brand & Pillars */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-stone-800">
          <div>
            <BurgerKingLogo size="md" />
            <p className="text-stone-400 mt-2 max-w-sm text-xs leading-relaxed">
              Restaurant Brands Asia Limited (Burger King India). Flame-grilled burgers crafted with fresh Indian produce, 100% vegetarian separate kitchens, and zero artificial trans fats.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-300">
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#008738]" />
              <span>100% Veg Dedicated Lines</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#D62300]" />
              <span>100% Flame-Grilled Quality</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-[#FFB703]" />
              <span>FSSAI Lic. No. 10014022002598</span>
            </div>
          </div>
        </div>

        {/* Middle Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div>
            <h4 className="font-extrabold uppercase text-white tracking-wider text-xs mb-3">
              Explore Menu
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  The Whopper® Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Crispy Veg & Paneer Royale
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Chicken Burgers & Wings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  BK Café Shakes & Cold Coffee
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold uppercase text-white tracking-wider text-xs mb-3">
              Deals & Perks
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('offers')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  2 For ₹79 Snacker Deals
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('combo-builder')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Royal Meal Builder
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenRewards}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  King Club Crown Rewards
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('offers')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  App Exclusive Discounts
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold uppercase text-white tracking-wider text-xs mb-3">
              Locations & Outlets
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('restaurants')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Mumbai Outlets (Andheri, Bandra)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('restaurants')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Bengaluru (Koramangala, Indiranagar)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('restaurants')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Delhi NCR & Cyber Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('restaurants')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Pune Outlets (FC Road)
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold uppercase text-white tracking-wider text-xs mb-3">
              Customer Support
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>Toll Free: 1800-22-22-22</li>
              <li>care@burgerking.in</li>
              <li>Nutrition & Allergen Guide</li>
              <li>Privacy Policy · Terms of Use</li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Copyright */}
        <div className="pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-stone-500 text-[11px] gap-3">
          <p>© {new Date().getFullYear()} Burger King India Ltd. TM & © Burger King Corporation. Used under license. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Flame-grilled with care in India</span>
            <Heart className="w-3.5 h-3.5 text-[#D62300] fill-[#D62300]" />
          </div>
        </div>
      </div>
    </footer>
  );
};
