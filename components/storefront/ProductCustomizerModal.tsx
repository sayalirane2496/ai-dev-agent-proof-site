'use client';

import React, { useState } from 'react';
import { Product, SelectedCustomizations } from '@/lib/types';
import { FoodTypeBadge } from '@/components/storefront/FoodTypeBadge';
import { X, Plus, Minus, Check, Flame, Sparkles } from 'lucide-react';

interface ProductCustomizerModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmAddToCart: (product: Product, customizations: SelectedCustomizations, quantity: number) => void;
}

export const ProductCustomizerModal: React.FC<ProductCustomizerModalProps> = ({
  product,
  isOpen,
  onClose,
  onConfirmAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [extraCheese, setExtraCheese] = useState(false);
  const [extraPatty, setExtraPatty] = useState(false);
  const [removedToppings, setRemovedToppings] = useState<string[]>([]);
  const [selectedSauce, setSelectedSauce] = useState<string>('');
  const [selectedSaucePrice, setSelectedSaucePrice] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('Regular');
  const [selectedSizeDelta, setSelectedSizeDelta] = useState<number>(0);
  const [isMeal, setIsMeal] = useState(false);
  const [mealFries, setMealFries] = useState('King Peri Peri Fries');
  const [mealDrink, setMealDrink] = useState('Coca-Cola (300ml)');

  if (!isOpen || !product) return null;

  // Pricing math
  const cheesePrice = extraCheese ? 25 : 0;
  const pattyPrice = extraPatty ? 90 : 0;
  const mealUpgradePrice = isMeal ? 99 : 0;
  const unitPrice =
    product.price +
    cheesePrice +
    pattyPrice +
    selectedSaucePrice +
    selectedSizeDelta +
    mealUpgradePrice;
  const totalPrice = unitPrice * quantity;

  const handleToggleRemoveTopping = (topping: string) => {
    if (removedToppings.includes(topping)) {
      setRemovedToppings(removedToppings.filter((t) => t !== topping));
    } else {
      setRemovedToppings([...removedToppings, topping]);
    }
  };

  const handleSelectSauce = (sauceName: string, price: number) => {
    if (selectedSauce === sauceName) {
      setSelectedSauce('');
      setSelectedSaucePrice(0);
    } else {
      setSelectedSauce(sauceName);
      setSelectedSaucePrice(price);
    }
  };

  const handleAdd = () => {
    const customizations: SelectedCustomizations = {
      extraCheese,
      extraPatty,
      removedToppings,
      selectedSauce: selectedSauce || undefined,
      selectedSize: selectedSize !== 'Regular' ? selectedSize : undefined,
      isMeal,
      mealFries: isMeal ? mealFries : '',
      mealDrink: isMeal ? mealDrink : '',
    };
    onConfirmAddToCart(product, customizations, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-[#FDFBF7] w-full md:max-w-2xl rounded-t-3xl md:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#E9E0D1]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative p-5 border-b border-[#EAE2D5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <FoodTypeBadge isVeg={product.isVeg} size="md" />
            <div>
              <h2 className="text-lg md:text-xl font-black font-display text-[#241812] leading-tight">
                {product.name}
              </h2>
              <span className="text-xs text-[#59483F] font-semibold">
                Base price: ₹{product.price}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F3EFE7] text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto custom-scrollbar flex-1 p-5 space-y-6">
          {/* Top Banner Image with Appetizing View */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-stone-900 shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-white flex items-end justify-between">
              <p className="text-xs text-stone-200 max-w-md line-clamp-2">
                {product.description}
              </p>
              {product.calories && (
                <span className="text-xs font-mono bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                  {product.calories}
                </span>
              )}
            </div>
          </div>

          {/* "MAKE IT A MEAL" Upgrade Card */}
          {product.customizationOptions.canMakeMeal && (
            <div
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                isMeal
                  ? 'bg-[#FFF9F3] border-[#ED7117] ring-2 ring-[#ED7117]/30'
                  : 'bg-white border-[#E3D8C6] hover:border-[#ED7117]/60'
              }`}
              onClick={() => setIsMeal(!isMeal)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF0E6] text-[#ED7117] flex items-center justify-center font-bold text-lg">
                    🍟
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#241812]">MAKE IT A MEAL</span>
                      <span className="bg-[#008738] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        SAVE ₹40
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Includes King Peri Peri Fries + Chilled Beverage
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-sm text-[#241812] block">+₹99</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ml-auto mt-1 ${
                      isMeal
                        ? 'bg-[#ED7117] border-[#ED7117] text-white'
                        : 'border-stone-300'
                    }`}
                  >
                    {isMeal && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>

              {/* Meal Sub-options when activated */}
              {isMeal && (
                <div
                  className="mt-4 pt-4 border-t border-[#F2E5D5] grid grid-cols-1 sm:grid-cols-2 gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div>
                    <label className="text-[11px] font-bold text-[#59483F] uppercase tracking-wider block mb-1">
                      Choose Fries
                    </label>
                    <select
                      value={mealFries}
                      onChange={(e) => setMealFries(e.target.value)}
                      className="w-full text-xs font-semibold p-2 bg-white border border-[#DDD3C2] rounded-xl focus:ring-1 focus:ring-[#D62300]"
                    >
                      <option>King Peri Peri Fries</option>
                      <option>Classic Salted Fries</option>
                      <option>Cheesy Liquid Fries (+₹20)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#59483F] uppercase tracking-wider block mb-1">
                      Choose Beverage
                    </label>
                    <select
                      value={mealDrink}
                      onChange={(e) => setMealDrink(e.target.value)}
                      className="w-full text-xs font-semibold p-2 bg-white border border-[#DDD3C2] rounded-xl focus:ring-1 focus:ring-[#D62300]"
                    >
                      <option>Coca-Cola (300ml)</option>
                      <option>Thums Up Charged (300ml)</option>
                      <option>Coca-Cola Zero Sugar</option>
                      <option>Sprite Chilled</option>
                      <option>BK Cold Coffee (+₹30)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Extra Patty & Cheese Options */}
          {(product.customizationOptions.cheeseAllowed || product.customizationOptions.extraPattyAllowed) && (
            <div className="bg-white p-4 rounded-2xl border border-[#E8DFD0] space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#786458]">
                Add Extra Indulgence
              </div>

              {product.customizationOptions.cheeseAllowed && (
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF6F0] hover:bg-[#F3ECE0] cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-base">🧀</span>
                    <div>
                      <span className="text-xs font-bold text-[#241812] block">
                        Extra Melted Cheddar Cheese Slice
                      </span>
                      <span className="text-[10px] text-stone-500">Creamy 100% dairy cheddar</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#241812]">+₹25</span>
                    <input
                      type="checkbox"
                      checked={extraCheese}
                      onChange={(e) => setExtraCheese(e.target.checked)}
                      className="w-4 h-4 rounded text-[#D62300] focus:ring-[#D62300]"
                    />
                  </div>
                </label>
              )}

              {product.customizationOptions.extraPattyAllowed && (
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF6F0] hover:bg-[#F3ECE0] cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-base">🔥</span>
                    <div>
                      <span className="text-xs font-bold text-[#241812] block">
                        Double the Patty (Extra Flame-Grilled Patty)
                      </span>
                      <span className="text-[10px] text-stone-500">Make it a double stack!</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#241812]">+₹90</span>
                    <input
                      type="checkbox"
                      checked={extraPatty}
                      onChange={(e) => setExtraPatty(e.target.checked)}
                      className="w-4 h-4 rounded text-[#D62300] focus:ring-[#D62300]"
                    />
                  </div>
                </label>
              )}
            </div>
          )}

          {/* Size Options (if available, e.g. Fries, Beverages) */}
          {product.customizationOptions.sizeOptions && (
            <div className="bg-white p-4 rounded-2xl border border-[#E8DFD0] space-y-2">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#786458]">
                Select Portion Size
              </div>
              <div className="grid grid-cols-3 gap-2">
                {product.customizationOptions.sizeOptions.map((sz) => {
                  const isSelected = selectedSize === sz.name;
                  return (
                    <button
                      key={sz.name}
                      onClick={() => {
                        setSelectedSize(sz.name);
                        setSelectedSizeDelta(sz.priceDelta);
                      }}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#241812] text-white border-[#241812]'
                          : 'bg-[#FAF6F0] text-[#59483F] border-[#DDD3C2] hover:bg-[#F3ECE0]'
                      }`}
                    >
                      <span className="block">{sz.name}</span>
                      <span className="text-[10px] opacity-80">
                        {sz.priceDelta > 0 ? `+₹${sz.priceDelta}` : 'Included'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Gourmet Sauces */}
          {product.customizationOptions.sauces && product.customizationOptions.sauces.length > 0 && (
            <div className="bg-white p-4 rounded-2xl border border-[#E8DFD0] space-y-2">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#786458]">
                Add King Gourmet Sauce Dip
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.customizationOptions.sauces.map((sauce) => {
                  const isSelected = selectedSauce === sauce.name;
                  return (
                    <button
                      key={sauce.name}
                      onClick={() => handleSelectSauce(sauce.name, sauce.price)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFF7E8] border-[#D62300] text-[#D62300] font-bold'
                          : 'bg-[#FAF6F0] border-[#DDD3C2] text-[#241812] font-semibold hover:bg-[#F3ECE0]'
                      }`}
                    >
                      <span>{sauce.name}</span>
                      <span>+₹{sauce.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Remove Toppings / Have It Your Way */}
          {product.customizationOptions.removableToppings &&
            product.customizationOptions.removableToppings.length > 0 && (
              <div className="bg-white p-4 rounded-2xl border border-[#E8DFD0] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#786458]">
                    HAVE IT YOUR WAY (Remove Toppings)
                  </div>
                  <span className="text-[10px] text-stone-400 font-semibold">Free</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.customizationOptions.removableToppings.map((top) => {
                    const isRemoved = removedToppings.includes(top);
                    return (
                      <button
                        key={top}
                        onClick={() => handleToggleRemoveTopping(top)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isRemoved
                            ? 'bg-red-100 text-red-700 line-through border border-red-300'
                            : 'bg-[#F2ECE0] text-[#59483F] hover:bg-[#E8DFC2]'
                        }`}
                      >
                        {isRemoved ? `No ${top}` : top}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
        </div>

        {/* Dynamic Price Calculation & Action Footer */}
        <div className="p-4 bg-white border-t border-[#EAE2D5] flex items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-[#F3ECE0] rounded-2xl p-1 border border-[#DDD3C2]">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-xl bg-white text-[#241812] flex items-center justify-center hover:bg-stone-100 font-bold shadow-xs cursor-pointer active:scale-95"
            >
              <Minus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
            <span className="w-8 text-center font-black text-sm text-[#241812] tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl bg-white text-[#241812] flex items-center justify-center hover:bg-stone-100 font-bold shadow-xs cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAdd}
            className="flex-1 py-3.5 px-5 bg-[#D62300] hover:bg-[#B81D00] text-white font-extrabold text-sm md:text-base rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-98 cursor-pointer flex items-center justify-between"
          >
            <span>ADD TO ORDER</span>
            <span className="font-black tabular-nums border-l border-red-500 pl-3">
              ₹{totalPrice}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
