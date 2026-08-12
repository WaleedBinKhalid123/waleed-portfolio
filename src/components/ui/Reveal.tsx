"use client";

import { cn } from "@/lib/utils";
import { observeReveal } from "@/lib/reveal";
import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Stagger in milliseconds, for items revealed as a group. */
  delay?: number;
  /** Travel distance in pixels. `0` fades without movement. */
  distance?: number;
  /** Render as `li` inside a list, so semantics survive. */
  as?: ElementType;
  className?: string;
}

/**
 * A one-shot fade-and-rise as an element enters the viewport.
 *
 * The visible state is written straight to the DOM by a shared observer rather
 * than held in React state — nothing else depends on it, so a render pass per
 * element scrolled into view would be pure waste. The transition lives in CSS
 * and is disabled under `prefers-reduced-motion`; a `<noscript>` rule in the
 * layout reveals everything when JavaScript is unavailable.
 */
export function Reveal({
  children,
  delay = 0,
  distance,
  as: Tag = "div",
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    return observeReveal(element);
  }, []);

  // Custom properties feed the CSS transition; React types them as `unknown`
  // keys, hence the single cast at the boundary rather than `any` on the value.
  const style = {
    ...(delay ? { "--reveal-delay": `${delay}ms` } : null),
    ...(distance !== undefined ? { "--reveal-y": `${distance}px` } : null),
  } as CSSProperties;

  return (
    <Tag
      ref={ref}
      data-visible="false"
      style={Object.keys(style).length > 0 ? style : undefined}
      className={cn("reveal", className)}
    >
      {children}
    </Tag>
  );
}
