import type { Project } from "@/types/portfolio";

/**
 * Links are strictly conditional: a button only appears when its URL exists, so
 * omit `githubUrl` / `liveUrl` / `caseStudyUrl` rather than pointing them at a
 * placeholder.
 *
 * `image` is optional — a typographic card is rendered when it's absent or the
 * file fails to load. Put images in `public/projects/…`.
 */
export const projects: Project[] = [
  {
    id: "yacht-registration-holland",
    title: "Yacht Registration Holland",
    description:
      "A yacht registration platform for BlueWater Registration Services — owners submit registration documents online, officials review and approve them, and registrations renew on a yearly subscription.",
    longDescription:
      "Multi-role platform separating yacht owners, nautical professionals and reviewing officials, with document upload and verification, application status tracking through the review pipeline, and yearly subscription-based registration renewals. Built on Laravel with a React front end for BlueWater Registration Services, a Netherlands-based yacht registration specialist with 18+ years in the industry and over 50,000 registrations processed — live in production with real customers.",
    technologies: ["Laravel", "React"],
    role: "Full stack developer",
    featured: true,
    image: "/projects/yacht-registration-holland.png",
    features: [
      "Role-based access for yacht owners, nautical professionals and reviewing officials",
      "End-to-end registration workflow with document upload and verification",
      "Application status tracking through the review pipeline",
      "Yearly subscription-based registration renewals",
    ],
    liveUrl: "https://www.yachtregistration.center/",
  },
  {
    id: "centropix",
    title: "Centropix — Enrollment & Affiliate Backoffice",
    description:
      "A full redesign of Centropix's public enrollment and affiliate site, paired with a complete rebuild of its internal backoffice covering sales, orders and the affiliate membership network.",
    longDescription:
      "Centropix is a wellness and bio-resonance technology company running a network-marketing affiliate programme. Led the redesign of the public enrollment site — sign-up flow, affiliate programme pages and the wider marketing site — and separately delivered a full-stack rebuild of the internal backoffice used by affiliates and staff, including the sales and orders module and the affiliate membership tree used to track referrals, ranks and commissions.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "ASP.NET"],
    role: "Full stack developer",
    featured: true,
    image: "/projects/centropix.png",
    features: [
      "Enrollment and sign-up flow redesign for new affiliates and customers",
      "Sales and orders module for tracking purchases and commissions",
      "Affiliate membership network tree for referrals and rank tracking",
      "Full-stack rebuild of the internal backoffice platform",
    ],
    liveUrl: "https://www.centropix.us/www/en/enrollment",
  },
  {
    id: "franchisingxpert",
    title: "FranchisingXpert POS",
    description:
      "A restaurant and franchise management platform with an offline-first desktop POS, centralized inventory, cloud sync and franchise-wide reporting.",
    longDescription:
      "A complete restaurant and franchise management ecosystem: a Super Admin portal for onboarding restaurants and configuring franchise settings, an offline-first desktop POS (Electron + local SQLite) handling orders, payments, receipts, shift handling and Z-reports, inventory and day-close operations with stock adjustments and COGS calculations, a cloud sync engine reconciling offline terminals with push/pull and retry handling, and franchise-wide reporting covering P&L, WISR reports and royalty calculations.",
    technologies: ["NestJS", "PostgreSQL", "Next.js", "Electron", "React", "SQLite", "Docker", "Nginx"],
    role: "Full stack engineer & team lead",
    // TODO: confirm project date and featured status.
    featured: true,
    image: "/projects/franchisingxpert-pos.png",
    features: [
      "Offline-first desktop POS (Electron + SQLite) for orders, payments, receipts and shift handling",
      "Cloud sync engine reconciling offline terminals with push/pull and retry handling",
      "Inventory, stock adjustments and COGS tracking through day-close operations",
      "Franchise analytics: P&L, WISR reports, royalty calculations and dashboards",
      "Owned DevOps end to end — frontend and backend deployments through CI/CD pipelines, containerised with Docker (Nginx in production)",
    ],
  },
  {
    id: "fitnee",
    title: "FitNee",
    description:
      "An online fitness platform connecting trainees with trainers and nutritionists through real-time chat and personalised exercise plans, with tools to track body measurements over time.",
    longDescription:
      "A UAE-based fitness platform pairing trainees with qualified trainers and nutritionists for real-time chat, exercise programming and progress tracking. Includes a comprehensive exercise library, a FitNee community space, body measurement tracking tools, and HyperPay-verified payments — backed by production-level Firebase services alongside a Python/Django and PostgreSQL backend.",
    technologies: ["React", "Python", "Django", "PostgreSQL", "Firebase"],
    role: "Full stack engineer & team lead",
    featured: true,
    image: "/projects/fitnee.png",
    features: [
      "Comprehensive exercise library",
      "FitNee community",
      "Qualified trainers and nutritionists",
      "Verified payments via HyperPay",
      "Production-level Firebase services",
      "Owned DevOps end to end — frontend and backend deployments through CI/CD pipelines, containerised with Docker",
    ],
    liveUrl: "https://fitnee.fit/",
  },
  {
    id: "efilemy1099",
    title: "eFileMy1099",
    description:
      "An online platform for filing 1099-INT, 1099-NEC and 1099-MISC forms with the IRS, returning filing status in seconds instead of weeks.",
    longDescription:
      "Payers submit 1099-INT, 1099-NEC and 1099-MISC forms and track them through a full verification pipeline — submitted, rejected, resubmission and approved — backed by the IRS V2 API. TIN verification runs against every submission before filing, and subscription billing is handled through Stripe.",
    technologies: ["React", "Node.js", "Express", "PostgreSQL", "IRS V2 API", "XML"],
    role: "Full stack engineer & team lead",
    featured: true,
    image: "/projects/efilemy1099.png",
    features: [
      "Streamlined tax filing process",
      "Subscription-based Stripe payments",
      "TIN verification",
      "IRS V2 API integration",
      "Owned DevOps end to end — frontend and backend deployments through CI/CD pipelines, containerised with Docker",
    ],
    liveUrl: "https://efilemy1099.com/",
  },
  {
    id: "easytipping",
    title: "EasyTipping",
    description:
      "A cashless tipping platform where givers tip receivers — individuals, teams or businesses — via a unique QR code, with Stripe, PayPal and Flutterwave payment gateways.",
    longDescription:
      "A cashless tipping platform for hospitality and service businesses — a receiver signs up as an individual, team or business account and gets a unique ID and QR code, so a guest can tip in seconds with no cash and nothing to install. Built as a web application (React, Node.js, PostgreSQL) with a companion React Native mobile app.",
    technologies: ["React", "React Native", "Node.js", "Express", "PostgreSQL"],
    role: "Full stack engineer & team lead",
    featured: true,
    image: "/projects/easytipping.png",
    features: [
      "Multiple payment gateways — Stripe, PayPal and Flutterwave",
      "Secure checkout",
      "QR code scan-to-pay",
      "Mobile app experience mirroring the web platform",
      "Transaction history and tracking",
      "User feedback and ratings",
      "Google Places reviews integration",
      "Owned DevOps end to end — frontend and backend deployments through CI/CD pipelines, containerised with Docker",
    ],
    liveUrl: "https://www.easytipping.com/",
  },
  {
    id: "healink",
    title: "Healink",
    description:
      "A multi-tenant dental practice management platform — hospitals onboard doctors and staff, staff build and track treatment plans, and patients get an AI-generated, plain-language summary of their own diagnosis and treatment.",
    longDescription:
      "A HIPAA-compliant, multi-tenant practice management platform for dental groups — each hospital onboards its own doctors and staff, who run patient care end to end, from treatment planning through to the patient's own view of their record. Built as a MERN application hosted on Google Cloud Platform.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Google Cloud Platform", "OpenAI GPT-4o API"],
    role: "Full stack engineer & team lead",
    featured: true,
    image: "/projects/healink-1.png",
    images: ["/projects/healink-1.png", "/projects/healink-2.png"],
    features: [
      "AI-generated patient summaries via the OpenAI GPT-4o API — prompted with the doctor's notes and treatment plan to produce a plain-language explanation for the patient",
      "Multi-tenant hospital onboarding, with each hospital managing its own doctors and staff",
      "Complete treatment planning with step-by-step tracking and clinical notes",
      "Teeth photo documentation attached to each treatment step",
      "Patient portal covering diagnosis, treatment history, documents and next steps per visit",
      "HIPAA-compliant, hosted on Google Cloud Platform",
      "Owned DevOps end to end — frontend and backend deployments through CI/CD pipelines, containerised with Docker",
    ],
    liveUrl: "https://healink.ai/",
  },
  {
    id: "catalyst",
    title: "Catalyst",
    description:
      "A shelter adoption program for Catalyst Pet's Shopify store — shelters onboard adopters and issue a unique QR code redeemable for a free first-time bag of cat litter.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Shopify SDK"],
    role: "Full stack engineer & team lead",
    image: "/projects/catalyst-1.png",
    images: ["/projects/catalyst-1.png", "/projects/catalyst-2.png"],
    features: [
      "Free first-time adopter cat litter redemption via unique QR code",
      "Advanced dashboard statistics",
      "State-wise shelter breakdown and stats",
      "Owned DevOps end to end — frontend and backend deployments through CI/CD pipelines, containerised with Docker",
    ],
    liveUrl: "https://shelters.catalystpet.com/",
  },
  {
    id: "housekeeper",
    title: "Housekeeper",
    description:
      "A property management platform where owners manage properties and bookings, assign cleaners to cleaning tasks, and handle invoicing — with bookings synced from multiple channel managers.",
    technologies: ["React", "Python", "Django", "Google Cloud Platform", "OpenAI GPT-4o API"],
    role: "Full stack engineer & team lead",
    image: "/projects/housekeeper.png",
    features: [
      "Assign cleaners to properties for cleaning tasks",
      "Invoice management",
      "Multi-channel integration — Lodgify, Guesty, Hostaway and Hostfully",
      "AI-generated summaries for properties and bookings via the OpenAI GPT-4o API",
      "Owned DevOps end to end — frontend and backend deployments through CI/CD pipelines, containerised with Docker",
    ],
    liveUrl: "https://www.admin.housekeeper.host/dashboard",
  },
  {
    id: "wenet",
    title: "Wenet",
    description:
      "The backend for an educational game teaching kids English — a real-time, socket-based AI pipeline scores a child's spoken sentence for grammar, vocabulary and accent, then replies with a generated voice response.",
    technologies: ["Python", "FastAPI", "WebSockets", "AWS Transcribe", "OpenAI GPT-4o API", "ElevenLabs"],
    role: "Backend & AI engineer",
    features: [
      "Real-time, socket-based audio pipeline from frontend to backend",
      "Speech-to-text via AWS Transcribe",
      "Sentence scoring via the OpenAI GPT-4o API — grammar, vocabulary and accent analysis",
      "Generated spoken response synthesised via ElevenLabs",
    ],
  },
  {
    id: "internal-rag-assistant",
    title: "Internal Operations RAG Assistant",
    description:
      "An internal RAG (Retrieval-Augmented Generation) assistant built for Argon's own operations — a natural-language interface over employee data, payroll, attendance, projects and teams.",
    longDescription:
      "Built so non-technical staff can query Argon's internal operations in plain language instead of digging through separate systems. Employee records, payroll, attendance, project assignments and team structures are split into chunks, embedded, and stored in a vector database. A retrieval layer pulls the most relevant chunks for a given question, and the OpenAI GPT-4o API composes the final answer grounded in that retrieved data rather than letting the model guess.",
    technologies: ["Python", "pgvector", "PostgreSQL", "OpenAI Embeddings API", "OpenAI GPT-4o API"],
    role: "Full stack engineer & team lead",
    features: [
      "Data chunking pipeline over employee records, payroll, attendance, projects and teams",
      "Vector database (pgvector) storing embeddings for semantic retrieval",
      "Retrieval-augmented generation — GPT-4o composes answers grounded in retrieved chunks",
      "Natural-language search across every indexed domain in one interface",
      "Owned DevOps end to end — frontend and backend deployments through CI/CD pipelines, containerised with Docker",
    ],
  },
  {
    id: "mark-lauren",
    title: "Mark Lauren",
    description:
      "An online fitness platform for daily exercises, with a huge premium-level exercise library, workout scheduling and custom workout plans.",
    technologies: ["React", "Node.js", "Express", "Supabase", "Google Cloud Platform"],
    role: "Full stack engineer & team lead",
    image: "/projects/mark-lauren-1.png",
    images: [
      "/projects/mark-lauren-1.png",
      "/projects/mark-lauren-2.png",
      "/projects/mark-lauren-3.png",
    ],
    features: [
      "Huge premium-level exercise library",
      "Workout scheduling",
      "Custom workout plan creation",
      "Owned DevOps end to end — frontend and backend deployments through CI/CD pipelines, containerised with Docker",
    ],
    liveUrl: "https://hooya.marklauren.com/",
  },
  {
    id: "craydl",
    title: "Craydl",
    description:
      "An AI layer for an architectural design studio — vision models read uploaded architecture documents, ask clarifying questions, and generate a category-wise construction budget.",
    longDescription:
      "Built for CRAYDL, an architectural design studio. Vision-capable models — Gemini and GPT-4o — analyse uploaded architecture documents, extract the relevant detail, and ask the user clarifying questions where the plans are ambiguous. The result is a full construction budget broken down by category — floors, windows, exterior and interior walls, and more — with a second model orchestration pass verifying the generated budget before it reaches the user.",
    technologies: ["Google Gemini API", "OpenAI GPT-4o API"],
    role: "Full stack engineer & team lead",
    image: "/projects/craydl.png",
    features: [
      "Vision-model document analysis via Gemini and GPT-4o — extracts detail from uploaded architecture plans",
      "Follow-up clarifying questions when plan details are ambiguous",
      "Category-wise budget generation — floors, windows, exterior and interior walls, and more",
      "Multi-model orchestration verifying the AI-generated budget before it reaches the user",
      "Owned DevOps end to end — frontend and backend deployments through CI/CD pipelines, containerised with Docker",
    ],
    liveUrl: "https://craydl.com/",
  },
];
