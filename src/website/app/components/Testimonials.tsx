"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, MessageSquare, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const gradientPairs = [
  { from: 'from-amber-500', to: 'to-orange-400' },
  { from: 'from-blue-500', to: 'to-cyan-400' },
  { from: 'from-emerald-500', to: 'to-teal-400' },
  { from: 'from-purple-500', to: 'to-pink-400' },
  { from: 'from-rose-500', to: 'to-red-400' },
  { from: 'from-indigo-500', to: 'to-blue-400' },
];

export function Testimonials() {
  const { layoutVariant } = useTheme();
  const [apiTestimonials, setApiTestimonials] = useState<any[] | null>(null);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data?.length > 0) {
          setApiTestimonials(data.data);
        } else {
          setApiTestimonials([]);
        }
      })
      .catch(() => {
        setApiTestimonials([]);
      });
  }, []);

  const testimonials = useMemo(() => {
    if (apiTestimonials && apiTestimonials.length > 0) {
      return apiTestimonials.map((t, i) => {
        const gradient = gradientPairs[i % gradientPairs.length];
        const initials = t.customerName ? t.customerName.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'U';
        return {
          name: t.customerName,
          destination: t.destination || '',
          rating: t.rating || 5,
          review: t.review,
          date: new Date(t.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          initials,
          gradientFrom: gradient.from,
          gradientTo: gradient.to,
        };
      });
    }
    return [];
  }, [apiTestimonials]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const visibleCount = typeof window !== 'undefined' ? (window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3) : 3;
  const maxIndex = Math.max(0, testimonials.length - visibleCount);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;
    const interval = setInterval(goNext, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goNext, testimonials.length]);

  if (!apiTestimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section id="reviews" className="py-20 bg-gray-50/50 dark:bg-gray-900/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Traveller Reviews</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              Real Experiences <br/>
              <span className="text-transparent bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] bg-clip-text">What Our Travelers Say</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={goPrev}
              className="p-3 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goNext}
              className="p-3 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cards slider */}
        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(currentIndex, currentIndex + visibleCount).map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-gray-200 dark:text-gray-700" />
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 italic">
                    "{item.review}"
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.gradientFrom} ${item.gradientTo} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                    {item.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">{item.name}</h3>
                    {item.destination && (
                      <p className="text-xs text-[var(--theme-primary)] font-medium">Traveled to {item.destination}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
