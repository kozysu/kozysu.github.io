"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "../assets/logo.png";
import { usePathname } from "next/navigation";
import { projectsVisible } from "../data/systems";
import { profiles } from "../data/profiles";

const links = [
    { label: "Publications", href: "/publications" },
    ...(projectsVisible ? [{ label: "Projects", href: "/projects" }] : []),
    // CV hidden from the nav for now; /cv still builds
    // { label: "CV", href: "/cv" },
];

/**
 * One thin bar across the top, in place of the old left rail: the name on the
 * left (it is the way home), the pages and the outside profiles on the right.
 * Position and lab are said once, on the home page, not on every page.
 */
export default function SiteHeader() {
    const pathname = usePathname();

    return (
        <header className="site-header">
            <div className="site-header-inner">
                <Link href="/" className="site-name">
                    <Image src={logo} alt="" width={26} height={26} priority />
                    Jisu Ko
                </Link>

                <nav className="site-nav">
                    {links.map(({ label, href }) => (
                        <Link
                            key={href}
                            href={href}
                            className={pathname.startsWith(href) ? "active" : undefined}
                        >
                            {label}
                        </Link>
                    ))}

                    <span className="site-profiles">
                        {profiles.map(({ label, href, Icon }) => (
                            <a
                                key={href}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                title={label}
                            >
                                <Icon aria-hidden="true" />
                            </a>
                        ))}
                    </span>
                </nav>
            </div>
        </header>
    );
}
