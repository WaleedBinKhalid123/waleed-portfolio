import Link from "next/link";
import { cn, isExternalUrl } from "@/lib/utils";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap " +
  "transition-colors duration-200 active:opacity-90 disabled:pointer-events-none disabled:opacity-55";

const VARIANTS: Record<ButtonVariant, string> = {
  // Ink-on-paper rather than a coloured button: the accent stays reserved for
  // links and small markers, which keeps the page calm.
  primary: "bg-foreground text-background hover:bg-foreground/88",
  secondary: "border border-border-strong text-foreground hover:bg-elevated",
  ghost: "text-muted hover:bg-elevated hover:text-foreground",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5",
  md: "h-11 px-5",
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

type NativeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;
type NativeAnchorProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "className" | "children" | "href"
>;

export type ButtonProps =
  | (CommonProps & NativeButtonProps & { href?: never })
  | (CommonProps & NativeAnchorProps & { href: string });

/** Static assets (`/resume.pdf`) must bypass the client router. */
function isFileHref(href: string): boolean {
  return /\.[a-z0-9]{2,5}(\?|#|$)/i.test(href);
}

/**
 * One button, three visual weights, rendered as `<button>`, `<a>` or `<Link>`
 * depending on the props — so a call to action never has to be re-styled just
 * because it navigates instead of submitting.
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children, ...rest } = props;
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);

  if (typeof rest.href === "string") {
    const { href, ...anchorProps } = rest as NativeAnchorProps & { href: string };

    if (isExternalUrl(href)) {
      return (
        <a {...anchorProps} href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }

    if (isFileHref(href)) {
      return (
        <a {...anchorProps} href={href} className={classes}>
          {children}
        </a>
      );
    }

    return (
      <Link {...anchorProps} href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button {...(rest as NativeButtonProps)} className={classes}>
      {children}
    </button>
  );
}
