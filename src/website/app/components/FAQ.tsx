"use client";
import { useState, useEffect, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

const defaultFaqs = [
  {
    question: 'How do I book a travel package?',
    answer: 'You can book a package by reviewing your preferred destination or package details, and submitting an inquiry. Our travel specialist will connect with you to personalize your itinerary and payment plan.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept major credit/debit cards, UPI, and bank transfers. All payments are processed through secure payment channels with official invoices provided.',
  },
  {
    question: 'Can I customize my travel package?',
    answer: 'Yes! We offer complete customization. You can modify the itinerary, duration, hotel category, and sightseeing activities according to your preferences.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Cancellation terms depend on airline, hotel, and local ground provider policies. Exact cancellation terms and schedules are specified in your customized itinerary quotation before payment.',
  },
  {
    question: 'Do you provide visa assistance?',
    answer: 'Yes, we provide visa guidance and documentation assistance for international holiday destinations and Kailash Mansarovar Yatra permits.',
  },
  {
    question: 'Is travel insurance included in packages?',
    answer: 'Travel insurance is available as an optional add-on for domestic and international itineraries. We recommend securing travel insurance prior to departure.',
  },
  {
    question: 'What happens if there is a flight delay or schedule change?',
    answer: 'In case of flight delays or schedule adjustments, our concierge team coordinates with local ground transportation to realign your pickup and itinerary seamlessly where feasible.',
  },
  {
    question: 'Can I make group or family bookings?',
    answer: 'Absolutely. We specialize in customized family trips, couple getaways, and spiritual group yatras with vehicle sizes tailored to your group requirement.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [apiContent, setApiContent] = useState<any[] | null>(null);

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          const faqItems = data.data.filter((s: any) => s.sectionType === 'faq' || s.sectionType === 'custom');
          if (faqItems.length > 0) setApiContent(faqItems);
        }
      })
      .catch(() => {});
  }, []);

  const faqs = useMemo(() => {
    if (apiContent && apiContent.length > 0) {
      return apiContent.map(s => ({
        question: s.title,
        answer: s.content,
      }));
    }
    return defaultFaqs;
  }, [apiContent]);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-gray-900 dark:text-white mb-4">
            Frequently Asked <span className="text-[var(--theme-primary)]">Questions</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find answers to common questions about our travel services
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <span className="text-lg font-semibold text-gray-900 dark:text-white pr-8">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[var(--theme-primary)] flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div className={`px-6 pb-6 ${isOpen ? 'block' : 'hidden'}`}>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
