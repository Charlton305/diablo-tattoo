'use client';

import { useState } from 'react';

interface ContactFormProps {
  variant?: 'dark' | 'darker';
}

export default function ContactForm({ variant = 'dark' }: ContactFormProps) {
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const inputBgClass = variant === 'darker' ? 'bg-zinc-900' : 'bg-black';

  return (
    <form
      action="https://formspree.io/f/YOUR_FORM_ID"
      method="POST"
      encType="multipart/form-data"
      className="space-y-6"
    >
      <div>
        <label htmlFor="name" className="block text-sm mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className={`w-full ${inputBgClass} border border-white/20 px-4 py-3 focus:outline-none focus:border-red-600 transition-colors`}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm mb-2">
          Email <span className="text-red-600">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className={`w-full ${inputBgClass} border border-white/20 px-4 py-3 focus:outline-none focus:border-red-600 transition-colors`}
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
          className={`w-full ${inputBgClass} border border-white/20 px-4 py-3 focus:outline-none focus:border-red-600 transition-colors`}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm mb-2">
          Message <span className="text-red-600">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          className={`w-full ${inputBgClass} border border-white/20 px-4 py-3 focus:outline-none focus:border-red-600 transition-colors resize-none`}
        />
      </div>

      <div>
        <label className="block text-sm mb-2">File Upload</label>
        <div className="relative border-2 border-dashed border-white/20 hover:border-red-600 transition-colors">
          <input
            type="file"
            id="file"
            name="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="py-12 text-center">
            <div className="mb-2">
              <svg
                className="w-12 h-12 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-400">
              {fileName || 'Add a File'}
            </p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-8 py-3 bg-red-600 hover:bg-red-700 transition-colors uppercase tracking-wider font-semibold"
      >
        Send
      </button>
    </form>
  );
}
