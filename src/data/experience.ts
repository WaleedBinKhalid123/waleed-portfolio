import type { Experience } from "@/types/portfolio";

/**
 * Dates are structured `YYYY-MM`. Never write a duration by hand: the UI
 * derives "Mar 2022 — Aug 2024 · 2 years 5 months" from these two fields.
 * For a current role set `current: true` and omit `endDate`.
 *
 * `logo` is optional — company initials are rendered when it's missing or the
 * image fails to load. Local files go in `public/logos/…`; remote URLs need
 * their host added to `images.remotePatterns` in `next.config.ts`.
 */
export const experiences: Experience[] = [
  {
    id: "argon",
    company: "Argon",
    role: "Senior Software Engineer",
    location: "Arfa Tower, Lahore, Pakistan",
    employmentType: "Full-time",
    startDate: "2023-12",
    current: true,
    summary:
      "Senior engineer across the Argon project portfolio — FitNee, Easytipping, Abodems, Housekeeper, Mark Lauren and eFileMy1099 — owning Django/DRF and Node.js backend services, React/Next.js front ends, AI feature integration, and leading the frontend and backend teams delivering them.",
    achievements: [
      "Built and maintained RESTful APIs using Python, Django and Django REST Framework for core backend services, running alongside Node.js/Express services across the project portfolio.",
      "Built a RAG (Retrieval-Augmented Generation) application, exposed through a Django/DRF API layer, to power an internal employee polling and feedback system.",
      "Developed speech-to-text and text-to-speech functionality for a learning-game backend using Amazon Transcribe and ElevenLabs.",
      "Grew a UAE-based online fitness platform to 20+ trainers, 50 trainees and 25+ nutritionists within its first two months.",
      "Implemented Stripe, PayPal and Saudi-based HyperPay payment gateways, supporting Apple Pay, Google Pay, ACH and credit cards.",
      "Designed Django ORM models and PostgreSQL schemas, and optimised queries and indexing for high-traffic platforms.",
      "Used Celery for background task processing and asynchronous AI model and document-processing workflows.",
      "Led frontend and backend teams, running daily scrum calls to keep delivery on track.",
    ],
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Redux Toolkit",
      "RTK Query",
      "Python",
      "Django",
      "Django REST Framework",
      "Celery",
      "Node.js",
      "Express",
      "PostgreSQL",
      "AWS",
      "Stripe",
      "PayPal",
    ],
  },
  {
    id: "boredm",
    company: "BoreDM",
    role: "Software Engineer",
    location: "Remote",
    employmentType: "Full-time",
    startDate: "2023-02",
    endDate: "2023-11",
    summary:
      "Contributed to a subsurface data management platform, building the React/TypeScript front end and Python/Django backend data services.",
    achievements: [
      "Built Django-based data-processing services and REST API endpoints to power React-PDF-based reporting.",
      "Designed Django models and PostgreSQL schema for subsurface dataset storage and retrieval.",
      "Maintained direct client communication for requirement gathering and delivery.",
    ],
    technologies: ["React", "TypeScript", "Python", "Django", "PostgreSQL"],
  },
  {
    id: "webiestorms",
    company: "The Webiestorms Company",
    role: "Software Engineer",
    location: "Johar Town, Lahore, Pakistan",
    employmentType: "Full-time",
    startDate: "2020-09",
    endDate: "2023-01",
    summary:
      "Developed web platforms for international clients, including Netherlands-based businesses (YRH, Centropix) and a year-long engagement with a Canadian firm as a React developer.",
    achievements: [
      "Led a team of 5 developers across multiple concurrent client projects, handling delivery and client communication directly.",
      "Implemented caching mechanisms and optimised database queries and indexing to improve data retrieval speed and reduce server load.",
      "Followed SDLC processes, MVC structure and RESTful API conventions across projects.",
    ],
    technologies: ["React", "jQuery", "Redux Toolkit", "Node.js", "Laravel", "SQL"],
  },
];
