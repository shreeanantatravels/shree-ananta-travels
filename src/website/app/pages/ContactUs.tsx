"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Topbar } from '../components/Topbar';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ChatbotButton } from '../components/ChatbotButton';
import { ProtectedEmail } from '../components/ProtectedEmail';
import { useAgent } from '../context/AgentContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Send, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { toast } from 'sonner';

export default function ContactUs() {
  const { siteConfig, agent } = useAgent();

  const address = siteConfig?.address || 'E91, East of Kailash, Delhi 110065';
  const phone = siteConfig?.contactPhone || agent?.whatsapp || '';
  const email = siteConfig?.contactEmail || 'shreeanantatravels@gmail.com';
  const rawWhatsapp = agent?.whatsapp || siteConfig?.contactPhone || '';
  const cleanWa = rawWhatsapp.replace(/\D/g, '');
  const whatsappNumber = cleanWa.startsWith('91') ? cleanWa : (cleanWa.length === 10 ? `91${cleanWa}` : cleanWa);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    destination: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error('Please provide your name and phone number.');
      return;
    }

    const cleanInputPhone = formData.phone.replace(/[\s\-()]/g, '');
    if (!/^\+?[1-9]\d{9,14}$/.test(cleanInputPhone)) {
      toast.error('Please enter a valid phone number (10-15 digits).');
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
          email: formData.email.trim() || undefined,
          toLocation: formData.destination.trim() || undefined,
          specialRequests: formData.message.trim() || undefined,
          source: 'contact_page',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
        toast.success('Thank you! Your travel inquiry has been received.');
      } else {
        toast.error(data.message || 'Failed to submit inquiry. Please try again.');
      }
    } catch {
      toast.error('Network error. Please try calling or messaging us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col font-sans selection:bg-[var(--theme-primary)] selection:text-white">
      <Topbar />
      <Navbar />

      {/* ── Hero / Header ────────────────────────────────────────────── */}
      <section className="relative py-14 sm:py-20 bg-gradient-to-b from-white via-slate-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 border-b border-slate-200/80 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] text-xs font-extrabold uppercase tracking-widest mb-4 border border-[var(--theme-primary)]/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dedicated Guest Concierge</span>
          </div>

          <h1 
            className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight max-w-3xl mx-auto"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Contact <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'var(--theme-gradient)' }}>Shree Ananta Travels</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Have questions about tour packages, customized itineraries, or yatra dates? Connect directly with our travel specialists in Delhi.
          </p>
        </div>
      </section>

      {/* ── Main Content Grid ───────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Office Details & Direct Contacts */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-gray-800 shadow-xl space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                <MapPin className="w-6 h-6 text-[var(--theme-primary)]" />
                <span>Delhi Headquarters</span>
              </h2>

              <div className="space-y-4 pt-2">
                {/* Office Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 mt-1 border border-amber-200/50 dark:border-amber-900/50">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                      Registered Office
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mt-0.5 leading-snug">
                      {address}
                    </p>
                  </div>
                </div>

                {/* Telephone */}
                {phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-1 border border-blue-200/50 dark:border-blue-900/50">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Direct Phone Line
                      </p>
                      <a 
                        href={`tel:${phone.replace(/[^0-9+]/g, '')}`} 
                        className="text-sm sm:text-base font-bold text-[var(--theme-primary)] hover:underline mt-0.5 block"
                      >
                        {phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Email */}
                {email && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 mt-1 border border-purple-200/50 dark:border-purple-900/50">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Email Concierge
                      </p>
                      <ProtectedEmail 
                        email={email} 
                        className="text-sm sm:text-base font-bold text-[var(--theme-primary)] hover:underline mt-0.5 block break-all"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* WhatsApp Button */}
              {whatsappNumber && (
                <div className="pt-4 border-t border-slate-100 dark:border-gray-800">
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Shree Ananta Travels! I would like to plan a tour.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-extrabold text-sm shadow-lg shadow-green-600/20 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
                    <span>Message on WhatsApp</span>
                  </a>
                </div>
              )}
            </div>

            {/* Trust Assurances */}
            <div className="bg-slate-100/70 dark:bg-gray-900/60 rounded-3xl p-6 border border-slate-200/70 dark:border-gray-800/70 space-y-3">
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-700 dark:text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Transparent pricing with zero hidden booking charges</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-700 dark:text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Customized day-wise itineraries tailored to your dates</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-700 dark:text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Direct consultation with experienced destination planners</span>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-gray-800 shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">
                Send an Inquiry
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 font-medium">
                Fill in your details below and our team will get in touch with personalized options.
              </p>

              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Inquiry Received!
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Thank you for reaching out. One of our travel specialists will review your preferences and contact you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', phone: '', email: '', destination: '', message: '' });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl text-xs font-bold text-[var(--theme-primary)] bg-[var(--theme-primary)]/10 hover:bg-[var(--theme-primary)]/20 transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +91 7289037447"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                        Preferred Destination
                      </label>
                      <input
                        type="text"
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        placeholder="e.g. Kashmir, Bali, Kailash Yatra"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                      Trip Details / Special Requests
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share your travel dates, number of travelers, budget, or preferred hotel tier..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] transition-all font-medium resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl text-white font-extrabold text-sm shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 active:scale-98"
                    style={{ background: 'var(--theme-gradient)' }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Your Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Travel Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
      <ChatbotButton />
    </div>
  );
}
