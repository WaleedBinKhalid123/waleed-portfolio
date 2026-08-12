import {
  FiCpu,
  FiCode,
  FiTool,
  FiUsers,
  FiMail,
  FiCloud,
  FiPhone,
  FiGlobe,
  FiMapPin,
  FiGithub,
  FiServer,
  FiLayers,
  FiTwitter,
  FiLinkedin,
  FiDatabase,
  FiDownload,
  FiGitBranch,
  FiCreditCard,
  FiCheckSquare,
} from "react-icons/fi";
import { SiCredly } from "react-icons/si";
import type { IconType } from "react-icons";
import type { ContactChannelIcon, SkillGroupIcon, SocialLinks } from "@/types/portfolio";

/**
 * Icon registry.
 *
 * Data files reference icons by key, never by import, which keeps `src/data`
 * free of components — and keeps the icon set consistent, since every icon on
 * the site is resolved through one of these maps.
 */

export const skillGroupIcons: Record<SkillGroupIcon, IconType> = {
  frontend: FiCode,
  backend: FiServer,
  database: FiDatabase,
  ai: FiCpu,
  cloud: FiCloud,
  devops: FiGitBranch,
  architecture: FiLayers,
  testing: FiCheckSquare,
  tools: FiTool,
  payments: FiCreditCard,
  leadership: FiUsers,
};

export const contactChannelIcons: Record<ContactChannelIcon, IconType> = {
  email: FiMail,
  phone: FiPhone,
  location: FiMapPin,
  github: FiGithub,
  linkedin: FiLinkedin,
  credly: SiCredly,
  resume: FiDownload,
};

type SocialKey = keyof SocialLinks;

export const socialIcons: Record<SocialKey, IconType> = {
  github: FiGithub,
  linkedin: FiLinkedin,
  credly: SiCredly,
  x: FiTwitter,
  website: FiGlobe,
};

export const socialLabels: Record<SocialKey, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  credly: "Credly",
  x: "X",
  website: "Website",
};
