"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Complete the progress bar when the route actually changes
  useEffect(() => {
    if (isNavigating) {
      setProgress(100);
      const timer = setTimeout(() => {
        setOpacity(0);
        const hideTimer = setTimeout(() => {
          setIsNavigating(false);
          setProgress(0);
          setOpacity(1);
        }, 200);
        return () => clearTimeout(hideTimer);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept clicks on internal links to give 0ms instant feedback
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const target = (e.target as HTMLElement)?.closest?.("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore external links, downloads, new tabs, and hashes
      if (
        target.target === "_blank" ||
        target.hasAttribute("download") ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        href === window.location.pathname
      ) {
        return;
      }

      // Ignore if user is holding ctrl/cmd/shift/meta key
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }

      // Start instant loading bar
      setIsNavigating(true);
      setOpacity(1);
      setProgress(25);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Trickle progress
      setTimeout(() => {
        setProgress((prev) => (prev < 70 ? 70 : prev));
      }, 120);

      // Safety fallback: auto-complete after 4 seconds if navigation was aborted
      timeoutRef.current = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 4000);
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!isNavigating && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        zIndex: 999999,
        pointerEvents: "none",
        opacity,
        transition: "opacity 200ms ease-out",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, var(--theme-primary, #f59e0b), #fbbf24, #f59e0b)",
          boxShadow: "0 0 10px rgba(245, 158, 11, 0.7), 0 0 5px rgba(251, 191, 36, 0.5)",
          transition: progress === 100 ? "width 150ms ease-out" : "width 400ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
}
