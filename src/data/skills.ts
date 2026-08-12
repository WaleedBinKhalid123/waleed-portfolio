import type { SkillGroup } from "@/types/portfolio";

/**
 * Grouped rather than rated: proficiency bars invent a precision that doesn't
 * exist and read as junior. Order each group most-relevant first — the UI
 * preserves the order you write here.
 *
 * The section scales with this file: add a group and it appears, with its own
 * filter chip and icon (see `skillGroupIcons` in `components/ui/icons.tsx`).
 * `highlightIcons` picks a few standout items to show as small coloured brand
 * marks beside the category title — see `techIcons`/`techColors`.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    category: "Frontend",
    icon: "frontend",
    highlightIcons: ["React.js", "Next.js", "TypeScript"],
    items: [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Redux Toolkit & RTK Query",
      "Tailwind CSS",
      "SASS",
      "Reactstrap",
      "HTML5 & CSS3",
    ],
  },
  {
    id: "backend",
    category: "Backend",
    icon: "backend",
    highlightIcons: ["Python", "Django", "Node.js"],
    items: [
      "Python",
      "Django",
      "Django REST Framework",
      "Celery",
      "Node.js",
      "Express.js",
      "RESTful API design",
      "Authentication & Authorization",
    ],
  },
  {
    id: "database",
    category: "Database",
    icon: "database",
    highlightIcons: ["PostgreSQL", "MongoDB"],
    items: [
      "PostgreSQL",
      "MongoDB",
      "SQL",
      "Database design & modelling",
      "Query optimization & indexing",
      "Caching strategies",
    ],
  },
  {
    id: "ai",
    category: "AI / LLM Integration",
    icon: "ai",
    items: [
      "RAG (Retrieval-Augmented Generation)",
      "NLP",
      "Speech-to-text & text-to-speech (Amazon Transcribe, ElevenLabs)",
      "LLM & third-party AI model APIs",
      "Automated document parsing",
      "Workflow automation",
    ],
  },
  {
    id: "cloud",
    category: "Cloud & DevOps",
    icon: "cloud",
    highlightIcons: ["AWS EC2", "GitHub Actions (CI/CD)"],
    items: ["AWS EC2", "AWS S3", "AWS RDS", "AWS Amplify", "GitHub Actions (CI/CD)"],
  },
  {
    id: "payments",
    category: "Payments & Integrations",
    icon: "payments",
    highlightIcons: ["Stripe", "PayPal"],
    items: [
      "Stripe",
      "PayPal",
      "HyperPay (STC Pay, Mada, Cards)",
      "Flutterwave",
      "Apple Pay",
      "Google Pay",
      "Card payments",
    ],
  },
  {
    id: "leadership",
    category: "Leadership & Collaboration",
    icon: "leadership",
    items: ["Team leadership", "Client communication", "Agile delivery"],
  },
  {
    id: "testing",
    category: "Testing",
    icon: "testing",
    highlightIcons: ["Jest", "Pytest"],
    items: ["Pytest", "Jest", "Playwright (end-to-end)"],
  },
  {
    id: "tools",
    category: "APIs & Project Tools",
    icon: "tools",
    highlightIcons: ["JIRA", "Postman"],
    items: ["Swagger", "Postman", "JIRA", "Trello", "Monday", "Git & GitHub"],
  },
];
