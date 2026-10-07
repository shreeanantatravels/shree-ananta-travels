"use client";

export type LayoutVariant =
  | "centered"
  | "left-aligned"
  | "split"
  | "royal-gold";

export interface ThemeConfig {
  id: string;
  name: string;
  layoutVariant: LayoutVariant;
  colors: {
    primary: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    gradient: string;
  };
  swatchGradient: string;
  heroImages: string[];
  heroOverlayClass: string;
  footerBgClass: string;
  footerAccentClass: string;
  trustBgClass: string;
}

const THEMES: Record<string, ThemeConfig> = {
  gold: {
    id: "gold",
    name: "Royal Gold",
    layoutVariant: "royal-gold",
    colors: {
      primary: "#d4af37",
      primaryDark: "#b8860b",
      secondary: "#f59e0b",
      accent: "#e5c158",
      gradient:
        "linear-gradient(135deg, #d4af37 0%, #b8860b 50%, #996515 100%)",
    },
    swatchGradient: "from-amber-400 via-amber-500 to-yellow-600",
    heroImages: [],
    heroOverlayClass:
      "bg-gradient-to-r from-amber-950/90 via-amber-900/75 to-yellow-900/85",
    footerBgClass: "bg-gradient-to-b from-amber-950 via-gray-900 to-black",
    footerAccentClass: "hover:text-amber-400",
    trustBgClass:
      "bg-gradient-to-b from-amber-50/40 via-yellow-50/30 to-white dark:from-amber-950 dark:via-gray-900/20 dark:to-gray-950",
  },
};

export function getThemeConfig(id: string): ThemeConfig {
  return THEMES.gold;
}

export function getAllThemes(): ThemeConfig[] {
  return Object.values(THEMES);
}

export function getThemeIds(): string[] {
  return Object.keys(THEMES);
}

export default THEMES;
