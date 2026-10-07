"use client";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface TestimonialData {
  _id: string;
  agentId: string;
  customerName: string;
  destination: string;
  rating: number;
  review: string;
  avatarUrl: string;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const testimonialApi = createApi({
  reducerPath: 'testimonialApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
  }),
  tagTypes: ['Testimonial'],
  endpoints: (builder) => ({
    getTestimonials: builder.query<{ success: boolean; data: TestimonialData[] }, void>({
      query: () => '/testimonials',
      providesTags: ['Testimonial'],
    }),
    createTestimonial: builder.mutation<{ success: boolean; data: TestimonialData }, Partial<TestimonialData>>({
      query: (body) => ({
        url: '/testimonials',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Testimonial'],
    }),
    updateTestimonial: builder.mutation<{ success: boolean; data: TestimonialData }, { id: string; data: Partial<TestimonialData> }>({
      query: ({ id, data }) => ({
        url: `/testimonials/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Testimonial'],
    }),
    deleteTestimonial: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/testimonials/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Testimonial'],
    }),
  }),
});

export const {
  useGetTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} = testimonialApi;


