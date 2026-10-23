"use client";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ItineraryItem {
  dayNumber: number;
  title: string;
  description: string;
  _id?: string;
  city?: string;
  route?: string;
  altitude?: string;
  stay?: string;
  meals?: string;
  transport?: string;
}

export interface PackageSEO {
  title?: string;
  description?: string;
  focusKeyword?: string;
  relatedKeywords?: string[];
}

export interface PackageData {
  _id: string;
  agentId: string;
  title: string;
  slug?: string;
  description: string;
  location: string;
  duration: string;
  category: 'domestic' | 'international' | 'kailash';
  packageType: string;
  enableRouteMap?: boolean;
  enableAltitude?: boolean;
  route?: string;
  departure?: string;
  tourStyle?: string;
  routeBannerTitle?: string;
  routeBannerSubtitle?: string;
  trustFeatures?: string[];
  imageUrl1?: string;
  imageUrl2?: string;
  imageUrl3?: string;
  imageUrl4?: string;
  itinerary: ItineraryItem[];
  originalPrice: number;
  discountedPrice?: number;
  isTrending: boolean;
  hasOffer: boolean;
  badges: string[];
  tags?: string[];
  seo?: PackageSEO;
  redirectFromSlugs?: string[];
  inclusions: string[];
  exclusions: string[];
  termsAndConditions?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const packageApi = createApi({
  reducerPath: 'packageApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    credentials: 'include',
  }),
  tagTypes: ['Package'],
  endpoints: (builder) => ({
    getPackages: builder.query<{ success: boolean; data: PackageData[] }, void>({
      query: () => '/packages',
      providesTags: ['Package'],
    }),
    createPackage: builder.mutation<{ success: boolean; data: PackageData }, FormData>({
      query: (pkg) => ({
        url: '/packages',
        method: 'POST',
        body: pkg,
      }),
      invalidatesTags: ['Package'],
    }),
    updatePackage: builder.mutation<{ success: boolean; data: PackageData }, { id: string; data: FormData | Partial<PackageData> }>({
      query: ({ id, data }) => ({
        url: `/packages/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Package'],
    }),
    deletePackage: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/packages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Package'],
    })
  })
});

export const {
  useGetPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packageApi;


