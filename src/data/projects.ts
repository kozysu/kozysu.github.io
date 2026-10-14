import { Project } from "../types/project";
import criticmateImg from "../assets/26_criticmate.webp";
import PrioritizationImg from "../assets/25_prioritization.png";
import MorningEmotionImg from "../assets/24_morningemo.png";
import ColorboImg from "../assets/24_colorbo.webp";
import CompEmoImg from "../assets/24_compemo.png";
import MorningBehaviorImg from "../assets/22_morningbehavior.png";

/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ WHAT WAS REMOVED, AND WHY                                               │
 * │                                                                         │
 * │ Eight of these entries carried the same pasted paragraph — "A           │
 * │ longitudinal study on morning behavior changes using specialized        │
 * │ wake-up tasks" — along with the same `role`, `tags` and `technologies`. │
 * │ It described the Coastal Overtopping Prediction System as a morning     │
 * │ wake-up study, and it was live on /projects.                            │
 * │                                                                         │
 * │ Everything that could not be sourced has been taken out rather than     │
 * │ reworded, so nothing here is a guess:                                   │
 * │                                                                         │
 * │  · `role` and `technologies` are gone from every entry. They were       │
 * │    identical across eight projects ("React Native, Firebase, HealthKit  │
 * │    API" on a coastal prediction system). Add them back per project.     │
 * │  · `detailDescription` is gone from Criticmate and the pose system.     │
 * │    Both read as plausible filler — Criticmate's named "balance,         │
 * │    contrast, and alignment" where the paper's own teaser figure says    │
 * │    perception / comprehension / projection.                             │
 * │  · This YouTube link was on seven different entries, so it could not be │
 * │    attributed to any one of them. Put it back where it belongs:         │
 * │    https://youtu.be/VDjTSU0eei0?si=M1IpFeJ7e_Jlbyx8&t=49                │
 * │                                                                         │
 * │ `description` is now taken from the matching paper in publications.ts   │
 * │ where one exists, and left empty where none does. An empty one renders  │
 * │ as "Write-up to come" rather than as someone else's project.            │
 * │                                                                         │
 * │ STILL NEEDS COPY: Colorbo, Sleep Quality Evaluation, Morning Behavior   │
 * │ Change, Adaptive Mission, Morning Sound, Coastal Overtopping.           │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

export const projects: Project[] = [
    {
        title: "Criticmate",
        year: "2026",
        // CHI 2026 — Criticmate: Stagewise Human–AI Co-Critique in Single-Screen
        // UI Evaluation
        description:
            "Stagewise human–AI co-critique for evaluating a UI on a single screen.",
        tags: ["Human-AI Interaction", "Design Critique"],
        imageUrl: criticmateImg,
    },
    {
        title: "Requirement Prioritization Agent",
        year: "2025",
        // KSC '25 — Project Requirement Prioritization Using LLM Agents.
        // Registered as software: C-2025-046626, Korea Copyright Commission.
        description:
            "Prioritizing project requirements with a framework of LLM agents.",
        tags: ["LLM Agents", "Software Engineering"],
        imageUrl: PrioritizationImg,
    },
    {
        title: "Compound Facial Emotion Recognition Using VLMs",
        year: "2024",
        // KSC '24 — Compound Facial Emotion Recognition Using Vision Language
        // Models
        description:
            "Recognizing compound facial emotions with vision language models.",
        tags: ["Vision-Language Models", "Facial Emotion Recognition"],
        imageUrl: CompEmoImg,
    },
    {
        title: "Pose Analysis System",
        year: "2024",
        // MVA (accepted) — Masked Pose Embedding for View and Occlusion
        // Invariance in 2D Pose Analysis. Patent 10-2024-0008158; registered as
        // software C-2024-047372.
        description:
            "Masked pose embedding for view and occlusion invariance in 2D pose analysis.",
        tags: ["Pose & Motion Analysis", "Masked Autoencoders"],
        imageUrl: "",
        githubUrl: "https://github.com/kozysu",
    },
    {
        title: "Wake-up Tasks for Behavior Change",
        year: "2024",
        // JMIR Formative Research 2022 — Using wake-up tasks for morning
        // behavior change: development and usability study
        description:
            "Wake-up tasks for morning behavior change: development and usability study.",
        tags: ["Behavioral Sensing", "Digital Wellness"],
        imageUrl: MorningEmotionImg,
        projectUrl: "https://formative.jmir.org/2022/9/E39497",
    },
    {
        title: "Colorbo",
        year: "2024",
        // Exhibited at the "Digital Planet" exhibition, Busan National Science
        // Museum, 2024.07 (see cv.ts). Nothing else on file.
        description: "",
        tags: ["Exhibition"],
        imageUrl: ColorboImg,
    },
    {
        title: "Sleep Quality Evaluation",
        year: "2023",
        description: "",
        tags: ["Digital Wellness"],
        imageUrl: "",
    },
    {
        title: "Morning Behavior Change",
        year: "2022",
        description: "",
        tags: ["Digital Wellness"],
        imageUrl: MorningBehaviorImg,
    },
    {
        title: "Adaptive Mission",
        year: "2022",
        description: "",
        tags: ["Digital Wellness"],
        imageUrl: MorningBehaviorImg,
    },
    {
        title: "Morning Sound",
        year: "2022",
        description: "",
        tags: ["Digital Wellness"],
        imageUrl: "",
    },
    {
        title: "Coastal Overtopping Prediction System",
        year: "2022",
        description: "",
        tags: ["Prediction System"],
        imageUrl: "",
    },
];
