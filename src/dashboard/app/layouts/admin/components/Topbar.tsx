"use client";
import React from 'react';

import { Menu } from 'lucide-react';
import { UserDropdown } from './UserDropdown';

interface TopbarProps {
  onOpenSidebar: () => void;
}

export function Topbar({ onOpenSidebar }: TopbarProps) {

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm h-[65px]">
      <div className="px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="flex items-center justify-between w-full">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3 ml-auto">
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
