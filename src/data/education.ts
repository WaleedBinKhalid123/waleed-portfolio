import type { Education } from "@/types/portfolio";

/**
 * Dates use the same `YYYY-MM` convention as experience and are formatted by
 * `formatDateRange`. `logo` and `achievements` are optional; institution
 * initials are shown when no logo is present.
 */
export const education: Education[] = [
  {
    id: "bs-software-engineering",
    institution: "Punjab University College of Information Technology",
    degree: "Bachelor of Software Engineering",
    location: "Johar Town, Lahore, Pakistan",
    // TODO: confirm exact start month — set here as a reasonable estimate.
    startDate: "2017-09",
    endDate: "2021-07",
  },
];
