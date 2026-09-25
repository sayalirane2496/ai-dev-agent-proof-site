'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase/browser';

type Tab = 'dashboard' | 'products' | 'coupons' | 'restaurants' | 'orders' | 'customers';

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [role, setRole] = useState<string | null | undefined>(undefined);
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/v1/me')
      .then((r) => r.json())
      .then((json) => setRole(json.data?.profile?.role ?? null));
  }, []);

  useEffect(() => {
    if (role !== 'admin') return;
    const path =
      tab === 'dashboard'
        ? '/api/v1/admin/dashboard'
        : tab === 'products'
          ? '/api/v1/admin/products'
          : tab === 'coupons'
            ? '/api/v1/admin/coupons'
            : tab === 'restaurants'
              ? '/api/v1/admin/restaurants'
              : tab === 'orders'
                ? '/api/v1/admin/orders'
                : '/api/v1/admin/customers';
    fetch(path)
      .then((r) => r.json())
      .then((json) => {
        if (!json.ok) setError(json.error?.message || 'Failed');
        else {
          setError('');
          setData(json.data);
        }
      });
  }, [tab, role]);

  if (role === null) {
    return (
      <main className="p-8">
        <h1>Admin</h1>
        <p data-testid="admin-forbidden">Not authorized.</p>
        <Link href="/login">Sign in</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-black text-2xl">Operations admin</h1>
          <button
            className="text-xs font-bold"
            onClick={async () => {
              await createBrowserSupabase().auth.signOut();
              router.push('/login');
            }}
          >
            Sign out
          </button>
        </div>
        <nav className="flex flex-wrap gap-2">
          {(['dashboard', 'products', 'coupons', 'restaurants', 'orders', 'customers'] as Tab[]).map((item) => (
            <button
              key={item}
              data-testid={`admin-tab-${item}`}
              onClick={() => setTab(item)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold ${tab === item ? 'bg-[#241812] text-white' : 'bg-white border border-[#E8DFD0]'}`}
            >
              {item}
            </button>
          ))}
        </nav>
        {error && <p className="text-sm text-[#D62300]">{error}</p>}
        <pre className="bg-white border border-[#E8DFD0] rounded-2xl p-4 text-xs overflow-auto" data-testid="admin-panel">
          {JSON.stringify(data, null, 2)}
        </pre>
        {tab === 'products' && Array.isArray(data) && (
          <button
            className="text-xs font-bold bg-[#D62300] text-white px-3 py-2 rounded-xl"
            onClick={async () => {
              const first = data[0] as { id: string; is_active?: boolean };
              await fetch('/api/v1/admin/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: first.id, isActive: first.is_active === false }),
              });
              setTab('products');
            }}
          >
            Toggle first product active
          </button>
        )}
      </div>
    </main>
  );
}
