# Portfolio — V2

A personal portfolio for a senior software engineer. Single Next.js application
— no separate backend. All content lives in typed data files, so the site is
updated by editing data, never components.

**This is Version 2.** Version 1 is untouched, in `../portfolio`.

## What V2 adds over V1

| Area           | V2                                                                            |
| -------------- | ----------------------------------------------------------------------------- |
| Identity       | Geist throughout, a warm accent, editorial section headers on a full-width rule |
| Hero           | Derived statistics that count up on first view — years, companies, projects, certifications |
| Experience     | Timeline with a rail that draws downward as each role enters view              |
| Certifications | Filterable gallery built for 20+ entries, with brand marks and a "Show all" cap |
| Projects       | Larger alternating featured cards, plus a technology filter on the grid        |
| Navigation     | Active-section underline, and a ⌘K command menu covering **every** section     |
| Detail         | Reading progress, copy-to-clipboard email, print stylesheet                   |
| Scrolling      | Measured, self-correcting anchor navigation (see §24)                          |

Everything is still data-driven, typed, server-rendered by default, and free of
an animation library — the motion is CSS, driven by one shared observer.

---

## 1. Framework and architecture

| Concern      | Choice                                                   |
| ------------ | -------------------------------------------------------- |
| Framework    | Next.js 16 (App Router, Turbopack)                        |
| Language     | TypeScript (strict)                                       |
| UI           | React 19 — Server Components by default                   |
| Styling      | Tailwind CSS v4, design tokens as CSS variables           |
| Icons        | `react-icons` (Feather + Simple Icons brand marks)        |
| Contact form | Next.js Route Handler + Nodemailer + Gmail SMTP           |
| Validation   | Zod, one schema shared by client and server               |

Only four components run on the client — the navbar (mobile menu, scroll and
active-section state), the theme toggle, the back-to-top button, the contact
form, plus three small ones that need an image `onError` handler or a collapse
toggle. Everything else renders on the server.

The page is statically generated and revalidated daily (`export const revalidate`
in `src/app/page.tsx`), because durations like "2 years 5 months" for a current
role are computed at render time and would otherwise go stale.

---

## 2. Folder structure

```text
src/
├── app/
│   ├── api/contact/route.ts   POST endpoint for the contact form
│   ├── layout.tsx             fonts, metadata, theme boot, header/footer
│   ├── page.tsx               section composition
│   ├── globals.css            design tokens + base styles
│   ├── icon.svg               favicon (static monogram)
│   ├── opengraph-image.tsx    social card, generated from site.ts
│   ├── robots.ts / sitemap.ts
│
├── components/
│   ├── layout/       Navbar, MobileMenu, Footer, AnchorScroll
│   ├── sections/     Hero, About, Skills, Experience, Projects,
│   │                 Education, Certifications, Contact
│   ├── experience/   ExperienceItem (timeline)
│   ├── education/    EducationItem (timeline)
│   ├── certifications/ CertificationCard, CertificationGallery (filter)
│   ├── projects/     ProjectCard, ProjectLinks, ProjectMedia, ProjectGrid
│   ├── contact/      ContactForm
│   ├── theme/        ThemeProvider, BootScript
│   └── ui/           Button, Badge, TagList, Container, Section,
│                     SectionHeading, ThemeToggle, BackToTop, Counter,
│                     CommandMenu, ScrollProgress, CopyButton,
│                     CredentialMark, ProfileImage, SocialLinks,
│                     CollapsibleList, Reveal, icons, brandIcons
│
├── data/             ← everything you edit
├── lib/              date, stats, scroll, reveal, validation,
│                     mailer, rate-limit, theme, utils
└── types/portfolio.ts  shared interfaces
```

---

## 3. Where portfolio data is stored

Everything is in `src/data/`. Each file is typed against `src/types/portfolio.ts`,
so a missing or misspelled field is a build error.

| File                | Holds                                              |
| ------------------- | -------------------------------------------------- |
| `site.ts`           | name, title, email, location, URL, socials, résumé, avatar, sections |
| `hero.ts`           | hero headline, summary, availability, buttons       |
| `about.ts`          | about prose, focus areas, highlights                |
| `skills.ts`         | skill groups                                        |
| `experience.ts`     | roles                                               |
| `projects.ts`       | projects                                            |
| `education.ts`      | qualifications                                      |
| `certifications.ts` | credentials                                         |
| `contact.ts`        | contact copy; channels are derived from `site.ts`   |

> The repository ships with **placeholder content** — generic sample names such
> as "Acme Digital" and "Example University", and `example.com` URLs. Replace or
> delete every entry marked with a `TODO` comment.

