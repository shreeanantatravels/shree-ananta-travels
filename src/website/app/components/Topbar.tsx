"use client";
import { useAgent } from '../context/AgentContext';
import { Phone, Mail, Info } from 'lucide-react';
import Link from 'next/link';

export function Topbar() {
  const { agent, siteConfig } = useAgent();

  const phone = siteConfig?.contactPhone || agent?.phone || '+91 98765 43210';
  const email = siteConfig?.contactEmail || agent?.email || 'info@shreeanantatravels.com';

  const offerText = siteConfig?.topbarOffer?.text?.trim() || "";

  const showOffer = (siteConfig?.topbarOffer?.isActive !== false) && Boolean(offerText);

  return (
    <div 
      className="w-full text-white text-xs py-2.5 px-4 sm:px-8 border-b border-white/10 font-semibold shadow-md relative overflow-hidden select-none"
      style={{
        background: 'linear-gradient(90deg, var(--theme-primary) 0%, var(--theme-secondary, var(--theme-primary)) 50%, var(--theme-primary) 100%)',
        backgroundSize: '200% 100%',
        animation: 'topbarThemeGradient 8s ease infinite',
      }}
    >
      {/* Continuous moving glossy sheen wave over theme color */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'topbarShineWave 3.5s linear infinite',
        }}
      />

      <style jsx>{`
        @keyframes topbarThemeGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes topbarShineWave {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Phone */}
        {phone ? (
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-1.5 hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5 fill-current text-white" />
            <span>{phone}</span>
          </a>
        ) : <div />}

        {/* Center: Offer Banner */}
        {showOffer && offerText ? (
          <div className="text-center font-bold truncate max-w-[280px] sm:max-w-[480px] md:max-w-none">
            {offerText}
          </div>
        ) : <div />}

        {/* Right: Support Email & About Us */}
        <div className="flex items-center gap-3.5 whitespace-nowrap">
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              <Mail className="w-3.5 h-3.5 text-white" />
              <span className="hidden md:inline">{email}</span>
            </a>
          )}

          {email && <span className="opacity-40">|</span>}

          <Link
            href="/about"
            className="flex items-center gap-1 hover:underline font-bold text-white transition-opacity"
          >
            <Info className="w-3.5 h-3.5" />
            <span>About Us</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
