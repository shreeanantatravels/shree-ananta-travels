"use client";
import { useState, useEffect } from 'react';
import { Palette, Check, Loader2, ExternalLink } from 'lucide-react';
import { useGetMeQuery, useUpdateProfileMutation } from '../api/authApi';
import { toast } from 'sonner';

interface PredefinedTheme {
  id: string;
  name: string;
  description: string;
  colorPrimary: string;
  colorSecondary: string;
}

const PREDEFINED_THEMES: PredefinedTheme[] = [
  {
    id: 'gold',
    name: 'Royal Gold',
    description: 'Luxury Royal Navy & Metallic Gold',
    colorPrimary: '#0f2b5c',
    colorSecondary: '#d4af37',
  },
];

export function ThemeManagement() {
  const { data } = useGetMeQuery();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const agent = data?.agent;
  const [activeTheme, setActiveTheme] = useState<string>('gold');

  // Hydrate from DB on load
  useEffect(() => {
    if (agent?.theme) setActiveTheme('gold');
  }, [agent?.theme]);

  const handleThemeSelect = async (themeId: string) => {
    if (themeId === activeTheme) return; // no change
    setActiveTheme(themeId); // optimistic update

    try {
      await updateProfile({ theme: themeId }).unwrap();
      toast.success(`Theme updated to "${PREDEFINED_THEMES.find(t => t.id === themeId)?.name}"!`);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save theme.');
      setActiveTheme('gold');
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Website Theme</h2>
            <p className="text-sm text-gray-600 mt-1">Primary aesthetic for your travel website</p>
          </div>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Preview site
        </a>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PREDEFINED_THEMES.map((theme) => {
            const isActive = activeTheme === theme.id;
            
            return (
              <div 
                key={theme.id}
                className={`relative rounded-xl border-2 transition-all duration-300 overflow-hidden cursor-pointer ${
                  isActive ? 'border-blue-500 shadow-md ring-4 ring-blue-500/10' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => handleThemeSelect(theme.id)}
              >
                {/* Theme Preview Header */}
                <div 
                  className="h-24 p-4 flex items-end"
                  style={{ background: `linear-gradient(135deg, ${theme.colorPrimary}, ${theme.colorSecondary})` }}
                >
                  <p className="font-bold text-white text-lg drop-shadow-md">{theme.name}</p>
                </div>
                
                {/* Content & Toggle */}
                <div className="p-4 bg-white flex flex-col justify-between items-start gap-4 h-[100px]">
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">{theme.description}</p>
                  
                  <div className="flex items-center justify-between w-full mt-auto">
                    <span className={`text-sm font-semibold flex items-center gap-1.5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {isActive && <Check className="w-3.5 h-3.5" />}
                      {isActive ? (isLoading ? 'Saving...' : 'Active Theme') : 'Set Active'}
                    </span>
                    
                    {/* iOS style toggle */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleThemeSelect(theme.id); }}
                      disabled={isLoading}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 ${
                        isActive ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                      role="switch"
                      aria-checked={isActive}
                    >
                      <span className="sr-only">Make Active</span>
                      {isActive && isLoading ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin absolute left-1 top-0.5" />
                      ) : (
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isActive ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

