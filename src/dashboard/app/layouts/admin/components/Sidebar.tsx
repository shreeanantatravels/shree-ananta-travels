"use client";
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import Link from 'next/link';

import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {
  LayoutDashboard,
  Palette,
  Package,
  Users,
  Image,
  FileText,
  Star,
  X,
  User,
  Plane,
  ArrowLeft,
  Globe,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

const globalNavItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Package Catalog', href: '/admin/packages', icon: Package },
  { name: 'Leads & Enquiries', href: '/admin/leads', icon: Users },
];

const contextData: Record<string, { title: string, description: string, items: { name: string, href: string, icon: any }[] }> = {
  'website': {
    title: 'Website Management',
    description: 'Branding, content, FAQs & testimonials',
    items: [
      { name: 'Branding & Theme', href: '/admin/branding', icon: Palette },
      { name: 'Content Setup', href: '/admin/content', icon: FileText },
      { name: 'FAQs Management', href: '/admin/faqs', icon: HelpCircle },
      { name: 'Testimonials', href: '/admin/testimonials', icon: Star },
    ]
  }
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeContext: 'website' | null;
  setActiveContext: (context: 'website' | null) => void;
}

export function Sidebar({ isOpen, onClose, activeContext, setActiveContext }: SidebarProps) {
  const pathname = usePathname() || '';
  const router = useRouter();

  const handleBackToMain = () => {
    setActiveContext(null);
    router.push('/admin/dashboard');
  };

  const handleSelectContext = (contextKey: 'website', defaultHref: string) => {
    setActiveContext(contextKey);
    router.push(defaultHref);
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed inset-y-0 left-0 z-50 w-60 
        lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 
        bg-white/90 backdrop-blur-xl border-r border-gray-200/60 flex flex-col shrink-0 
        transform transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
      `}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo */}
          <div className="flex items-center justify-between px-4 border-b border-gray-200/50 h-[65px] flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Plane className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900 tracking-tight font-sans">
                  Shree Ananta Travels
                </h2>
                <p className="text-[10px] text-gray-500 font-medium">Admin Portal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav Content */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {/* If inside a specific context (Website Management) */}
            {activeContext && contextData[activeContext] ? (
              <div className="space-y-4">
                <button
                  onClick={handleBackToMain}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all w-full text-left border border-gray-200/60"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Main Menu</span>
                </button>

                <div>
                  <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    {contextData[activeContext].title}
                  </p>
                  <div className="space-y-1">
                    {contextData[activeContext].items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={onClose}
                          className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all
                            ${isActive 
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold' 
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }
                          `}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* Global Main Menu + Context Cards */
              <div className="space-y-6">
                <div>
                  <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Main Menu
                  </p>
                  <div className="space-y-1">
                    {globalNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={onClose}
                          className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all
                            ${isActive 
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold' 
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }
                          `}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Context Switcher Cards */}
                <div className="pt-2 border-t border-gray-100 space-y-2.5">
                  <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Management Options
                  </p>
                  
                  {/* Website Management Button */}
                  <button
                    onClick={() => handleSelectContext('website', '/admin/branding')}
                    className="w-full text-left p-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200/60 rounded-xl transition-all group relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-blue-900 flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-blue-600" />
                        Website Management
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[10px] text-blue-700/80 leading-tight">Branding, content & testimonials</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

