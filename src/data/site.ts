import type { NavItem, SiteConfig } from "@/types/portfolio";

/**
 * Central site configuration.
 *
 * Nothing outside `src/data` needs to change.
 */
export const siteConfig: SiteConfig = {
  name: "Waleed Bin Khalid",
  title: "Senior Software Engineer",
  description:
    "Senior software engineer building full-stack web and SaaS platforms with React, Next.js, Node.js and Django, with AI features such as RAG, NLP and STT/TTS.",

  email: "waleedbinkhalid84587@gmail.com",
  phone: "+92 309 4184587",

  location: "Lahore, Pakistan",

  url: "https://waleed-portfolio-alpha.vercel.app",

  socialLinks: {
    github: "https://github.com/WaleedBinKhalid123",
    linkedin: "https://www.linkedin.com/in/waleed-bin-khalid-296b931b4",
  },

  // Add `public/resume.pdf` to enable every résumé link, or remove this field
  // entirely to hide them.
  resumeUrl: "/resume.pdf",

  // Portrait, shown at 52px beside the name in the hero.
  avatar: "/avatar.jpg",

  keywords: [
    "Full Stack Developer",
    "MERN Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "Python Developer",
    "Django Developer",
    "TypeScript",
    "AI Integration",
    "RAG",
    "Software Engineer",
  ],
};

/**
 * Every section on the page, in document order.
 *
 * `primary` marks the handful that appear in the header — a crowded navbar
 * reads like an admin dashboard. Everything else stays reachable by scrolling
 * and through the ⌘K command menu, which lists this whole array.
 */
// Hrefs are route-safe (`/#about`, not `#about`) so they work from any URL.
export const sections: NavItem[] = [
  { label: "Home", href: "/#top" },
  { label: "About", href: "/#about", primary: true },
  { label: "Skills", href: "/#skills" },
  { label: "Experience", href: "/#experience", primary: true },
  { label: "Projects", href: "/#projects", primary: true },
  { label: "Education", href: "/#education" },
  { label: "Contact", href: "/#contact", primary: true },
];

/** Header navigation — derived, so the two lists can never drift apart. */
export const navItems: NavItem[] = sections.filter((section) => section.primary);
