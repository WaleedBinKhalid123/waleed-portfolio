import { certifications } from "@/data/certifications";
import { experiences } from "@/data/experience";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { calculateTotalExperience, formatExperienceHeadline } from "@/lib/date";
import type { PortfolioStat } from "@/types/portfolio";

/**
 * Headline statistics, derived from the data files.
 *
 * Nothing here is authored: add a certification or a project and the hero
 * updates itself. Years of experience come from the same overlap-aware
 * calculation the experience section uses, so the two can never disagree.
 */

const totalExperience = calculateTotalExperience(experiences);

/** Distinct companies — one employer with two roles still counts once. */
const companyCount = new Set(experiences.map((experience) => experience.company)).size;

/** Distinct technologies across every skill group. */
const technologyCount = new Set(skillGroups.flatMap((group) => group.items)).size;

export const portfolioStats = {
  totalExperience,
  yearsOfExperience: totalExperience.years,
  certificationCount: certifications.length,
  companyCount,
  projectCount: projects.length,
  technologyCount,
} as const;

/**
 * The hero's stat row. Entries with a zero value are dropped, so an empty data
 * file never produces a "0 Projects" tile.
 */
export const heroStats: PortfolioStat[] = [
  {
    id: "experience",
    value: portfolioStats.yearsOfExperience,
    suffix: "+",
    label: portfolioStats.yearsOfExperience === 1 ? "Year experience" : "Years experience",
    // The rounded headline is for glanceability; the exact figure is announced.
    description: `${formatExperienceHeadline(totalExperience)} — ${totalExperience.label} of professional experience`,
  },
  {
    id: "companies",
    value: portfolioStats.companyCount,
    label: portfolioStats.companyCount === 1 ? "Company" : "Companies",
  },
  {
    id: "projects",
    value: portfolioStats.projectCount,
    suffix: "+",
    label: portfolioStats.projectCount === 1 ? "Project" : "Projects",
  },
  {
    id: "certifications",
    value: portfolioStats.certificationCount,
    label: portfolioStats.certificationCount === 1 ? "Certification" : "Certifications",
  },
].filter((stat) => stat.value > 0);
