'use client';

import React, { useState } from 'react';
import { CartItem, Product } from '@/lib/types';
import { FoodTypeBadge } from '@/components/storefront/FoodTypeBadge';
import { UPSELL_ITEMS } from '@/features/catalog/mock-fallback';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onAddUpsell: (product: Product) => void;
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  discountAmount: number;
  totalAmount: number;
  appliedCoupon: string;
  onApplyCouponCode: (code: string) => void;
  onRemoveCoupon: () => void;
  onProceedToCheckout: () => void;
  upsellItems?: Product[];
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onIncrement,
  onDecrement,
  onRemove,
  onAddUpsell,
  subtotal,
  deliveryFee,
  taxes,
  discountAmount,
  totalAmount,
  appliedCoupon,
  onApplyCouponCode,
  onRemoveCoupon,
  onProceedToCheckout,
  upsellItems = UPSELL_ITEMS,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponBusy, setCouponBusy] = useState(false);

  if (!isOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const normalized = couponInput.trim().toUpperCase();
    setCouponBusy(true);
    try {
      const response = await fetch('/api/v1/cart/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            customizations: item.customizations,
          })),
          couponCode: normalized,
          fulfillmentType: 'delivery',
        }),
      });
      const json = await response.json();
      if (!json.ok) {
        setCouponError(json.error?.message || 'Invalid promo code');
        return;
      }
      onApplyCouponCode(normalized);
      setCouponInput('');
    } catch {
      setCouponError('Could not apply promo code');
    } finally {
      setCouponBusy(false);
    }
  };

  const freeDeliveryThreshold = 299;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-[#E6DDD0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#ECE3D5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FFF0E8] text-[#D62300] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 id="cart-drawer-title" className="font-display font-black text-lg text-[#241812] leading-tight">
                YOUR ORDER
              </h2>
              <span className="text-xs text-[#59483F] font-semibold">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F3EFE7] text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            aria-label="Close Cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Meter */}
        <div className="bg-[#FFF8ED] px-4 py-2.5 border-b border-[#EFE3CF] text-xs">
          {amountNeededForFreeDelivery > 0 ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[#59483F] font-semibold">
                <span>Add ₹{amountNeededForFreeDelivery} more for FREE Delivery!</span>
                <span className="font-bold text-[#D62300]">₹{freeDeliveryThreshold} Goal</span>
              </div>
              <div className="w-full h-1.5 bg-[#E8DFC2] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ED7117] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[#008738] font-bold">
              <Check className="w-4 h-4" />
              <span>You have unlocked FREE Express Delivery!</span>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#F3ECE0] flex items-center justify-center text-3xl">
                🍔
              </div>
              <h3 className="font-display font-extrabold text-lg text-[#241812]">
                Your King Cart is hungry!
              </h3>
              <p className="text-xs text-stone-500 max-w-xs">
                Good food takes real flame grilling. Add a legendary Whopper or crispy sides to get started.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 bg-[#D62300] hover:bg-[#B81D00] text-white font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.cartItemId}
                className="bg-white p-3.5 rounded-2xl border border-[#EAE2D5] shadow-xs flex items-start gap-3"
              >
                {/* Item Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                  <img
                    src={item.image}
                    alt={item.productName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <FoodTypeBadge isVeg={item.isVeg} size="sm" />
                      <h4 className="font-extrabold text-sm text-[#241812] truncate">
                        {item.productName}
                      </h4>
                    </div>
                    <button
                      onClick={() => onRemove(item.cartItemId)}
                      className="text-stone-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Customization Details Pills */}
                  <div className="text-[11px] text-[#786458] mt-1 space-y-0.5">
                    {item.customizations.isMeal && (
                      <div className="text-[#ED7117] font-semibold">
                        🍟 Meal: {item.customizations.mealFries} + {item.customizations.mealDrink}
                      </div>
                    )}
                    {item.customizations.extraCheese && <div>+ Extra Cheese Slice</div>}
                    {item.customizations.extraPatty && <div>+ Double Patty Stack</div>}
                    {item.customizations.selectedSauce && <div>+ {item.customizations.selectedSauce}</div>}
                    {item.customizations.selectedSize && <div>Size: {item.customizations.selectedSize}</div>}
                    {item.customizations.removedToppings.length > 0 && (
                      <div className="text-stone-400 line-through">
                        No {item.customizations.removedToppings.join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Pricing and Stepper Row */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-extrabold text-sm text-[#241812] tabular-nums">
                      ₹{item.unitPrice * item.quantity}
                    </span>

                    <div className="flex items-center bg-[#F3ECE0] rounded-xl p-0.5 border border-[#E3D9C8]">
                      <button
                        onClick={() => onDecrement(item.cartItemId)}
                        className="w-6 h-6 rounded-lg bg-white text-[#241812] flex items-center justify-center font-bold text-xs shadow-xs hover:bg-stone-50 cursor-pointer"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3 stroke-[3]" />
                      </button>
                      <span className="w-7 text-center font-black text-xs tabular-nums text-[#241812]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onIncrement(item.cartItemId)}
                        className="w-6 h-6 rounded-lg bg-white text-[#241812] flex items-center justify-center font-bold text-xs shadow-xs hover:bg-stone-50 cursor-pointer"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Upselling Carousel: "Complete your meal" */}
          {cartItems.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#241812] tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#ED7117]" />
                <span>COMPLETE YOUR FEAST</span>
              </div>
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
                {upsellItems.map((upsell) => (
                  <div
                    key={upsell.id}
                    className="min-w-[150px] bg-white rounded-2xl p-2.5 border border-[#EAE2D5] flex flex-col justify-between shadow-xs"
                  >
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-1.5 bg-stone-100">
                      <img
                        src={upsell.image}
                        alt={upsell.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1 bg-white p-0.5 rounded shadow-xs">
                        <FoodTypeBadge isVeg={upsell.isVeg} size="sm" />
                      </div>
                    </div>
                    <div>
                      <h5 className="font-extrabold text-xs text-[#241812] truncate">
                        {upsell.name}
                      </h5>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-bold text-[#D62300] tabular-nums">
                          ₹{upsell.price}
                        </span>
                        <button
                          onClick={() => onAddUpsell(upsell)}
                          className="px-2 py-0.5 bg-[#FFF0E8] hover:bg-[#D62300] text-[#D62300] hover:text-white rounded-lg text-[10px] font-black border border-red-200 transition-colors cursor-pointer"
                        >
                          + ADD
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Promo Code Input */}
          {cartItems.length > 0 && (
            <div className="bg-white p-3.5 rounded-2xl border border-[#EAE2D5] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#241812]">
                <Tag className="w-3.5 h-3.5 text-[#D62300]" />
                <span>Have a Royal Coupon?</span>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-[#EAF7EE] border border-[#008738]/30 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#008738]" />
                    <div>
                      <span className="font-mono text-xs font-bold text-[#008738]">
                        {appliedCoupon}
                      </span>
                      <span className="text-[10px] text-stone-600 block">
                        Saved ₹{discountAmount} on this order!
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={onRemoveCoupon}
                    className="text-xs text-red-600 font-bold hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. KING50)"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      setCouponError('');
                    }}
                    className="flex-1 uppercase font-mono text-xs px-3 py-2 bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl focus:ring-1 focus:ring-[#D62300]"
                  />
                  <button
                    type="submit"
                    disabled={couponBusy}
                    className="px-3.5 py-2 bg-[#241812] hover:bg-[#3B291F] text-white font-bold text-xs rounded-xl cursor-pointer disabled:opacity-60"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && <p className="text-[10px] text-red-600 font-semibold">{couponError}</p>}
            </div>
          )}
        </div>

        {/* Checkout Bill & Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-white border-t border-[#ECE3D5] space-y-3">
            {/* Bill Details */}
            <div className="space-y-1.5 text-xs text-[#59483F]">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="font-semibold text-[#241812] tabular-nums">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                <span className="font-semibold tabular-nums">
                  {deliveryFee === 0 ? (
                    <span className="text-[#008738] font-bold">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Restaurant GST & Taxes (5%)</span>
                <span className="font-semibold text-[#241812] tabular-nums">₹{taxes}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#008738] font-bold">
                  <span>Coupon Discount</span>
                  <span className="tabular-nums">-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black font-display text-[#241812] pt-2 border-t border-[#EAE2D5]">
                <span>To Pay</span>
                <span className="tabular-nums text-[#D62300]">₹{totalAmount}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              data-testid="proceed-checkout"
              className="w-full py-3.5 px-5 bg-[#D62300] hover:bg-[#B81D00] text-white font-extrabold text-base rounded-2xl shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-between"
            >
              <span>PROCEED TO CHECKOUT</span>
              <span className="flex items-center gap-1 font-black tabular-nums border-l border-red-500 pl-3">
                ₹{totalAmount}
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
