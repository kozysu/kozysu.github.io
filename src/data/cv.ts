export interface CVEntry {
    when: string;
    what: string;
    detail?: string;
}

/**
 * Derived from the timeline already recorded in `news.ts` (including the
 * entries currently commented out there) — please verify dates before
 * publishing.
 */
export const education: CVEntry[] = [
    {
        when: "2024.03 — present",
        what: "Ph.D. in Computer Science",
        detail:
            "Hanyang University ERICA · Human-AI Interaction Lab · Advised by Prof. Minsam Ko",
    },
    {
        when: "2022.03 — 2024.02",
        what: "M.S. in Computer Science",
        detail: "Hanyang University ERICA · Human-AI Interaction Lab",
    },
];

/** The milestones the CV lists under Activities. These overlap with `news.ts`
 *  by design: news is written to be read on the day, this is written to be
 *  read on a CV. */
export const service: CVEntry[] = [
    {
        when: "2025.09",
        what: "Passed Ph.D. qualifying exam",
        detail: "Hanyang University ERICA",
    },
    {
        when: "2025.05",
        what: "Attended ACM CHI 2025",
        detail: "Yokohama, Japan",
    },
    {
        when: "2024.07",
        what: "Exhibited Colorbo at the “Digital Planet” exhibition",
        detail: "Busan National Science Museum",
    },
];

