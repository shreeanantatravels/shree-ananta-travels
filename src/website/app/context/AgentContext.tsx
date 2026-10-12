"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

/* ── Types ─────────────────────────────────────────────────────── */
export interface AgentPackage {
  _id: string;
  title: string;
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
  const [agent, setAgent] = useState<AgentProfile | null>(initialAgent);
  const [packages, setPackages] = useState<AgentPackage[]>(initialPackages);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(initialSiteConfig);
  const [isLoading, setIsLoading] = useState(!initialPackages.length);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If not pre-hydrated, show loading state
    if (!packages.length || !siteConfig) {
      setIsLoading(true);
    }

    Promise.all([
      fetch('/api/auth/me', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ success: false })),
      fetch('/api/packages?isActive=true', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ success: false })),
      fetch('/api/site-config', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ success: false })),
    ])
      .then(([userData, packagesData, configData]) => {
        if (userData.success && (userData.agent || userData.data)) {
          setAgent(userData.agent || userData.data);
        }

        if (packagesData.success && packagesData.data) {
          setPackages(packagesData.data);
        }

        if (configData.success && configData.data) {
          setSiteConfig(configData.data);
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
