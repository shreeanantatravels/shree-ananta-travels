"use client";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { CRMProvider } from '../context/CRMContext';
import { SettingsModal } from '../components/SettingsModal';
import { Footer } from '../components/Footer';
import { Sidebar } from './admin/components/Sidebar';
import { Topbar } from './admin/components/Topbar';
import { useGetMeQuery } from '../api/authApi';

const websiteItems = ['/branding', '/content', '/testimonials', '/faqs', '/blogs'];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const isLoginPage = pathname.includes('/login');

  const [activeContext, setActiveContext] = useState<'website' | null>(() => {
    if (websiteItems.some(path => pathname.includes(path))) return 'website';
    return null;
  });

  useEffect(() => {
    if (websiteItems.some(path => pathname.includes(path))) {
      setActiveContext('website');
    } else {
      setActiveContext(null);
    }
  }, [pathname]);

  const { data } = useGetMeQuery(undefined, { skip: isLoginPage });
  const agent = data?.agent;

  useEffect(() => {
    if (isLoginPage) return;
    const handleScroll = () => {
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 60;
      setIsAtBottom(scrolledToBottom);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoginPage]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <CRMProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900 selection:bg-blue-200">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          activeContext={activeContext}
          setActiveContext={setActiveContext}
        />
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 transition-all duration-300 relative">
          <Topbar 
            onOpenSidebar={() => setSidebarOpen(true)} 
          />
          
          <main className="flex-1 overflow-y-auto relative scroll-smooth bg-gray-50" id="main-scroll-container">
            <div className="max-w-[1600px] mx-auto w-full p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-24">
              {children}
            </div>
            
            <Footer />
          </main>
        </div>
        
        <SettingsModal 
          isOpen={settingsOpen} 
          onClose={() => setSettingsOpen(false)} 
        />
      </div>
    </CRMProvider>
  );
}

