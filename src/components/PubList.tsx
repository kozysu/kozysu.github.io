"use client";

import { useRef, useState } from "react";
import { Publication } from "../types/publication";

/** Short label for the venue mark, e.g. "CHI 2026" → "CHI". */
function venueTag(venue: string, venueShort?: string) {
    if (venueShort) return venueShort;
    const acronym = venue.match(/\(([A-Z][A-Za-z]+)\b/);
    if (acronym) return acronym[1];
    return venue.replace(/\s*(19|20)\d{2}\s*$/, "");
}

/** Domestic papers carry the hangul name, so the byline is marked on either. */
const isMe = (author: string) =>
    author.includes("Jisu Ko") || author.includes("고지수");

/** Statuses that aren't a venue yet — shown muted rather than accented. */
const PENDING = /under review|in review|submitted|in prep|to appear/i;

/** A paper that names its system usually leads with it: "Criticmate: Stagewise
 *  …". The name is set in italic so the list can be read by system as well as
 *  by title. Anything else is left exactly as written. */
function titleParts(title: string, project?: string) {
    if (!project) return [null, title] as const;
    const head = title.split(":")[0];
    if (head.trim().toLowerCase() !== project.toLowerCase()) {
        return [null, title] as const;
    }
    return [head, title.slice(head.length)] as const;
}

function imgSrc(imageUrl: Publication["imageUrl"]) {
    if (!imageUrl) return undefined;
    return typeof imageUrl === "string" ? imageUrl : imageUrl.src;
}

const PEEK_WIDTH = 210;

/** Newest year first; within a year the authored order is kept. */
function groupByYear(items: Publication[]) {
    const groups = new Map<number, Publication[]>();
    for (const pub of items) {
        const bucket = groups.get(pub.year) ?? [];
        bucket.push(pub);
        groups.set(pub.year, bucket);
    }
    return [...groups.entries()].sort((a, b) => b[0] - a[0]);
}

interface PubListProps {
    items: Publication[];
    /** Show each paper's figure inline. Off for the home teaser, where the
     *  figure trails the cursor instead. */
    thumbs?: boolean;
}

export function PubList({ items, thumbs = false }: PubListProps) {
    const [peek, setPeek] = useState<string | null>(null);
    const peekRef = useRef<HTMLDivElement>(null);

    // Trails the pointer diagonally, clear of the line being read, and clamped
    // inside the viewport. Positioned imperatively — one re-render per mousemove
    // would be wasteful.
    const track = (e: React.MouseEvent) => {
        const node = peekRef.current;
        if (!node) return;
        const gap = 26;
        const maxX = document.documentElement.clientWidth - PEEK_WIDTH - 16;
        const maxY = window.innerHeight - (node.offsetHeight || 180) - 16;
        node.style.left = `${Math.min(e.clientX + gap, maxX)}px`;
        node.style.top = `${Math.min(e.clientY + gap, maxY)}px`;
    };

    return (
        <>
            <div className="pubs">
                {groupByYear(items).map(([year, list]) => (
                    <div className="year-row" key={year}>
                        <div className="year">{year}</div>

                        <div className="pub-list">
                            {list.map((pub, idx) => {
                                const src = imgSrc(pub.imageUrl);
                                // a domestic entry is a proceedings citation,
                                // not a paper with a teaser — it runs as one
                                // column and cites its pages instead
                                const withThumb = thumbs && !pub.domestic;
                                const tag = venueTag(pub.venue, pub.venueShort);
                                const hasProject =
                                    pub.projectUrl && pub.projectUrl !== "#";
                                const hasPdf = pub.pdfUrl && pub.pdfUrl !== "#";

                                return (
                                    <article
                                        className={`pub-row${
                                            withThumb ? " with-thumb" : ""
                                        }${pub.domestic ? " kr" : ""}`}
                                        key={idx}
                                        // the research lens on the home page links here
                                        id={pub.project && !pub.domestic ? pub.project.toLowerCase() : undefined}
                                        onMouseEnter={() =>
                                            !thumbs && setPeek(src ?? null)
                                        }
                                        onMouseLeave={() => setPeek(null)}
                                        onMouseMove={thumbs ? undefined : track}
                                    >
                                        <div>
                                            <div className="pub-head">
                                                <span
                                                    className={`venue-pill${
                                                        PENDING.test(tag)
                                                            ? " pending"
                                                            : ""
                                                    }`}
                                                >
                                                    {tag}
                                                </span>

                                                {pub.metrics && (
                                                    <span className="venue-metrics">
                                                        {pub.metrics.join(" · ")}
                                                    </span>
                                                )}
                                            </div>

                                            <h3
                                                className={
                                                    pub.titleEn ? undefined : "ko"
                                                }
                                            >{(() => {
                                                const [name, rest] = titleParts(
                                                    pub.titleEn ?? pub.title,
                                                    pub.project
                                                );
                                                return name ? (
                                                    <>
                                                        <em>{name}</em>
                                                        {rest}
                                                    </>
                                                ) : (
                                                    rest
                                                );
                                            })()}</h3>

                                            <p className="authors">
                                                {pub.authors.map((author, i) => (
                                                    <span key={i}>
                                                        {isMe(author) ? (
                                                            <b>{author}</b>
                                                        ) : (
                                                            author
                                                        )}
                                                        {i < pub.authors.length - 1
                                                            ? ", "
                                                            : ""}
                                                    </span>
                                                ))}
                                            </p>

                                            {pub.domestic ? (
                                                <p className="journal">
                                                    <span className="yr">{pub.year}</span>
                                                    {pub.venue}
                                                    {pub.pages && ` · pp. ${pub.pages}`}
                                                </p>
                                            ) : (
                                                pub.venue.toLowerCase() !==
                                                    tag.toLowerCase() && (
                                                    <p className="journal">{pub.venue}</p>
                                                )
                                            )}

                                            {(hasProject || hasPdf) && (
                                                <div className="links">
                                                    {hasProject && (
                                                        <a
                                                            href={pub.projectUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {/doi\.org|dl\.acm\.org|jmir\.org|mdpi\.com|link\.springer\.com/.test(
                                                                pub.projectUrl as string
                                                            )
                                                                ? "DOI"
                                                                : "Project"}{" "}
                                                            ↗
                                                        </a>
                                                    )}
                                                    {hasPdf && (
                                                        <a
                                                            href={pub.pdfUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            PDF ↗
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {withThumb && (
                                            <div
                                                className={`pub-thumb${
                                                    src ? "" : " pending"
                                                }`}
                                            >
                                                {src && <img src={src} alt="" />}
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div
                className="peek"
                ref={peekRef}
                aria-hidden="true"
                style={{
                    width: PEEK_WIDTH,
                    opacity: peek ? 1 : 0,
                    transform: `scale(${peek ? 1 : 0.96})`,
                }}
            >
                {peek && <img src={peek} alt="" />}
            </div>
        </>
    );
}
