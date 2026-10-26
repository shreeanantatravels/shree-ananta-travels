"use client";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface BlogCategoryData {
  _id: string;
  name: string;
  slug: string;
  heading?: string;
  description?: string;
  order: number;
  isActive: boolean;
  showInNavbar?: boolean;
  subcategories: {
    _id?: string;
    name: string;
    slug: string;
    description?: string;
    isActive?: boolean;
  }[];
  publishedCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogData {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt?: string;
  author: string;
  category: string;
  categorySlug: string;
  subcategory?: string;
  subcategorySlug?: string;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  isFeatured: boolean;
  publishedAt?: string;
  scheduledAt?: string;
  readTime: number;
  tags: string[];
  faq?: {
    question: string;
    answer: string;
  }[];
  seo?: {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
  };
  socialSharing?: {
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
  redirectFromSlugs?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogListResponse {
  success: boolean;
  data: BlogData[];
  featuredArticle?: BlogData | null;
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const blogsApi = createApi({
  reducerPath: 'blogsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
  }),
  tagTypes: ['Blog', 'BlogCategory'],
  endpoints: (builder) => ({
    getBlogs: builder.query<
      BlogListResponse,
      {
        page?: number;
        limit?: number;
        status?: string;
        category?: string;
        search?: string;
        admin?: boolean;
        sort?: string;
      }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.set('page', String(params.page));
        if (params.limit) queryParams.set('limit', String(params.limit));
        if (params.status) queryParams.set('status', params.status);
        if (params.category) queryParams.set('category', params.category);
        if (params.search) queryParams.set('search', params.search);
        if (params.admin) queryParams.set('admin', 'true');
        if (params.sort) queryParams.set('sort', params.sort);
        return `/blogs?${queryParams.toString()}`;
      },
      providesTags: ['Blog'],
    }),

    getBlogById: builder.query<{ success: boolean; data: BlogData }, string>({
      query: (id) => `/blogs/${id}?admin=true`,
      providesTags: (_result, _error, id) => [{ type: 'Blog', id }],
    }),

    createBlog: builder.mutation<{ success: boolean; data: BlogData }, Partial<BlogData>>({
      query: (body) => ({
        url: '/blogs',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Blog', 'BlogCategory'],
    }),

    updateBlog: builder.mutation<
      { success: boolean; data: BlogData },
      { id: string; data: Partial<BlogData> }
    >({
      query: ({ id, data }) => ({
        url: `/blogs/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Blog', 'BlogCategory'],
    }),

    deleteBlog: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog', 'BlogCategory'],
    }),

    // Category endpoints
    getCategories: builder.query<{ success: boolean; data: BlogCategoryData[] }, void>({
      query: () => '/blogs/categories',
      providesTags: ['BlogCategory'],
    }),

    createCategory: builder.mutation<
      { success: boolean; data: BlogCategoryData },
      Partial<BlogCategoryData>
    >({
      query: (body) => ({
        url: '/blogs/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['BlogCategory'],
    }),

    updateCategory: builder.mutation<
      { success: boolean; data: BlogCategoryData },
      { id: string; data: Partial<BlogCategoryData> }
    >({
      query: ({ id, data }) => ({
        url: `/blogs/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['BlogCategory'],
    }),

    deleteCategory: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/blogs/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BlogCategory'],
    }),

    reorderCategories: builder.mutation<
      { success: boolean; message: string },
      { id: string; order: number }[]
    >({
      query: (orders) => ({
        url: '/blogs/categories',
        method: 'PUT',
        body: { action: 'reorder', orders },
      }),
      invalidatesTags: ['BlogCategory'],
    }),

    toggleCategoryNavbar: builder.mutation<
      { success: boolean; data?: BlogCategoryData; message?: string },
      string
    >({
      query: (id) => ({
        url: '/blogs/categories',
        method: 'PUT',
        body: { action: 'toggleNavbar', id },
      }),
      invalidatesTags: ['BlogCategory'],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useReorderCategoriesMutation,
  useToggleCategoryNavbarMutation,
} = blogsApi;
