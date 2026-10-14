export interface NewsItem {
    date: string;
    content: string;
    link?: string;
}

export const newsData: NewsItem[] = [
    {
        date: "Sep 2026",
        content: "Our paper on masked pose embedding has been accepted to Machine Vision and Applications 🎉",
    },
    {
        date: "Apr 2026",
        content: "Attended CHI 2026 in Barcelona 🇪🇸",
    },
    {
        date: "Jan 2026",
        content: "One paper has been conditionally accepted to CHI 2026! Best birthday gift ever 🎉",
        // link: "#"
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
        date: "Aug 2024",
        content: "Served as TA for 'LangChain-based Chatbot Application Development' workshop at Dongsan High School 🧑‍🏫",
    },
    {
        date: "Jul 2024",
        content: "Exhibited Colorbo at 'Digital Planet' exhibition, Busan National Science Museum 🎨",
    },
    {
        date: "Mar 2024",
        content: "Started Ph.D. at Human-AI Interaction Lab 🧑‍💻",
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
