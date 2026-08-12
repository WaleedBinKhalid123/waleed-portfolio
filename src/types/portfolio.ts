/**
 * Shared domain types for the portfolio.
 *
 * Every data file in `src/data` is typed against these interfaces, so a typo or
 * a missing required field is a compile-time error rather than a runtime hole
 * in the UI.
 *
 * Date convention: all dates are stored as `YYYY-MM` (an optional `YYYY-MM-DD`
 * is also accepted). Display strings and durations are always derived —
 * never authored by hand. See `src/lib/date.ts`.
 */

/** A month-precision date, e.g. `"2022-03"`. */
export type MonthString = string;

/* -------------------------------------------------------------------------- */
/* Site                                                                        */
/* -------------------------------------------------------------------------- */

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  /** Credly profile — where verified certification badges live. */
  credly?: string;
  x?: string;
  website?: string;
}

export interface SiteConfig {
  /** Full name, used in the header, hero, metadata and footer. */
  name: string;
  /** Short professional title, e.g. "Senior Full Stack Developer". */
  title: string;
  /** One-sentence description used for SEO and social cards. */
  description: string;
  email: string;
  phone?: string;
  location: string;
  /** Absolute production URL — required for correct Open Graph metadata. */
  url: string;
  socialLinks: SocialLinks;
  /** Path or URL to a downloadable résumé. Omit to hide every résumé link. */
  resumeUrl?: string;
  /**
   * Optional portrait, e.g. `"/avatar.jpg"`. When omitted — or if the file
   * fails to load — nothing is rendered in its place.
   */
  avatar?: string;
  /** Keywords for search engines. */
  keywords: string[];
}

export interface NavItem {
  label: string;
  /** In-page anchor, e.g. `"#projects"`. */
  href: string;
  /**
   * Shown in the header. Sections without it are still reachable by scrolling
   * and from the command menu — the navbar stays short on purpose.
   */
  primary?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                        */
/* -------------------------------------------------------------------------- */

export interface CallToAction {
  label: string;
  href: string;
}

export interface HeroContent {
  /** Short status line above the headline. Omit to hide the marker entirely. */
  availability?: string;
  /** The single sentence a visitor should leave with. */
  headline: string;
  summary: string;
  primaryCta: CallToAction;
  secondaryCta?: CallToAction;
}

/* -------------------------------------------------------------------------- */
/* About                                                                       */
/* -------------------------------------------------------------------------- */

export interface AboutHighlight {
  label: string;
  value: string;
}

export interface About {
  /** Short headline shown above the prose. */
  headline: string;
  /** Body copy — one string per paragraph. */
  paragraphs: string[];
  /** Bullet list of focus areas / specialisms. */
  focusAreas?: string[];
  /** Small key/value facts rendered beside the prose. */
  highlights?: AboutHighlight[];
}

/* -------------------------------------------------------------------------- */
/* Skills                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Brand marks available to credentials, roles and qualifications.
 * Keys map to components in `src/components/ui/brandIcons.tsx`.
 */
export type BrandIconKey =
  | "aws"
  | "azure"
  | "google"
  | "googlecloud"
  | "docker"
  | "kubernetes"
  | "terraform"
  | "linux"
  | "mongodb"
  | "postgresql"
  | "redis"
  | "graphql"
  | "react"
  | "nextjs"
  | "nodejs"
  | "typescript"
  | "python"
  | "github"
  | "cisco";

/** Keys map to icons in `src/components/ui/icons.tsx`. */
export type SkillGroupIcon =
  | "frontend"
  | "backend"
  | "database"
  | "ai"
  | "cloud"
  | "devops"
  | "architecture"
  | "testing"
  | "tools"
  | "payments"
  | "leadership";

export interface SkillGroup {
  id: string;
  /** Group name, e.g. "Frontend". */
  category: string;
  icon?: SkillGroupIcon;
  items: string[];
  /**
   * A handful of standout items (must match entries in `items`) shown as
   * small coloured brand marks beside the category title. Only used when a
   * genuine brand mark exists for the name — see `techIcons`.
   */
  highlightIcons?: string[];
}

/* -------------------------------------------------------------------------- */
/* Experience                                                                  */
/* -------------------------------------------------------------------------- */

export interface Experience {
  id: string;
  company: string;
  role: string;
  location?: string;
  /** Employment type, e.g. "Full-time", "Contract". */
  employmentType?: string;

