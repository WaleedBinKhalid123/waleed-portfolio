"use client";

import { cn } from "@/lib/utils";
import { FiCheck, FiCopy } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";

interface CopyButtonProps {
  /** The text placed on the clipboard. */
  value: string;
  /** Accessible name, e.g. "Copy email address". */
  label: string;
  className?: string;
}

/**
 * Copies a value and says so.
 *
 * Small thing, real saving: most people reading a portfolio want the email
 * address in their own client, not a `mailto:` link that hijacks whatever the
 * OS thinks the default mail app is. Confirmation is announced politely, and
 * the button falls back to doing nothing visible if the clipboard is blocked
 * rather than pretending it worked.
 */
export function CopyButton({ value, label, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard denied (insecure origin, permissions): the address is still
      // on screen to select manually, so there is nothing useful to report.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs text-muted",
        "transition-colors duration-200 hover:border-border-strong hover:text-foreground",
        className,
      )}
    >
      {copied ? (
        <FiCheck aria-hidden="true" className="size-3.5 text-accent" />
      ) : (
        <FiCopy aria-hidden="true" className="size-3.5" />
      )}
      <span aria-hidden="true">{copied ? "Copied" : "Copy"}</span>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? `${label}: copied` : ""}
      </span>
    </button>
  );
}
