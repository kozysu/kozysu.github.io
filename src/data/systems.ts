import figWorkflow from "../assets/criticmate/fig2_workflow.png";
import figInterface from "../assets/criticmate/fig3_interface.png";
import figGuidelines from "../assets/criticmate/fig6_guidelines.png";
import figConditions from "../assets/criticmate/fig8_conditions.png";
import figGlobalLocal from "../assets/criticmate/fig9_global_local.png";
import figDiversity from "../assets/criticmate/fig10_diversity.png";
import figQuality from "../assets/criticmate/fig12_quality.png";

/**
 * Per-system project pages, in the shape an HCI project page usually takes:
 * a one-line swap, a teaser, an abstract, then as many sections as the work
 * needs.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ PLEASE READ BEFORE PUBLISHING                                           │
 * │                                                                         │
 * │ Criticmate is written from the paper itself — public/papers/            │
 * │ 26_criticmate.pdf. Abstract verbatim, everything else with the figures  │
 * │ and numbers it came from.                                               │
 * │                                                                         │
 * │ Postalk and PRISM have no PDF on file, so their `tldr` lines are still  │
 * │ DRAFTS written from the paper titles and teaser figures — not from the  │
 * │ papers. Rewrite them, or drop the PDFs into public/papers/ and I can    │
 * │ fill those pages the same way. Their `abstract` and `sections` are      │
 * │ deliberately empty: the page renders without them rather than showing   │
 * │ something invented.                                                     │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Title, authors, venue, year, teaser figure and the PDF link are NOT repeated
 * here — they are read from `publications.ts`, matched on `project`.
 */

/** a small named block inside a section — three stages, four components, … */
export interface SystemCard {
    /** the tiny label above the card's title */
    label?: string;
    title: string;
    body: string;
}

/** a figure worth reading at a glance rather than inside a sentence */
export interface SystemStat {
    value: string;
    label: string;
    /** what it beat, when there is a comparison */
    against?: string;
}

/** a figure from the paper, with the paper's own caption */
export interface SystemFigure {
    /** a static image import */
    src: unknown;
    caption?: string;
}

/**
 * A plot drawn from the paper's own tables rather than lifted from it — the
 * figures in the PDF are vector, and a scaled screenshot of matplotlib output
 * would be both soft and off-key against the rest of the page.
 */
export interface SystemChart {
    /** one entry per series; two at most */
    series: string[];
    /** the axis top — bars are drawn as a fraction of it */
    max: number;
    rows: {
        label: string;
        /** one value per series */
        values: number[];
        /** significance, comparison, whatever the row needs */
        note?: string;
        /** the row this work is on, drawn at full strength */
        lead?: boolean;
    }[];
    caption: string;
}

export interface SystemSection {
    /** the small accent label above the heading */
    eyebrow: string;
    /** the heading, written as a statement rather than a noun */
    heading: string;
    /** shown under the heading, before anything else */
    lead?: string;
    body?: string[];
    cards?: SystemCard[];
    stats?: SystemStat[];
    figures?: SystemFigure[];
    chart?: SystemChart;
    /** draw the section on a tinted band */
    band?: boolean;
}

export interface SystemPage {
    /** the URL segment: /projects/<slug> */
    slug: string;
    /** matches `Publication.project` and `Stage.project` */
    project: string;
    /** the swap in a sentence or two — what it returns instead of an answer */
    tldr: string;
    /** one line under the authors; omit to fall back to the lab */
    affiliations?: string[];
    abstract?: string;
    sections?: SystemSection[];
    /** only rendered when present */
    videoUrl?: string;
    codeUrl?: string;
    /** shown in a copyable block; omit while a paper is under review */
    bibtex?: string;
}

