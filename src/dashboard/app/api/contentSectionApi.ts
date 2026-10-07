"use client";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ContentSectionItem {
  icon: string;
  title: string;
  description: string;
}

export interface ContentSectionData {
  _id: string;
  agentId: string;
  sectionType: 'hero_tagline' | 'about_us' | 'why_choose_us' | 'travel_theme' | 'custom';
  title: string;
  content: string;
  items: ContentSectionItem[];
  imageUrl: string;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const contentSectionApi = createApi({
  reducerPath: 'contentSectionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
  }),
  tagTypes: ['ContentSection'],
  endpoints: (builder) => ({
    getContentSections: builder.query<{ success: boolean; data: ContentSectionData[] }, void>({
      query: () => '/content-sections',
      providesTags: ['ContentSection'],
    }),
    createContentSection: builder.mutation<{ success: boolean; data: ContentSectionData }, Partial<ContentSectionData>>({
      query: (body) => ({
        url: '/content-sections',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ContentSection'],
    }),
    updateContentSection: builder.mutation<{ success: boolean; data: ContentSectionData }, { id: string; data: Partial<ContentSectionData> }>({
      query: ({ id, data }) => ({
        url: `/content-sections/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['ContentSection'],
    }),
    deleteContentSection: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/content-sections/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ContentSection'],
    }),
  }),
});

export const {
  useGetContentSectionsQuery,
  useCreateContentSectionMutation,
  useUpdateContentSectionMutation,
  useDeleteContentSectionMutation,
} = contentSectionApi;


