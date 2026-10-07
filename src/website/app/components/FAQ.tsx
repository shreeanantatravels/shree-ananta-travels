"use client";
import { useState, useEffect, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

const defaultFaqs = [
  {
    question: 'How do I book a travel package?',
    answer: 'You can book a package by clicking on the package card, reviewing the details, and clicking the "Book Now" button. Alternatively, you can fill out the Plan Tour Form and our team will contact you.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit/debit cards, UPI, net banking, and EMI options. All payments are processed through secure payment gateways.',
  },
  {
    question: 'Can I customize my travel package?',
    answer: 'Yes! We offer complete customization. You can modify the itinerary, accommodation, and activities according to your preferences. Contact our team for personalized packages.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Cancellation charges vary by package and time of cancellation. Generally, cancellations made 30+ days before departure receive 80% refund, 15-30 days receive 50%, and less than 15 days are non-refundable.',
  },
  {
    question: 'Do you provide visa assistance?',
    answer: 'Yes, we provide complete visa assistance for international travel including documentation support, application submission, and tracking.',
  },
  {
    question: 'Are travel insurance included in packages?',
    answer: 'Basic travel insurance is included in all international packages. You can also opt for comprehensive insurance coverage at additional cost.',
  },
  {
    question: 'What happens if there is a flight delay?',
    answer: 'In case of flight delays, our 24/7 support team will assist you with rebooking and accommodation arrangements. Terms depend on airline policies.',
  },
  {
    question: 'Can I make group bookings?',
    answer: 'Absolutely! We offer special discounts for group bookings of 10+ travelers. Contact our sales team for customized group packages and pricing.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900 dark:text-white pr-8">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[var(--theme-primary)] flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
