'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase/browser';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const supabase = createBrowserSupabase();
    const { error: signError } = await supabase.auth.signInWithPassword({ email, password });
    if (signError) {
      setError(signError.message);
      setBusy(false);
      return;
    }
    const me = await fetch('/api/v1/me').then((r) => r.json());
    const role = me.data?.profile?.role;
    if (role === 'admin') router.push('/admin');
    else if (role === 'restaurant') router.push('/kitchen');
    else router.push('/');
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white border border-[#E8DFD0] rounded-3xl p-6 space-y-4 shadow-sm"
      >
        <h1 className="font-display font-black text-2xl text-[#241812]">Sign in</h1>
        <p className="text-xs text-[#59483F]">
          Optional account for rewards, addresses, and order history. Guest checkout stays available on the menu.
        </p>
        <label className="block text-xs font-bold">
          Email
          <input
            className="mt-1 w-full border border-[#E8DFD0] rounded-xl px-3 py-2 text-sm"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            data-testid="login-email"
          />
        </label>
        <label className="block text-xs font-bold">
          Password
          <input
            className="mt-1 w-full border border-[#E8DFD0] rounded-xl px-3 py-2 text-sm"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            data-testid="login-password"
          />
        </label>
        {error && (
          <p className="text-xs text-[#D62300] font-bold" data-testid="login-error">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          data-testid="login-submit"
          className="w-full py-3 bg-[#D62300] text-white font-extrabold rounded-2xl"
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <Link href="/" className="block text-center text-xs font-bold text-[#D62300]">
          Continue as guest
        </Link>
      </form>
    </main>
  );
}