---

## 4. How to add a project

Add an object to `projects` in `src/data/projects.ts`. Only `id`, `title`,
`description` and `technologies` are required:

```ts
{
  id: "inventory-service",          // unique, used as the React key
  title: "Inventory Service",
  description: "One or two sentences shown on the card.",
  longDescription: "Longer text — only used for featured projects.",
  technologies: ["Node.js", "TypeScript", "PostgreSQL"],
  role: "Backend developer",
  date: "2024-02",                  // YYYY-MM, shown next to the role
  featured: true,                   // wider two-column treatment, listed first
  features: ["Bullet points shown on featured cards"],
  image: "/projects/inventory.png",
}
```

The UI picks it up automatically: featured projects render first in a wide
layout, the rest fill the "More work" grid.

## 5. How to add GitHub / Live Demo links

Add whichever URLs exist. **Each button only renders when its URL is present**,
so omit the field rather than pointing it somewhere fake:

```ts
githubUrl: "https://github.com/you/inventory-service",   // → "Source"
liveUrl: "https://inventory.example.com",                // → "Live demo"
caseStudyUrl: "https://example.com/write-up",            // → "Case study"
```

With none of the three set, no link row is rendered at all.

## 6. How to add experience

Add an object to `experiences` in `src/data/experience.ts`:

```ts
{
  id: "acme-digital",
  company: "Acme Digital",
  role: "Senior Full Stack Developer",
  location: "Remote",
  employmentType: "Full-time",
  startDate: "2023-02",
  current: true,                    // or endDate: "2025-04"
  summary: "One sentence on the scope of the role.",
  achievements: ["Specific, measurable outcomes."],
  technologies: ["Next.js", "Node.js", "MongoDB"],
  companyUrl: "https://example.com",   // optional → company name becomes a link
  logo: "/logos/acme.svg",             // optional
}
```

Entries are sorted newest-first automatically, so order in the file does not
matter.

## 7. How to add start / end dates

Dates are **structured**, always `YYYY-MM`:

```ts
startDate: "2021-06",
endDate: "2023-11",     // omit for a current role
current: true,          // set instead of endDate
```

The UI formats them as `Jun 2021 — Nov 2023`, or `Jun 2021 — Present`. Never
write a formatted date string by hand.

## 8. How experience duration is calculated

Automatically, in `src/lib/date.ts`. Components receive finished values:

```ts
calculateDuration("2022-03", "2024-08")
// { years: 2, months: 5, totalMonths: 29, label: "2 years 5 months" }
```

- An omitted `endDate` (or `current: true`) runs to the current month.
- Singular and plural are handled: `1 year`, `2 years`, `1 month`, `6 months`.
- Zero values are suppressed: 24 months renders as `2 years`, not `2 years 0 months`.

`calculateTotalExperience(experiences)` powers the "7+ years" figures in the hero
and the experience heading. It **merges overlapping date ranges**, so concurrent
or back-to-back roles are never double-counted.

## 9. How to add company logos

Optional. Two ways:

- **Local** — drop the file in `public/logos/` and set `logo: "/logos/acme.svg"`.
- **Remote** — set the full URL, then allow-list the host in `next.config.ts`:

  ```ts
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.example.com", pathname: "/**" }],
  },
  ```

If `logo` is missing, or the file fails to load, the company initials are shown
in a bordered tile instead (`AD` for "Acme Digital"). A broken image is never
displayed. The same component handles education and certification logos.

## 10. How to add education

Add to `education` in `src/data/education.ts`:

```ts
{
  id: "bsc-computer-science",
  institution: "Example University",
  degree: "BSc (Hons) Computer Science",
  fieldOfStudy: "Software Engineering",
  startDate: "2015-09",
  endDate: "2019-06",
  location: "City, Country",
  description: "Optional one-liner.",
  institutionUrl: "https://example.edu",   // optional → institution becomes a link
}
```

Dates use the same `YYYY-MM` convention and are formatted by the same utility.

## 11. How to add education logos

Identical to company logos: `logo: "/logos/university.svg"`, or a remote URL with
the host allow-listed. Missing or broken → institution initials.

## 12. How to add certifications

Add to `certifications` in `src/data/certifications.ts`:

```ts
{
  id: "cert-cloud-practitioner",
  name: "Cloud Practitioner",
  issuer: "Example Cloud",
  issueDate: "2024-03",
  expiryDate: "2027-03",                       // optional
  credentialId: "ABCD-1234",                   // optional
  credentialUrl: "https://verify.example.com/ABCD-1234",  // optional
}
```

