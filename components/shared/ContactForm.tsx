'use client';

import { useState, useRef } from 'react';

const WORKER_URL = 'https://diablo-worker.leejcharlton.workers.dev/contact';

const ARTISTS = [
  { label: 'No preference', value: '' },
  { label: 'Ray', value: 'Ray' },
  { label: 'Leo', value: 'Leo' },
  { label: 'Jin', value: 'Jin' },
  { label: 'Matt', value: 'Matt' },
];

interface Preview {
  url: string;
  name: string;
  file: File;
}

interface ContactFormProps {
  variant?: 'dark' | 'darker';
}

export default function ContactForm({ variant = 'darker' }: ContactFormProps) {
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputBgClass = variant === 'darker' ? 'bg-zinc-900' : 'bg-black';

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    const remaining = 3 - previews.length;
    const toAdd = selected.slice(0, remaining);
    const newPreviews = toAdd.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    }));
    setPreviews(prev => [...prev, ...newPreviews]);
    // Reset input so the same file can be re-selected after removal
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removePreview(index: number) {
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const form = e.currentTarget;
    const data = new FormData(form);

    // Attach image files under named keys
    previews.forEach((preview, i) => {
      data.append(`image${i}`, preview.file);
    });

    try {
      const res = await fetch(WORKER_URL, { method: 'POST', body: data });
      const json = await res.json();
      if (!res.ok || json.error) {
        setErrorMessage(json.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
      } else {
        setStatus('success');
      }
    } catch {
      setErrorMessage('Could not reach the server. Please check your connection and try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-lg font-semibold uppercase tracking-wider">Enquiry Sent</p>
        <p className="text-gray-400 text-sm">
          Thanks for getting in touch. We&apos;ll be in contact with you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot — hidden from real users, bots fill it */}
      <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

      <div>
        <label htmlFor="name" className="block text-sm mb-2">
          Name <span className="text-accent">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className={`w-full ${inputBgClass} border border-white/20 px-4 py-3 focus:outline-none focus:border-accent transition-colors`}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm mb-2">
          Email <span className="text-accent">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className={`w-full ${inputBgClass} border border-white/20 px-4 py-3 focus:outline-none focus:border-accent transition-colors`}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm mb-2">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className={`w-full ${inputBgClass} border border-white/20 px-4 py-3 focus:outline-none focus:border-accent transition-colors`}
        />
      </div>

      <div>
        <label htmlFor="artist" className="block text-sm mb-2">
          Artist
        </label>
        <select
          id="artist"
          name="artist"
          className={`w-full ${inputBgClass} border border-white/20 px-4 py-3 focus:outline-none focus:border-accent transition-colors appearance-none`}
        >
          {ARTISTS.map(a => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm mb-2">
          Message <span className="text-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          className={`w-full ${inputBgClass} border border-white/20 px-4 py-3 focus:outline-none focus:border-accent transition-colors resize-none`}
        />
      </div>

      <div>
        <label className="block text-sm mb-2">
          Reference Images <span className="text-gray-500 font-normal">(up to 3)</span>
        </label>

        {/* Thumbnail previews */}
        {previews.length > 0 && (
          <div className="flex gap-3 mb-3 flex-wrap">
            {previews.map((p, i) => (
              <div key={p.url} className="relative w-20 h-20 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt={p.name}
                  className="w-full h-full object-cover border border-white/20"
                />
                <button
                  type="button"
                  onClick={() => removePreview(i)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-white text-xs flex items-center justify-center leading-none hover:opacity-80"
                  aria-label={`Remove ${p.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload area — only show if fewer than 3 selected */}
        {previews.length < 3 && (
          <div className="relative border-2 border-dashed border-white/20 hover:border-accent transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              id="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="py-10 text-center">
              <svg
                className="w-10 h-10 mx-auto text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-sm text-gray-400">
                {previews.length === 0 ? 'Add up to 3 images' : `Add ${3 - previews.length} more`}
              </p>
            </div>
          </div>
        )}
      </div>

      {status === 'error' && (
        <p className="text-accent text-sm">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full px-8 py-3 bg-accent hover:opacity-90 transition-opacity uppercase tracking-wider font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Sending…' : 'Send'}
      </button>
    </form>
  );
}
