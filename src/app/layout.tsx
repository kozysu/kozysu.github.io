import type { Metadata } from "next";
import "../styles/index.css";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = {
    title: "Jisu Ko",
    description:
        "HCI researcher studying what AI should return in place of an answer when people work out what they want only by doing the work. Ph.D. student at the Human-AI Interaction Lab, Hanyang University ERICA.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                {/* a dot grid under everything, so the white ground reads as
                    paper rather than as nothing */}
                <div className="bg-dots" aria-hidden />

                <div className="layout">
                    <SiteHeader />

                    <main className="page">{children}</main>

                    <footer className="site-footer">
                        <span>© {new Date().getFullYear()} · JISU KO · ALL RIGHTS RESERVED</span>
                    </footer>
                </div>
            </body>
        </html>
    );
}
