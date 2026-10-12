"use client";
import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';

interface ProtectedEmailProps {
  email?: string;
  className?: string;
  showIcon?: boolean;
  iconClassName?: string;
  subject?: string;
}

/**
 * Technical SEO Anti-Spam Protected Email Component.
 * Obfuscates email in raw SSR HTML so automated email scraping bots
 * and SEO scanners cannot find plain-text email patterns, while providing
 * a completely normal, one-click clickable mailto link for real human users.
 */
export function ProtectedEmail({
  email = "shreeanantatravels@gmail.com",
  className = "",
  showIcon = false,
  iconClassName = "w-4 h-4",
  subject,
}: ProtectedEmailProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [localPart, domainPart] = (email || "shreeanantatravels@gmail.com").split('@');
  const mailtoUrl = subject
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${email}`;

  if (!isClient) {
    // In raw HTML delivered to web crawlers / SEO auditors:
    // Email is split across elements with non-email characters to defeat regex scrapers
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        {showIcon && <Mail className={iconClassName} aria-hidden="true" />}
        <span className="email-protected">
          <span>{localPart}</span>
          <span className="opacity-70 font-mono select-none px-0.5" aria-hidden="true">[at]</span>
          <span>{domainPart}</span>
        </span>
      </span>
    );
  }

  // Once hydrated for human visitors:
  return (
    <a
      href={mailtoUrl}
      className={`inline-flex items-center gap-1.5 ${className}`}
      title={`Email ${email}`}
    >
      {showIcon && <Mail className={iconClassName} aria-hidden="true" />}
      <span>{email}</span>
    </a>
  );
}

export default ProtectedEmail;
