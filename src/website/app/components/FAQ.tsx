"use client";
import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, Loader2 } from 'lucide-react';

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  position?: number;
}

export function FAQ() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/faqs?activeOnly=true')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch FAQs');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (data.success && Array.isArray(data.data)) {
            setFaqs(data.data);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('FAQ fetch error:', err);
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Structured Data (JSON-LD) generated dynamically only from visible active FAQs
  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  return (
    <section id="faqs" className="py-16 md:py-20 bg-gray-50/70 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] text-xs font-bold uppercase tracking-wider mb-3.5 border border-[var(--theme-primary)]/20 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Frequently Asked{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'var(--theme-gradient, linear-gradient(135deg, #d97706, #ea580c))' }}
            >
              Questions
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Find answers to common questions about booking, payments, customizations, and tour logistics.
          </p>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-[var(--theme-primary)] animate-spin mb-3" />
            <p className="text-sm text-gray-500 font-medium">Loading answers...</p>
          </div>
        ) : hasError ? (
          <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">
              Unable to load FAQs at the moment. Please contact our support team directly.
            </p>
          </div>
        ) : faqs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">
              No FAQs available at this time.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq._id || index}
                  className="bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
                  >
                    <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white pr-4 leading-snug group-hover:text-[var(--theme-primary)] transition-colors">
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'rotate-180 bg-[var(--theme-primary)] text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700/60">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
