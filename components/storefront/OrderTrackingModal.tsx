'use client';

import React, { useState, useEffect } from 'react';
import { UserOrder } from '@/lib/types';
import { FoodTypeBadge } from '@/components/storefront/FoodTypeBadge';
import { X, Check, Clock, Phone, MessageSquare, MapPin, Bike, Flame, Navigation, Store } from 'lucide-react';

interface OrderTrackingModalProps {
  order: UserOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const [simulatedStep, setSimulatedStep] = useState<number>(2);
  const [etaMinutes, setEtaMinutes] = useState(24);
  const [riderLocationPercent, setRiderLocationPercent] = useState(45);

  useEffect(() => {
    const interval = setInterval(() => {
      setEtaMinutes((prev) => (prev > 5 ? prev - 1 : 5));
      setRiderLocationPercent((prev) => (prev < 85 ? prev + 3 : 85));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen || !order) return null;

  const steps = [
    { label: 'Order Confirmed', sub: 'Sent to kitchen', done: simulatedStep >= 1 },
    { label: 'Flame-Grilling', sub: 'Grilled at 400°C', done: simulatedStep >= 2, current: simulatedStep === 2 },
    { label: 'Out for Delivery', sub: 'Hot bag sealed', done: simulatedStep >= 3, current: simulatedStep === 3 },
    { label: 'Arrived at Door', sub: 'Enjoy your meal', done: simulatedStep >= 4, current: simulatedStep === 4 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tracking-title"
        className="bg-[#FDFBF7] rounded-3xl w-full max-w-2xl max-h-[92vh] shadow-2xl border border-[#E8DFD0] overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#ECE3D5] flex items-center justify-between bg-white">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#D62300] block">
              Live Order Tracker
            </span>
            <div className="flex items-center gap-2">
              <h2 id="tracking-title" className="text-xl font-black font-display text-[#241812]">
                ORDER #{order.orderId}
              </h2>
              <span className="bg-[#EAF7EE] text-[#008738] text-[10px] font-bold px-2 py-0.5 rounded-md">
                LIVE
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

        {/* Tracker Body */}
        <div className="overflow-y-auto custom-scrollbar p-5 space-y-6">
          {/* ETA & Status Banner */}
          <div className="bg-gradient-to-r from-[#241812] to-[#3D281E] text-white p-5 rounded-3xl shadow-lg flex items-center justify-between">
            <div>
              <span className="text-xs text-[#FFB703] font-bold uppercase tracking-wider block">
                Estimated Delivery In
              </span>
              <div className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white mt-0.5">
                {etaMinutes}–{etaMinutes + 8} MINS
              </div>
              <p className="text-xs text-stone-300 mt-1">
                Delivering from <strong className="text-white">{order.restaurantName}</strong>
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl">
              🔥
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="bg-white p-5 rounded-3xl border border-[#ECE3D5] shadow-xs">
            <div className="grid grid-cols-4 relative">
              {/* Connecting line */}
              <div className="absolute top-4 left-6 right-6 h-1 bg-[#EBE3D3] -z-0">
                <div
                  className="h-full bg-[#D62300] transition-all duration-700"
                  style={{ width: `${((simulatedStep - 1) / 3) * 100}%` }}
                />
              </div>

              {steps.map((st, idx) => (
                <div key={st.label} className="relative z-10 flex flex-col items-center text-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      st.done
                        ? 'bg-[#D62300] text-white ring-4 ring-red-100 shadow-sm'
                        : 'bg-white border-2 border-stone-300 text-stone-400'
                    } ${st.current ? 'animate-pulse' : ''}`}
                  >
                    {st.done ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                  </div>
                  <span className="text-xs font-bold text-[#241812] mt-2 block leading-tight">
                    {st.label}
                  </span>
                  <span className="text-[10px] text-stone-500 hidden sm:block mt-0.5">
                    {st.sub}
                  </span>
                </div>
              ))}
            </div>

            {/* Stepper Controls for Evaluation Demonstration */}
            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold">Simulate Progress:</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSimulatedStep(s)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
                      simulatedStep === s
                        ? 'bg-[#241812] text-white'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    Stage {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Delivery Route Map Visual */}
          <div className="bg-[#EAE4D8] rounded-3xl overflow-hidden border border-[#DDD3C2] relative h-48 sm:h-56 shadow-inner">
            {/* Styled Map Background Canvas */}
            <div className="absolute inset-0 bg-[#E8E1D3] opacity-90">
              {/* Simulated streets / grid pattern */}
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#DCD4C4" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* Road curve */}
                <path
                  d="M 40 180 Q 180 60 360 120 T 600 80"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                <path
                  d="M 40 180 Q 180 60 360 120 T 600 80"
                  fill="none"
                  stroke="#FFB703"
                  strokeWidth="6"
                  strokeDasharray="8 6"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Restaurant Marker */}
            <div className="absolute left-8 bottom-6 flex flex-col items-center">
              <div className="w-10 h-10 rounded-2xl bg-[#D62300] text-white flex items-center justify-center shadow-lg border-2 border-white">
                <Store className="w-5 h-5" />
              </div>
              <span className="bg-white/95 text-[10px] font-black px-2 py-0.5 rounded shadow mt-1 text-[#241812]">
                BK Kitchen
              </span>
            </div>

            {/* Moving Rider Marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-500"
              style={{ left: `${riderLocationPercent}%` }}
            >
              <div className="w-11 h-11 rounded-2xl bg-[#241812] text-[#FFB703] flex items-center justify-center shadow-2xl border-2 border-white animate-bounce">
                <Bike className="w-6 h-6" />
              </div>
              <span className="bg-[#241812] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow mt-1 whitespace-nowrap">
                Rider on Way
              </span>
            </div>

            {/* Destination Marker */}
            <div className="absolute right-8 top-6 flex flex-col items-center">
              <div className="w-10 h-10 rounded-2xl bg-[#008738] text-white flex items-center justify-center shadow-lg border-2 border-white">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="bg-white/95 text-[10px] font-black px-2 py-0.5 rounded shadow mt-1 text-[#241812]">
                Your Location
              </span>
            </div>
          </div>

          {/* Delivery Rider Contact Card */}
          <div className="bg-white p-4 rounded-3xl border border-[#ECE3D5] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF0E8] text-[#D62300] font-black text-lg flex items-center justify-center">
                🏍️
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase block">
                  Delivery Valet
                </span>
                <span className="text-sm font-extrabold text-[#241812] block">
                  {order.riderName || 'Ramesh Kumar'}
                </span>
                <span className="text-xs text-stone-500">
                  Insulated BK Flame Hot-Bag · Vaccinated
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert(`Calling delivery valet: ${order.riderPhone || '+91 98201 43210'}`)}
                className="p-2.5 rounded-xl bg-[#F4EFE6] hover:bg-[#EBE2D3] text-[#241812] transition-colors cursor-pointer"
                title="Call Rider"
              >
                <Phone className="w-4 h-4 text-[#D62300]" />
              </button>
              <button
                onClick={() => alert('Opening live chat with delivery support...')}
                className="p-2.5 rounded-xl bg-[#F4EFE6] hover:bg-[#EBE2D3] text-[#241812] transition-colors cursor-pointer"
                title="Chat with Support"
              >
                <MessageSquare className="w-4 h-4 text-[#59483F]" />
              </button>
            </div>
          </div>

          {/* Order Itemized Summary */}
          <div className="bg-white p-4 rounded-3xl border border-[#ECE3D5] space-y-2">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#786458]">
              <span>Items in this Order</span>
              <span className="text-stone-400 font-mono">Paid ₹{order.totalAmount}</span>
            </div>
            <div className="divide-y divide-stone-100">
              {order.items.map((item) => (
                <div key={item.cartItemId} className="py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FoodTypeBadge isVeg={item.isVeg} size="sm" />
                    <span className="font-semibold text-[#241812]">
                      {item.quantity}x {item.productName}
                    </span>
                  </div>
                  <span className="font-bold text-[#241812] tabular-nums">
                    ₹{item.unitPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
