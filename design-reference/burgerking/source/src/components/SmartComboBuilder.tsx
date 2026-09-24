import React, { useState } from 'react';
import { PRODUCTS, WHOPPER_IMAGE, CRISPY_VEG_IMAGE, PERI_PERI_FRIES_IMAGE, BK_CAFE_SHAKE_IMAGE } from '../data/mockData';
import { Product, SelectedCustomizations } from '../types';
import { FoodTypeBadge } from './FoodTypeBadge';
import { Sparkles, Check, Flame, ArrowRight } from 'lucide-react';

interface SmartComboBuilderProps {
  onAddComboToCart: (
    burger: Product,
    friesName: string,
    drinkName: string,
    comboPrice: number
  ) => void;
}

export const SmartComboBuilder: React.FC<SmartComboBuilderProps> = ({ onAddComboToCart }) => {
  // Selectable Burgers
  const comboBurgers = [
    PRODUCTS[0], // Veg Whopper (₹189)
    PRODUCTS[1], // Chicken Whopper (₹219)
    PRODUCTS[3], // Crispy Veg (₹79)
    PRODUCTS[5], // Paneer Royale (₹199)
  ];

  // Selectable Fries
  const comboFries = [
    { name: 'King Peri Peri Fries', priceDelta: 40, image: PERI_PERI_FRIES_IMAGE, isHot: true },
    { name: 'Classic Salted Fries', priceDelta: 30, image: PERI_PERI_FRIES_IMAGE, isHot: false },
    { name: 'Cheesy Melt Fries', priceDelta: 55, image: PERI_PERI_FRIES_IMAGE, isHot: false },
  ];

  // Selectable Drinks
  const comboDrinks = [
    { name: 'Thums Up Charged (300ml)', priceDelta: 30, image: BK_CAFE_SHAKE_IMAGE, tag: 'Favorite' },
    { name: 'Coca-Cola Zero Sugar', priceDelta: 30, image: BK_CAFE_SHAKE_IMAGE, tag: '0 Sugar' },
    { name: 'BK Thick Cold Coffee', priceDelta: 65, image: BK_CAFE_SHAKE_IMAGE, tag: 'Signature' },
    { name: 'Chocolate Hazelnut Shake', priceDelta: 75, image: BK_CAFE_SHAKE_IMAGE, tag: 'Indulgent' },
  ];

  const [selectedBurger, setSelectedBurger] = useState<Product>(comboBurgers[1]); // Chicken Whopper
  const [selectedFries, setSelectedFries] = useState(comboFries[0]);
  const [selectedDrink, setSelectedDrink] = useState(comboDrinks[0]);

  // Savings logic: buying separately would cost burger.price + 119 + 60 = burger + 179
  // Combo price: burger.price + fries.priceDelta + drink.priceDelta
  const comboPrice = selectedBurger.price + selectedFries.priceDelta + selectedDrink.priceDelta;
  const separatePrice = selectedBurger.price + 119 + 60;
  const savings = Math.max(25, separatePrice - comboPrice);

  const handleAddCombo = () => {
    onAddComboToCart(
      selectedBurger,
      selectedFries.name,
      selectedDrink.name,
      comboPrice
    );
  };

  return (
    <section id="combo-builder" className="py-14 bg-gradient-to-b from-[#FDFBF7] to-[#F7F1E7] border-b border-[#E8DFC2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0E8] text-[#D62300] font-black text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Meal Studio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-[#241812]">
            BUILD YOUR ROYAL MEAL
          </h2>
          <p className="text-sm text-[#59483F] font-medium">
            Customize your 3-piece combo in 3 easy clicks. Pick your burger, fries, and drink with guaranteed combo savings!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Builder Controls Left (Steps 1, 2, 3) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Pick Burger */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8DFD0] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#241812] text-white flex items-center justify-center font-black text-xs">
                    1
                  </span>
                  <h3 className="font-display font-extrabold text-lg text-[#241812]">
                    Choose Your Burger
                  </h3>
                </div>
                <span className="text-xs text-stone-500 font-semibold">
                  Selected: <strong className="text-[#241812]">{selectedBurger.name}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {comboBurgers.map((b) => {
                  const isSelected = selectedBurger.id === b.id;
                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBurger(b)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#FFF7F0] border-[#D62300] shadow-sm'
                          : 'bg-[#FAF7F2] border-[#E5DAC8] hover:border-[#D62300]/40'
                      }`}
                    >
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2 bg-stone-100">
                        <img
                          src={b.image}
                          alt={b.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1.5 left-1.5 bg-white p-0.5 rounded shadow-xs">
                          <FoodTypeBadge isVeg={b.isVeg} size="sm" />
                        </div>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#D62300] text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-extrabold text-xs text-[#241812] line-clamp-1">
                          {b.name}
                        </h4>
                        <span className="text-xs font-bold text-[#D62300] tabular-nums mt-0.5 block">
                          ₹{b.price}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Pick Fries */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8DFD0] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#241812] text-white flex items-center justify-center font-black text-xs">
                    2
                  </span>
                  <h3 className="font-display font-extrabold text-lg text-[#241812]">
                    Choose Your Fries
                  </h3>
                </div>
                <span className="text-xs text-stone-500 font-semibold">
                  Selected: <strong className="text-[#241812]">{selectedFries.name}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {comboFries.map((f) => {
                  const isSelected = selectedFries.name === f.name;
                  return (
                    <div
                      key={f.name}
                      onClick={() => setSelectedFries(f)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'bg-[#FFF7F0] border-[#D62300] shadow-sm'
                          : 'bg-[#FAF7F2] border-[#E5DAC8] hover:border-[#D62300]/40'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                        <img
                          src={f.image}
                          alt={f.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-xs text-[#241812] truncate">
                            {f.name}
                          </h4>
                        </div>
                        <span className="text-[11px] font-bold text-[#D62300]">
                          +₹{f.priceDelta}
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#D62300] border-[#D62300] text-white'
                            : 'border-stone-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Pick Drink */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8DFD0] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#241812] text-white flex items-center justify-center font-black text-xs">
                    3
                  </span>
                  <h3 className="font-display font-extrabold text-lg text-[#241812]">
                    Choose Your Drink
                  </h3>
                </div>
                <span className="text-xs text-stone-500 font-semibold">
                  Selected: <strong className="text-[#241812]">{selectedDrink.name}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {comboDrinks.map((d) => {
                  const isSelected = selectedDrink.name === d.name;
                  return (
                    <div
                      key={d.name}
                      onClick={() => setSelectedDrink(d)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#FFF7F0] border-[#D62300] shadow-sm'
                          : 'bg-[#FAF7F2] border-[#E5DAC8] hover:border-[#D62300]/40'
                      }`}
                    >
                      <div>
                        <div className="text-[10px] font-black uppercase text-[#ED7117] mb-1">
                          {d.tag}
                        </div>
                        <h4 className="font-extrabold text-xs text-[#241812] line-clamp-1">
                          {d.name}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#ECE2D2]">
                        <span className="text-xs font-bold text-[#D62300]">+₹{d.priceDelta}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#D62300] border-[#D62300] text-white'
                              : 'border-stone-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Summary Card (Contiguous Purchase Module) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-[#241812] text-white rounded-3xl p-6 shadow-xl border border-stone-800 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase font-bold tracking-widest text-[#FFB703]">
                    Combo Summary
                  </span>
                  <span className="bg-[#008738] text-white font-black text-[10px] px-2.5 py-0.5 rounded-full">
                    SAVE ₹{savings}
                  </span>
                </div>
                <h3 className="text-2xl font-black font-display text-white">
                  {selectedBurger.name} Royal Meal
                </h3>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-3 text-xs border-y border-stone-800 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FoodTypeBadge isVeg={selectedBurger.isVeg} size="sm" />
                    <span className="font-semibold text-stone-200">{selectedBurger.name}</span>
                  </div>
                  <span className="font-bold text-stone-400 tabular-nums">₹{selectedBurger.price}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-300 font-semibold pl-5">{selectedFries.name}</span>
                  <span className="font-bold text-stone-400 tabular-nums">+₹{selectedFries.priceDelta}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-300 font-semibold pl-5">{selectedDrink.name}</span>
                  <span className="font-bold text-stone-400 tabular-nums">+₹{selectedDrink.priceDelta}</span>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>Standard Price:</span>
                  <span className="line-through tabular-nums">₹{separatePrice}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-stone-200">
                  <span>Combo Discount:</span>
                  <span className="text-[#008738]">-₹{savings}</span>
                </div>
                <div className="flex items-center justify-between text-xl font-black font-display text-white pt-2 border-t border-stone-800">
                  <span>Total Combo:</span>
                  <span className="text-[#FFB703] tabular-nums">₹{comboPrice}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleAddCombo}
                className="w-full py-4 px-5 bg-[#D62300] hover:bg-[#B81D00] text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>ADD COMBO TO CART</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