  /** `YYYY-MM` */
  startDate: MonthString;
  /** `YYYY-MM` — omit when `current` is true. */
  endDate?: MonthString;
  /** When true the duration runs to today. */
  current?: boolean;

  summary: string;
  achievements?: string[];
  technologies?: string[];

  /** Optional; a brand mark or initials are rendered when absent or broken. */
  logo?: string;
  /** Brand mark used when there is no logo image, e.g. "aws". */
  icon?: BrandIconKey;
  companyUrl?: string;
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                    */
/* -------------------------------------------------------------------------- */

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;

  technologies: string[];

  /** Optional; a typographic treatment is rendered when absent or broken. */
  image?: string;
  /**
   * Additional screenshots. When present (2+), featured cards render a
   * scrollable gallery with dot indicators instead of a single image —
   * `image` still serves as the single-image fallback for compact cards.
   */
  images?: string[];

  githubUrl?: string;
  liveUrl?: string;
  caseStudyUrl?: string;

  /** Featured projects are rendered first, in a wider layout. */
  featured?: boolean;

  features?: string[];
  role?: string;
  /** `YYYY-MM` — used only for ordering and display. */
  date?: MonthString;
}

/* -------------------------------------------------------------------------- */
/* Education & certifications                                                  */
/* -------------------------------------------------------------------------- */

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;

  startDate?: MonthString;
  endDate?: MonthString;
  current?: boolean;

  location?: string;
  description?: string;
  /** Honours, thesis topic, notable coursework. */
  achievements?: string[];

  logo?: string;
  /** Brand mark used when there is no logo image. */
  icon?: BrandIconKey;
  institutionUrl?: string;
}

/**
 * Free-form so new groupings need no code change: the certification filter
 * builds its tabs from whichever categories actually appear in the data.
 */
export type CertificationCategory = string;

export interface Certification {
  id: string;
  name: string;
  issuer: string;

  issueDate?: MonthString;
  expiryDate?: MonthString;

  credentialId?: string;
  credentialUrl?: string;

  logo?: string;
  /** Brand mark shown when there is no logo image, e.g. "aws". */
  icon?: BrandIconKey;

  /** Drives the filter tabs. Uncategorised entries still appear under "All". */
  category?: CertificationCategory;
  /** Pulled out above the grid, ahead of everything else. */
  featured?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Derived statistics                                                          */
/* -------------------------------------------------------------------------- */

export interface PortfolioStat {
  id: string;
  /** Numeric part — counted up on first view. */
  value: number;
  /** Rendered immediately after the number, e.g. "+". */
  suffix?: string;
  label: string;
  /** Precise form for assistive technology, e.g. "9 years 4 months". */
  description?: string;
}

/* -------------------------------------------------------------------------- */
/* Contact                                                                     */
/* -------------------------------------------------------------------------- */

/** Keys map to icons in `src/components/ui/ContactIcon.tsx`. */
export type ContactChannelIcon =
  | "email"
  | "phone"
  | "location"
  | "github"
  | "linkedin"
  | "credly"
  | "resume";

export interface ContactChannel {
  id: string;
  label: string;
  /** Human-readable value, e.g. "hello@example.com". */
  value: string;
  /** Omit for non-actionable rows such as a location. */
  href?: string;
  icon: ContactChannelIcon;
  external?: boolean;
}

export interface ContactContent {
  headline: string;
  description: string;
  /** Optional note about response time or availability. */
  availability?: string;
  channels: ContactChannel[];
}

/** Payload accepted by `POST /api/contact`. */
export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot — must stay empty. */
  company?: string;
}

export type ContactFormStatus = "idle" | "submitting" | "success" | "error";

export interface ContactApiResponse {
  ok: boolean;
  message: string;
  /** Field-level validation messages, keyed by field name. */
  errors?: Partial<Record<keyof ContactFormValues, string>>;
}

/* -------------------------------------------------------------------------- */
/* Dates                                                                       */
/* -------------------------------------------------------------------------- */

export interface Duration {
  years: number;
  months: number;
  totalMonths: number;
  /** Pluralised, zero-suppressed label, e.g. "2 years 5 months". */
  label: string;
}
