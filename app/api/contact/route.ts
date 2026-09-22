import { NextResponse } from 'next/server';

function isEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : null;
  const company = typeof body.company === 'string' ? body.company.trim() : null;
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!name) return NextResponse.json({ error: 'Name is required.' }, { status: 422 });
  if (!isEmail(email)) return NextResponse.json({ error: 'A valid email is required.' }, { status: 422 });
  if (!message) return NextResponse.json({ error: 'Message is required.' }, { status: 422 });

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Database is not configured. Add Supabase server environment variables.' }, { status: 503 });
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ name, email, phone, company, message }),
    cache: 'no-store',
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Unable to save your request. Please try again.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
