"use client";

import { useEffect, useState } from "react";

// Kept in pieces so the literal address never appears in the prerendered HTML.
const USER = "kojisu";
const HOST = ["hanyang", "ac", "kr"].join(".");

/**
 * Shows the address in the `name [at] domain` form that people read at a glance
 * and naive address harvesters skip. The real `mailto:` is assembled in the
 * browser after mount, so the link still works in one click while the static
 * HTML never carries the address in a scrapeable form.
 *
 * This defeats regex scrapers reading the served HTML — not a headless browser
 * that runs the page's JavaScript.
 */
export function Email({ className }: { className?: string }) {
    const [href, setHref] = useState<string | undefined>(undefined);

    useEffect(() => {
        setHref(`mailto:${USER}@${HOST}`);
    }, []);

    return (
        <a className={className} href={href} rel="nofollow">
            {USER} [at] {HOST}
        </a>
    );
}
