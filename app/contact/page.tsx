'use client';

import { FormEvent, useState } from 'react';

export default function ContactPage() {
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get('name') ?? '').trim();
    if (!name) {
      form.querySelector<HTMLInputElement>('#name')?.focus();
      return;
    }

    setStatus('');
    setBusy(true);
    try {
      const response = await fetch('/api/contact', { method: 'POST', body: JSON.stringify(Object.fromEntries(formData)), headers: { 'Content-Type': 'application/json' } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Something went wrong.');
      setStatus('Thanks. Your assessment request has been received.');
      form.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to submit the form.');
    } finally {
      setBusy(false);
    }
  }

  return <>
    <section className="page-hero"><div className="wrap"><p className="eyebrow">Contact</p><h1>Tell us what needs to change.</h1><p className="lede">Share a few details and we will use them to frame the first conversation.</p></div></section>
    <section className="section"><div className="wrap">
      <form className="card" onSubmit={onSubmit} noValidate>
        <div className="form-grid">
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" required /></div>
          <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required /></div>
          <div className="field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" inputMode="tel" /></div>
          <div className="field"><label htmlFor="company">Company</label><input id="company" name="company" /></div>
          <div className="field full"><label htmlFor="message">What would you like to improve?</label><textarea id="message" name="message" required /></div>
          <div className="field full"><button className="button primary" disabled={busy}>{busy ? 'Sending…' : 'Request assessment'}</button></div>
        </div>
        <div className="status" aria-live="polite">{status}</div>
      </form>
    </div></section>
  </>;
}
