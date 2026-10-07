"use client";
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { useGetMeQuery } from '../api/authApi';
import { setUser, clearAuth } from '../features/auth/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Full screen loading indicator for session verification
function AuthLoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm font-medium">Verifying admin session...</p>
      </div>
    </div>
  );
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname() || '';
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const isLoginPage = pathname.includes('/admin/login');

  // Skip API check on login page
  const { data, isLoading, isError } = useGetMeQuery(undefined, { skip: isLoginPage });

  // Sync server session with Redux store
  useEffect(() => {
    if (isLoginPage) return;
    if (data?.success && data.agent) {
      const freshData = {
        id: data.agent._id,
        name: data.agent.name,
        email: data.agent.email,
        businessName: data.agent.businessName || 'Shree Ananta Travels',
        isOnboarded: true,
      };
      if (JSON.stringify(user) !== JSON.stringify(freshData)) {
        dispatch(setUser(freshData));
      }
    }
  }, [data, dispatch, user, isLoginPage]);

  // Handle unauthorized or expired sessions
  useEffect(() => {
    if (isLoginPage) return;
    if (isError) {
      dispatch(clearAuth());
      router.replace('/admin/login');
    }
  }, [isError, dispatch, router, isLoginPage]);

  const currentUser = (data?.success && data.agent) ? data.agent : user;

  // Handle redirect if not authenticated after loading completes
  useEffect(() => {
    if (isLoginPage) return;
    if (!isLoading && !currentUser) {
      router.replace('/admin/login');
    }
  }, [isLoading, currentUser, isLoginPage, router]);

  // If on login page, render children directly
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading screen while checking server authentication or waiting for redirect
  if (isLoading || !currentUser) {
    return <AuthLoadingScreen />;
  }

  return <>{children}</>;
}
