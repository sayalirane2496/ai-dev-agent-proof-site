'use client';

import React, { useState } from 'react';
import { UserOrder } from '@/lib/types';
import { FoodTypeBadge } from '@/components/storefront/FoodTypeBadge';
import { Crown, Sparkles, Gift, Clock, MapPin, Repeat, Check, ArrowRight, ShieldCheck, X } from 'lucide-react';

interface RewardsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  orders: UserOrder[];
  onReorder: (order: UserOrder) => void;
  onTrackOrder: (order: UserOrder) => void;
}

type SavedAddress = {
  id?: string;
  label: string;
  address: string;
  isDefault: boolean;
  flat_building?: string;
  landmark?: string;
  locality?: string;
  city?: string;
};

export const RewardsDashboard: React.FC<RewardsDashboardProps> = ({
  isOpen,
  onClose,
  orders,
  onReorder,
  onTrackOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'rewards' | 'orders' | 'addresses'>('rewards');
  const [points, setPoints] = useState(1250);
  const [redeemedReward, setRedeemedReward] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [addresses, setAddresses] = useState<SavedAddress[]>([
    {
      label: 'Home',
      address: 'Flat 402, Sea Green Heights, Andheri West, Mumbai 400053',
      isDefault: true,
    },
    {
      label: 'Office',
      address: 'Level 5, Platina Tower, Bandra Kurla Complex (BKC), Mumbai 400051',
      isDefault: false,
    },
  ]);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newLabel, setNewLabel] = useState('Other');
  const [newAddress, setNewAddress] = useState('');

  const rewardsCatalog = [
    { id: 'rew-1', name: 'Free King Peri Peri Fries', pointsCost: 350, icon: '🍟' },
    { id: 'rew-2', name: 'Free BK Hazelnut Thick Shake', pointsCost: 600, icon: '🥤' },
    { id: 'rew-3', name: 'Free Flame-Grilled Veg / Chicken Whopper', pointsCost: 1400, icon: '🍔' },
    { id: 'rew-4', name: '₹200 Off on Next Family Feast', pointsCost: 1800, icon: '👑' },
  ];

  React.useEffect(() => {
    if (!isOpen) return;
    fetch('/api/v1/rewards')
      .then((r) => r.json())
      .then((json) => {
        if (json.ok && json.data.signedIn) {
          setSignedIn(true);
          setPoints(json.data.points);
        }
      })
      .catch(() => undefined);
    fetch('/api/v1/addresses')
      .then((r) => r.json())
      .then((json) => {
        if (json.ok && Array.isArray(json.data) && json.data.length) {
          setAddresses(
            json.data.map((row: Record<string, unknown>) => ({
              id: String(row.id),
              label: String(row.label),
              address: `${row.flat_building}, ${row.landmark}, ${row.locality}, ${row.city}`,
              isDefault: Boolean(row.is_default),
              flat_building: String(row.flat_building),
              landmark: String(row.landmark),
              locality: String(row.locality),
              city: String(row.city),
            })),
          );
        }
      })
      .catch(() => undefined);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRedeem = async (id: string, name: string, cost: number) => {
    if (points < cost) {
      alert(`You need ${cost - points} more Crown Points to unlock this reward! Keep ordering Whoppers.`);
      return;
    }
    if (signedIn) {
      const response = await fetch('/api/v1/rewards/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catalogId: id }),
      });
      const json = await response.json();
      if (!json.ok) {
        alert(json.error?.message || 'Sign in to redeem');
        return;
      }
      setPoints(json.data.points);
      setRedeemedReward(`${name} · coupon ${json.data.couponCode}`);
      setTimeout(() => setRedeemedReward(null), 4000);
      return;
    }
    setPoints((prev) => prev - cost);
    setRedeemedReward(name);
    setTimeout(() => setRedeemedReward(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div
        className="bg-[#FDFBF7] rounded-3xl w-full max-w-3xl max-h-[92vh] shadow-2xl border border-[#E8DFD0] overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#ECE3D5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FFF7E0] text-[#ED7117] flex items-center justify-center">
              <Crown className="w-4 h-4 fill-[#ED7117]" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-[#241812] leading-tight">
                KING CLUB REWARDS
              </h2>
              <span className="text-xs text-[#59483F] font-semibold">
                Hi, Vikram · Crown Gold Member
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

        {/* Loyalty Points Hero Card */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#241812] via-[#38261C] to-[#241812] text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#FFB703] block">
                Total Crown Balance
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-black font-display text-white tabular-nums">
                  {points.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-[#FFB703]">PTS</span>
              </div>
              <p className="text-xs text-stone-300 mt-1">
                Earn 10 Crown Points for every ₹100 spent on flame-grilled meals.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs border border-white/10 text-xs space-y-1 sm:max-w-xs">
              <div className="flex items-center justify-between text-stone-300 font-medium">
                <span>Next Milestone: Free Whopper</span>
                <span className="font-bold text-[#FFB703]">1,400 PTS</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FFB703] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (points / 1400) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-stone-400 block pt-0.5">
                {Math.max(0, 1400 - points)} points away from your next free feast!
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#ECE3D5] bg-white px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('rewards')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'rewards'
                ? 'border-[#D62300] text-[#D62300]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Redeem Vouchers
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#D62300] text-[#D62300]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Order History ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'addresses'
                ? 'border-[#D62300] text-[#D62300]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Saved Addresses
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto custom-scrollbar p-5 sm:p-6 flex-1 space-y-4">
          {redeemedReward && (
            <div className="p-3 bg-[#EAF7EE] border border-[#008738]/30 rounded-2xl flex items-center gap-2 text-xs font-bold text-[#008738]">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Congratulations! Redeemed voucher for: {redeemedReward}. Check your SMS!</span>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rewardsCatalog.map((rew) => {
                const canAfford = points >= rew.pointsCost;
                return (
                  <div
                    key={rew.id}
                    className="bg-white p-4 rounded-2xl border border-[#E8DFD0] flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#F6F0E6] flex items-center justify-center text-2xl">
                        {rew.icon}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-[#241812]">{rew.name}</h4>
                        <span className="text-[11px] font-black text-[#ED7117] block mt-0.5">
                          {rew.pointsCost} Points
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRedeem(rew.id, rew.name, rew.pointsCost)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-[#D62300] hover:bg-[#B81D00] text-white shadow-xs'
                          : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Redeem' : 'Need Pts'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-10 text-stone-500">
                  <p className="text-sm font-semibold">No past orders found</p>
                  <p className="text-xs text-stone-400 mt-1">Place your first order to view it here!</p>
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.orderId}
                    className="bg-white p-4 rounded-2xl border border-[#E8DFD0] shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#241812]">
                            #{ord.orderId}
                          </span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#EAF7EE] text-[#008738]">
                            {ord.status}
                          </span>
                        </div>
                        <span className="text-xs text-stone-500 block mt-0.5">{ord.date}</span>
                      </div>

                      <span className="text-sm font-black font-display text-[#241812] tabular-nums">
                        ₹{ord.totalAmount}
                      </span>
                    </div>

                    <div className="text-xs text-[#59483F] border-t border-stone-100 pt-2 space-y-1">
                      {ord.items.map((i) => (
                        <div key={i.cartItemId} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FoodTypeBadge isVeg={i.isVeg} size="sm" />
                            <span>{i.quantity}x {i.productName}</span>
                          </div>
                          <span className="tabular-nums">₹{i.unitPrice * i.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-stone-100 pt-2 flex items-center justify-between">
                      <button
                        onClick={() => onTrackOrder(ord)}
                        className="text-xs text-[#D62300] font-bold hover:underline cursor-pointer"
                      >
                        Track Status / Live Map →
                      </button>

                      <button
                        onClick={() => {
                          onReorder(ord);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#241812] hover:bg-[#3B291F] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Repeat className="w-3.5 h-3.5" />
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.label}
                  className="bg-white p-4 rounded-2xl border border-[#E8DFD0] flex items-start justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#F6F0E6] flex items-center justify-center text-[#D62300]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-[#241812]">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold text-[#008738] bg-[#EAF7EE] px-1.5 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      {editing === addr.label ? (
                        <div className="flex gap-2 mt-1">
                          <input
                            className="text-xs border border-[#E8DFD0] rounded-lg px-2 py-1 w-56"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            aria-label={`Edit ${addr.label} address`}
                          />
                          <button
                            className="text-xs font-bold text-[#008738]"
                            onClick={async () => {
                              const parts = editValue.split(',').map((p) => p.trim());
                              if (addr.id) {
                                await fetch('/api/v1/addresses', {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    id: addr.id,
                                    label: addr.label,
                                    flatBuilding: parts[0] || editValue,
                                    landmark: parts[1] || '',
                                    locality: parts[2] || '',
                                    city: parts[3] || '',
                                  }),
                                });
                              }
                              setAddresses((prev) =>
                                prev.map((a) => (a.label === addr.label ? { ...a, address: editValue } : a)),
                              );
                              setEditing(null);
                            }}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-stone-500 mt-0.5">{addr.address}</p>
                      )}
                    </div>
                  </div>
                  <button
                    className="text-xs text-[#D62300] font-bold hover:underline cursor-pointer"
                    onClick={() => {
                      setEditing(addr.label);
                      setEditValue(addr.address);
                    }}
                  >
                    Edit
                  </button>
                </div>
              ))}
              <form
                className="bg-[#FAF7F2] p-4 rounded-2xl border border-dashed border-[#E8DFD0] space-y-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newAddress.trim()) return;
                  const parts = newAddress.split(',').map((p) => p.trim());
                  await fetch('/api/v1/addresses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      label: newLabel,
                      flatBuilding: parts[0] || newAddress,
                      landmark: parts[1] || '',
                      locality: parts[2] || '',
                      city: parts[3] || '',
                    }),
                  });
                  setAddresses((prev) => [
                    ...prev,
                    { label: newLabel, address: newAddress, isDefault: false },
                  ]);
                  setNewAddress('');
                }}
              >
                <p className="text-xs font-bold">Add address</p>
                <input
                  className="w-full text-xs border border-[#E8DFD0] rounded-lg px-2 py-1"
                  placeholder="Label"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  aria-label="New address label"
                />
                <input
                  className="w-full text-xs border border-[#E8DFD0] rounded-lg px-2 py-1"
                  placeholder="Flat, landmark, locality, city"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  aria-label="New address"
                />
                <button type="submit" className="text-xs font-bold text-white bg-[#D62300] px-3 py-1.5 rounded-lg">
                  Save address
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
