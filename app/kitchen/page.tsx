'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type KitchenOrder = {
  public_code: string;
  status: string;
  fulfillment_type: string;
  total_inr: number;
  restaurant_id: string;
  contact_name: string;
};

export default function KitchenPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<{ role?: string; restaurant_id?: string } | null>(null);

  const load = () => {
    fetch('/api/v1/kitchen/orders')
      .then((r) => r.json())
      .then((json) => {
        if (!json.ok) {
          setError(json.error?.message || 'Failed');
          return;
        }
        setProfile(json.data.profile);
        setOrders(json.data.orders);
      });
  };

  useEffect(() => {
    load();
  }, []);

  if (error) {
    return (
      <main className="p-8">
        <h1>Kitchen</h1>
        <p data-testid="kitchen-forbidden">{error}</p>
        <Link href="/login">Sign in</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="font-display font-black text-2xl">Outlet orders</h1>
        <p className="text-sm text-[#59483F]" data-testid="kitchen-profile">
          {profile?.role} {profile?.restaurant_id}
        </p>
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.public_code} className="bg-white border border-[#E8DFD0] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-sm font-bold">#{order.public_code}</p>
                <p className="text-xs">
                  {order.status} · {order.fulfillment_type} · ₹{order.total_inr}
                </p>
              </div>
              <button
                className="text-xs font-bold bg-[#241812] text-white px-3 py-2 rounded-xl"
                onClick={async () => {
                  const next =
                    order.status === 'Confirmed'
                      ? 'Grilling'
                      : order.status === 'Grilling'
                        ? 'Out for Delivery'
                        : 'Delivered';
                  await fetch(`/api/v1/orders/${order.public_code}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: next }),
                  });
                  load();
                }}
              >
                Advance status
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