`View credential` only renders when `credentialUrl` is set — never invent one.

## 13. How to add certification logos

`logo: "/logos/example-cloud.svg"`, same rules and same initials fallback.

## 14. How to update skills

Edit `skillGroups` in `src/data/skills.ts`. Each group is a category with a flat
list of names — no percentages or proficiency bars:

```ts
{ id: "backend", category: "Backend", icon: "backend", items: ["Node.js", "Express"] }
```

`icon` is one of `frontend | backend | database | cloud | tools`, resolved through
`src/components/ui/icons.tsx`.

## 15. How to update personal information

`src/data/site.ts` is the single source for name, professional title,
description, email, phone, location, production URL, social links, résumé path
and avatar. It feeds the header, hero, contact channels, footer, page metadata,
favicon and social card.

- **Résumé** — put the PDF at `public/resume.pdf` (matching `resumeUrl`). Remove
  the `resumeUrl` field to hide every résumé link.
- **Avatar** — optional, shown at 52px beside your name in the hero. Put a
  square image in `public/` and set `avatar: "/avatar.jpg"`. Omit the field and
  nothing is rendered in its place — no gap, no placeholder ring.

  > It currently points at an **Unsplash stock photo** so the slot is visible
  > while you test. Replace it with your own image, then delete the
  > `images.unsplash.com` entry from `images.remotePatterns` in
  > `next.config.ts` — that entry exists only for this placeholder.

- **Favicon** — `src/app/icon.svg`, a static monogram (a rounded charcoal tile
  with a single letter). Edit the letter and colours there, or replace the file
  with your own icon; the filename is what Next.js looks for.
- **Navigation** — `navItems` in the same file. Keep it short; sections not
  listed are still reachable by scrolling.

---

## 16. How to configure a Gmail App Password

1. Enable 2-Step Verification on the Google account.
2. Go to <https://myaccount.google.com/apppasswords>.
3. Create an app password (choose "Mail"), and copy the 16-character value.
4. Put it in `.env.local` as `EMAIL_PASSWORD`. It is **not** your account password.

The value is only ever read in server-side code (`src/lib/mailer.ts`, which is
marked `server-only`). It is never sent to the browser, never logged and never
included in an API response.

## 17. Required environment variables

Copy `.env.example` to `.env.local` and fill it in:

```env
EMAIL_USER=your-email@gmail.com          # the Gmail account that sends
EMAIL_PASSWORD=your-16-char-app-password # Google App Password
CONTACT_EMAIL=your-email@gmail.com       # where enquiries land (defaults to EMAIL_USER)
```

`.env.local` is git-ignored; `.env.example` holds placeholders only. Never prefix
these with `NEXT_PUBLIC_` — that would expose them to the client.

## 18. How to run locally

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:3000>.

## 19. How to build

```bash
npm run build
```

Other checks:

```bash
npm run typecheck
```

```bash
npm run lint
```

```bash
npm start
```

## 20. How to deploy

Any Node host works; Vercel is the path of least resistance.

1. Push the repository to GitHub.
2. Import it on Vercel — the framework is detected automatically.
3. Add `EMAIL_USER`, `EMAIL_PASSWORD` and `CONTACT_EMAIL` as environment
   variables in the project settings (not in the repository).
4. Set `url` in `src/data/site.ts` to the production domain so canonical URLs,
   the sitemap and Open Graph tags are correct.

Self-hosting: `npm run build && npm start` behind a reverse proxy, with the same
three environment variables set on the server.

---

## 21. How dark / light mode works

- Tokens for both themes are defined in `src/app/globals.css` (`:root` and
  `.dark`). Components reference tokens (`text-muted`, `bg-surface`), never raw
  colours, so the two themes are designed independently rather than inverted.
- **Dark is the default.** With no stored preference the OS setting is used;
  if that expresses no preference, dark wins.
- `BootScript` runs as a blocking inline script in `<head>`, applying the theme
  class before the first paint — so there is no flash of the wrong theme.
- The choice is persisted to `localStorage` under `theme` and survives reloads.
  Until the visitor chooses explicitly, the site keeps following the OS.
- `ThemeProvider` mirrors the `<html>` class into React with
  `useSyncExternalStore`, so the header toggle and the mobile-menu toggle always
  agree.
- Both toggles are real buttons with a descriptive `aria-label` that updates with
  the current state.

## 22. How the Back to Top button works

`src/components/ui/BackToTop.tsx`. Hidden until the page is scrolled past 600px,
then it fades in at the bottom-right. It scrolls smoothly to the top — or jumps
instantly when the visitor prefers reduced motion — and moves focus to
`#main-content` so keyboard users continue from the top of the document rather
than from a control that has just disappeared. While hidden it is removed from
the tab order (`tabIndex={-1}`, `aria-hidden`), so it can never trap focus.

