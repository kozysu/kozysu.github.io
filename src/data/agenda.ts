/**
 * The scale the theme map is read against. Generative AI answers by default;
 * these name what each current system returns instead. Order is the order they
 * appear across the top of the map.
 */
export interface Stage {
    /** what the system hands back in place of an answer */
    kind: string;
    /** the swap in three words */
    note: string;
    /** the system that makes it; absent for the earlier stretch */
    project?: string;
    /** work that predates the thesis — drawn muted at the end of the scale */
    prior?: boolean;
}

export const stages: Stage[] = [
    { kind: "Sequence", note: "stages, not a verdict", project: "Criticmate" },
    { kind: "Reception", note: "uptake, not assessment", project: "Postalk" },
    { kind: "Opposition", note: "both sides, not advice", project: "PRISM" },
    { kind: "Before", note: "AI that reads people", prior: true },
];
