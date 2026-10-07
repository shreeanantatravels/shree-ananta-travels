"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { clearAuth } from '../../../features/auth/authSlice';
import { authApi, useGetMeQuery, useLogoutMutation } from '../../../api/authApi';
import { User, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const { data } = useGetMeQuery();

  const agent = data?.agent;
  const displayName = agent?.businessName || agent?.name || 'Shree Ananta Travels';
  const displayEmail = agent?.email || 'admin@anantatravel.com';
  const logoUrl = agent?.logo || '/uploads/shree-ananta-logo.jpg';

  // Initial letters if logo is not available
  const getInitials = (name: string) => {
    if (!name) return 'AT';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      await logout().unwrap();
    } catch (err) {
      console.error('Logout error:', err);
    }
    dispatch(clearAuth());
    dispatch(authApi.util.resetApiState());
    window.location.href = '/admin/login';
  };

  return (
    <div className="relative">
      {/* Circular Avatar Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1 rounded-full hover:bg-gray-100/80 transition-all focus:outline-none group"
        title="Account Profile"
      >
        <div className="w-10 h-10 rounded-full border-2 border-[#d4af37] p-0.5 shadow-md shadow-[#d4af37]/20 flex items-center justify-center bg-white text-gray-900 font-bold text-sm overflow-hidden group-hover:scale-105 transition-transform">
          {logoUrl ? (
            <img
              src={logoUrl.startsWith('http') || logoUrl.startsWith('/') ? logoUrl : `/uploads/logos/${logoUrl}`}
              alt={displayName}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span>{getInitials(displayName)}</span>
          )}
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight max-w-[130px] truncate">
            {displayName}
          </span>
          <span className="text-[10px] text-gray-500 font-medium leading-none mt-0.5">
            Admin Account
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close when clicking outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header: User Details */}
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-[#d4af37] p-0.5 shadow-md flex items-center justify-center bg-white text-gray-900 font-bold text-base shrink-0 overflow-hidden">
                {logoUrl ? (
                  <img
                    src={logoUrl.startsWith('http') || logoUrl.startsWith('/') ? logoUrl : `/uploads/logos/${logoUrl}`}
                    alt={displayName}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span>{getInitials(displayName)}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {displayEmail}
                </p>
                <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200/60 px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1.5">
                  <ShieldCheck className="w-3 h-3 text-green-600" />
                  <span>Verified Admin</span>
                </div>
              </div>
            </div>

            {/* Menu Links */}
            <div className="p-2 space-y-1">
              <Link
                href="/admin/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center text-gray-600 group-hover:text-blue-600 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">My Profile</p>
                  <p className="text-[10px] text-gray-500 font-normal">View & edit account details</p>
                </div>
              </Link>
            </div>

            {/* Logout Action */}
            <div className="p-2 pt-1 border-t border-gray-100 mt-1">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all group text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100/70 group-hover:bg-red-200/80 flex items-center justify-center text-red-600 transition-colors">
                  <LogOut className="w-4 h-4" />
                </div>
                <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
