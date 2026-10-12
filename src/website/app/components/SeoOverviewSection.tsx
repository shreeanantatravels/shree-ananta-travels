import React from "react";
import Link from "next/link";
import {
  Mountain,
  Compass,
  ShieldCheck,
  Award,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { ProtectedEmail } from "./ProtectedEmail";

export function SeoOverviewSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900/90 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>
              India&apos;s Trusted Pilgrimage &amp; Tour Specialist
            </span>
          </div>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Shree Ananta Travels — Journeys That Connect
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
            Shree Ananta Travels is India&apos;s premier pilgrimage and travel
            agency, delivering customized tour packages across domestic
            destinations, international getaways, and sacred Himalayan yatras.
            We ensure seamless journeys with dedicated ground support, verified
            hotel partners, pure vegetarian meals, and complete permit management.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60">
            <ShieldCheck className="w-8 h-8 text-[var(--theme-primary)] mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">
              Official Tibet Permits
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Full TAR permit and China group visa assistance for hassle-free
              Kailash Mansarovar entry.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60">
            <Award className="w-8 h-8 text-[var(--theme-primary)] mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">
              Pure Vegetarian Meals
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Freshly prepared sattvic &amp; pure vegetarian food arranged
              throughout all pilgrimage journeys.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60">
            <Mountain className="w-8 h-8 text-[var(--theme-primary)] mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">
              Certified Sherpa Teams
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Experienced mountain guides with medical oxygen backup and
              high-altitude safety training.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60">
            <Phone className="w-8 h-8 text-[var(--theme-primary)] mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">
              2-Hour Quote Guarantee
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Share your travel preferences and get a customized itinerary and
              pricing within 2 hours.
            </p>
          </div>
        </div>

        {/* Detailed Informational Guide */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--theme-primary)]" />
              Kailash Mansarovar Yatra
            </h3>
            <p>
              Mount Kailash (6,638 m) and Lake Mansarovar (4,590 m) represent
              one of the most sacred pilgrimage circuits in the world. We offer
              comprehensive helicopter and overland routes from Kathmandu,
              Lucknow, and Lhasa with full logistical arrangements, comfortable
              guesthouses, and acclimatization days.
            </p>
            <ul className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{" "}
                Helicopter Yatra via Nepalgunj &amp; Simikot
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{" "}
                Overland Yatra via Kyirong border
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 3-Day
                Outer Kora (Parikrama) assistance
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--theme-primary)]" />
              Adi Kailash &amp; Char Dham Yatra
            </h3>
            <p>
              Experience the divine grace of Adi Kailash and Om Parvat in
              Uttarakhand&apos;s Pithoragarh district, where nature displays the
              sacred Om symbol in snow. We also conduct end-to-end Char Dham
              yatras covering Yamunotri, Gangotri, Kedarnath, and Badrinath with
              helicopter and road options.
            </p>
            <ul className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Adi
                Kailash &amp; Parvati Sarovar via Dharchula
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Char
                Dham Yatra from Delhi, Haridwar, Rishikesh
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Do
                Dham (Kedarnath &amp; Badrinath) packages
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--theme-primary)]" />
              Domestic &amp; International Tours
            </h3>
            <p>
              Beyond pilgrimages, Shree Ananta Travels curates bespoke travel
              packages across India (Kashmir, Kerala, Rajasthan, Himachal,
              Ladakh, Andaman) and leading world destinations (Dubai, Bali,
              Thailand, Vietnam, Singapore, Europe). All packages include
              handpicked hotels, private cabs, and sightseeing.
            </p>
            <ul className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{" "}
                Family, honeymoon, and group packages
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Visa
                assistance &amp; airport transfers included
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{" "}
                Transparent pricing with zero hidden charges
              </li>
            </ul>
          </div>
        </div>

        {/* Office & Contact Strip */}
        <div className="mt-12 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-xs text-gray-600 dark:text-gray-300">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--theme-primary)]" />
              <strong>Delhi Office:</strong> E91, East of Kailash, New Delhi
              110065
            </span>
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[var(--theme-primary)]" />
              <strong>Call / WhatsApp:</strong> +91 7289037447
            </span>
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[var(--theme-primary)]" />
              <strong>Email:</strong>{" "}
              <ProtectedEmail email="shreeanantatravels@gmail.com" className="text-gray-900 dark:text-gray-100 hover:underline" />
            </span>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
            style={{ background: "var(--theme-gradient)" }}
          >
            Get In Touch
          </Link>
        </div>
      </div>
    </section>
  );
}
