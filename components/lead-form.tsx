'use client';

import { FormEvent, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

type LeadFormProps = {
  title?: string;
  source?: string;
};

export function LeadForm({ title = 'Tell us what you need', source = 'website' }: LeadFormProps) {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') ?? '').trim(),
      phone: String(form.get('phone') ?? '').trim(),
      email: String(form.get('email') ?? '').trim() || undefined,
      message: String(form.get('message') ?? '').trim() || undefined,
      source,
    };

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Unable to send your enquiry.');
      setSent(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to send your enquiry.');
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="sticky-card form-success">
        <CheckCircle2 size={30} />
        <div className="eyebrow">Received</div>
        <h3 className="display" style={{ fontSize: 30 }}>Thank you.</h3>
        <p className="copy">Your request has been recorded. Our team will get in touch shortly.</p>
      </div>
    );
  }

  return (
    <form className="form sticky-card" onSubmit={handleSubmit}>
      <div className="eyebrow">Private enquiry</div>
      <h3 className="display" style={{ fontSize: 30, margin: '8px 0' }}>{title}</h3>
      <p className="form-intro">Share your details and a short note. We will use them only to respond to this enquiry.</p>

      <label>Name<input name="name" required autoComplete="name" placeholder="Your name" /></label>
      <label>Phone<input name="phone" required autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" /></label>
      <label>Email<input name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label>
      <label>How can we help?<textarea name="message" placeholder="Tell us a little about your requirement..." /></label>

      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="btn btn-dark" style={{ width: '100%' }} disabled={busy}>
        {busy ? <><Loader2 size={15} className="spin" /> Sending...</> : 'Send enquiry'}
      </button>
    </form>
  );
}
