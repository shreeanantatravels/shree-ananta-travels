"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Users, HeartHandshake, Compass, CheckCircle2, 
  ArrowRight, BookOpen, Star, Info, Globe, Sunrise, Map, PhoneCall, Award, Sparkles
} from 'lucide-react';
import { Topbar } from '../components/Topbar';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ChatbotButton } from '../components/ChatbotButton';
import { useAgent } from '../context/AgentContext';

export default function AboutUs() {
  const { agent, siteConfig } = useAgent();
  const displayName = siteConfig?.companyName || agent?.businessName || agent?.name || 'Shree Ananta Travels';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans selection:bg-[var(--theme-primary)]/30">
      <Topbar />
      <Navbar />
      
      {/* ── 1. Hero Section ──────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        {/* Background ambient light & animations */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--theme-primary)]/10 rounded-full blur-[150px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[var(--theme-secondary)]/10 rounded-full blur-[150px] pointer-events-none" />
        
        {/* Decorative grids */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 dark:opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] text-xs font-extrabold uppercase tracking-widest mb-6 border border-[var(--theme-primary)]/20 shadow-xs hover:scale-105 transition-transform cursor-default">
            <Globe className="w-4 h-4 animate-spin-slow" style={{ animationDuration: '4s' }} />
            <span>Welcome to {displayName}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white tracking-tight mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            Where Every Journey Is <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'var(--theme-gradient)' }}>
              More Than an Itinerary
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
            A holiday is not just a change of place; it's a collection of moments, carefully crafted and seamlessly executed. We believe the people who plan your journey make all the difference.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 font-bold text-base px-8 py-4 rounded-full text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ background: 'var(--theme-gradient)' }}
            >
              <span>Plan Your Trip</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-base px-8 py-4 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <Compass className="w-5 h-5 text-[var(--theme-primary)]" />
              <span>Explore Destinations</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Impact Highlights ────────────────────────────────────────────── */}
      <section className="relative -mt-10 z-20 max-w-7xl mx-auto px-4">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 p-8 rounded-3xl shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100 dark:divide-gray-800">
            {[
              { label: 'Personalized Concierge', icon: Sparkles },
              { label: 'Discreet & Exclusive', icon: ShieldCheck },
              { label: 'Global Partnerships', icon: Globe },
              { label: 'Authentic & Sacred', icon: Sunrise },
            ].map((stat, idx) => (
              <div key={idx} className="text-center group px-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <stat.icon className="w-7 h-7" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white group-hover:text-[var(--theme-primary)] transition-colors leading-snug">
                  {stat.label}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Our Philosophy & Ethics (PDF Content) ─────────────────────────────── */}
      <section className="py-24 bg-gray-50 dark:bg-gray-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            <div className="space-y-8 relative">
              <div className="absolute -left-10 -top-10 text-[var(--theme-primary)]/5">
                <Compass className="w-64 h-64" />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Our Work. Our Ethics. <br /> Our Way.
                </h2>
                <div className="w-20 h-1.5 bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] rounded-full mb-8"></div>
                
                <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p>
                    Our work begins much before the journey itself—with understanding the requirements of our travellers, planning the itinerary, anticipating challenges and preparing for the many small details that come together to make a trip possible.
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    We believe in working with clarity, responsibility, humility and attention to detail.
                  </p>
                  <p>
                    For us, there is no detail too small when it concerns a traveller. From the first conversation and preparation for the journey to transportation, accommodation, permits, local arrangements and assistance along the way, we strive to remain attentive to what you may need.
                  </p>

                  <div className="mt-8 p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">The Traveller Comes First</h3>
                    <p className="mb-4">
                      Every traveller comes with a different expectation, a different physical capacity, a different reason for undertaking the journey and, most importantly, a different inner journey.
                    </p>
                    <p className="mb-4">
                      We therefore do not look at a group simply as a number of tourists. <strong>We look at the people.</strong>
                    </p>
                    <p className="text-xl font-bold text-[var(--theme-primary)] mb-4">
                      We listen. We understand. We plan. We assist.
                    </p>
                    <p>
                      Our endeavour is to create an environment where you feel that your concerns are heard and that someone is genuinely paying attention to your journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Image Grid */}
            <div className="grid grid-cols-2 gap-4 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[var(--theme-primary)]/20 rounded-full blur-[60px]" />
              
              <div className="space-y-4 translate-y-8">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-gray-800 relative group">
                  <img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=75&w=600&auto=format&fit=crop" alt="Travel" loading="lazy" decoding="async" width={400} height={500} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-gray-800 relative group">
                  <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=75&w=600&auto=format&fit=crop" alt="Adventure" loading="lazy" decoding="async" width={400} height={400} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-gray-800 relative group">
                  <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=75&w=600&auto=format&fit=crop" alt="Views" loading="lazy" decoding="async" width={400} height={400} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-gray-800 relative group">
                  <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=75&w=600&auto=format&fit=crop" alt="Beach" loading="lazy" decoding="async" width={400} height={500} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ── 3.5 The Souls Who Make the Journey (PDF Content) ──────────────────── */}
      <section className="py-24 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            The Souls Who Make the Journey
          </h2>
          <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              Perhaps the most beautiful part of any meaningful journey is something that no itinerary can ever capture. It is the people you meet along the way.
            </p>
            <p>
              Strangers become companions. Companions become friends. Different lives, different stories and different reasons for travelling come together on the same path.
            </p>
            <p>
              There are moments of laughter, silence, difficulty, encouragement and shared strength. And somewhere along that journey, one realizes that the beauty of travel lies not only in where we go, but in whom we meet and how we walk together.
            </p>
            <p className="font-bold text-2xl text-[var(--theme-primary)] pt-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              At {displayName}, we feel privileged to be a part of that journey.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. Why Choose Us (Cards) ───────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Why Travel With Ananta
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              We may not be able to control the weather, but we can control how carefully we plan, how responsibly we operate, and how sincerely we assist you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Immaculate Precision",
                desc: "Every stage of your journey is carefully thought through, from initial planning to ground-level coordination. Our strength lies in the backend logistics.",
                icon: BookOpen,
                delay: "delay-[0ms]"
              },
              {
                title: "Strong In-House Team",
                desc: "Our travel team is directly involved in managing ground logistics, allowing us to maintain closer coordination and respond quickly to requirements.",
                icon: ShieldCheck,
                delay: "delay-[100ms]"
              },
              {
                title: "Permits & Visas",
                desc: "We assist with all required permits, visas and documentation, helping ensure that necessary formalities are planned well in advance.",
                icon: Info,
                delay: "delay-[200ms]"
              },
              {
                title: "Customized Private Groups",
                desc: "For families, friends, or private groups who prefer their own travel experience, we craft 100% tailor-made arrangements.",
                icon: Users,
                delay: "delay-[300ms]"
              },
              {
                title: "Scale & Capacity",
                desc: "Whether a honeymoon couple or a corporate group of 100+, our backend systems ensure individual requirements never get lost.",
                icon: HeartHandshake,
                delay: "delay-[400ms]"
              },
              {
                title: "People on the Ground",
                desc: "Travel comes with uncertainties. Our staff and partners are deployed on the ground globally so assistance is always available.",
                icon: Sunrise,
                delay: "delay-[500ms]"
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className={`group relative bg-gray-50 dark:bg-gray-800/40 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700/60 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden ${feature.delay}`}>
                  {/* Hover gradient background effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-primary)]/5 to-[var(--theme-secondary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" style={{ background: 'var(--theme-gradient)' }}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-3 group-hover:text-[var(--theme-primary)] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. A Note for Our Travellers & Promise ─────────────────────────────── */}
      <section className="py-24 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-full bg-[var(--theme-primary)]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          
          <div className="bg-white dark:bg-gray-900 p-10 md:p-14 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Star className="w-32 h-32 text-[var(--theme-primary)]" />
            </div>

            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                A Note for Our Travellers
              </h2>
              
              <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                <p>
                  Some journeys, especially those through high-altitude, sacred, or challenging terrains, are not merely luxury tours. They take place in regions where resources and infrastructure can be limited and weather conditions can be unpredictable.
                </p>
                <p>
                  Despite these inherent challenges, we continuously strive to provide you with the best possible support, comfort and assistance within the circumstances of the journey.
                </p>
                <p>
                  There may be moments when plans need to change, comforts may be limited, or circumstances may not unfold exactly as expected. Our responsibility is to prepare as meticulously as possible, remain present, and extend every possible assistance along the way.
                </p>
                <p className="font-bold text-gray-900 dark:text-white">
                  We ask our travellers to undertake such journeys with an open heart and an understanding of the unique nature of travel.
                </p>
              </div>

              <div className="my-10 border-t border-gray-100 dark:border-gray-800"></div>

              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                Our Promise to You
              </h2>

              <ul className="space-y-4 max-w-2xl mx-auto text-lg text-gray-700 dark:text-gray-200 font-medium">
                {[
                  "Attention to the minutest detail.",
                  "Respect for every traveller.",
                  "Responsibility at every step.",
                  "The understanding that every trip is someone's deeply cherished journey."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[var(--theme-primary)] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-8 text-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 font-bold text-lg px-10 py-5 rounded-full text-white shadow-[0_0_40px_rgba(var(--theme-primary-rgb),0.4)] hover:shadow-[0_0_60px_rgba(var(--theme-primary-rgb),0.6)] transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{ background: 'var(--theme-gradient)' }}
                >
                  <PhoneCall className="w-5 h-5 animate-bounce" />
                  <span>Connect With Our Experts</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
      <ChatbotButton />
    </div>
  );
}
