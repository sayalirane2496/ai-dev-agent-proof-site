import React from 'react';
import { Home, UtensilsCrossed, Tag, ShoppingBag, User } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenRewards: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onNavigate,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenRewards,
}) => {
  return (
    <>
      {/* Floating Cart Pill on Mobile when Cart has items */}
      {cartCount > 0 && (
        <div className="md:hidden fixed bottom-18 left-4 right-4 z-40 animate-fade-in-up">
          <button
            onClick={onOpenCart}
            className="w-full bg-[#D62300] text-white p-3 rounded-2xl shadow-xl flex items-center justify-between font-bold text-sm cursor-pointer border border-red-700 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-2.5">
              <div className="bg-white text-[#D62300] font-black text-xs px-2 py-0.5 rounded-full">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </div>
              <span className="font-semibold text-xs tracking-wide">VIEW ORDER</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold tabular-nums">₹{cartTotal}</span>
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
          </button>
        </div>
      )}

      {/* Main Bottom Nav Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-t border-[#E8E1D3] px-2 py-1 flex items-center justify-around h-16 shadow-lg">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 cursor-pointer transition-colors ${
            activeTab === 'home' ? 'text-[#D62300]' : 'text-[#786458]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] font-semibold mt-0.5">Home</span>
        </button>

        <button
          onClick={() => onNavigate('menu')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 cursor-pointer transition-colors ${
            activeTab === 'menu' ? 'text-[#D62300]' : 'text-[#786458]'
          }`}
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span className="text-[11px] font-semibold mt-0.5">Menu</span>
        </button>

        <button
          onClick={() => onNavigate('offers')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 cursor-pointer transition-colors ${
            activeTab === 'offers' ? 'text-[#D62300]' : 'text-[#786458]'
          }`}
        >
          <Tag className="w-5 h-5" />
          <span className="text-[11px] font-semibold mt-0.5">Offers</span>
        </button>

        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 text-[#786458] cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#D62300] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold mt-0.5">Cart</span>
        </button>

        <button
          onClick={onOpenRewards}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 cursor-pointer transition-colors ${
            activeTab === 'rewards' ? 'text-[#ED7117]' : 'text-[#786458]'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[11px] font-semibold mt-0.5">Rewards</span>
        </button>
      </nav>
    </>
  );
};
