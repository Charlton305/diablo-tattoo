'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string | null;
  answer: string | null;
}

interface FAQData {
  heading?: string | null;
  description?: string | null;
  items?: FAQItem[] | null;
}

interface FAQSectionProps {
  data: FAQData;
}

export default function FAQSection({ data }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 md:py-32 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-8">
          {data?.heading ?? ''}
        </h1>
        <p className="text-xl text-center text-gray-400 mb-16">
          {data?.description ?? ''}
        </p>

        <div className="space-y-4">
          {data?.items?.map((item, index) => (
            <div
              key={item.question ?? index}
              className="border border-white/20 bg-zinc-900/50"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-zinc-900 transition-colors"
              >
                <span className="text-lg font-semibold pr-4">
                  {item.question ?? ''}
                </span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 py-5 text-gray-300 leading-relaxed">
                  {item.answer ?? ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
