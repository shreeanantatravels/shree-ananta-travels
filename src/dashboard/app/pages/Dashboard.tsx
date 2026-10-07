"use client";
import React from 'react';
import Link from 'next/link';

import {
  Users,
  MessageSquare,
  TrendingUp,
  Package,
  ArrowUpRight,
  Globe,
  ExternalLink,
  Loader2,
} from 'lucide-react';

import { useGetLeadsQuery } from '../api/leadsApi';
import { useGetPackagesQuery } from '../api/packageApi';

export function Dashboard() {
  const { data: leadsRes, isLoading: leadsLoading } = useGetLeadsQuery();
  const { data: pkgsRes, isLoading: pkgsLoading } = useGetPackagesQuery();

  const leads = leadsRes?.data || [];
  const packages = pkgsRes?.data || [];

  // Stats computed from real data
  const totalLeads = leads.length;
  const contactedLeads = leads.filter((l: any) => l.status === 'contacted' || l.status === 'quoted').length;
  const recentLeads = [...leads]
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Top packages by lead count
  const leadsByPackage: Record<string, number> = {};
  leads.forEach((l: any) => {
    if (l.packageName) {
      leadsByPackage[l.packageName] = (leadsByPackage[l.packageName] || 0) + 1;
    }
  });
  const topPackages = packages
    .slice(0, 3)
    .map((pkg: any) => ({
      name: pkg.title,
      enquiries: leadsByPackage[pkg.title] || 0,
      price: `₹${(pkg.discountedPrice || pkg.originalPrice || 0).toLocaleString('en-IN')}`,
    }));

  const isLoading = leadsLoading || pkgsLoading;

  const stats = [
    {
      name: 'Total Leads',
      value: isLoading ? '—' : String(totalLeads),
      change: totalLeads > 0 ? `${totalLeads} enquiries` : 'No leads yet',
      icon: Users,
      color: 'blue',
    },
    {
      name: 'Contacted',
      value: isLoading ? '—' : String(contactedLeads),
      change: 'In progress',
      icon: MessageSquare,
      color: 'orange',
    },
    {
      name: 'Active Packages',
      value: isLoading ? '—' : String(packages.filter((p: any) => p.isActive).length),
      change: `${packages.length} total`,
      icon: Package,
      color: 'green',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Website Status Banner */}
      <div className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 border border-blue-500/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/30">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Your Website is Live!</h3>
            <p className="text-xs text-gray-600 mt-0.5">Share this link with your customers to start getting leads.</p>
          </div>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition-all shrink-0"
        >
          <span>Visit Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          const gradients: Record<string, string> = {
            green: 'from-emerald-500 to-teal-600',
            blue: 'from-blue-500 to-indigo-600',
            orange: 'from-amber-500 to-orange-600',
          };
          const shadows: Record<string, string> = {
            green: 'shadow-emerald-500/30',
            blue: 'shadow-blue-500/30',
            orange: 'shadow-orange-500/30',
          };

          return (
            <div
              key={stat.name}
              className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4 shadow-sm transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradients[stat.color]} flex items-center justify-center shadow-md ${shadows[stat.color]}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.change}
                </div>
              </div>
              <div>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400 mb-0.5" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</p>
                )}
                <p className="text-xs text-gray-600">{stat.name}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Packages */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-200">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Your Packages</h2>
              <Link href="/admin/packages" className="text-xs text-blue-600 font-medium hover:underline">
                View All
              </Link>
            </div>
          </div>
          <div className="p-4">
            {pkgsLoading ? (
              <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
            ) : topPackages.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No packages yet. <Link href="/admin/packages" className="text-blue-600 underline">Add your first package</Link>.</p>
            ) : (
              <div className="space-y-3">
                {topPackages.map((pkg, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50/60 transition-all duration-200 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/30">
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{pkg.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-600">{pkg.enquiries} enquiries</span>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{pkg.price}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-200">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Recent Enquiries</h2>
              <Link href="/admin/leads" className="text-xs text-blue-600 font-medium hover:underline">
                View All
              </Link>
            </div>
          </div>
          <div className="p-4">
            {leadsLoading ? (
              <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
            ) : recentLeads.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No enquiries yet. Share your website to get leads!</p>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((enquiry: any, index: number) => {
                  const initials = (enquiry.name || 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
                  const when = enquiry.createdAt
                    ? new Date(enquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                    : '—';
                  return (
                    <div key={enquiry._id || index} className="flex items-center gap-3 p-4 rounded-xl hover:bg-green-50/60 transition-all duration-200 group">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 group-hover:text-green-600 transition-colors truncate">{enquiry.name}</p>
                        <p className="text-sm text-gray-600 truncate">
                          {enquiry.toLocation || '—'}{enquiry.adults ? ` • ${enquiry.adults} travelers` : ''}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold mb-1 ${
                          enquiry.status === 'new' || !enquiry.status
                            ? 'bg-green-100 text-green-700 ring-1 ring-green-600/20'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {(!enquiry.status || enquiry.status === 'new') ? 'New' : enquiry.status}
                        </span>
                        <p className="text-xs text-gray-500">{when}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
