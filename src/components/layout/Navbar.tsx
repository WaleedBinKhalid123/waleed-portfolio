"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { sectionId } from "@/lib/scroll";
import { FiMenu, FiSearch } from "react-icons/fi";
import { navItems, siteConfig } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useCallback, useEffect, useRef, useState } from "react";
import { OPEN_COMMAND_MENU_EVENT } from "@/components/ui/CommandMenu";

/**
 * Highlights the section currently occupying the middle of the viewport.
 * The band is deliberately narrow so exactly one item is ever marked.
 */
function useActiveSection(hrefs: string[]): string | null {
  // Hrefs are route-safe (`/#about`); the observer needs the bare element id.
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = hrefs
      .map((href) => document.getElementById(sectionId(href)))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0 || typeof IntersectionObserver === "undefined") return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }

        // Preserve document order rather than intersection order.
        const current = sections.find((section) => visible.has(section.id));
        setActive(current ? current.id : null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [hrefs]);

  return active;
}

const NAV_HREFS = navItems.map((item) => item.href);

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const activeId = useActiveSection(NAV_HREFS);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openCommandMenu = () => window.dispatchEvent(new Event(OPEN_COMMAND_MENU_EVENT));

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-300",
        scrolled ? "border-b bg-background/85 backdrop-blur-md" : "border-b border-transparent",
      )}
    >
      <Container size="wide">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/#top"
            className="flex min-w-0 items-baseline gap-2.5 py-2 text-sm font-medium tracking-tight"
          >
            <span className="truncate">{siteConfig.name}</span>
            <span
              aria-hidden="true"
              className="hidden truncate font-mono text-xs font-normal text-subtle lg:inline"
            >
              / {siteConfig.title}
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = activeId === sectionId(item.href);

                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative block rounded-md px-3 py-2 text-sm transition-colors duration-200",
                        isActive ? "text-foreground" : "text-muted hover:text-foreground",
                      )}
                    >
                      {item.label}
                      {/*
                        Underline for the section in view. It scales from the
                        centre rather than appearing, so moving between items
                        reads as one continuous indicator.
                      */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-3 bottom-1 h-px origin-center bg-accent",
                          "transition-transform duration-300 ease-out",
                          isActive ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            {/*
              Visible entry point for the command menu — a keyboard shortcut
              nobody can discover is not a feature.
            */}
            <button
              type="button"
              onClick={openCommandMenu}
              aria-label="Open command menu"
              className="hidden items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-xs text-subtle transition-colors duration-200 hover:border-border-strong hover:text-foreground lg:inline-flex"
            >
              <FiSearch aria-hidden="true" className="size-3.5" />
              <span>Search</span>
              <kbd className="font-mono text-[0.625rem] tracking-wider">⌘K</kbd>
            </button>

            <SocialLinks className="ml-1 hidden sm:flex" />

            {siteConfig.resumeUrl ? (
              <a
                href={siteConfig.resumeUrl}
                className="ml-1 hidden rounded-md border border-border-strong px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:bg-elevated lg:inline-flex"
              >
                Résumé
              </a>
            ) : null}

            <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-border sm:block" />

            <ThemeToggle />

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="-mr-2 inline-flex size-10 items-center justify-center rounded-md text-muted transition-colors hover:bg-elevated hover:text-foreground md:hidden"
            >
              <FiMenu aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>
      </Container>

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        items={navItems}
        activeId={activeId}
        triggerRef={menuButtonRef}
      />
    </header>
  );
}
