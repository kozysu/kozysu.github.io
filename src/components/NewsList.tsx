"use client";

import { useEffect, useRef, useState } from "react";
import { newsData, NewsItem } from "../data/news";

function Note({ item, i }: { item: NewsItem; i?: number }) {
    return (
        <div
            className="note"
            style={i === undefined ? undefined : ({ "--i": i } as React.CSSProperties)}
        >
            <span className="when">{item.date}</span>
            <span>
                {item.link ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                        {item.content}
                    </a>
                ) : (
                    item.content
                )}
            </span>
        </div>
    );
}

/** Headed like every other home section — title, rule, and the one action on
 *  the far end. Only the latest item shows; everything earlier opens in place
 *  underneath it, so the home page leads with one line of news, not a log. */
export function NewsList() {
    const [open, setOpen] = useState(false);
    const moreRef = useRef<HTMLDivElement>(null);
    const [latest, ...earlier] = newsData;

    // a folded row can't be tabbed into or read out; `inert` does both, and
    // React 18 doesn't pass it through as a prop
    useEffect(() => {
        moreRef.current?.toggleAttribute("inert", !open);
    }, [open]);

    if (!latest) return null;

    return (
        <>
            <div className="sec-head">
                <h2 className="display-sm">News</h2>

                {earlier.length > 0 && (
                    <button
                        className="sec-action toggle"
                        onClick={() => setOpen((o) => !o)}
                        aria-expanded={open}
                        aria-controls="news-earlier"
                    >
                        {open ? "Show less" : "Show all"}
                        <span className="chev" aria-hidden />
                    </button>
                )}
            </div>

            <div className="notes">
                <Note item={latest} />

                <div id="news-earlier" ref={moreRef} className={`notes-more${open ? " open" : ""}`}>
                    <div className="notes-more-inner">
                        {earlier.map((item, i) => (
                            <Note item={item} i={i} key={item.date + item.content} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
