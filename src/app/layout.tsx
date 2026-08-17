import "./globals.css";
import { siteConfig } from "@/data/site";
import { DEFAULT_THEME } from "@/lib/theme";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { BackToTop } from "@/components/ui/BackToTop";
import { Geist, JetBrains_Mono } from "next/font/google";
import { CommandMenu } from "@/components/ui/CommandMenu";
import { BootScript } from "@/components/theme/BootScript";
import { AnchorScroll } from "@/components/layout/AnchorScroll";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { safeJsonLd, buildPersonJsonLd } from "@/lib/structuredData";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-family",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-family",
});


export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.title}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  // Matches the two theme backgrounds so mobile browser chrome blends in.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfa" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0d0f" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // `suppressHydrationWarning`: ThemeScript may change the class before React
    // hydrates, which is the whole point of running it first.
    <html
      lang="en"
      className={`${DEFAULT_THEME} ${geist.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <BootScript />
        {/* Scroll-revealed content must not stay hidden without JavaScript. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}.rule-draw,.timeline-rail,.timeline-node{transform:none !important;opacity:1 !important}`}</style>
        </noscript>
        {/* schema.org Person markup — lets search engines show a richer
            result for a query naming you directly. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(buildPersonJsonLd()) }}
        />
      </head>
      {/* suppressHydrationWarning: some browser extensions (e.g. ColorZilla)
          inject attributes like `cz-shortcut-listen` onto <body> before React
          hydrates — a false-positive mismatch, not a real one. */}
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only rounded-md bg-foreground px-4 py-2 text-sm text-background focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
          >
            Skip to content
          </a>

          <ScrollProgress />
          <Navbar />

          <main id="main-content" tabIndex={-1} className="focus:outline-none">
            {children}
          </main>

          <Footer />
          <BackToTop />

          {/* Global ⌘K palette. Renders nothing until it is opened. */}
          <CommandMenu />

          {/* Measured, self-correcting in-page navigation. */}
          <AnchorScroll />
        </ThemeProvider>

        {/* Page views + visitor location, visible only in the Vercel
            dashboard — a no-op until Web Analytics is enabled there. */}
        <Analytics />

        {/* Real-user Core Web Vitals, visible only in the Vercel dashboard —
            a no-op until Speed Insights is enabled there. */}
        <SpeedInsights />
      </body>
    </html>
  );
}
