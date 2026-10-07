"use client";
import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, ArrowRight } from 'lucide-react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import Link from 'next/link';
import { useAgent } from '../context/AgentContext';
import { PlanTourModal } from './PlanTourModal';
import logo from "../../assets/tgt-logo.png";

export function Footer() {
  const { agent, siteConfig } = useAgent();
  const [showPlanTourModal, setShowPlanTourModal] = useState(false);

  const displayName   = siteConfig?.companyName || agent?.businessName || agent?.name || 'Shree Ananta Travels';
  const tagline       = agent?.tagline || 'Your trusted partner for unforgettable travel experiences around the world. Creating memories that last a lifetime.';
  
  const phone         = siteConfig?.contactPhone || agent?.whatsapp || '+91 98765 43210';
  const email         = siteConfig?.contactEmail || 'info@shreeanantatravels.com';
  const address       = siteConfig?.address || '2nd floor Varun Villa, UCO Bank Building, Dhalli Shimla -12, 171012';
  
  const rawWhatsapp   = agent?.whatsapp || phone;
  const cleanWhatsapp = rawWhatsapp.replace(/\D/g, '');
  const whatsappMsg   = encodeURIComponent(`Hi ${displayName}! I'm looking for travel packages and details.`);
  const whatsappLink  = `https://wa.me/${cleanWhatsapp}?text=${whatsappMsg}`;

  const facebookHref  = siteConfig?.facebookUrl || '#';
  const instagramHref = siteConfig?.instagramUrl || '#';
  const year          = new Date().getFullYear();

  function formatLogoUrl(url: any): string {
    if (!url) return '';
    if (typeof url === 'object' && url.src) return url.src;
    if (typeof url === 'string') {
      if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/')) return url;
      return `/uploads/${url}`;
    }
    return '';
  }

  const rawLogo = siteConfig?.logoUrl || agent?.logo || '/uploads/shree-ananta-logo.jpg';
  const logoUrl = formatLogoUrl(rawLogo) || formatLogoUrl(logo);

  const socialIconBaseClass = "w-10 h-10 rounded-full flex items-center justify-center transition-all transform hover:scale-110";

  const LogoBlock = ({ size = 'sm' }: { size?: 'sm' | 'lg' }) => (
    <Link href="/" className="flex items-center gap-3 mb-4 group">
      <div className={`${size === 'lg' ? 'w-14 h-14' : 'w-12 h-12'} bg-gradient-to-br from-[var(--theme-primary)] to-[var(--theme-secondary)] rounded-2xl flex items-center justify-center shadow-lg overflow-hidden p-0.5 transition-transform duration-300 group-hover:scale-105`}>
        <img src={logoUrl} alt={displayName} className="w-full h-full object-cover rounded-xl" />
      </div>
      <div className="flex flex-col">
        <span className={`${size === 'lg' ? 'text-2xl font-black' : 'text-xl font-bold'} text-white group-hover:text-[var(--theme-accent)] transition-colors`}>{displayName}</span>
        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Journeys That Connect</span>
      </div>
    </Link>
  );

  const ContactBlock = () => (
    <ul className="space-y-3.5 text-sm">
      {phone && (
        <li className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[var(--theme-accent)] group-hover:bg-[var(--theme-primary)] group-hover:text-white transition-all shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-gray-300 hover:text-white transition-colors font-medium">
            {phone}
          </a>
        </li>
      )}
      {email && (
        <li className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[var(--theme-accent)] group-hover:bg-[var(--theme-primary)] group-hover:text-white transition-all shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <a href={`mailto:${email}`} className="text-gray-300 hover:text-white transition-colors font-medium truncate">
            {email}
          </a>
        </li>
      )}
      {address && (
        <li className="flex items-start gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[var(--theme-accent)] group-hover:bg-[var(--theme-primary)] group-hover:text-white transition-all shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-gray-400 leading-snug font-light">{address}</span>
        </li>
      )}
    </ul>
  );

  const SocialBlock = () => (
    <div className="flex items-center gap-3">
      {facebookHref && facebookHref !== '#' && (
        <a href={facebookHref} target="_blank" rel="noopener noreferrer" className={`${socialIconBaseClass} bg-white/10 hover:bg-[#1877f2] text-white shadow-md`}>
          <FaFacebook className="w-5 h-5" />
        </a>
      )}
      {instagramHref && instagramHref !== '#' && (
        <a href={instagramHref} target="_blank" rel="noopener noreferrer" className={`${socialIconBaseClass} bg-white/10 hover:bg-gradient-to-tr hover:from-amber-500 hover:to-purple-600 text-white shadow-md`}>
          <FaInstagram className="w-5 h-5" />
        </a>
      )}
      {whatsappLink && (
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className={`${socialIconBaseClass} bg-white/10 hover:bg-emerald-500 text-white shadow-md`}>
          <MessageCircle className="w-5 h-5" />
        </a>
      )}
    </div>
  );

  return (
    <footer className="bg-gradient-to-b from-[#0a1c3d] via-[#0f2b5c] to-[#040e20] text-white pt-20 pb-10 border-t-2 border-[#d4af37]/40 relative">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="bg-gradient-to-r from-[#0f2b5c] to-[#1e3b70] backdrop-blur-2xl p-8 md:p-10 rounded-3xl border-2 border-[#d4af37]/40 mb-16 shadow-2xl shadow-[#d4af37]/10 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl text-center lg:text-left">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ready to craft your dream holiday?
            </h3>
            <p className="text-[#f3d375]/90 text-sm font-light leading-relaxed">
              Connect with our destination experts to design a bespoke itinerary tailored to your preferences.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row w-full lg:w-auto items-center gap-3.5 relative z-10">
            <button 
              onClick={() => setShowPlanTourModal(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#c59b27] text-[#0a1c3d] font-extrabold px-7 py-3.5 rounded-2xl text-sm hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-2.5 whitespace-nowrap shadow-[0_0_25px_rgba(212,175,55,0.3)] cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Request a Callback</span>
            </button>
            
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full sm:w-auto bg-white/10 hover:bg-emerald-600/90 border border-white/20 px-7 py-3.5 rounded-2xl text-white font-bold text-sm hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-2.5 backdrop-blur-md whitespace-nowrap shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <div>
            <LogoBlock size="lg" />
            <p className="text-[#f3d375]/80 text-sm leading-relaxed mb-6 font-light">
              {tagline}
            </p>
            <SocialBlock />
          </div>

          <div>
            <h4 className="text-sm font-extrabold mb-5 text-[#d4af37] uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#d4af37]" /> Home</Link></li>
              <li><Link href="/destinations" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#d4af37]" /> Destinations</Link></li>
              <li><Link href="/packages" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#d4af37]" /> Tour Packages</Link></li>
              <li><Link href="/packages?category=trending" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#d4af37]" /> Trending Packages</Link></li>
              <li><Link href="/about" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#d4af37]" /> About Us</Link></li>
              <li><Link href="/services" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#d4af37]" /> Our Services</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-extrabold mb-5 text-[#d4af37] uppercase tracking-wider">Legal Standards</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/terms-and-conditions" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#d4af37]" /> Terms & Conditions</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#d4af37]" /> Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-extrabold mb-5 text-[#d4af37] uppercase tracking-wider">Concierge Desk</h4>
            <ContactBlock />
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#f3d375]/70 gap-4">
          <p>© {year} {displayName}. All rights reserved.</p>
        
        </div>
      </div>

      <PlanTourModal
        isOpen={showPlanTourModal}
        onClose={() => setShowPlanTourModal(false)}
      />
    </footer>
  );
}
