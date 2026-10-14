/**
 * Home-page research lens: four design principles the work explores. They are
 * a way of looking at the papers, not a process each one implements end to
 * end, so they carry no order and each lists only the papers that touch it.
 * Edit freely.
 */
export interface LensPrinciple {
    /** the short label above the title */
    key: string;
    title: string;
    line: string;
    /** papers that explore it; names as in `publications.ts` */
    projects: string[];
    /** which small diagram to draw */
    figure: "reveal" | "reframe" | "revise" | "agency";
}

export const lensIntro = {
    lead: "Making thinking visible, perspectives explorable, and decisions revisable.",
    body:
        "Across design, decision-making, and communication, I explore how AI can " +
        "make reflection actionable while keeping people in control.",
};

export const lensPrinciples: LensPrinciple[] = [
    {
        key: "Reveal",
        title: "Making Thinking Visible",
        line: "Externalizing reasoning, intentions, and assumptions so they can be examined.",
        projects: ["Criticmate", "Postalk"],
        figure: "reveal",
    },
    {
        key: "Reframe",
        title: "Exploring Perspectives",
        line: "Introducing alternative viewpoints and feedback that invite reconsideration.",
        projects: ["PRISM", "Postalk"],
        figure: "reframe",
    },
    {
        key: "Revise",
        title: "Enabling Revision",
        line: "Making interpretations, priorities, and outputs open to meaningful change.",
        projects: ["Criticmate", "Postalk"],
        figure: "revise",
    },
    {
        key: "Agency",
        title: "Preserving Human Agency",
        line: "Keeping people actively involved in directing AI-supported thinking and action.",
        projects: ["PRISM", "Postalk"],
        figure: "agency",
    },
];
