"use client";

import { useEffect, useRef } from "react";

/**
 * A one-pixel reading indicator across the top of the page.
 *
 * Long-form pages benefit from a sense of position, and this is the cheapest
 * honest way to give it: one passive scroll listener, coalesced into a single
 * animation frame, writing one CSS custom property. No re-renders, no layout
 * reads beyond the two the browser already caches.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const root = document.documentElement;
      const scrollable = root.scrollHeight - root.clientHeight;
      const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
      ref.current?.style.setProperty("--scroll-progress", String(progress));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-50 h-px print:hidden">
      <div
        ref={ref}
        className="h-full origin-left bg-accent/70"
        style={{ transform: "scaleX(var(--scroll-progress, 0))" }}
      />
    </div>
  );
}
