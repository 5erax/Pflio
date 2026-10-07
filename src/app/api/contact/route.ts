import { NextResponse } from 'next/server';
import { validateContact } from '@/lib/contact-validation';

export async function POST(request: Request) {
  let originHost: string;
  try { originHost = new URL(request.headers.get('origin') || '').host; }
  catch { return NextResponse.json({ error: 'Please submit from this website.' }, { status: 403 }); }
  if (originHost !== request.headers.get('host')) return NextResponse.json({ error: 'Please submit from this website.' }, { status: 403 });
  if (Number(request.headers.get('content-length') || 0) > 20000) return NextResponse.json({ error: 'Message too large.' }, { status: 413 });
  let payload: unknown;
  try {
    const text = await request.text();
    if (text.length > 20000) return NextResponse.json({ error: 'Message too large.' }, { status: 413 });
    payload = JSON.parse(text);
  } catch { return NextResponse.json({ error: 'The message could not be read.' }, { status: 400 }); }
  if (!validateContact(payload)) return NextResponse.json({ error: 'Please enter a name, valid email, and a message of at least 10 characters.' }, { status: 400 });
  if (payload.website) return NextResponse.json({ error: 'The message could not be accepted.' }, { status: 400 });
  const endpoint = process.env.CONTACT_WEBHOOK_URL;
  if (!endpoint) return NextResponse.json({ error: 'Message delivery is not connected yet. Your message has not been sent. Copy or save your draft below.' }, { status: 503 });
  try {
    const result = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(process.env.CONTACT_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}` } : {}) }, body: JSON.stringify({ name: payload.name.trim(), email: payload.email.trim(), message: payload.message.trim() }), signal: AbortSignal.timeout(8000) });
    if (!result.ok) throw new Error('Delivery failed');
    return NextResponse.json({ sent: true });
  } catch { return NextResponse.json({ error: 'Delivery failed. Your message has not been sent. Please keep your draft and try again later.' }, { status: 502 }); }
}
