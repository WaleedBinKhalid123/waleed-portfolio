"use client";

import { useEffect, useRef } from "react";
import { observeReveal } from "@/lib/reveal";

interface CounterProps {
  value: number;
  /** Rendered immediately after the number, e.g. "+". */
  suffix?: string;
  /** Total run time in milliseconds. */
  duration?: number;
}

/** Decelerating curve — fast start, gentle settle. Never overshoots. */
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Counts up to `value` the first time it scrolls into view.
 *
 * The final number is what the server renders, so it is correct without
 * JavaScript, correct for crawlers, and correct for anyone who prefers reduced
 * motion — in that case the animation never runs and the number simply is what
 * it is. Frames are written straight to the DOM: a count-up is presentation,
 * not state, and sixty renders a second for a decorative number is waste.
 */
export function Counter({ value, suffix, duration = 1100 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let start: number | null = null;

    const run = () => {
      // Reset only once we know the animation will actually play, so the
      // rendered value is never blanked for a frame and left there.
      element.textContent = "0";

      const step = (timestamp: number) => {
        start ??= timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        element.textContent = String(Math.round(easeOutExpo(progress) * value));
        if (progress < 1) frame = requestAnimationFrame(step);
      };

      frame = requestAnimationFrame(step);
    };

    const stop = observeReveal(element, run);

    return () => {
      cancelAnimationFrame(frame);
      stop();
      // Whatever happened, leave the true value behind.
      element.textContent = String(value);
    };
  }, [value, duration]);

  return (
    <span className="tabular-nums">
      <span ref={ref}>{value}</span>
      {suffix ? <span aria-hidden="true">{suffix}</span> : null}
    </span>
  );
}
