'use client';

import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import guideContent from '@/content/guide.json';

export default function GuideSection() {
  const { heading, description, beforeSession, aftercare } = guideContent;

  return (
    <section className="py-20 md:py-32 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            {heading}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="space-y-16">
          <div className="border border-white/20 bg-zinc-900/50 p-8 sm:p-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              {beforeSession.heading}
            </h2>
            <p className="text-gray-300 mb-10 leading-relaxed text-lg">
              {beforeSession.intro}
            </p>
            <div className="space-y-6">
              {beforeSession.items.map((item) => (
                <div key={item.id} className="py-1">
                  <h3 className="text-xl font-semibold mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/20 bg-zinc-900/50 p-8 sm:p-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              {aftercare.heading}
            </h2>
            <div className="bg-red-900/20 border-l-4 border-red-600 p-6 mb-10">
              <div className="flex">
                <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="ml-4 text-gray-300 leading-relaxed">
                  {aftercare.intro}
                </p>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-2xl font-semibold mb-6">
                Aftercare Steps
              </h3>
              <div className="space-y-4">
                {aftercare.instructions.map((instruction) => (
                  <p key={instruction.id} className="text-gray-300 leading-relaxed border-l-2 border-white/20 pl-4 py-1">
                    {instruction.content}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="border border-red-900/50 bg-red-950/30 p-6">
                <div className="flex items-center mb-6">
                  <XCircle className="h-6 w-6 text-red-500 mr-2" />
                  <h3 className="text-xl font-semibold">
                    DO NOT
                  </h3>
                </div>
                <ul className="space-y-3">
                  {aftercare.donts.map((dont, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-3 flex-shrink-0 text-xl leading-none">✕</span>
                      <span className="text-gray-300 leading-relaxed">
                        {dont.replace('DO NOT ', '')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-green-900/50 bg-green-950/30 p-6">
                <div className="flex items-center mb-6">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                  <h3 className="text-xl font-semibold">
                    DO
                  </h3>
                </div>
                <ul className="space-y-3">
                  {aftercare.dos.map((doItem, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-3 flex-shrink-0 text-xl leading-none">✓</span>
                      <span className="text-gray-300 leading-relaxed">
                        {doItem.replace('DO ', '')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-zinc-800/50 border-l-4 border-white/30 p-6">
              <p className="text-gray-300 leading-relaxed">
                {aftercare.footer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
