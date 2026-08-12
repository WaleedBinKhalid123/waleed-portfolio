"use client";

import {
  FiSun,
  FiMoon,
  FiMail,
  FiSearch,
  FiDownload,
  FiArrowRight,
  FiCornerDownLeft,
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import type { IconType } from "react-icons";
import { sections, siteConfig } from "@/data/site";
import { useTheme } from "@/components/theme/ThemeProvider";
import { findAnchorTarget, scrollToElement } from "@/lib/scroll";
import { socialIcons, socialLabels } from "@/components/ui/icons";
import type { SocialLinks as SocialLinksMap } from "@/types/portfolio";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/** Any control can open the menu by dispatching this on `window`. */
export const OPEN_COMMAND_MENU_EVENT = "portfolio:open-command-menu";

interface Command {
  id: string;
  label: string;
  group: "Navigate" | "Links" | "Preferences";
  icon: IconType;
  /** Extra words matched by the search box but not displayed. */
  keywords?: string;
  run: () => void;
}

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const { theme, mounted, toggleTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setOpen(false), []);

  const commands = useMemo<Command[]>(() => {
    const goTo = (href: string) => () => {
      close();
      const target = findAnchorTarget(href);
      if (target) scrollToElement(target);
    };

    const openUrl = (url: string) => () => {
      close();
      window.open(url, "_blank", "noopener,noreferrer");
    };

    // Every section, including the ones the header leaves out.
    const list: Command[] = sections.map((item) => ({
      id: `nav-${item.href}`,
      label: item.label,
      group: "Navigate",
      icon: FiArrowRight,
      keywords: "section jump scroll",
      run: goTo(item.href),
    }));

    list.push({
      id: "link-email",
      label: `Email ${siteConfig.email}`,
      group: "Links",
      icon: FiMail,
      keywords: "contact write message",
      run: () => {
        close();
        window.location.assign(`mailto:${siteConfig.email}`);
      },
    });

    // Derived from siteConfig, so a new network needs no change here.
    for (const key of Object.keys(siteConfig.socialLinks) as Array<keyof SocialLinksMap>) {
      const href = siteConfig.socialLinks[key];
      if (!href) continue;

      list.push({
        id: `link-${key}`,
        label: `Open ${socialLabels[key]} profile`,
        group: "Links",
        icon: socialIcons[key],
        keywords: "profile external",
        run: openUrl(href),
      });
    }

    if (siteConfig.resumeUrl) {
      list.push({
        id: "link-resume",
        label: "Download résumé",
        group: "Links",
        icon: FiDownload,
        keywords: "cv pdf",
        run: openUrl(siteConfig.resumeUrl),
      });
    }

    list.push({
      id: "pref-theme",
      label: mounted
        ? `Switch to ${theme === "dark" ? "light" : "dark"} theme`
        : "Switch theme",
      group: "Preferences",
      icon: mounted && theme === "dark" ? FiSun : FiMoon,
      keywords: "dark light appearance colour color",
      run: () => {
        toggleTheme();
        close();
      },
    });

    return list;
  }, [close, mounted, theme, toggleTheme]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return commands;
    return commands.filter((command) =>
      `${command.label} ${command.group} ${command.keywords ?? ""}`.toLowerCase().includes(term),
    );
  }, [commands, query]);

  // Group headings are derived from the filtered results, so an empty group
  // never leaves a stray label behind.
  const groups = useMemo(() => {
    const order: Command["group"][] = ["Navigate", "Links", "Preferences"];
    return order
      .map((group) => ({ group, items: results.filter((command) => command.group === group) }))
      .filter((entry) => entry.items.length > 0);
  }, [results]);

  // Open on ⌘K / Ctrl+K from anywhere, and on request from the navbar button.
  // Opening resets the query here, at the event, rather than in an effect
  // reacting to `open` — one state update instead of a second render pass.
  useEffect(() => {
    const prepare = () => {
      openerRef.current = document.activeElement as HTMLElement | null;
      setQuery("");
      setActiveIndex(0);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key?.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        prepare();
        setOpen((previous) => !previous);
      }
    };

    const onOpenRequest = () => {
      prepare();
      setOpen(true);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_COMMAND_MENU_EVENT, onOpenRequest);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_COMMAND_MENU_EVENT, onOpenRequest);
    };
  }, []);

  // Lock the page while the dialog is up; restore focus on the way out.
  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 0);
    const opener = openerRef.current;

    return () => {
      window.clearTimeout(focusTimer);
      body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  const flatResults = groups.flatMap((entry) => entry.items);
  // Derived, not stored: as the result set shrinks under a longer query the
  // highlight simply clamps, with no extra render to correct itself.
  const highlighted = Math.min(activeIndex, Math.max(flatResults.length - 1, 0));

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (flatResults.length === 0) return;
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((highlighted + direction + flatResults.length) % flatResults.length);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      flatResults[highlighted]?.run();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh] sm:p-6 sm:pt-[15vh]">
      <button
        type="button"
        aria-label="Close command menu"
        onClick={close}
        className="animate-overlay-in absolute inset-0 cursor-default bg-background/70 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        onKeyDown={onKeyDown}
        className="animate-panel-in card relative flex max-h-[70vh] w-full max-w-lg flex-col overflow-hidden rounded-xl shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b px-4">
          <FiSearch aria-hidden="true" className="size-4 shrink-0 text-subtle" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Jump to a section, open a link…"
            aria-label="Search commands"
            aria-controls="command-results"
            autoComplete="off"
            spellCheck={false}
            className="h-12 w-full bg-transparent text-[0.9375rem] text-foreground placeholder:text-subtle focus:outline-none"
          />
          <kbd className="hidden shrink-0 rounded border px-1.5 py-0.5 font-mono text-[0.625rem] text-subtle sm:block">
            ESC
          </kbd>
        </div>

        <ul id="command-results" className="flex-1 overflow-y-auto p-2">
          {groups.map((entry) => (
            <li key={entry.group}>
              <p className="eyebrow px-3 pt-3 pb-2">{entry.group}</p>
              <ul>
                {entry.items.map((command) => {
                  const index = flatResults.indexOf(command);
                  const isActive = index === highlighted;
                  const Icon = command.icon;

                  return (
                    <li key={command.id}>
                      <button
                        type="button"
                        onClick={command.run}
                        onMouseMove={() => setActiveIndex(index)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                          isActive ? "bg-elevated text-foreground" : "text-muted",
                        )}
                      >
                        <Icon
                          aria-hidden="true"
                          className={cn("size-4 shrink-0", isActive ? "text-accent" : "text-subtle")}
                        />
                        <span className="min-w-0 flex-1 truncate">{command.label}</span>
                        {isActive ? (
                          <FiCornerDownLeft aria-hidden="true" className="size-3.5 text-subtle" />
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}

          {flatResults.length === 0 ? (
            <li className="px-3 py-8 text-center text-sm text-muted">No matching commands.</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
