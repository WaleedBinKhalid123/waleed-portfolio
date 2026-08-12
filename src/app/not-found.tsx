import Link from "next/link";
import type { Metadata } from "next";
import { sections, siteConfig } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { FiArrowLeft, FiArrowUpRight } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/**
 * Not found.
 *
 * Reached most often by a stale link or a résumé that has not been added yet,
 * so it does two things: says plainly what happened, and offers the routes
 * someone was probably looking for — rather than dead-ending them under a
 * header whose links all point at a page they are not on.
 */
export default function NotFound() {
  const destinations = sections.filter((section) => section.href !== "/#top");

  return (
    <Container className="flex min-h-[70vh] flex-col justify-center py-20">
      <div className="max-w-xl">
        <p className="eyebrow">Error 404</p>

        <h1 className="mt-6 font-display text-[2rem] leading-[1.1] font-medium tracking-[-0.035em] text-balance sm:text-[2.75rem]">
          That page doesn&rsquo;t exist.
        </h1>

        <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted sm:text-base">
          The link may be out of date, or the file may not have been added yet. Everything on this
          site lives on one page — here is the way back.
        </p>

        <div className="mt-9">
          <Link
            href="/"
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-colors duration-200 hover:bg-foreground/88"
          >
            <FiArrowLeft
              aria-hidden="true"
              className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Back to the portfolio
          </Link>
        </div>

        <nav aria-label="Sections" className="mt-12 border-t pt-6">
          <h2 className="eyebrow">Or jump straight to</h2>

          <ul className="mt-4 grid gap-x-8 gap-y-1 sm:grid-cols-2">
            {destinations.map((section) => (
              <li key={section.href}>
                <Link
                  href={section.href}
                  className="group inline-flex items-center gap-1.5 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
                >
                  {section.label}
                  <FiArrowUpRight aria-hidden="true" className="arrow-ne size-3.5 text-subtle" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-10 text-xs text-subtle">
          Still stuck? Email{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            {siteConfig.email}
          </a>
          .
        </p>
      </div>
    </Container>
  );
}
