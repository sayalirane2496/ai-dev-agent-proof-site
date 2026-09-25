'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase/browser';
import Link from 'next/link';

type Mode = 'signin' | 'signup';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('signin');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const goHomeAfterSession = async () => {
    const me = await fetch('/api/v1/me').then((r) => r.json());
    const role = me.data?.profile?.role;
    if (role === 'admin') router.push('/admin');
    else if (role === 'restaurant') router.push('/kitchen');
    else router.push('/');
    router.refresh();
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    const supabase = createBrowserSupabase();

    if (mode === 'signup') {
      if (displayName.trim().length < 2) {
        setError('Enter your name');
        setBusy(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setBusy(false);
        return;
      }
      const { data, error: signError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { display_name: displayName.trim() },
        },
      });
      if (signError) {
        setError(signError.message);
        setBusy(false);
        return;
      }
      if (data.session) {
        await goHomeAfterSession();
        return;
      }
      setNotice('Account created. Sign in with the same email and password.');
      setMode('signin');
      setBusy(false);
      return;
    }

    const { error: signError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (signError) {
      setError(signError.message);
      setBusy(false);
      return;
    }
    await goHomeAfterSession();
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white border border-[#E8DFD0] rounded-3xl p-6 space-y-4 shadow-sm"
      >
        <h1 className="font-display font-black text-2xl text-[#241812]">
          {mode === 'signin' ? 'Sign in' : 'Create account'}
        </h1>
        <p className="text-xs text-[#59483F]">
          Customer account for rewards, addresses, and order history. Guest checkout stays available on the menu.
        </p>
        <div className="flex bg-[#F2ECE0] p-1 rounded-2xl">
          <button
            type="button"
            data-testid="auth-mode-signin"
            onClick={() => {
              setMode('signin');
              setError('');
              setNotice('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold ${
              mode === 'signin' ? 'bg-white text-[#D62300] shadow-sm' : 'text-[#59483F]'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            data-testid="auth-mode-signup"
            onClick={() => {
              setMode('signup');
              setError('');
              setNotice('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold ${
              mode === 'signup' ? 'bg-white text-[#D62300] shadow-sm' : 'text-[#59483F]'
            }`}
          >
            Create account
          </button>
        </div>
        {mode === 'signup' && (
          <label className="block text-xs font-bold">
            Name
            <input
              className="mt-1 w-full border border-[#E8DFD0] rounded-xl px-3 py-2 text-sm"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              autoComplete="name"
              data-testid="signup-name"
            />
          </label>
        )}
        <label className="block text-xs font-bold">
          Email
          <input
            className="mt-1 w-full border border-[#E8DFD0] rounded-xl px-3 py-2 text-sm"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
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
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            data-testid="login-password"
          />
        </label>
        {notice && (
          <p className="text-xs text-[#008738] font-bold" data-testid="auth-notice">
            {notice}
          </p>
        )}
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
          {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
        <Link href="/" className="block text-center text-xs font-bold text-[#D62300]">
          Continue as guest
        </Link>
      </form>
    </main>
  );
}
