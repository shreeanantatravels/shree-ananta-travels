"use client";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export interface DestinationData {
  name: string;
  category: 'domestic' | 'international';
  active: boolean;
  trending: boolean;
  image: string;
  showInNavbar?: boolean;
}

export interface CustomNavLink {
  label: string;
  url: string;
  isActive: boolean;
}

export interface NavLinkItem {
  id: string;
  label: string;
  url: string;
  isActive: boolean;
  canDelete: boolean;
  order: number;
}

export interface SiteConfigData {
  _id: string;
  agentId: string;
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
  customNavLink?: CustomNavLink;
  topbarOffer?: {
    text?: string;
    ctaText?: string;
    ctaLink?: string;
    isActive?: boolean;
  };
  cardOffer?: {
    text?: string;
    bgColor?: string;
    isActive?: boolean;
  };
  destinations: DestinationData[];
  createdAt: string;
  updatedAt: string;
}

export const siteConfigApi = createApi({
  reducerPath: 'siteConfigApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
  }),
  tagTypes: ['SiteConfig'],
  endpoints: (builder) => ({
    getSiteConfig: builder.query<{ success: boolean; data: SiteConfigData }, void>({
      query: () => '/site-config',
      providesTags: ['SiteConfig'],
    }),
    updateSiteConfig: builder.mutation<{ success: boolean; data: SiteConfigData }, Partial<SiteConfigData>>({
      query: (body) => ({
        url: '/site-config',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['SiteConfig'],
    }),
  }),
});

export const {
  useGetSiteConfigQuery,
  useUpdateSiteConfigMutation,
} = siteConfigApi;
