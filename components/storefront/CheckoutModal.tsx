'use client';

import React, { useState } from 'react';
import { CartItem, RestaurantLocation } from '@/lib/types';
import { FoodTypeBadge } from '@/components/storefront/FoodTypeBadge';
import { X, Check, MapPin, Bike, Store, CreditCard, Smartphone, Banknote, ShieldCheck, ArrowRight } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  discountAmount: number;
  totalAmount: number;
  selectedLocation: RestaurantLocation;
  orderMode?: 'delivery' | 'pickup';
  couponCode?: string;
  onOrderSuccess: (orderId: string, address: string, serverTotal?: number) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  subtotal,
  deliveryFee,
  taxes,
  discountAmount,
  totalAmount,
  selectedLocation,
  orderMode = 'delivery',
  couponCode = '',
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>(orderMode);
  const [customerName, setCustomerName] = useState('Vikram Malhotra');
  const [customerPhone, setCustomerPhone] = useState('9820143210');
  const [flatNo, setFlatNo] = useState('Flat 402, Sea Green Heights');
  const [landmark, setLandmark] = useState('Near Crystal Point Mall');
  const [deliveryNote, setDeliveryNote] = useState('Leave at door, contactless');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const fullAddress = `${flatNo}, ${landmark}, ${selectedLocation.locality}, ${selectedLocation.city}`;

  const handlePlaceOrder = async () => {
    setFormError('');
    if (customerName.trim().length < 2) {
      setFormError('Enter your name');
      return;
    }
    if (!/^\d{10}$/.test(customerPhone.replace(/\s/g, ''))) {
      setFormError('Enter a 10-digit phone number');
      return;
    }
    setIsProcessing(true);
    try {
      const response = await fetch('/api/v1/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            customizations: item.customizations,
          })),
          couponCode,
          fulfillmentType: deliveryMode,
          restaurantId: selectedLocation.id,
          contactName: customerName,
          contactPhone: customerPhone,
          deliveryAddress: deliveryMode === 'pickup' ? selectedLocation.address : fullAddress,
          deliveryNote,
          paymentMethod,
          upiApp: selectedUpiApp,
        }),
      });
      const json = await response.json();
      if (!json.ok) {
        setFormError(json.error?.message || 'Checkout failed');
        setIsProcessing(false);
        return;
      }
      const code = json.data.publicCode || json.data.orderId;
      onOrderSuccess(code, deliveryMode === 'pickup' ? selectedLocation.address : fullAddress, json.data.totalAmount);
      onClose();
    } catch {
      setFormError('Checkout failed. Try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div
        className="bg-[#FDFBF7] rounded-3xl w-full max-w-4xl max-h-[94vh] shadow-2xl border border-[#E8DFD0] overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Progress Stepper */}
        <div className="p-4 sm:p-5 border-b border-[#ECE3D5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-black font-display text-[#241812]">
              ROYAL CHECKOUT
            </h2>
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-stone-500">
              <span className={step === 1 ? 'text-[#D62300]' : 'text-[#008738]'}>
                1. Delivery & Contact
              </span>
              <span>→</span>
              <span className={step === 2 ? 'text-[#D62300]' : 'text-stone-400'}>
                2. Payment
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

        {/* Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto custom-scrollbar">
          {/* Main Checkout Form Left */}
          <div className="lg:col-span-7 p-5 sm:p-6 space-y-6 border-b lg:border-b-0 lg:border-r border-[#ECE3D5]">
            {step === 1 && (
              <div className="space-y-6">
                {/* Order Type Switch */}
                <div className="flex bg-[#F2ECE0] p-1 rounded-2xl">
                  <button
                    onClick={() => setDeliveryMode('delivery')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      deliveryMode === 'delivery'
                        ? 'bg-white text-[#D62300] shadow-sm'
                        : 'text-[#59483F]'
                    }`}
                  >
                    <Bike className="w-4 h-4" />
                    <span>Deliver to Me (30 min)</span>
                  </button>
                  <button
                    onClick={() => setDeliveryMode('pickup')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      deliveryMode === 'pickup'
                        ? 'bg-white text-[#D62300] shadow-sm'
                        : 'text-[#59483F]'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Pick up at Outlet</span>
                  </button>
                </div>

                {/* Delivery Address Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-[#786458]">
                      Delivery Location
                    </label>
                    <span className="text-xs text-[#008738] font-bold">
                      Outlet: {selectedLocation.locality}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-[11px] font-semibold text-[#59483F]">Flat / House / Floor / Building</span>
                      <input
                        type="text"
                        value={flatNo}
                        onChange={(e) => setFlatNo(e.target.value)}
                        placeholder="e.g. Flat 402, Building A"
                        className="w-full mt-1 p-2.5 bg-white border border-[#DDD3C2] rounded-xl text-xs font-semibold focus:ring-1 focus:ring-[#D62300]"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-[#59483F]">Landmark / Street</span>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Near Metro Station"
                        className="w-full mt-1 p-2.5 bg-white border border-[#DDD3C2] rounded-xl text-xs font-semibold focus:ring-1 focus:ring-[#D62300]"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#786458]">
                    Contact for Live SMS Updates
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] font-semibold text-[#59483F]">Your Name</span>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full mt-1 p-2.5 bg-white border border-[#DDD3C2] rounded-xl text-xs font-semibold focus:ring-1 focus:ring-[#D62300]"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-[#59483F]">10-Digit Mobile Number</span>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full pl-11 pr-3 py-2.5 bg-white border border-[#DDD3C2] rounded-xl text-xs font-semibold focus:ring-1 focus:ring-[#D62300]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Instructions */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#786458]">
                    Delivery Instructions
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      'Leave at door',
                      'Avoid ringing bell',
                      'Leave with guard',
                    ].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setDeliveryNote(opt)}
                        className={`p-2 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                          deliveryNote === opt
                            ? 'bg-[#241812] text-white border-[#241812]'
                            : 'bg-white border-[#DDD3C2] text-[#59483F] hover:bg-[#F6F0E6]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full py-3.5 bg-[#D62300] hover:bg-[#B81D00] text-white font-extrabold text-sm rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>CONTINUE TO PAYMENT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-[#D62300] hover:underline mb-2 cursor-pointer"
                  >
                    ← Back to Address & Contact
                  </button>
                  <h3 className="font-display font-extrabold text-lg text-[#241812]">
                    Select Payment Method
                  </h3>
                  <p className="text-xs text-[#59483F]">
                    All transactions are 100% encrypted & secure.
                  </p>
                </div>

                {/* Payment Options */}
                <div className="space-y-3">
                  {/* UPI Option */}
                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'bg-[#FFF8F2] border-[#D62300] ring-1 ring-[#D62300]'
                        : 'bg-white border-[#E5DAC8] hover:border-[#D62300]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF0E8] text-[#D62300] flex items-center justify-center">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-extrabold text-sm text-[#241812] block">
                            UPI Instant Pay (Google Pay / PhonePe / Paytm)
                          </span>
                          <span className="text-[11px] text-stone-500">
                            Fastest payment method with zero convenience fees
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'upi' ? 'bg-[#D62300] border-[#D62300] text-white' : 'border-stone-300'
                        }`}
                      >
                        {paymentMethod === 'upi' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    {paymentMethod === 'upi' && (
                      <div className="mt-3 pt-3 border-t border-[#F1E5D5] flex gap-2">
                        {[
                          { id: 'gpay', name: 'Google Pay' },
                          { id: 'phonepe', name: 'PhonePe' },
                          { id: 'paytm', name: 'Paytm UPI' },
                        ].map((app) => (
                          <button
                            key={app.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUpiApp(app.id as any);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                              selectedUpiApp === app.id
                                ? 'bg-[#241812] text-white border-[#241812]'
                                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                            }`}
                          >
                            {app.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Credit / Debit Cards */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-[#FFF8F2] border-[#D62300] ring-1 ring-[#D62300]'
                        : 'bg-white border-[#E5DAC8] hover:border-[#D62300]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F0F5FF] text-blue-600 flex items-center justify-center">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-extrabold text-sm text-[#241812] block">
                            Credit / Debit Cards
                          </span>
                          <span className="text-[11px] text-stone-500">
                            Visa, Mastercard, RuPay, Diners Club
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'card' ? 'bg-[#D62300] border-[#D62300] text-white' : 'border-stone-300'
                        }`}
                      >
                        {paymentMethod === 'card' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'bg-[#FFF8F2] border-[#D62300] ring-1 ring-[#D62300]'
                        : 'bg-white border-[#E5DAC8] hover:border-[#D62300]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#EAF7EE] text-[#008738] flex items-center justify-center">
                          <Banknote className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-extrabold text-sm text-[#241812] block">
                            Cash / UPI on Delivery
                          </span>
                          <span className="text-[11px] text-stone-500">
                            Pay in cash or scan rider’s QR upon arrival
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'cod' ? 'bg-[#D62300] border-[#D62300] text-white' : 'border-stone-300'
                        }`}
                      >
                        {paymentMethod === 'cod' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF5ED] rounded-xl flex items-center gap-2 text-xs text-[#59483F] font-semibold border border-[#EBE1D0]">
                  <ShieldCheck className="w-4 h-4 text-[#008738] shrink-0" />
                  <span>
                    {paymentMethod === 'cod'
                      ? 'Cash on delivery is a real unpaid order state. No online charge is taken.'
                      : 'Sandbox payment only. No bank, UPI, or card charge will be made.'}
                  </span>
                </div>
                {formError && (
                  <p className="text-xs font-bold text-[#D62300]" data-testid="checkout-error">
                    {formError}
                  </p>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full py-4 bg-[#D62300] hover:bg-[#B81D00] text-white font-extrabold text-base rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-75"
                  data-testid="place-order"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>
                        {paymentMethod === 'cod' ? 'Placing cash-on-delivery order...' : 'Recording sandbox payment...'}
                      </span>
                    </div>
                  ) : (
                    <>
                      <span>
                        {paymentMethod === 'cod' ? 'PLACE COD ORDER' : 'PAY (TEST MODE)'} — ₹{totalAmount}
                      </span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Right */}
          <div className="lg:col-span-5 p-5 sm:p-6 bg-[#FAF7F2] space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-display font-black text-sm uppercase tracking-wider text-[#241812] mb-3">
                Order Summary ({cartItems.length} items)
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                {cartItems.map((item) => (
                  <div key={item.cartItemId} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <FoodTypeBadge isVeg={item.isVeg} size="sm" />
                      <span className="font-bold text-[#241812] truncate">
                        {item.quantity}x {item.productName}
                      </span>
                    </div>
                    <span className="font-extrabold text-[#241812] tabular-nums shrink-0">
                      ₹{item.unitPrice * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-[#EAE2D5] pt-4 mt-4 space-y-1.5 text-xs text-[#59483F]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold tabular-nums">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold tabular-nums">
                    {deliveryFee === 0 ? <span className="text-[#008738] font-bold">FREE</span> : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST & Taxes (5%)</span>
                  <span className="font-semibold tabular-nums">₹{taxes}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#008738] font-bold">
                    <span>Royal Discount</span>
                    <span className="tabular-nums">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-black font-display text-[#241812] pt-2 border-t border-[#EAE2D5]">
                  <span>Total Amount</span>
                  <span className="text-[#D62300] tabular-nums">₹{totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Delivery address brief */}
            <div className="p-3 bg-white rounded-2xl border border-[#EAE2D5] text-xs space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block">
                Delivering from:
              </span>
              <span className="font-bold text-[#241812] block">
                {selectedLocation.name}
              </span>
              <span className="text-stone-500 block text-[11px]">
                Estimated delivery time: 25–35 minutes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
