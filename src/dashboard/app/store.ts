"use client";
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './api/authApi';
import authReducer from './features/auth/authSlice';
import { packageApi } from './api/packageApi';
import { leadsApi } from './api/leadsApi';
import { testimonialApi } from './api/testimonialApi';
import { contentSectionApi } from './api/contentSectionApi';
import { siteConfigApi } from './api/siteConfigApi';
import { faqsApi } from './api/faqsApi';
import { blogsApi } from './api/blogsApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [packageApi.reducerPath]: packageApi.reducer,
    [leadsApi.reducerPath]: leadsApi.reducer,
    [testimonialApi.reducerPath]: testimonialApi.reducer,
    [contentSectionApi.reducerPath]: contentSectionApi.reducer,
    [siteConfigApi.reducerPath]: siteConfigApi.reducer,
    [faqsApi.reducerPath]: faqsApi.reducer,
    [blogsApi.reducerPath]: blogsApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(packageApi.middleware)
      .concat(leadsApi.middleware)
      .concat(testimonialApi.middleware)
      .concat(contentSectionApi.middleware)
      .concat(siteConfigApi.middleware)
      .concat(faqsApi.middleware)
      .concat(blogsApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
