"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { projectsVisible } from "../data/systems";

const links = [
    { label: "Home", href: "/" },
    { label: "Publications", href: "/publications" },
    ...(projectsVisible ? [{ label: "Projects", href: "/projects" }] : []),
    // CV hidden from the nav for now; /cv still builds
    // { label: "CV", href: "/cv" },
];

/**
 * One thin bar across the top: the name on the left, and on the right the
 * pages, all as the same small text — the page you are on in full ink.
 * Position, lab and the outside profiles are said once, on the home page,
 * not on every page.
 */
export default function SiteHeader() {
    const pathname = usePathname();

    return (
        <header className="site-header">
            <div className="site-header-inner">
                <Link href="/" className="site-name">
                    Jisu Ko
                </Link>

                <nav className="site-nav">
                    {links.map(({ label, href }) => (
                        <Link
                            key={href}
                            href={href}
                            className={
                                (href === "/" ? pathname === "/" : pathname.startsWith(href))
                                    ? "active"
                                    : undefined
                            }
                        >
                            {label}
                        </Link>
                    ))}

                </nav>
            </div>
        </header>
    );
}