## 23. How the contact form works

```text
ContactForm (client)
  → POST /api/contact
    → Zod validation (server-side, authoritative)
    → honeypot / rate limit / duplicate checks
    → Nodemailer → Gmail SMTP
      → your inbox
```

- **Validation** — one Zod schema (`src/lib/validation.ts`) used by both sides.
  Name 2–100, valid email, subject 3–150, message 10–5000 characters. The client
  check only saves a round trip; the server always re-validates.
- **States** — `Send message` → `Sending…` (submit disabled) → a success note, or
  a generic error. On failure the visitor's text is preserved; on success the
  form clears. Messages are announced through an `aria-live` region.
- **Errors** — internal reasons (missing credentials, SMTP failure) are logged on
  the server only. The client always sees the same generic message.
- **Anti-spam** — an off-screen honeypot field (a bot that fills it gets a plain
  success response and no email is sent), five submissions per IP per 15 minutes,
  duplicate suppression for five minutes after a successful send, and hard length
  limits. Deliberately lightweight — no third-party service, no CAPTCHA.
- **Reply-To** — Gmail rewrites the sender, so the visitor's address is set as
  `Reply-To`; replying from your inbox reaches them directly.

Rate-limit state is in-process and best effort: it resets on a cold start and is
per-instance. That is an acceptable trade for a personal site — swap in a shared
store if you ever need it to be exact.

---

## Long lists

Sections that grow over time cap themselves and reveal the rest behind a
**Show more** control: experience (4 roles), featured projects (3), other
projects (4), certifications (4), education (3). Long technology lists collapse
to a `+N` marker. In both cases the hidden entries stay in the HTML — they are
hidden with CSS, so search engines and screen readers still see the full list,
and without JavaScript everything renders expanded. Adjust the caps via the
constants at the top of each section component.

## Accessibility notes

Semantic landmarks and a single `h1`; a skip link; visible focus rings on every
interactive element; the mobile menu behaves as a modal dialog (focus moves in,
Tab is trapped, Escape closes, focus returns to the trigger); all pointer targets
are at least 24px; every text colour clears WCAG AA (4.5:1) in both themes; and
all animation is disabled under `prefers-reduced-motion`.

---

## 24. V2 specifics

### Derived statistics

`src/lib/stats.ts` computes every headline number from the data files —
overlap-aware years of experience, distinct companies (one employer with two
roles counts once), project count, certification count, distinct technologies.
Add a certification and the hero updates itself. Nothing is hardcoded.

### Certifications at scale

`src/data/certifications.ts` is built for twenty-plus entries. `featured` ones
sort first; `category` drives the filter tabs, which are derived from the data
with live counts. Cards are rendered on the server and handed to the client
gallery, which only decides visibility — so every credential is in the HTML for
crawlers, and filtering never re-renders a card.

Each credential mark falls through three tiers: `logo` image → `icon` brand mark
(`aws`, `googlecloud`, `docker`, … see `src/components/ui/brandIcons.tsx`) →
issuer initials. A broken image drops to the next tier silently.

### Command menu

⌘K / Ctrl+K anywhere, or the Search button in the header. It lists every section
— including Skills, Education and Certifications, which the navbar deliberately
omits — plus every configured profile, the résumé and the theme toggle. Sections
come from `sections` in `site.ts`; the navbar renders only those flagged
`primary`, so the two lists cannot drift apart.

### Anchor navigation

In-page links do not rely on the browser's native jump. `src/lib/scroll.ts`
scrolls deliberately, then re-measures once the scroll settles and corrects any
drift — because lazy images and web fonts can change the height of intervening
content while a smooth scroll is still travelling, which is what makes a native
jump land on the wrong section. One delegated capture-phase listener
(`AnchorScroll`) covers every anchor on the page.

Links are written `/#about`, not `#about`, so they work from any URL rather than
appending a hash to whatever page you happen to be on.

### Motion

No animation library. Reveals are CSS transitions flipped by a single shared
`IntersectionObserver` (`src/lib/reveal.ts`) that writes a `data-visible`
attribute and unobserves — revealing a hundred certification tiles costs zero
React renders. Everything is disabled under `prefers-reduced-motion`, where
content arrives in its final state immediately.

### Printing

`@media print` drops the header, footer, filters and controls, expands every
collapsed list, switches to ink-on-paper, and appends URLs after external links
— so "Print to PDF" produces a usable document.
