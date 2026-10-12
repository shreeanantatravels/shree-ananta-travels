"use client";
import { useState, useEffect } from 'react';
import {
  User,
  Shield,
  TrendingUp,
  Package,
  Loader2,
} from 'lucide-react';
import { Input } from "../components/ui/input";
import { toast } from 'sonner';
import { useGetMeQuery, useUpdateProfileMutation, useUpdatePasswordMutation, useForgotPasswordMutation, useResetPasswordMutation } from '../api/authApi';

export function Profile() {
  // Fetch agent details
  const { data, isLoading } = useGetMeQuery();
  const agent = data?.agent;

  // Mutations
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
  });

  useEffect(() => {
    if (agent) {
      const nameParts = (agent.name || '').split(' ');
      setProfileForm({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: agent.email || '',
        whatsapp: agent.whatsapp || '',
      });
    }
  }, [agent]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fullName = `${profileForm.firstName.trim()} ${profileForm.lastName.trim()}`.trim();
      if (!fullName || !profileForm.email) {
         toast.error("Name and Email are required");
         return;
      }
      if (profileForm.whatsapp && profileForm.whatsapp.trim()) {
        const cleanWa = profileForm.whatsapp.replace(/[\s\-()]/g, '');
        if (!/^\+?[1-9]\d{9,14}$/.test(cleanWa)) {
          toast.error("Please enter a valid 10-15 digit WhatsApp number (e.g. +91 7289037447).");
          return;
        }
      }
      await updateProfile({
        name: fullName,
        email: profileForm.email,
        whatsapp: profileForm.whatsapp,
      }).unwrap();
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update profile.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!agent) {
    return <div className="p-6 text-center text-red-500 font-medium">Failed to load profile data. Please refresh.</div>;
  }

  const getInitials = () => {
    if (!agent?.name) return 'AT';
    return agent.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and business information</p>
      </div>

      {/* Content */}
      <div className="mt-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Profile Card */}
          <div className="col-span-1 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
                {getInitials()}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{agent.name || 'Shree Ananta Travels Admin'}</h2>
              <p className="text-sm text-gray-500 mb-4">{agent.email}</p>
              
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 mb-6">
                <Shield className="w-3.5 h-3.5" /> Verified Account
              </span>

              <div className="w-full border-t border-gray-100 pt-6 grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{agent.leadsCount !== undefined ? agent.leadsCount : 0}</span>
                  <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">Leads</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{agent.packagesCount !== undefined ? agent.packagesCount : 0}</span>
                  <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">Packages</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Settings Form & Website Link */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  <p className="text-xs text-gray-500">Update your account details</p>
                </div>
              </div>
              <form onSubmit={handleProfileSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <Input 
                      type="text" 
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-auto" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <Input 
                      type="text" 
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-auto" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <Input 
                      type="email" 
                      value={profileForm.email}
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed h-auto" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone / WhatsApp Number</label>
                    <Input 
                      type="tel" 
                      value={profileForm.whatsapp}
                      onChange={(e) => setProfileForm({...profileForm, whatsapp: e.target.value})}
                      placeholder="e.g. +91 7289037447"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-auto" 
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button 
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

