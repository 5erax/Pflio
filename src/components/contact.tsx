'use client';
import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Copy, DownloadSimple } from '@phosphor-icons/react';
import { Dialog } from './ui/dialog';
import { profile } from '@/data/portfolio';

export function Contact({ open, close, onOpen }: { open: boolean; close: () => void; onOpen: (open: boolean) => void }) {
  const [state, setState] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState(''); const [draft, setDraft] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = { name: String(data.get('name') ?? ''), email: String(data.get('email') ?? ''), message: String(data.get('message') ?? ''), website: String(data.get('website') ?? '') };
    setDraft(`To: ${profile.name}\nFrom: ${payload.name} <${payload.email}>\n\n${payload.message}`);
    setState('loading'); setMessage('');
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(12000) });
      const result: { error?: string } = await response.json();
      if (!response.ok) throw new Error(result.error || 'The message could not be sent. Please try again.');
      setState('success'); setMessage('Message sent. Thank you for starting a conversation.');
    } catch (error) { setState('error'); setMessage(error instanceof Error ? error.message : 'Connection interrupted. Your draft is still here.'); }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([draft], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'conversation-with-astraa.txt'; anchor.click(); URL.revokeObjectURL(url);
  }
  return <Dialog open={open} onClose={close} titleId="contact-title" onOpen={onOpen}>
    <div className="contact-form-wrap"><h2 id="contact-title">Start a<br />conversation.</h2>
      {state === 'success' ? <div className="form-success" role="status"><ArrowUpRight size={48} /><p>{message}</p><button className="text-link" onClick={close}>Back to the experience</button></div> : <form onSubmit={submit}>
        <div className="form-row"><label>Your name<input name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="How should I call you?" /></label><label>Your email<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label></div>
        <label>What are we building?<textarea name="message" required minLength={10} maxLength={5000} rows={4} placeholder="An idea, a collaboration, or just a hello..." /></label>
        <div className="honeypot" aria-hidden><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <button className="primary-button" disabled={state === 'loading'} type="submit">{state === 'loading' ? 'Sending...' : 'Send message'} <ArrowUpRight size={20} aria-hidden /></button>
        {message && <div className="form-feedback" role="alert"><p>{message}</p>{state === 'error' && <div className="draft-actions"><button type="button" className="text-link" onClick={async () => { try { await navigator.clipboard.writeText(draft); setMessage('Draft copied. Your message has not been sent.'); } catch { setMessage('Copy unavailable. Use Save draft to keep your message.'); } }}><Copy size={17} aria-hidden /> Copy draft</button><button type="button" className="text-link" onClick={download}><DownloadSimple size={17} aria-hidden /> Save draft</button></div>}</div>}
        <p className="form-note">You can also <a className="text-link" href={`mailto:${profile.email}`}>email me directly ↗</a>. Your message is only marked sent after delivery is confirmed.</p>
      </form>}
    </div>
  </Dialog>;
}
