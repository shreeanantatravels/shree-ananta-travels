"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useState } from 'react';
import { useAgent } from '../context/AgentContext';

interface ChatbotButtonProps {
  hidden?: boolean;
}

export function ChatbotButton({ hidden = false }: ChatbotButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { agent, siteConfig } = useAgent();

  if (hidden) return null;

  const handleClick = () => {
    // Priority: agent.whatsapp (set during onboarding) > siteConfig.contactPhone > fallback
    const rawNumber = agent?.whatsapp || siteConfig?.contactPhone || '';
    // Strip non-digits, ensure country code
    const digits = rawNumber.replace(/\D/g, '');
    const whatsappNumber = digits.startsWith('91') ? digits : `91${digits}`;
    const message = siteConfig?.defaultWhatsappMessage || "Hello! I need help with travel planning.";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      {/* WhatsApp Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-8 right-8 z-[9998] w-16 h-16 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-2xl hover:shadow-[#25D366]/40 transition-all duration-300 flex items-center justify-center group animate-in fade-in slide-in-from-bottom-4 duration-500 hover:scale-110 active:scale-95"
        aria-label="Chat with us on WhatsApp"
      >
        <FontAwesomeIcon
          icon={faWhatsapp}
          className="text-4xl leading-none group-hover:scale-110 transition-transform duration-300"
        />

        {/* Subtle pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-10"></span>

        {/* Ripple effect on hover */}
        {isHovered && (
          <span className="absolute inset-0 rounded-full bg-white/20 animate-ping"></span>
        )}
      </button>

      {/* Tooltip */}
      <div
        className={`fixed bottom-8 right-28 z-[9998] pointer-events-none transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <div className="bg-gray-900 dark:bg-gray-800 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium whitespace-nowrap border border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Chat with us on WhatsApp
          </div>

          {/* Arrow pointer */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-gray-900 dark:border-l-gray-800"></div>
        </div>
      </div>
    </>
  );
}
