"use client";
import { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, Loader2, MapPin, User, Phone, Users, Compass, IndianRupee, Headset, Send, Lock } from 'lucide-react';
import { toast } from 'sonner';

const POPULAR_DESTINATIONS = [
  'Kashmir',
  'Bali',
  'Dubai',
  'Kerala',
  'Himachal',
  'Ladakh',
  'Maldives',
  'Goa',
  'Other',
];

const PASSENGER_OPTIONS = [
  { label: '1 Person', value: '1' },
  { label: '2 People', value: '2' },
  { label: '3-5 People', value: '3-5' },
  { label: '6+ Group', value: '6+' },
];

// Module-level flag: persists across client-side page transitions (SPA routing),
// but resets automatically whenever the user does a full page refresh (F5 / reload).
let hasShownInThisPageLoad = false;

export function LeadCaptureModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    destination: 'Kashmir',
    passengers: '2',
  });
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Only show once per full page load; do not trigger again when navigating back & forth
    if (hasShownInThisPageLoad) return;

    const timer = setTimeout(() => {
      hasShownInThisPageLoad = true;
      setIsOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen) setTimeout(() => nameRef.current?.focus(), 300);
  }, [isOpen]);

  const handleClose = () => {
    hasShownInThisPageLoad = true;
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error('Please fill in your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          destination: formData.destination,
          toLocation: formData.destination,
          passengers: formData.passengers,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        toast.success('Inquiry submitted successfully! We will contact you soon.');
        setTimeout(() => {
          handleClose();
          setSubmitted(false);
          setFormData({ name: '', phone: '', destination: 'Kashmir', passengers: '2' });
        }, 2800);
      } else {
        toast.error(data.message || 'Failed to submit request.');
      }
    } catch (err) {
      console.error('Lead submission error:', err);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto transition-all animate-in fade-in duration-300"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      {/* ── Main Modal Card (Fully Responsive for Mobile/Tablet/Desktop) ────────── */}
      <div className="relative w-full max-w-[820px] max-h-[92vh] sm:max-h-[90vh] bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-y-auto md:overflow-hidden grid grid-cols-1 md:grid-cols-12 animate-in zoom-in-95 duration-300 my-auto border border-gray-100 dark:border-zinc-800">
        
        {/* ── LEFT PANEL: Dark Navy Visual Section ────────────────── */}
        <div className="md:col-span-5 bg-[#14223d] p-4 sm:p-6 md:p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Background curved lines */}
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-1/2 -right-12 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative z-10">
            {/* Tagline */}
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="w-5 sm:w-6 h-[2px]" style={{ background: 'var(--theme-primary, #eab308)' }} />
              <span className="text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase text-amber-400">
                EXCLUSIVE OFFER
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight mb-2 sm:mb-3">
              Your <span className="text-white">Dream Trip</span> <br className="hidden sm:inline" />
              <span
                className="font-serif italic text-2xl sm:text-3xl md:text-4xl leading-tight inline-block sm:block mt-0.5 ml-1 sm:ml-0"
                style={{ color: 'var(--theme-accent, #fbbf24)' }}
              >
                Starts Here
              </span>
            </h2>

            <p className="text-white/80 text-xs leading-relaxed mb-4 sm:mb-6 hidden sm:block">
              Tell us a few details and we&apos;ll get you a free customized tour quote!
            </p>

            {/* Features List (Compact grid on mobile, stacked on tablet/desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-2.5 sm:gap-3 md:gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-amber-400 shrink-0">
                  <Compass size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-snug">Personalized Itinerary</h4>
                  <p className="text-[10px] text-white/60 hidden sm:block">As per your travel style</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-amber-400 shrink-0">
                  <IndianRupee size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-snug">Best Price Guarantee</p>
                  <p className="text-[10px] text-white/60 hidden sm:block">No hidden charges</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-amber-400 shrink-0">
                  <Headset size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-snug">Dedicated Support</p>
                  <p className="text-[10px] text-white/60 hidden sm:block">Here to assist your journey</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Cursive Quote (Tablet/Desktop) */}
          <div className="relative z-10 mt-6 pt-4 hidden md:block border-t border-white/10">
            <p className="font-serif italic text-base sm:text-lg text-white/90 leading-tight">
              Travel More <br />
              <span className="text-white/70">Worry Less</span>
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL: Form Section ───────────────────────────── */}
        <div className="md:col-span-7 p-4 sm:p-6 md:p-8 bg-white dark:bg-zinc-900 flex flex-col justify-between relative">
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            aria-label="Close modal"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition-colors shadow-xs"
          >
            <X size={16} />
          </button>

          {/* Decorative Stamp Badge */}
          <div className="hidden lg:flex absolute top-5 right-14 w-24 h-24 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 flex-col items-center justify-center text-center p-2 transform rotate-6 pointer-events-none shadow-xs">
            <span className="font-serif italic text-[10px] text-amber-800 dark:text-amber-300 leading-tight font-medium">
              Good Places <br />
              Great People <br />
              Better Trips
            </span>
          </div>

          {submitted ? (
            /* Success State */
            <div className="my-auto py-8 text-center animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={30} />
              </div>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">Inquiry Received! 🎉</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-gray-900 dark:text-white">{formData.name || 'Traveler'}</span>! Our travel expert will call you shortly with custom quotes for {formData.destination}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 my-auto">
              
              {/* Form Title */}
              <div className="pr-8 sm:pr-0">
                <span
                  className="text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase block mb-0.5"
                  style={{ color: 'var(--theme-primary, #d97706)' }}
                >
                  GET A FREE QUOTE
                </span>
                <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  Plan Your Trip
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1 max-w-xs">
                  Share your details & get a custom package quote!
                </p>
              </div>

              {/* 1. Destination Field */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                  <MapPin size={13} style={{ color: 'var(--theme-primary, #d97706)' }} />
                  <span>Destination</span>
                  <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  required
                  className="w-full h-10 sm:h-11 px-3 sm:px-3.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/70 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all cursor-pointer font-medium"
                  style={{ '--tw-ring-color': 'var(--theme-primary, #d97706)' } as React.CSSProperties}
                >
                  {POPULAR_DESTINATIONS.map((dest) => (
                    <option key={dest} value={dest}>
                      {dest}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Full Name Field */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                  <User size={13} style={{ color: 'var(--theme-primary, #d97706)' }} />
                  <span>Full Name</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  required
                  className="w-full h-10 sm:h-11 px-3 sm:px-3.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/70 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all font-medium"
                  style={{ '--tw-ring-color': 'var(--theme-primary, #d97706)' } as React.CSSProperties}
                />
              </div>

              {/* 3. Mobile / WhatsApp Number Field */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                  <Phone size={13} style={{ color: 'var(--theme-primary, #d97706)' }} />
                  <span>Mobile / WhatsApp Number</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 h-10 sm:h-11 px-2.5 sm:px-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-bold shrink-0">
                    <span>IN +91 ▾</span>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter your 10-digit mobile number"
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    className="flex-1 min-w-0 h-10 sm:h-11 px-3 sm:px-3.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/70 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all font-medium"
                    style={{ '--tw-ring-color': 'var(--theme-primary, #d97706)' } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* 4. Number of Passengers Field */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1">
                  <Users size={13} style={{ color: 'var(--theme-primary, #d97706)' }} />
                  <span>Number of Passengers</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                  {PASSENGER_OPTIONS.map((opt) => {
                    const isSelected = formData.passengers === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, passengers: opt.value })}
                        className={`h-9 sm:h-10 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'text-white border-transparent shadow-xs scale-102'
                            : 'bg-gray-50/70 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
                        }`}
                        style={isSelected ? { background: 'var(--theme-primary, #d97706)' } : {}}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 sm:h-12 mt-2 sm:mt-3 flex items-center justify-center gap-2 text-white font-bold text-xs sm:text-base rounded-xl shadow-md hover:shadow-lg hover:opacity-95 active:scale-[0.99] transition-all duration-150 disabled:opacity-70 group cursor-pointer"
                style={{ background: 'var(--theme-gradient, linear-gradient(135deg, #d97706 0%, #f59e0b 100%))' }}
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Send size={15} className="transition-transform group-hover:translate-x-1" />
                    <span>Get Custom Tour Quote</span>
                    <span className="text-base sm:text-lg leading-none font-normal">→</span>
                  </>
                )}
              </button>

              {/* Footer Trust Guarantee */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-gray-400 dark:text-gray-500 font-medium pt-0.5">
                <Lock size={11} className="text-gray-400" />
                <span>Your details are safe with us.</span>
              </div>
            </form>
          )}

          {/* Bottom Right Dashed Flight Deco */}
          <div className="absolute bottom-2 right-2 text-amber-500/60 pointer-events-none hidden sm:block">
            <svg width="60" height="30" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 25C20 5 40 25 55 10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
              <path d="M52 8L57 10L54 14" fill="currentColor"/>
            </svg>
          </div>

        </div>
      </div>
    </div>
  );
}