export const systemPages: SystemPage[] = [
    {
        // Everything in this entry is taken from the paper itself
        // (public/papers/26_criticmate.pdf). Figures, tables and section
        // numbers are cited so any claim can be checked against the source.
        slug: "criticmate",
        project: "Criticmate",
        tldr:
            "AI tools evaluate a screen in a single pass and hand back a " +
            "verdict, which leaves room for neither the model's reasoning nor " +
            "the designer's judgement. Criticmate splits the evaluation into " +
            "three editable stages — Perception, Comprehension, Projection — " +
            "and exposes what the model inferred at each one, so a designer " +
            "can correct the structure before any critique is written.",
        abstract:
            "AI tools are increasingly used for UI evaluation, yet most treat " +
            "evaluation as a single-pass, black-box process that limits both " +
            "effective model reasoning and human involvement. Grounded in " +
            "Situation Awareness (SA) theory, we reframe single-screen " +
            "heuristic evaluation of mobile UIs as stagewise human–AI " +
            "co-critique, structuring evaluation into three editable stages: " +
            "Perception (what is on the screen), Comprehension (what elements " +
            "mean and do), and Projection (what problems and fixes follow). We " +
            "instantiate this framing in Criticmate, an interactive system " +
            "that exposes intermediate reasoning artifacts for intervention. " +
            "Across offline benchmarks and a controlled user study, we show " +
            "that stagewise co-critique yields more expert-like and better " +
            "balanced critiques than single-pass approaches, while supporting " +
            "higher trust and engagement without reducing perceived autonomy.",
        affiliations: [
            "Department of Applied Artificial Intelligence, Hanyang University",
            "Department of Human Computer Interaction, Hanyang University",
            "Department of Design, Ulsan National Institute of Science and Technology",
        ],
        sections: [
            {
                eyebrow: "The paradigm",
                heading: "Three editable stages, not one verdict.",
                lead:
                    "A formative study found that designers do not evaluate a " +
                    "screen in one pass. They scan globally before locally, and " +
                    "they inject domain knowledge more heavily the later the " +
                    "stage — while the AI tools they used structured none of it. " +
                    "Criticmate follows the same order, and hands the designer " +
                    "the controls at each one.",
                cards: [
                    {
                        label: "Stage 1",
                        title: "Perception",
                        body:
                            "The model segments the layout into non-overlapping " +
                            "sections and enumerates the components inside each. " +
                            "The designer validates or rewrites that structural " +
                            "map before any judgement is made on it.",
                    },
                    {
                        label: "Stage 2",
                        title: "Comprehension",
                        body:
                            "The model describes what those elements look like " +
                            "and what they do. The designer refines the reading " +
                            "with the task, brand and domain context the model " +
                            "cannot see from the pixels.",
                    },
                    {
                        label: "Stage 3",
                        title: "Projection",
                        body:
                            "The two jointly set the guidelines, identify gaps " +
                            "against them, group the gaps by root cause, and " +
                            "write fixes — each as an editable expected standard, " +
                            "identified gap and proposed fix.",
                    },
                ],
                figures: [
                    {
                        src: figWorkflow,
                        caption:
                            "Figure 2 — Stagewise co-critique workflow. " +
                            "Perception builds a structural map, Comprehension " +
                            "interprets the visual and functional roles of what " +
                            "it found, and Projection evaluates issues and " +
                            "proposes fixes against explicit guidelines. Each " +
                            "column names what the AI is asked for and what the " +
                            "designer does with the answer.",
                    },
                ],
            },
            {
                eyebrow: "System",
                heading: "Every intermediate result is an artifact you can edit.",
                band: true,
                lead:
                    "A web client–server system. The Target Panel holds the task " +
                        "description and the screenshot under evaluation; the " +
                        "Output Panel holds the current stage's outputs as " +
                    "structured, editable tables. Next.js on the front, " +
                    "FastAPI behind it.",
                body: [
                    "Two models, split by what each stage asks for: GPT-4o at " +
                        "temperature 0 for the visually grounded work of " +
                        "Perception and Comprehension, o3-mini at 0.3 for the " +
                        "longer reasoning of Projection. Every intermediate " +
                        "result is kept in a YAML representation recording " +
                        "sections, components, interpretations, guidelines, gaps " +
                        "and fixes — which is what makes the edit history " +
                        "versionable and the reasoning inspectable rather than " +
                        "something to take on trust.",
                ],
                figures: [
                    {
                        src: figInterface,
                        caption:
                            "Figure 3 — The interface. (A) Target Panel, holding " +
                            "the task description and the UI screenshot. " +
                            "(B) Output Panel, holding the current stage's " +
                            "outputs as an editable table.",
                    },
                    {
                        src: figGuidelines,
                        caption:
                            "Figure 6 — Guideline setup in Projection. The " +
                            "designer extends a default heuristic set with " +
                            "context-specific priorities, and the critique is " +
                            "written against the edited set rather than a fixed " +
                            "checklist.",
                    },
                ],
            },
            {
                eyebrow: "Offline evaluation",
                heading: "More expert-like, and the only one that stayed balanced.",
                lead:
                    "Against the UICrit dataset — 1,000 mobile screens with 8,387 " +
                    "expert-authored critique comments — we held out 102 UIs " +
                    "stratified by component density and compared the full " +
                    "pipeline against zero-shot and few-shot single-pass " +
                    "baselines, plus three ablations that collapse the stages.",
                body: [
                    "Splitting the stages is what recovers the minority class " +
                        "of comments: the full pipeline sits near 39% where " +
                        "every baseline and flattened variant stays between 10% " +
                        "and 28%, and it produces half again as many critiques " +
                        "per screen without repeating itself.",
                ],
                figures: [
                    {
                        src: figConditions,
                        caption:
                            "Figure 8 — The conditions compared: two " +
                            "single-pass baselines, and three ablations that " +
                            "collapse the stages one at a time.",
                    },
                    {
                        src: figGlobalLocal,
                        caption:
                            "Figure 9 — Balance of generated critiques across " +
                            "methods, with 95% bootstrap confidence intervals. " +
                            "The full pipeline is the only condition that does " +
                            "not collapse onto one level of description.",
                    },
                    {
                        src: figDiversity,
                        caption:
                            "Figure 10 — Content diversity. (a) Critique " +
                            "comments per UI. (b) Vendi Score for overall " +
                            "critiques, identified gaps and proposed fixes — " +
                            "more comments, and less repetition among them.",
                    },
                ],
                chart: {
                    series: ["F1@0.5"],
                    max: 0.7,
                    rows: [
                        { label: "CM-Full", values: [0.646], lead: true },
                        { label: "CM-w/oRCA", values: [0.603], note: "no root-cause analysis" },
                        { label: "FS (few-shot)", values: [0.508], note: "single pass, 8 examples" },
                        { label: "CM-UniProj", values: [0.481], note: "Projection collapsed" },
                        { label: "CM-Flat", values: [0.47], note: "Comprehension collapsed too" },
                        { label: "ZS (zero-shot)", values: [0.465], note: "single pass" },
                    ],
                    caption:
                        "Table 1 — Agreement with expert critiques, F1 at a " +
                        "cosine similarity threshold of 0.5. Every stage that " +
                        "is collapsed costs agreement, and the two single-pass " +
                        "baselines sit at the bottom with the flattest ablations.",
                },
            },
            {
                eyebrow: "User study",
                heading: "26 designers, and three more rating every critique blind.",
                band: true,
                lead:
                    "Thirteen professional designers and thirteen intermediates " +
                    "evaluated two screens, once with Criticmate and once with a " +
                    "single-pass baseline they could steer with free-text " +
                    "revision requests, in counterbalanced order.",
                figures: [
                    {
                        src: figQuality,
                        caption:
                            "Figure 12 — Split violin plots of critique quality, " +
                            "Criticmate against the baseline. (a) Participants " +
                            "rating their own critiques; (b) three professional " +
                            "designers rating them blind. The distance between " +
                            "the two halves is the finding.",
                    },
                ],
                body: [
                    "External raters preferred the Criticmate critiques on all " +
                        "four dimensions, and participants reported higher " +
                        "engagement and trust with no loss of perceived autonomy.",
                    "What changed most was the division of labour. The system " +
                        "took the surface checks — spacing, contrast, basic " +
                        "hierarchy — and the designers supplied task context, " +
                        "brand knowledge and long-term strategy. Intermediates " +
                        "used the stages as a scaffold for learning structured " +
                        "evaluation; experts used them to free attention for the " +
                        "harder judgements. Several experts also found the full " +
                        "workflow heavy for a trivial screen, which points at " +
                        "adaptive staging rather than a fixed three.",
                ],
            },
        ],
        bibtex: `@inproceedings{ko2026criticmate,
  author    = {Ko, Jisu and Choi, Jinyoung and Morales, Cielo and
               Kim, Dajung and Ko, Minsam},
  title     = {Criticmate: Stagewise Human--AI Co-Critique in
               Single-Screen UI Evaluation},
  booktitle = {Proceedings of the 2026 CHI Conference on Human Factors
               in Computing Systems (CHI '26)},
  year      = {2026},
  address   = {Barcelona, Spain},
  publisher = {ACM},
  doi       = {10.1145/3772318.3790929},
}`,
    },
    {
        slug: "postalk",
        project: "Postalk",
        tldr:
            "A poster and the talk beside it carry different takeaways, and an " +
            "author cannot hear either one. Postalk returns what an audience " +
            "would take away from each channel rather than an assessment of " +
            "the draft.",
    },
    {
        slug: "prism",
        project: "PRISM",
        tldr:
            "Asked about a career decision, an AI gives advice. PRISM returns " +
            "two opposing perspectives on the same decision and surfaces where " +
            "the attention goes.",
    },
];

/** "Criticmate: Stagewise…" under a heading that already says Criticmate reads
 *  as a stutter, so the system's own name comes off the front of its title. */
export function trimTitle(title: string, project: string) {
    return title.startsWith(`${project}:`)
        ? title.slice(project.length + 1).trim()
        : title;
}

export function systemPageFor(slug: string) {
    return systemPages.find((page) => page.slug === slug);
}

/** Projects are hidden for now: off the sidebar, and the home cards go to the
 *  publication list instead of a project page. The pages are still built —
 *  flip this back to bring them in. */
export const projectsVisible = false;

export function slugForProject(project: string | undefined) {
    if (!project) return undefined;
    return systemPages.find((page) => page.project === project)?.slug;
}
