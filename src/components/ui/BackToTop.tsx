"use client";

import { cn } from "@/lib/utils";
import { FiArrowUp } from "react-icons/fi";
import { useEffect, useState } from "react";

/** Roughly one viewport of scrolling before the control is useful. */
const REVEAL_OFFSET = 600;

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > REVEAL_OFFSET);

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });

    // Move focus back to the top of the document so keyboard users continue
    // from where the page now is, not where the button was.
    document.getElementById("main-content")?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      // Hidden from the tab order while off-screen, so it is never a focus trap
      // for keyboard users at the top of the page.
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        "fixed right-4 bottom-4 z-40 inline-flex size-10 items-center justify-center rounded-full sm:right-6 sm:bottom-6",
        "border border-border-strong bg-surface/90 text-muted backdrop-blur-sm",
        "transition-[opacity,transform,color] duration-300",
        "hover:text-foreground",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
      )}
    >
      <FiArrowUp aria-hidden="true" className="size-4" />
    </button>
  );
}
