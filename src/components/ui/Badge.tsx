import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  /** `solid` sits on a surface panel; `outline` sits directly on the page. */
  variant?: "solid" | "outline";
  className?: string;
}

/** Small, low-contrast tag used for technologies and metadata. */
export function Badge({ children, variant = "solid", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs leading-none text-muted",
        variant === "solid" ? "bg-elevated" : "border",
        className,
      )}
    >
      {children}
    </span>
  );
}
