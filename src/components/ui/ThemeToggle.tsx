"use client";

import { cn } from "@/lib/utils";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "@/components/theme/ThemeProvider";

interface ThemeToggleProps {
  className?: string;
}

/**
 * The two icons are stacked and cross-faded rather than swapped, so switching
 * theme reads as one continuous motion instead of a flicker.
 *
 * Neither is rendered until the DOM has been read: the server has no way to
 * know which theme the visitor stored. The button keeps its size either way, so
 * nothing shifts when they appear.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, mounted, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const label = mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Switch theme";

  return (
    <button
      type="button"
      // The click point seeds the circular reveal; a keyboard activation
      // reports 0,0, in which case the centre of the button is used instead.
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const fromKeyboard = event.clientX === 0 && event.clientY === 0;
        toggleTheme({
          x: fromKeyboard ? rect.left + rect.width / 2 : event.clientX,
          y: fromKeyboard ? rect.top + rect.height / 2 : event.clientY,
        });
      }}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md text-muted",
        "transition-colors duration-200 hover:bg-elevated hover:text-foreground",
        className,
      )}
    >
      <span className="relative block size-[1.05rem]">
        {mounted ? (
          <>
            <FiSun
              aria-hidden="true"
              className={cn(
                "absolute inset-0 size-[1.05rem] transition-all duration-300 ease-out",
                isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0",
              )}
            />
            <FiMoon
              aria-hidden="true"
              className={cn(
                "absolute inset-0 size-[1.05rem] transition-all duration-300 ease-out",
                isDark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100",
              )}
            />
          </>
        ) : null}
      </span>
    </button>
  );
}
