"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, Headphones, IndianRupee, Sparkles, CheckCircle2, ArrowRight, Phone, Globe, Star, Users } from 'lucide-react';
import { useAgent } from '../context/AgentContext';

export function WhyTrustUs() {
  const { siteConfig, agent } = useAgent();
  const companyDisplayName = siteConfig?.companyName || agent?.businessName || agent?.name || 'Shree Ananta Travels';

  const phone = siteConfig?.contactPhone || agent?.whatsapp || '+91 98765 43210';
  
  const heroSubtitle = `${companyDisplayName} is a premium travel company dedicated to delivering 24/7 supported, hassle-free holiday experiences across India and abroad.`;

  const features = [
    {
      icon: ShieldCheck,
      title: 'Trusted & Verified',
      desc: '100% verified and secure travel agency providing complete safety, transparency, and reliable service.',
      badge: 'Trusted',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    },
    {
      icon: Headphones,
      title: '24/7 All-Time Support',
      desc: 'Dedicated round-the-clock helpline & WhatsApp assistance before, during, and after your trip.',
      badge: '24/7 Active',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    },
    {
      icon: IndianRupee,
      title: 'Best Price Guarantee',
      desc: 'Direct contracts with top hotels and airlines to offer guaranteed lowest package rates.',
      badge: 'Best Value',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    },
    {
      icon: Globe,
      title: 'Pan-India & Global Tours',
      desc: 'From Leh-Ladakh circuits to Maldives water villas — covering 200+ worldwide destinations.',
      badge: '200+ Cities',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-gray-50/80 via-white to-gray-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[var(--theme-primary)]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[var(--theme-secondary)]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] text-xs font-extrabold uppercase tracking-widest mb-4 border border-[var(--theme-primary)]/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>About Our Company</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            About{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'var(--theme-gradient)' }}
            >
              {companyDisplayName}
            </span>
          </h2>

          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            {heroSubtitle}
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative p-7 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/80 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"
                      style={{ background: 'var(--theme-gradient)' }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2.5 group-hover:text-[var(--theme-primary)] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Highlights Row */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-md mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200">24/7 On-Trip Assistance</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200">15,000+ Happy Travellers</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200">12+ Years Trust</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200">500+ Hotel Partners</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/about"
            className="inline-flex items-center gap-2.5 font-bold text-base px-8 py-4 rounded-full text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ background: 'var(--theme-gradient)' }}
          >
            <span>Read Full Story &amp; 24/7 Support</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold px-7 py-4 rounded-full border border-gray-200 dark:border-gray-700 transition-all duration-300 text-base"
          >
            <Phone className="w-4.5 h-4.5 text-emerald-500 animate-pulse" />
            <span>Call 24/7 Support Helpline</span>
          </a>
        </div>

      </div>
    </section>
  );
}
