import { Publication, Patent, SoftwareRegistration } from "../types/publication";
import img22MorningBehavior from "../assets/22_mbc_line.webp";
import img24Colorbo from "../assets/24_colorbo.webp";
import img24CompEmo from "../assets/24_compemo.png";
import img24MorningEmo from "../assets/24_mwi_line.webp";
import img25Prioritization from "../assets/25_prioritization.png";
import img26Criticmate from "../assets/26_criticmate_line.webp";
import img26PosTalk from "../assets/26_postalk.webp";
import img26PRISM from "../assets/26_prism.png";
import img26MPE from "../assets/26_mpe_line.webp";

/**
 * Venue metrics, read off each venue's own page in September 2026. Impact
 * factors move once a year with the JCR release — check these against the
 * source before the CV goes anywhere that matters.
 *
 * Only the journals carry them: a conference is not measured on the same
 * scale, and half a line of CORE ranks beside half a line of impact factors
 * reads as though they were. CHI's figures, if they are ever wanted:
 * CORE A* (ICORE 2026), Google Scholar h5-index 129, CHI 2026 accepted
 * 1,702 of 6,725 (25.3%).
 *
 *   MVA              Springer; JCR Q3, 2025 JIF 2.3 (5-year 2.5)
 *   JMIR Hum Factors ESCI — not SCIE; 2025 JIF 3.9; Q1 Health Care Sciences
 *                    & Services, 77th percentile (46/194)
 *   JMIR Form Res    ESCI; 2025 JIF 2.4; Q2 Health Care Sciences & Services,
 *                    50th percentile (97/194)
 *   Applied Sciences MDPI, SCIE; 2025 JIF 2.9 (2026 JCR release); Q2
 *                    Engineering, Multidisciplinary
 *   KIISE / HCI Korea  domestic proceedings — no index or impact factor
 */
