import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** `wide` is used by the header, which sits closer to the viewport edges. */
  size?: "default" | "wide";
}

/**
 * The single source of horizontal rhythm. Every section uses it, so the page
 * keeps one measure at every breakpoint — including very wide displays, where
 * the content stops growing rather than stretching into an unreadable line.
 */
export function Container({ children, className, size = "default" }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        size === "wide" ? "max-w-352" : "max-w-6xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
