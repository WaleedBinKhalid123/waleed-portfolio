"use client";

import {
  useMemo,
  useEffect,
  useContext,
  useCallback,
  createContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { DEFAULT_THEME, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

/** Fired whenever the theme class changes, so every subscriber re-renders. */
const THEME_EVENT = "portfolio:themechange";

/** Where the circular reveal should start — usually the toggle that was clicked. */
export interface ThemeTransitionOrigin {
  x: number;
  y: number;
}

interface ThemeContextValue {
  theme: Theme;
  /** False until hydration completes, when the DOM can be trusted. */
  mounted: boolean;
  setTheme: (theme: Theme, origin?: ThemeTransitionOrigin) => void;
  toggleTheme: (origin?: ThemeTransitionOrigin) => void;
}


const ThemeContext = createContext<ThemeContextValue | null>(null);

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener(THEME_EVENT, onStoreChange);
  return () => window.removeEventListener(THEME_EVENT, onStoreChange);
}

/**
 * The `<html>` class is the source of truth: `ThemeScript` sets it before the
 * first paint, so reading it back is always correct and never fights the DOM.
 */
function getThemeSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** Matches the class rendered by the server, keeping hydration consistent. */
function getServerThemeSnapshot(): Theme {
  return DEFAULT_THEME;
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  window.dispatchEvent(new Event(THEME_EVENT));
}

/**
 * Applies the theme as a circle expanding from wherever the visitor clicked.
 *
 * Everything here is an enhancement over the plain swap: without View
 * Transitions, or with reduced motion, the theme is applied directly and the
 * result is identical — only the journey differs.
 */
function applyThemeWithReveal(theme: Theme, origin?: ThemeTransitionOrigin): void {
  // Hoisted to a boolean: an inline check would narrow `document` itself.
  const supportsViewTransitions = typeof document.startViewTransition === "function";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!supportsViewTransitions || prefersReducedMotion || !origin) {
    applyTheme(theme);
    return;
  }

  const { x, y } = origin;
  // Radius needed to reach the furthest corner from the click point.
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  const transition = document.startViewTransition(() => applyTheme(theme));

  void transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
      },
      {
        duration: 480,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  });
}

/**
 * Shares theme state with every toggle on the page (header and mobile menu stay
 * in sync) without duplicating it: the DOM holds the state, and
 * `useSyncExternalStore` keeps React in step with it.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerThemeSnapshot);
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  // Follow the OS only while the visitor has not made an explicit choice.
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: light)");

    const handleChange = (event: MediaQueryListEvent) => {
      if (localStorage.getItem(THEME_STORAGE_KEY)) return;
      applyTheme(event.matches ? "light" : "dark");
    };

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const setTheme = useCallback((next: Theme, origin?: ThemeTransitionOrigin) => {
    applyThemeWithReveal(next, origin);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private browsing or blocked storage: the theme still applies for this visit.
    }
  }, []);

  const toggleTheme = useCallback(
    (origin?: ThemeTransitionOrigin) => {
      setTheme(getThemeSnapshot() === "dark" ? "light" : "dark", origin);
    },
    [setTheme],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, mounted, setTheme, toggleTheme }),
    [theme, mounted, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
