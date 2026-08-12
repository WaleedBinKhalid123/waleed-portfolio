"use client";

import { siteConfig } from "@/data/site";
import { sectionId } from "@/lib/scroll";
import { useEffect, useRef } from "react";
import type { NavItem } from "@/types/portfolio";
import { FiArrowUpRight, FiX } from "react-icons/fi";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  /** Element id of the section currently in view. */
  activeId: string | null;
  /** Focus returns here when the menu closes. */
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen navigation for small viewports.
 *
 * Behaves like a modal dialog: it locks page scroll, moves focus inside on
 * open, keeps Tab within the panel, closes on Escape, and returns focus to the
 * button that opened it.
 */
export function MobileMenu({ open, onClose, items, activeId, triggerRef }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    // Captured now so cleanup restores focus to the button that opened the
    // menu, whatever the ref points at by then.
    const trigger = triggerRef.current;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-50 flex flex-col bg-background md:hidden"
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-b px-5">
        <span className="text-sm font-medium tracking-tight">{siteConfig.name}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="-mr-2 inline-flex size-10 items-center justify-center rounded-md text-muted transition-colors hover:bg-elevated hover:text-foreground"
        >
          <FiX aria-hidden="true" className="size-5" />
        </button>
      </div>

      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-5 py-8">
        <ul className="flex flex-col">
          {items.map((item, index) => (
            <li key={item.href} className="border-b last:border-b-0">
              <a
                href={item.href}
                onClick={onClose}
                aria-current={activeId === sectionId(item.href) ? "true" : undefined}
                className="flex items-baseline gap-4 py-5 text-2xl font-medium tracking-tight transition-colors hover:text-accent"
              >
                <span className="font-mono text-xs text-subtle">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {siteConfig.resumeUrl ? (
          <a
            href={siteConfig.resumeUrl}
            onClick={onClose}
            className="mt-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            Résumé
            <FiArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        ) : null}
      </nav>

      <div className="flex shrink-0 items-center justify-between border-t px-5 py-4">
        <SocialLinks />
        <ThemeToggle />
      </div>
    </div>
  );
}
