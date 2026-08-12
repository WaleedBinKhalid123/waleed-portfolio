import {
  SiVite,
  SiGit,
  SiJest,
  SiHtml5,
  SiJira,
  SiRedis,
  SiSass,
  SiMysql,
  SiReact,
  SiRedux,
  SiTrello,
  SiDjango,
  SiNginx,
  SiPaypal,
  SiVercel,
  SiDocker,
  SiPython,
  SiMapbox,
  SiStripe,
  SiPrisma,
  SiExpress,
  SiGraphql,
  SiGithub,
  SiPytest,
  SiApplepay,
  SiMongodb,
  SiMongoose,
  SiPostman,
  SiTerraform,
  SiWordpress,
  SiNextdotjs,
  SiStorybook,
  SiGooglepay,
  SiNodedotjs,
  SiTypescript,
  SiKubernetes,
  SiPostgresql,
  SiJavascript,
  SiTailwindcss,
  SiGithubactions,
} from "react-icons/si";
import { FaAws } from "react-icons/fa6";
import type { IconType } from "react-icons";

/**
 * Technology name → brand mark.
 *
 * Deliberately partial. A tag only gains an icon when there is a genuine,
 * recognisable mark for it — "System design" and "Code review" have none, and
 * inventing one would be worse than the plain text. Anything unmatched simply
 * renders as before, which is why this can stay a lookup rather than a
 * requirement on the data.
 *
 * Keys are normalised (lowercase, punctuation stripped), so "Node.js",
 * "node js" and "NodeJS" all resolve to the same mark.
 */
export const techIcons: Record<string, IconType> = {
  react: SiReact,
  reactjs: SiReact,
  nextjs: SiNextdotjs,
  typescript: SiTypescript,
  javascript: SiJavascript,
  javascriptes2023: SiJavascript,
  tailwindcss: SiTailwindcss,
  redux: SiRedux,
  reduxtoolkit: SiRedux,
  rtkquery: SiRedux,
  reduxtoolkitrtkquery: SiRedux,
  trello: SiTrello,
  nodejs: SiNodedotjs,
  express: SiExpress,
  expressjs: SiExpress,
  django: SiDjango,
  djangorestframework: SiDjango,
  graphql: SiGraphql,
  mongodb: SiMongodb,
  mongoose: SiMongoose,
  postgresql: SiPostgresql,
  mysql: SiMysql,
  sql: SiMysql,
  prisma: SiPrisma,
  redis: SiRedis,
  docker: SiDocker,
  kubernetes: SiKubernetes,
  terraform: SiTerraform,
  nginx: SiNginx,
  githubactions: SiGithubactions,
  githubactionscicd: SiGithubactions,
  git: SiGit,
  github: SiGithub,
  gitgithub: SiGithub,
  aws: FaAws,
  awss3: FaAws,
  awsec2: FaAws,
  awsrds: FaAws,
  awsamplify: FaAws,
  vercel: SiVercel,
  jest: SiJest,
  pytest: SiPytest,
  storybook: SiStorybook,
  vite: SiVite,
  python: SiPython,
  stripe: SiStripe,
  paypal: SiPaypal,
  applepay: SiApplepay,
  googlepay: SiGooglepay,
  html5css3: SiHtml5,
  sass: SiSass,
  jira: SiJira,
  postman: SiPostman,
  mapbox: SiMapbox,
  wordpress: SiWordpress,
};

/**
 * Normalises a technology name into a lookup key. Callers index `techIcons`
 * with this directly rather than through a helper that returns a component —
 * a component identity should come from a static map, not a function call.
 */
export function techIconKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Brand colour per tech key, for the rare place a mark is shown at brand size
 * rather than at icon size (the skills section highlight strip). Deliberately
 * partial: brands whose mark is black/white (Next.js, GitHub) are left
 * unmapped so they inherit the current text colour instead of vanishing in
 * one theme.
 */
export const techColors: Record<string, string> = {
  react: "#61DAFB",
  reactjs: "#61DAFB",
  typescript: "#3178C6",
  javascript: "#F7DF1E",
  tailwindcss: "#38BDF8",
  redux: "#764ABC",
  reduxtoolkit: "#764ABC",
  rtkquery: "#764ABC",
  reduxtoolkitrtkquery: "#764ABC",
  nodejs: "#5FA04E",
  express: "#8A8A8A",
  expressjs: "#8A8A8A",
  django: "#0C4B33",
  djangorestframework: "#0C4B33",
  mongodb: "#47A248",
  postgresql: "#4169E1",
  mysql: "#4479A1",
  sql: "#4479A1",
  redis: "#DC382D",
  docker: "#2496ED",
  aws: "#FF9900",
  awss3: "#FF9900",
  awsec2: "#FF9900",
  awsrds: "#FF9900",
  awsamplify: "#FF9900",
  githubactions: "#2088FF",
  githubactionscicd: "#2088FF",
  git: "#F05032",
  jest: "#C21325",
  pytest: "#0A9EDC",
  python: "#3776AB",
  stripe: "#635BFF",
  paypal: "#003087",
  googlepay: "#4285F4",
  jira: "#0052CC",
  trello: "#0052CC",
  postman: "#FF6C37",
};
