"use client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faFacebookF, faXTwitter, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';

interface SocialShareProps {
  title?: string;
  url?: string;
}

export function SocialShareBar({
  title,
  url,
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url || "https://www.shreeanantatravels.com/");
  const [currentTitle, setCurrentTitle] = useState(
    title || "Shree Ananta Travels — Journeys That Connect"
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(url || window.location.href);
      if (title) {
        setCurrentTitle(title);
      } else if (document.title && document.title.trim()) {
        setCurrentTitle(document.title.trim());
      }
    }
  }, [title, url]);

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(currentTitle);

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: faWhatsapp,
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%0A%0A${encodedUrl}`,
      color: "hover:bg-[#25D366] text-white bg-[#25D366]/90",
      ariaLabel: "Share page on WhatsApp",
    },
    {
      name: "Facebook",
      icon: faFacebookF,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:bg-[#1877F2] text-white bg-[#1877F2]/90",
      ariaLabel: "Share page on Facebook",
    },
    {
      name: "X (Twitter)",
      icon: faXTwitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:bg-black text-white bg-gray-900",
      ariaLabel: "Share page on X (Twitter)",
    },
    {
      name: "LinkedIn",
      icon: faLinkedinIn,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:bg-[#0A66C2] text-white bg-[#0A66C2]/90",
      ariaLabel: "Share page on LinkedIn",
    },
  ];

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // Fallback
      }
    }
  };

  return (
    <>
      {/* ── 1. Embedded Share Bar Section (Visible in Document Flow) ────────── */}
      <div className="w-full bg-gray-50/80 dark:bg-gray-800/40 border-y border-gray-100 dark:border-gray-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-200">
            <div className="w-9 h-9 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">Share This Page</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Recommend our itineraries and holy yatras with friends & family</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            {shareLinks.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.ariaLabel}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all duration-300 hover:scale-105 active:scale-95 ${s.color}`}
              >
                <FontAwesomeIcon icon={s.icon} className="w-3.5 h-3.5" />
                <span>{s.name}</span>
              </a>
            ))}

            <button
              onClick={handleCopyLink}
              aria-label="Copy website link to clipboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)] shadow-xs transition-all duration-300 cursor-pointer active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Floating Quick Share Dock (Desktop Right Edge) ─────────────── */}
      <aside
        aria-label="Social media sharing sidebar"
        className="fixed right-3 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-2 p-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/80 dark:border-gray-700/80"
      >
        <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 text-center pb-1 border-b border-gray-100 dark:border-gray-800">
          Share
        </span>
        {shareLinks.map((s) => (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.ariaLabel}
            title={s.ariaLabel}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xs ${s.color}`}
          >
            <FontAwesomeIcon icon={s.icon} className="w-4 h-4" />
            <span className="sr-only">{s.name}</span>
          </a>
        ))}
        <button
          onClick={handleCopyLink}
          aria-label="Copy page link"
          title="Copy link"
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-[var(--theme-primary)] transition-all cursor-pointer hover:scale-110"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <LinkIcon className="w-4 h-4" />}
        </button>
      </aside>
    </>
  );
}
