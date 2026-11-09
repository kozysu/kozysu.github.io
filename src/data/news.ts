export interface NewsItem {
    date: string;
    content: string;
    link?: string;
    /** the words in `content` that carry the link; the rest stays plain text */
    linkText?: string;
}

export const newsData: NewsItem[] = [
    {
        date: "Nov 2026",
        content: "Two of my CHI 2027 reviews received Special Recognition for Outstanding Reviews! 🏅",
    },
    {
        date: "Sep 2026",
        content: "Our Masked Pose Embedding paper has been accepted in Machine Vision and Applications! 🎉",
        linkText: "Masked Pose Embedding",
        link: "https://link.springer.com/article/10.1007/s00138-026-01909-7",
    },
    {
        date: "Apr 2026",
        content: "Attended CHI 2026 in Barcelona 🇪🇸",
    },
    {
        date: "Jan 2026",
        content: "Our Criticmate paper has been conditionally accepted to CHI 2026! Best birthday gift ever 🎉",
        linkText: "Criticmate",
        link: "https://doi.org/10.1145/3772318.3790929",
    },
    {
        date: "Sep 2025",
        content: "Passed my Ph.D. qualifying exam 🎓",
    },
    {
        date: "May 2025",
        content: "Attended CHI 2025 in Yokohama 🇯🇵",
    },
    {
        date: "Mar 2024",
        content: "Started my Ph.D. at the Human-AI Interaction Lab 🧑‍💻",
    },
    // {
    //     date: "Dec 2023",
    //     content: "Completed my Master's defense 🎓",
    // },
    // {
    //     date: "Mar 2022",
    //     content: "Started my Master's at Human-AI Interaction Lab 🧑‍💻",
    // },
];
