import Link from "next/link";
import { FiArrowUp } from "react-icons/fi";
import { navItems, siteConfig } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t py-12 sm:py-14">
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <p className="text-sm font-medium tracking-tight">{siteConfig.name}</p>
            <p className="mt-2 text-sm text-muted">{siteConfig.title}</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-3 inline-block py-1 text-sm text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              {siteConfig.email}
            </a>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
            <nav aria-label="Footer">
              <h2 className="eyebrow">Navigate</h2>
              <ul className="mt-3 flex flex-col gap-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="inline-block py-1 text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="eyebrow">Elsewhere</h2>
              <SocialLinks variant="labelled" className="mt-3 flex-col items-start! gap-1" />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t pt-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>

          <Link
            href="/#top"
            className="inline-flex items-center gap-1.5 self-start py-1.5 transition-colors hover:text-foreground"
          >
            <FiArrowUp aria-hidden="true" className="size-3.5" />
            Back to top
          </Link>
        </div>
      </Container>
    </footer>
  );
}
