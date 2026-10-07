"use client";
import React, { useEffect } from 'react';
import { Topbar } from '../components/Topbar';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ChatbotButton } from '../components/ChatbotButton';
import { SERVICES_DATA } from '../components/ServicesSection';
import { ShieldCheck, PhoneCall } from 'lucide-react';

export default function Services() {
  
  useEffect(() => {
    // If hash in URL, scroll to it smoothly
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans selection:bg-[var(--theme-primary)]/30">
      <Topbar />
      <Navbar />
      
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
         <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--theme-primary)]/10 rounded-full blur-[150px] animate-pulse pointer-events-none" />
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 dark:opacity-10 pointer-events-none" />
         
         <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Our <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'var(--theme-gradient)' }}>Tailored Services</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              From air tickets to luxury expeditions, we provide comprehensive travel solutions to ensure every aspect of your journey is perfect.
            </p>
         </div>
      </section>

      {/* Services List */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 space-y-24">
          {SERVICES_DATA.map((service, idx) => {
            const Icon = service.icon;
            const isEven = idx % 2 === 0;

            return (
              <div id={service.id} key={service.id} className={`flex flex-col md:flex-row gap-10 lg:gap-16 items-center scroll-mt-32 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                {/* Image */}
                <div className="w-full md:w-1/2">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] group bg-gray-100 dark:bg-gray-800">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2 space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl shadow-md border border-[var(--theme-primary)]/20" style={{ background: 'var(--theme-gradient)' }}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {service.title}
                  </h2>
                  <div className="w-16 h-1.5 bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] rounded-full"></div>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {service.fullDesc}
                  </p>
                  
                  <ul className="space-y-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 font-bold">
                       <ShieldCheck className="w-5 h-5 text-emerald-500" />
                       Trusted & Verified Providers
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 font-bold">
                       <PhoneCall className="w-5 h-5 text-blue-500" />
                       24/7 Dedicated Support
                    </li>
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <Footer />
      <ChatbotButton />
    </div>
  );
}
