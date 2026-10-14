"use client";

import { useState } from "react";
import { PubList } from "../../components/PubList";
import { publications } from "../../data/publications";
import { Publication } from "../../types/publication";

/** Where a paper sits in the record: a Korean venue or an international one.
 *  Papers still under review sit with the international record, where they
 *  were submitted; their pill already says they are not out yet. Whether a
 *  venue was a conference or a journal is on the row too — it does not need a
 *  tab of its own. */
function kindOf(pub: Publication) {
    return pub.domestic ? "domestic" : "international";
}

const isMe = (author: string) =>
    author.includes("Jisu Ko") || author.includes("고지수");

/** First author, counting shared first authorship — where the byline carries
 *  asterisks, everyone marked with one is a first author, which is how these
 *  papers are cited and how a CV lists them. */
function isFirstAuthor(pub: Publication) {
    const [lead] = pub.authors;
    if (!lead) return false;
    if (isMe(lead)) return true;

    const mine = pub.authors.find(isMe);
    return !!mine && mine.includes("*") && lead.includes("*");
}

const tabs = [
    { key: "international", label: "International" },
    { key: "domestic", label: "Domestic" },
];

export default function PublicationPage() {
    // the international record is what a reader came for, so it is what the
    // page opens on rather than an undifferentiated pile
    const [tab, setTab] = useState("international");
    const [firstOnly, setFirstOnly] = useState(false);

    // the first-author cut is orthogonal to the two tabs, so it narrows the
    // pool the tabs are counted from rather than replacing them
    const pool = firstOnly ? publications.filter(isFirstAuthor) : publications;

    const count = (key: string) => pool.filter((p) => kindOf(p) === key).length;
    const shown = pool.filter((p) => kindOf(p) === tab);

    return (
        <>
            <div className="page-head">
                <h1 className="display">Publications</h1>

                {/* the cuts of the list, on the rule the head closes with —
                    they do not need a row of their own */}
                <div className="pub-tabs">
                    {tabs.map(({ key, label }) => (
                        <button
                            key={key}
                            className={`pub-tab${tab === key ? " active" : ""}`}
                            onClick={() => setTab(key)}
                        >
                            {label}
                            <span className="ct">{count(key)}</span>
                        </button>
                    ))}

                    <button
                        type="button"
                        role="switch"
                        aria-checked={firstOnly}
                        className={`pub-switch${firstOnly ? " on" : ""}`}
                        onClick={() => setFirstOnly((f) => !f)}
                    >
                        <span className="track" aria-hidden="true">
                            <span className="knob" />
                        </span>
                        First author
                    </button>
                </div>
            </div>

            {shown.length > 0 ? (
                <PubList items={shown} thumbs key={`${tab}-${firstOnly}`} />
            ) : (
                <p className="empty">
                    No first-author papers in this part of the record yet.
                </p>
            )}
        </>
    );
}
