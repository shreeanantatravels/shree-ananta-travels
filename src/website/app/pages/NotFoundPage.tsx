"use client";
import Link from 'next/link';
import { Topbar } from '../components/Topbar';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ChatbotButton } from '../components/ChatbotButton';
import { Compass, MapPin, Home as HomeIcon, Search, ArrowLeft, HelpCircle, PhoneCall, Sparkles } from 'lucide-react';
import { useAgent } from '../context/AgentContext';

const QUICK_DESTINATIONS = [
  { name: 'Kailash Yatra', href: '/packages?category=kailash' },
  { name: 'Kashmir Valley', href: '/packages?search=Kashmir' },
  { name: 'Bali Romance', href: '/packages?search=Bali' },
  { name: 'Kerala Backwaters', href: '/packages?search=Kerala' },
  { name: 'Dubai Luxury', href: '/packages?search=Dubai' },
  { name: 'Rajasthan Forts', href: '/packages?search=Rajasthan' },
];

export default function NotFoundPage() {
  const { siteConfig, agent } = useAgent();
  const phone = siteConfig?.contactPhone || agent?.whatsapp || '';
  const digits = phone.replace(/\D/g, '');
  const whatsappTarget = digits.startsWith('91') ? digits : (digits.length === 10 ? `91${digits}` : digits);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col selection:bg-amber-500 selection:text-white">
      <Topbar />
      <Navbar />

      {/* ── Main Error Container ─────────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center py-16 px-4 relative overflow-hidden">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-3xl w-full mx-auto text-center relative z-10">
          
          {/* 404 Badge Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-extrabold uppercase tracking-widest mb-6 animate-pulse">
            <Compass className="w-4 h-4" />
            <span>404 - Destination Uncharted</span>
          </div>

          {/* Big Stylized 404 Display */}
          <div className="relative my-4">
            <h1 
              className="text-8xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text select-none leading-none opacity-90"
              style={{ backgroundImage: 'var(--theme-gradient, linear-gradient(135deg, #0f2b5c 0%, #d4af37 100%))' }}
            >
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-6 py-2 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl transform -rotate-2">
                <span className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200">
                  🗺️ Lost in Paradise?
                </span>
              </div>
            </div>
          </div>

          {/* Heading & Subtitle */}
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mt-4 mb-3 tracking-tight">
            Oops! This Page Doesn't Exist
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed mb-8">
            The link you followed might be broken, or the URL <code className="bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded text-amber-600 dark:text-amber-400 font-mono text-xs">invalid route</code> was misspelled. Let's get you back on track!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 group"
              style={{ background: 'var(--theme-gradient, linear-gradient(135deg, #d4af37 0%, #0f2b5c 100%))' }}
            >
              <HomeIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Homepage</span>
            </Link>

            <Link
              href="/packages"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-xs hover:-translate-y-0.5"
            >
              <Search className="w-4 h-4 text-amber-500" />
              <span>Explore Tour Packages</span>
            </Link>
          </div>

          {/* Popular Destination Shortcuts */}
          <div className="bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl max-w-2xl mx-auto backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Popular Destinations to Explore</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {QUICK_DESTINATIONS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-all border border-gray-200/60 dark:border-gray-700/60 shadow-xs"
                >
                  <MapPin className="w-3 h-3 text-amber-500 group-hover:text-white" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Need Assistance Section */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <HelpCircle className="w-4 h-4 text-gray-400" />
            <span>Need help finding something?</span>
            {whatsappTarget ? (
              <a 
                href={`https://wa.me/${whatsappTarget}?text=${encodeURIComponent("Hi Shree Ananta Travels, I need help finding a tour package")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline text-amber-600 dark:text-amber-400 hover:opacity-80"
              >
                Contact Support
              </a>
            ) : (
              <Link
                href="/contact"
                className="font-bold underline text-amber-600 dark:text-amber-400 hover:opacity-80"
              >
                Contact Support
              </Link>
            )}
          </div>

        </div>
      </main>

      <Footer />
      <ChatbotButton />
    </div>
  );
}
