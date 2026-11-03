"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImageIcon } from "lucide-react";
import { projectsVisible, slugForProject } from "../data/systems";
import { publications } from "../data/publications";
import { DemoFigure } from "./DemoFigure";

/** The home row is the international record; Korean venues stay on the full
 *  list, under their own tab. Criticmate is pulled ahead of the MVA paper
 *  here only — the full list keeps the authored order. */
const papers = (() => {
    const list = publications.filter((pub) => !pub.domestic);
    const from = list.findIndex((pub) => pub.project === "Criticmate");
    const to = list.findIndex((pub) => pub.venueShort === "MVA");
    if (from > to && to >= 0) list.splice(to, 0, ...list.splice(from, 1));
    return list;
})();

/**
 * Every paper on the home page, as the same figure-venue-title cards the
 * selected three used to be, in a row that steps a card at a time with the
 * arrows (or scrolls and snaps under a finger). Order is the authored order
 * in `publications.ts`, newest first, but for the one move above.
 *
 * Above the row runs a fixed timeline: each year sits on it where its first
 * card falls in the row, and a short bar on the line marks the stretch in
 * view, so stepping through the cards reads as moving through the years.
 *
 * A card links to its project page where the paper has one, and to the full
 * list otherwise.
 */
/** Each year with the index of its first card, newest first. */
const years = papers.reduce<{ year: number; first: number }[]>(
    (acc, pub, i) => (acc.at(-1)?.year === pub.year ? acc : [...acc, { year: pub.year, first: i }]),
    [],
);

interface View {
    /** visible window, as fractions of the whole row */
    start: number;
    size: number;
    /** where each year's first card sits, as a fraction of the whole row */
    marks: number[];
}

export function PubCarousel() {
    const trackRef = useRef<HTMLDivElement>(null);
    const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);
    const [view, setView] = useState<View>({
        start: 0,
        size: 1,
        marks: years.map(({ first }) => first / papers.length),
    });

    // read off the scroll position rather than kept as an index, so a swipe
    // and an arrow click can never disagree about where the row is
    const sync = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;
        const { scrollLeft, clientWidth, scrollWidth } = track;
        setAtStart(scrollLeft <= 1);
        setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
        setView({
            start: scrollLeft / scrollWidth,
            size: clientWidth / scrollWidth,
            marks: years.map(
                ({ first }) => (slotRefs.current[first]?.offsetLeft ?? 0) / scrollWidth,
            ),
        });
    }, []);

    const jumpTo = (index: number) => {
        const track = trackRef.current;
        const slot = slotRefs.current[index];
        if (!track || !slot) return;
        track.scrollTo({ left: slot.offsetLeft, behavior: "smooth" });
    };

    useEffect(() => {
        sync();
        window.addEventListener("resize", sync);
        return () => window.removeEventListener("resize", sync);
    }, [sync]);

    // one card at a time: the pitch is a card and the gap after it, read off
    // where the first two cards sit
    const step = (dir: 1 | -1) => {
        const track = trackRef.current;
        const [a, b] = slotRefs.current;
        if (!track || !a) return;
        const pitch = b ? b.offsetLeft - a.offsetLeft : a.offsetWidth;
        track.scrollBy({ left: dir * pitch, behavior: "smooth" });
    };

    return (
        <>
            <div className="sec-head">
                <h2 className="display-sm">Publications</h2>
                <Link className="sec-action" href="/publications">
                    All publications
                    <span className="arrow" aria-hidden>
                        →
                    </span>
                </Link>
            </div>

            <div className="pub-timeline">
                <span
                    className="pub-timeline-bar"
                    style={{
                        left: `${view.start * 100}%`,
                        width: `${view.size * 100}%`,
                    }}
                    aria-hidden
                />
                {years.map(({ year, first }, i) => {
                    const at = view.marks[i];
                    const next = view.marks[i + 1] ?? 1;
                    const inView = at < view.start + view.size - 0.001 && next > view.start + 0.001;
                    return (
                        <button
                            type="button"
                            key={year}
                            className={`pub-timeline-year${inView ? " on" : ""}`}
                            style={{ left: `${at * 100}%` }}
                            onClick={() => jumpTo(first)}
                        >
                            {year}
                        </button>
                    );
                })}
            </div>

            <div className="pub-carousel">
                <button
                    type="button"
                    className="pub-arrow prev"
                    aria-label="Previous publications"
                    disabled={atStart}
                    onClick={() => step(-1)}
                >
                    ‹
                </button>
                <button
                    type="button"
                    className="pub-arrow next"
                    aria-label="Next publications"
                    disabled={atEnd}
                    onClick={() => step(1)}
                >
                    ›
                </button>

                <div className="pub-track" ref={trackRef} onScroll={sync}>
                    {papers.map((pub, i) => {
                        const slug = projectsVisible && slugForProject(pub.project);
                        const img = pub.imageUrl ?? null;

                        return (
                            <div
                                className="pub-slot"
                                key={pub.title}
                                ref={(node) => {
                                    slotRefs.current[i] = node;
                                }}
                            >
                                <Link
                                    className="system"
                                    href={slug ? `/projects/${slug}` : "/publications"}
                                >
                                    <DemoFigure
                                        className={`system-fig${img ? "" : " pending"}`}
                                        demo={img && pub.demoUrl}
                                    >
                                        {img ? (
                                            <Image
                                                src={img}
                                                alt=""
                                                sizes="(max-width: 900px) 100vw, 33vw"
                                            />
                                        ) : (
                                            <ImageIcon size={28} strokeWidth={1.25} aria-hidden />
                                        )}
                                    </DemoFigure>

                                    <span className="venue">{pub.venueShort ?? pub.venue} · {pub.year}</span>

                                    <h3>{pub.titleEn ?? pub.title}</h3>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
