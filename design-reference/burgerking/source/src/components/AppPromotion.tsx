import React from 'react';
import { Smartphone, QrCode, Sparkles, Download, ShieldCheck, Star } from 'lucide-react';

export const AppPromotion: React.FC = () => {
  return (
    <section className="py-14 bg-gradient-to-r from-[#241812] via-[#352217] to-[#241812] text-white border-t border-[#3D281E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xs flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFB703]/20 text-[#FFB703] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>India App Exclusive Deals</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-white leading-tight">
              GET THE BURGER KING APP. <br />
              <span className="text-[#ED7117]">GET FREE CRISPY FRIES TODAY.</span>
            </h2>

            <p className="text-sm text-stone-300 leading-relaxed">
              Order on the go, earn double Crown Points, unlock secret menu items, and track your rider in real time.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <div className="flex items-center gap-1 text-[#FFB703] font-bold text-sm">
                <span>★ 4.8</span>
                <span className="text-stone-400 font-normal">on Play Store & App Store</span>
              </div>
              <span className="text-stone-600 hidden sm:inline">·</span>
              <div className="flex items-center gap-1.5 text-stone-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#008738]" />
                <span>10M+ Downloads in India</span>
              </div>
            </div>
          </div>

          {/* Download & QR Action Box */}
          <div className="bg-white text-[#241812] p-5 rounded-3xl shadow-2xl flex items-center gap-5 border border-stone-200">
            {/* Simulated QR Code SVG */}
            <div className="w-24 h-24 bg-[#FAF7F2] p-2 rounded-2xl border border-stone-200 flex flex-col items-center justify-center shrink-0">
              <QrCode className="w-16 h-16 text-[#241812]" />
              <span className="text-[9px] font-black text-[#D62300] uppercase tracking-tighter">
                Scan & Download
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 block">
                Available on iOS & Android
              </span>
              <button
                onClick={() => alert('Redirecting to Google Play Store / Apple App Store...')}
                className="w-full px-4 py-2.5 bg-[#241812] hover:bg-[#3D2B20] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow"
              >
                <Download className="w-4 h-4" />
                <span>Install BK App</span>
              </button>
              <span className="text-[10px] text-stone-500 block text-center">
                Use code <strong className="text-[#D62300]">BKAPP</strong> for ₹100 Off
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
