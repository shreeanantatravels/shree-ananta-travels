"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_CONTACT_PHONE } from '@/lib/utils/contactConfig';

/* ── Types ─────────────────────────────────────────────────────── */
export interface AgentPackage {
  _id: string;
  title: string;
  slug?: string;
  description: string;
  location: string;
  duration: string;
  category: string;
  packageType: string;
  imageUrl1: string;
  imageUrl2: string;
  originalPrice: number;
  discountedPrice: number | null;
  isTrending: boolean;
  hasOffer: boolean;
  badges: string[];
  tags?: string[];
  seo?: {
    title?: string;
    description?: string;
    focusKeyword?: string;
    relatedKeywords?: string[];
  };
  inclusions: string[];
  exclusions: string[];
  itinerary?: { day: number; title: string; description: string; }[];
}

export interface AgentProfile {
  _id: string;
  name: string;
  businessName: string;
  tagline: string;
  logo: string;
  theme: string;
  whatsapp: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface NavLinkItem {
  id: string;
  label: string;
  url: string;
  isActive: boolean;
  canDelete: boolean;
  order: number;
}

export interface SiteConfig {
  companyName: string;
  logoUrl?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  defaultWhatsappMessage: string;
  currency: string;
  timezone: string;
  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImages?: string[];
  navLinks?: NavLinkItem[];
  customNavLink?: {
    label: string;
    url: string;
    isActive: boolean;
  };
  topbarOffer: {
    text: string;
    ctaText: string;
    ctaLink: string;
    isActive: boolean;
  };
  cardOffer: {
    text: string;
    bgColor: string;
    isActive: boolean;
  };

  destinations?: {
    name: string;
    category: 'domestic' | 'international';
    active: boolean;
    trending: boolean;
    image: string;
  }[];
}

interface AgentContextType {
  agent: AgentProfile | null;
  packages: AgentPackage[];
  siteConfig: SiteConfig | null;
  isLoading: boolean;
  error: string | null;
}

const AgentContext = createContext<AgentContextType>({
  agent: null,
  packages: [],
  siteConfig: null,
  isLoading: false,
  error: null,
});

interface AgentProviderProps {
  children: React.ReactNode;
  initialPackages?: AgentPackage[];
  initialSiteConfig?: SiteConfig | null;
  initialAgent?: AgentProfile | null;
}

export function AgentProvider({
  children,
  initialPackages = [],
  initialSiteConfig = null,
  initialAgent = null,
}: AgentProviderProps) {
  const hasInitialData = initialPackages.length > 0 && !!initialSiteConfig;
  const [agent, setAgent] = useState<AgentProfile | null>(initialAgent);
  const [packages, setPackages] = useState<AgentPackage[]>(initialPackages);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(initialSiteConfig);
  // Only show loading spinner if we have NO initial SSR data at all
  const [isLoading, setIsLoading] = useState(!hasInitialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Background-refresh data without blocking the UI when SSR already provided initial data
    Promise.all([
      fetch('/api/auth/me', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ success: false })),
      fetch('/api/packages?isActive=true', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ success: false })),
      fetch('/api/site-config', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ success: false })),
    ])
      .then(([userData, packagesData, configData]) => {
        if (userData.success && (userData.agent || userData.data)) {
          setAgent(userData.agent || userData.data);
        } else if (configData.success && configData.agent) {
          setAgent(configData.agent);
        }

        if (packagesData.success && packagesData.data) {
          setPackages(packagesData.data);
        }

        if (configData.success && configData.data) {
          const cfg = configData.data;
          cfg.contactPhone = configData.agent?.whatsapp?.trim() || cfg.contactPhone?.trim() || DEFAULT_CONTACT_PHONE;
          setSiteConfig(cfg);
        }
      })
      .catch(() => setError('Failed to connect to server'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AgentContext.Provider value={{
      agent,
      packages,
      siteConfig,
      isLoading,
      error,
    }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  return useContext(AgentContext);
}
