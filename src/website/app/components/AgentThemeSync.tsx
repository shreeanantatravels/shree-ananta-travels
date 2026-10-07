"use client";
import { useEffect } from 'react';
import { useAgent } from '../context/AgentContext';
import { useTheme } from '../context/ThemeContext';

const THEME_MAP: Record<string, string> = {
  gold: 'gold',
  navy: 'navy',
  red: 'red',
  cyan: 'cyan',
  default: 'gold',
};

export default function AgentThemeSync() {
  const { agent, siteConfig } = useAgent();
  const { setThemeColor } = useTheme();

  useEffect(() => {
    if (agent?.theme) {
      const mappedTheme = THEME_MAP[agent.theme] || 'navy';
      setThemeColor(mappedTheme);
    }
  }, [agent?.theme, setThemeColor]);

  useEffect(() => {
    const rawLogo = siteConfig?.logoUrl || agent?.logo;
    let logoPath = '/favicon.png';
    if (rawLogo) {
      if (typeof rawLogo === 'string') {
        if (rawLogo.startsWith('http') || rawLogo.startsWith('data:') || rawLogo.startsWith('/')) {
          logoPath = rawLogo;
        } else {
          logoPath = `/uploads/${rawLogo}`;
        }
      }
    }

    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = logoPath;
  }, [siteConfig?.logoUrl, agent?.logo]);

  return null;
}
