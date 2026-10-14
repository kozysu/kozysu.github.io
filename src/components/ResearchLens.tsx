import Link from "next/link";
import { lensIntro, lensPrinciples, LensPrinciple } from "../data/lens";

/** The drawing itself, on a 120×64 grid. Grey for the material, the accent
 *  for what the principle acts on. */
function Drawing({ kind }: { kind: LensPrinciple["figure"] }) {
    switch (kind) {
        case "reveal":
            // a field of faint, unseen elements; inside the lens they come
            // into view and their relations show
            return (
                <>
                    {[
                        [10, 14], [22, 46], [30, 24], [96, 18], [106, 44], [90, 52], [14, 34],
                    ].map(([x, y]) => (
                        <circle key={`${x}-${y}`} cx={x} cy={y} r="2" className="dot faint" />
                    ))}
                    <circle cx="60" cy="32" r="22" className="ln ac" />
                    <path d="M51 25 L67 23 L64 40 L51 25" className="ln ac thin" />
                    <circle cx="51" cy="25" r="2.4" className="dot" />
                    <circle cx="67" cy="23" r="2.4" className="dot" />
                    <circle cx="64" cy="40" r="2.4" className="dot" />
                </>
            );
        case "reframe":
            // one starting point, several ways of seeing it
            return (
                <>
                    <circle cx="16" cy="32" r="3.5" className="dot" />
                    <path d="M19 32 C50 32 60 12 100 12" className="ln" />
                    <path d="M19 32 H100" className="ln ac" />
                    <path d="M19 32 C50 32 60 52 100 52" className="ln" />
                    <circle cx="103" cy="12" r="3" className="ring" />
                    <circle cx="103" cy="32" r="3" className="ring ac" />
                    <circle cx="103" cy="52" r="3" className="ring" />
                </>
            );
        case "revise":
            // before → after: the same three items, reweighted
            return (
                <>
                    <path d="M10 18 H30 M10 32 H44 M10 46 H22" className="ln dash" />
                    <path d="M54 32 H66 M62 28 L66 32 L62 36" className="ln" />
                    <path d="M78 18 H112" className="ln ac thick" />
                    <path d="M78 32 H98 M78 46 H90" className="ln thick" />
                </>
            );
        case "agency":
            // the dot is the person. Dashed grey: paths open to them; solid
            // green: the one they took. The small arc between the ends says
            // the choice stays theirs to change.
            return (
                <>
                    <path d="M6 32 H38" className="ln" />
                    <path d="M46 29 C62 22 76 12 109 12" className="ln ac" />
                    <path d="M104.5 8.5 L109.5 12 L104.5 15.5" className="ln ac" />
                    <path d="M47 32 H108" className="ln dash" />
                    <path d="M46 35 C62 42 76 52 108 52" className="ln dash" />
                    <path d="M92 18 C99 26 99 38 92 46" className="ln" />
                    <path d="M92.7 21.4 L92 18 L95.3 19.1 M95.3 44.9 L92 46 L92.7 42.6" className="ln" />
                    <circle cx="42" cy="32" r="4" className="dot ac" />
                </>
            );
    }
}

/** Two passes of the same drawing, each warped by a little noise and the
 *  second nudged off the first — the overlap of a pencil going over a line
 *  twice, with the geometry left as it was. */
function Figure({ kind }: { kind: LensPrinciple["figure"] }) {
    const a = `rough-${kind}-a`;
    const b = `rough-${kind}-b`;

    return (
        <svg className="lens-fig" viewBox="0 0 120 64" aria-hidden="true">
            <defs>
                <filter id={a} x="-5%" y="-10%" width="110%" height="120%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="2" />
                    <feDisplacementMap in="SourceGraphic" scale="1.1" />
                </filter>
                <filter id={b} x="-5%" y="-10%" width="110%" height="120%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="7" />
                    <feDisplacementMap in="SourceGraphic" scale="1.5" />
                </filter>
            </defs>
            <g filter={`url(#${a})`}>
                <Drawing kind={kind} />
            </g>
            <g className="pass2" filter={`url(#${b})`} transform="translate(0.3 0.25)">
                <Drawing kind={kind} />
            </g>
        </svg>
    );
}

export function ResearchLens() {
    return (
        <>
            <div className="sec-head lens-head">
                <h2 className="display-sm">
                    Research <em>lens.</em>
                </h2>
                <span className="lens-meta">{lensPrinciples.length} design principles</span>
            </div>

            <div className="lens-intro">
                <p className="lead">{lensIntro.lead}</p>
                <p>{lensIntro.body}</p>
            </div>

            <ol className="lens">
                {lensPrinciples.map((p, i) => (
                    <li className="lens-card" key={p.key}>
                        <div className="lens-top">
                            <span className="lens-num">{String(i + 1).padStart(2, "0")}</span>
                            <span className="sep">/</span>
                            <span className="lens-move">{p.key}</span>
                        </div>

                        <Figure kind={p.figure} />

                        <h3>{p.title}</h3>
                        <p className="lens-tag">{p.line}</p>

                        <div className="lens-proj">
                            {p.projects.map((name) => (
                                <Link href={`/publications#${name.toLowerCase()}`} key={name}>
                                    {name}
                                </Link>
                            ))}
                        </div>
                    </li>
                ))}
            </ol>
        </>
    );
}
