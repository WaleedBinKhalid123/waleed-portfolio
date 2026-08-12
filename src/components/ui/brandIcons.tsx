import {
  SiReact,
  SiRedis,
  SiPython,
  SiCisco,
  SiLinux,
  SiDocker,
  SiGithub,
  SiMongodb,
  SiGraphql,
  SiTerraform,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiTypescript,
  SiKubernetes,
  SiGooglecloud,
} from "react-icons/si";
import type { IconType } from "react-icons";
import type { BrandIconKey } from "@/types/portfolio";
import { FaAws, FaGoogle, FaMicrosoft } from "react-icons/fa6";

/**
 * Brand marks for credentials, in the same spirit as the GitHub and LinkedIn
 * icons in the header.
 *
 * Certifications reference a key rather than importing a component, so the
 * data files stay free of JSX. A certification with no `icon` (and no `logo`)
 * still renders — it falls back to issuer initials — so this map is a
 * refinement, never a requirement.
 *
 * Note: Amazon, Microsoft and Google marks come from Font Awesome; the Simple
 * Icons set no longer ships them.
 */
export const brandIcons: Record<BrandIconKey, IconType> = {
  aws: FaAws,
  azure: FaMicrosoft,
  google: FaGoogle,
  googlecloud: SiGooglecloud,
  docker: SiDocker,
  kubernetes: SiKubernetes,
  terraform: SiTerraform,
  linux: SiLinux,
  mongodb: SiMongodb,
  postgresql: SiPostgresql,
  redis: SiRedis,
  graphql: SiGraphql,
  react: SiReact,
  nextjs: SiNextdotjs,
  nodejs: SiNodedotjs,
  typescript: SiTypescript,
  python: SiPython,
  github: SiGithub,
  cisco: SiCisco,
};
