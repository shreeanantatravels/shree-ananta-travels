"use client";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface FaqData {
  _id: string;
  question: string;
  answer: string;
  category: string;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const faqsApi = createApi({
  reducerPath: 'faqsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
  }),
  tagTypes: ['Faq'],
  endpoints: (builder) => ({
    getFaqs: builder.query<{ success: boolean; data: FaqData[] }, void>({
      query: () => '/faqs',
      providesTags: ['Faq'],
    }),
    createFaq: builder.mutation<{ success: boolean; data: FaqData }, Partial<FaqData>>({
      query: (body) => ({
        url: '/faqs',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Faq'],
    }),
    updateFaq: builder.mutation<{ success: boolean; data: FaqData }, { id: string; data: Partial<FaqData> }>({
      query: ({ id, data }) => ({
        url: `/faqs/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Faq'],
    }),
    deleteFaq: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/faqs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Faq'],
    }),
    reorderFaqs: builder.mutation<{ success: boolean }, { id: string; position: number }[]>({
      query: (orders) => ({
        url: '/faqs',
        method: 'PUT',
        body: { action: 'reorder', orders },
      }),
      invalidatesTags: ['Faq'],
    }),
  }),
});

export const {
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useReorderFaqsMutation,
} = faqsApi;
