"use client";
import { Provider } from 'react-redux';
import { store } from '@/src/dashboard/app/store';
import { ThemeProvider } from 'next-themes';
import { AdminLayout } from '@/src/dashboard/app/layouts/AdminLayout';
import { ProtectedRoute } from '@/src/dashboard/app/components/ProtectedRoute';
import { Toaster } from 'sonner';

export default function AdminProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <ProtectedRoute>
          <AdminLayout>
            {children}
          </AdminLayout>
        </ProtectedRoute>
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    </Provider>
  );
}
