"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ScrollRestorationManager() {
  const pathname = usePathname();
  const userInteractedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Prevent default browser premature reset to (0, 0) during hydration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const storageKey = `sat_scroll_${pathname}`;
    userInteractedRef.current = false;

    // Save scroll position periodically as user scrolls
    let scrollDebounce: NodeJS.Timeout | null = null;
    const onScroll = () => {
      userInteractedRef.current = true;
      if (scrollDebounce) clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(() => {
        try {
          sessionStorage.setItem(storageKey, window.scrollY.toString());
        } catch {}
      }, 80);
    };

    // Save synchronously right before unload / reload
    const onBeforeUnload = () => {
      try {
        sessionStorage.setItem(storageKey, window.scrollY.toString());
      } catch {}
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("beforeunload", onBeforeUnload);

    // Stop programmatic scroll restoration if user manually interacts
    const onUserGesture = () => {
      userInteractedRef.current = true;
    };

    window.addEventListener("wheel", onUserGesture, { passive: true });
    window.addEventListener("touchmove", onUserGesture, { passive: true });
    window.addEventListener("pointerdown", onUserGesture, { passive: true });
    window.addEventListener("keydown", onUserGesture, { passive: true });

    // Restore scroll position for this route if available
    let savedScrollY = 0;
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        savedScrollY = parseInt(stored, 10);
      }
    } catch {}

    const timers: NodeJS.Timeout[] = [];

    if (savedScrollY > 0) {
      userInteractedRef.current = false;

      const attemptScroll = () => {
        if (userInteractedRef.current) return;
        window.scrollTo({
          top: savedScrollY,
          behavior: "instant",
        });
      };

      // Immediate attempt
      attemptScroll();

      // Subsequent attempts as Next.js hydration, images, and fonts load
      requestAnimationFrame(attemptScroll);
      [40, 100, 200, 350, 600, 1000].forEach((delay) => {
        timers.push(setTimeout(attemptScroll, delay));
      });
    }

    return () => {
      if (scrollDebounce) clearTimeout(scrollDebounce);
      timers.forEach((t) => clearTimeout(t));
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("wheel", onUserGesture);
      window.removeEventListener("touchmove", onUserGesture);
      window.removeEventListener("pointerdown", onUserGesture);
      window.removeEventListener("keydown", onUserGesture);
    };
  }, [pathname]);

  return null;
}