export const publications: Publication[] = [
    {
        title: "\"On the Wall or in the Talk?\": A Cross-Channel Takeaway Loop for Academic Poster Authoring",
        authors: ["Jisu Ko", "Seyoung Park", "Minsam Ko"],
        venue: "Under review",
        venueShort: "Under review",
        project: "Postalk",
        keywords: ["Human-AI Interaction", "Academic Communication"],
        year: 2026,
        projectUrl: "#",
        pdfUrl: "#",
        imageUrl: img26PosTalk,
        isSelected: true
    },
    {
        title: "Taking Sides with Yourself: How Opposing AI Perspectives Shape Attention in Career Decision-Making",
        authors: ["Gijun Jang*","Jisu Ko*", "Jinyoung Choi*", "Minsam Ko"],
        venue: "Under review",
        venueShort: "Under review",
        project: "PRISM",
        keywords: ["Human-AI Interaction", "Judgment & Decision Support"],
        year: 2026,
        projectUrl: "#",
        pdfUrl: "#",
        imageUrl: img26PRISM,
        isSelected: true
    },
    {
        title: "Masked Pose Embedding for View and Occlusion Invariance in 2D Pose Analysis",
        authors: ["Jisu Ko", "Jeonguk Seo", "Minsam Ko"],
        venue: "Machine Vision and Applications 2026",
        venueShort: "MVA",
        metrics: ["SCIE Q3", "IF 2.3"],
        keywords: ["Pose & Motion Analysis"],
        year: 2026,
        projectUrl: "https://link.springer.com/article/10.1007/s00138-026-01909-7",
        pdfUrl: "/papers/26_pose.pdf",
        imageUrl: img26MPE,
        isSelected: false
    },
    {
        title: "다중 페르소나 상호작용을 활용한 진로 의사결정 지원 시스템",
        titleEn: "Supporting Reflective Career Decision-Making through Multi-Persona Interaction",
        authors: ["최진영", "고지수", "고민삼"],
        venue: "한국정보과학회 학술발표논문집 (한국컴퓨터종합학술대회)",
        venueShort: "KCC",
        domestic: true,
        keywords: ["Human-AI Interaction", "Judgment & Decision Support"],
        year: 2026,
        isSelected: false
    },
    {
        title: "Criticmate: Stagewise Human–AI Co-Critique in Single-Screen UI Evaluation",
        authors: ["Jisu Ko", "Jinyoung Choi", "Cielo Morales", "Dajung Kim", "Minsam Ko"],
        venue: "ACM CHI Conference on Human Factors in Computing Systems 2026",
        venueShort: "CHI",
        project: "Criticmate",
        keywords: ["Human-AI Interaction", "Design Critique"],
        year: 2026,
        projectUrl: "https://doi.org/10.1145/3772318.3790929",
        pdfUrl: "/papers/26_criticmate.pdf",
        imageUrl: img26Criticmate,
        isSelected: true
    },
    {
        title: "LLM 에이전트를 활용한 프로젝트 요구사항 우선순위화",
        titleEn: "Project Requirement Prioritization Using LLM Agents",
        authors: ["최진영", "고지수", "고민삼"],
        venue: "한국정보과학회 학술발표논문집",
        venueShort: "KSC",
        domestic: true,
        pages: "630–632",
        keywords: ["LLM Agents", "Software Engineering"],
        year: 2025,
        imageUrl: img25Prioritization,
        isSelected: false
    },
    {
        title: "Understanding Morning Emotions by Analyzing Daily Wake-Up Alarm Usage: Longitudinal Observational Study",
        authors: ["Kyue Taek Oh*", "Jisu Ko*", "Nayoung Jin", "Sangbin Han", "Chan Yul Yoon", "Jaemyung Shin", "Minsam Ko"],
        venue: "JMIR Human Factors 2024",
        venueShort: "JMIR HF",
        metrics: ["ESCI Q1", "77th pct", "IF 3.9"],
        keywords: ["Behavioral Sensing", "Digital Wellness"],
        year: 2024,
        projectUrl: "https://humanfactors.jmir.org/2024/1/e50835",
        pdfUrl: "#",
        imageUrl: img24MorningEmo,
        isSelected: false
    },
    {
        title: "비전 언어 모델을 활용한 복합 얼굴 표정 인식",
        titleEn: "Compound Facial Emotion Recognition Using Vision Language Models",
        authors: ["신요섭", "고지수", "고민삼"],
        venue: "한국정보과학회 학술발표논문집",
        venueShort: "KSC",
        domestic: true,
        pages: "657–659",
        keywords: ["Pose & Motion Analysis"],
        year: 2024,
        imageUrl: img24CompEmo,
        isSelected: false
    },
    {
        title: "마스크 기반 자세 임베딩을 통한 시점 및 가려짐 불변적 자세 분석",
        titleEn: "Pose Analysis with View and Occlusion Invariance via Masked Pose Embedding",
        authors: ["고지수", "고민삼"],
        venue: "한국정보과학회 학술발표논문집",
        venueShort: "KCC",
        domestic: true,
        pages: "729–731",
        keywords: ["Pose & Motion Analysis"],
        year: 2024,
        imageUrl: img24Colorbo,
        isSelected: false
    },
    {
        title: "Using wake-up tasks for morning behavior change: development and usability study",
        authors: ["Kyue Taek Oh", "Jisu Ko", "Jaemyung Shin", "Minsam Ko"],
        venue: "JMIR Formative Research 2022",
        venueShort: "JMIR FR",
        metrics: ["ESCI Q2", "50th pct", "IF 2.4"],
        keywords: ["Behavioral Sensing", "Digital Wellness"],
        year: 2022,
        projectUrl: "https://formative.jmir.org/2022/9/E39497",
        pdfUrl: "#",
        imageUrl: img22MorningBehavior,
        isSelected: false
    },
    {
        title: "A Review of Deep Learning Applications for Railway Safety",
        authors: ["Kyue Taek Oh", "Mintaek Yoo", "Nayoung Jin", "Jisu Ko", "Jeonguk Seo", "Hyojin Joo", "Minsam Ko"],
        venue: "Applied Sciences 2022",
        venueShort: "Appl. Sci.",
        metrics: ["SCIE Q2", "IF 2.9"],
        keywords: ["Pose & Motion Analysis"],
        year: 2022,
        projectUrl: "https://www.mdpi.com/2076-3417/12/20/10572",
        pdfUrl: "#",
        isSelected: false
    },
    {
        title: "합성곱 신경망 기반 유튜브 동영상 섬네일 스타일 분석",
        titleEn: "Analyzing Thumbnail Styles of YouTube Videos via Convolutional Neural Network",
        authors: ["김진아", "고지수", "이윤지", "임주연", "고민삼"],
        venue: "한국HCI학회 학술대회",
        venueShort: "HCI Korea",
        domestic: true,
        pages: "283–287",
        year: 2021,
        isSelected: false
    }
];

export const patents: Patent[] = [
    {
        title: "MASKED AUTOENCODER 2D IMAGE MOTION ANALYSIS METHOD AND THE SYSTEM THEREOF",
        patentNo: "10-2024-0008158",
        authority: "Korean Intellectual Property Office",
        year: "2024"
    }
];

export const softwareRegistrations: SoftwareRegistration[] = [
    {
        title: "LLM Agent-based Requirements Prioritization Framework",
        registrationNo: "C-2025-046626",
        authority: "Korea Copyright Commission",
        year: "2025"
    },
    {
        title: "Video-based Motion Analysis Program",
        registrationNo: "C-2024-047372",
        authority: "Korea Copyright Commission",
        year: "2024"
    }
];
