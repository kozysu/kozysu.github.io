/**
 * Home-page research map: every paper placed in a 2×2.
 *   columns — who makes the call (AI / people)
 *   rows    — when the goal is set (forms during the work / given up front)
 * Placement is a judgment call; edit freely.
 */
export interface MapItem {
    name: string;
    note?: string;
    venue: string;
}

export interface MapCell {
    key: "formsAI" | "formsPeople" | "givenAI" | "givenPeople";
    current?: boolean;
    items: MapItem[];
}

export const mapColumns = ["AI decides", "People decide"];
export const mapRows = ["Goal forms during the work", "Goal is given up front"];

export const mapCells: MapCell[] = [
    {
        key: "formsAI",
        items: [{ name: "Requirement prioritization with LLM agents", venue: "KSC ’25" }],
    },
    {
        key: "formsPeople",
        current: true,
        items: [
            { name: "Criticmate", note: "staged UI critique", venue: "CHI ’26" },
            { name: "Postalk", note: "poster and talk authoring", venue: "under review" },
            { name: "PRISM", note: "career decisions", venue: "under review" },
        ],
    },
    {
        key: "givenAI",
        items: [
            { name: "Masked pose embedding", venue: "MVA ’26 · KCC ’24" },
            { name: "Compound facial emotion recognition", venue: "KSC ’24" },
            { name: "Morning emotions from alarm logs", venue: "JMIR HF ’24" },
            { name: "Deep learning for railway safety", note: "review", venue: "Appl. Sci. ’22" },
        ],
    },
    {
        key: "givenPeople",
        items: [{ name: "Wake-up tasks for behavior change", venue: "JMIR FR ’22" }],
    },
];
