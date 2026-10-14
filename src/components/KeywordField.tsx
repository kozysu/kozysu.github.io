"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { publications } from "../data/publications";
import { stages } from "../data/agenda";
import { Publication } from "../types/publication";

/**
 * A constellation of the research themes, built from the papers themselves:
 * every distinct keyword is a node, sized by how many papers carry it, and two
 * nodes are joined whenever they appear together on a paper. Clicking a node
 * opens the papers behind it.
 *
 * Positions come from a small spring layout, so keywords that share papers
 * settle next to each other. It runs from a fixed starting ring with fixed
 * parameters, so the result is the same on every load — no randomness.
 */

interface Theme {
    label: string;
    papers: Publication[];
    /** fractional index on the scale: the mean of the stages its papers sit in,
     *  or the prior-work stretch when none of them name a system */
    band: number;
    /** true when the theme runs across more than one stage */
    spans: boolean;
    /** sits in the stretch before the thesis rather than on a stage */
    prior: boolean;
    /** carries at least one paper flagged as selected work. The home page used
     *  to list those papers under the map; now the map lights them instead. */
    current: boolean;
    /** orbit radius and phase, so no two drift together */
    orbit: number;
    phase: number;
}

interface Edge {
    a: number;
    b: number;
    /** how many papers carry both keywords — a stronger pull */
    w: number;
}

interface Point {
    x: number;
    y: number;
}

const INK = "23, 24, 26";
const ACCENT = "54, 104, 92";

/** Vertical room a label needs around its node, in px. Labels are wide and
 *  short, so the clearance around a node is an ellipse, not a circle. */
const LABEL_GAP_Y = 48;

function buildGraph(): { themes: Theme[]; edges: Edge[] } {
    const byKeyword = new Map<string, Publication[]>();
    for (const pub of publications) {
        for (const kw of pub.keywords ?? []) {
            const bucket = byKeyword.get(kw) ?? [];
            bucket.push(pub);
            byKeyword.set(kw, bucket);
        }
    }

    const entries = [...byKeyword.entries()].sort(
        (a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0])
    );

    const stageOf = new Map(
        stages.map((st, i) => [st.project, i] as const).filter(([p]) => p)
    );
    const priorBand = stages.findIndex((st) => st.prior);

    const themes: Theme[] = entries.map(([label, papers], i) => {
        const hits = papers
            .map((p) => stageOf.get(p.project))
            .filter((v): v is number => v !== undefined);
        const band = hits.length
            ? hits.reduce((a, b) => a + b, 0) / hits.length
            : priorBand;
        return {
            label,
            papers,
            band,
            spans: new Set(hits).size > 1,
            prior: hits.length === 0,
            current: papers.some((p) => p.isSelected),
            orbit: 5 + (i % 3) * 2,
            phase: i * 1.27,
        };
    });

    const index = new Map(themes.map((t, i) => [t.label, i]));
    const weights = new Map<string, Edge>();
    for (const pub of publications) {
        const kws = pub.keywords ?? [];
        for (let a = 0; a < kws.length; a++) {
            for (let b = a + 1; b < kws.length; b++) {
                const ia = index.get(kws[a]);
                const ib = index.get(kws[b]);
                if (ia === undefined || ib === undefined) continue;
                const [lo, hi] = ia < ib ? [ia, ib] : [ib, ia];
                const key = `${lo}-${hi}`;
                const found = weights.get(key);
                if (found) found.w += 1;
                else weights.set(key, { a: lo, b: hi, w: 1 });
            }
        }
    }
    return { themes, edges: [...weights.values()] };
}

/** Keywords joined by a shared paper form one research area. */
function findGroups(n: number, edges: Edge[]): number[] {
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (const e of edges) {
        adj[e.a].push(e.b);
        adj[e.b].push(e.a);
    }
    const group = new Array(n).fill(-1);
    let g = 0;
    for (let i = 0; i < n; i++) {
        if (group[i] >= 0) continue;
        const queue = [i];
        group[i] = g;
        while (queue.length) {
            const cur = queue.pop() as number;
            for (const next of adj[cur]) {
                if (group[next] < 0) {
                    group[next] = g;
                    queue.push(next);
                }
            }
        }
        g++;
    }
    return group;
}

/**
 * A rounded outline around a cloud of points. Rather than tracing the convex
 * hull — which keeps its corners however much you smooth the path — this
 * measures how far the cloud reaches at each angle, blurs that profile around
 * the circle, and rebuilds the shape from it. The blur is what makes it round.
 */
function roundOutline(cloud: Point[], pad: number, bins = 56): Point[] {
    const cx = cloud.reduce((s, p) => s + p.x, 0) / cloud.length;
    const cy = cloud.reduce((s, p) => s + p.y, 0) / cloud.length;

    const radii = new Array(bins).fill(0);
    const reach = Math.round(bins / 8);
    for (const p of cloud) {
        const d = Math.hypot(p.x - cx, p.y - cy);
        const a = Math.atan2(p.y - cy, p.x - cx);
        const bin = Math.floor(((a + Math.PI) / (Math.PI * 2)) * bins) % bins;
        // a point also props up its neighbouring angles, so gaps fill in
        for (let k = -reach; k <= reach; k++) {
            const j = (bin + k + bins) % bins;
            const falloff = Math.cos((k / (reach + 1)) * (Math.PI / 2));
            radii[j] = Math.max(radii[j], d * falloff);
        }
    }

    for (let pass = 0; pass < 8; pass++) {
        const prev = radii.slice();
        for (let i = 0; i < bins; i++) {
            radii[i] =
                (prev[(i - 1 + bins) % bins] + 2 * prev[i] + prev[(i + 1) % bins]) /
                4;
        }
    }

    return radii.map((r, i) => {
        const a = (i / bins) * Math.PI * 2 - Math.PI;
        const rad = r + pad;
        return { x: cx + Math.cos(a) * rad, y: cy + Math.sin(a) * rad };
    });
}

/** Trace a closed path that curves through the polygon's edge midpoints, which
 *  rounds every corner without any corner-radius bookkeeping. */
function traceBlob(ctx: CanvasRenderingContext2D, pts: Point[]) {
    const n = pts.length;
    if (n < 3) return;
    const mid = (a: Point, b: Point) => ({
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2,
    });
    const first = mid(pts[n - 1], pts[0]);
    ctx.beginPath();
    ctx.moveTo(first.x, first.y);
    for (let i = 0; i < n; i++) {
        const cur = pts[i];
        const m = mid(cur, pts[(i + 1) % n]);
        ctx.quadraticCurveTo(cur.x, cur.y, m.x, m.y);
    }
    ctx.closePath();
}

/**
 * Spring layout in pixel space: edges pull, every pair pushes, and a label's
 * own footprint keeps its neighbours from sitting on top of it. Deterministic
 * — same input, same output.
 */
function solve(
    themes: Theme[],
    edges: Edge[],
    groups: number[],
    labelWidths: number[],
    /** x centre of each stage column, measured from the scale itself */
    bandX: number[],
    /** how far a theme may drift inside each column before being pulled back */
    bandSlack: number[],
    width: number,
    height: number
): Point[] {
    const n = themes.length;
    if (n === 0) return [];

    /** where a theme belongs horizontally, interpolated between column centres */
    const targetX = (band: number) => {
        if (bandX.length === 0) return width / 2;
        const lo = Math.floor(band);
        const hi = Math.min(Math.ceil(band), bandX.length - 1);
        const t = band - lo;
        return (
            (bandX[Math.min(lo, bandX.length - 1)] ?? width / 2) * (1 - t) +
            (bandX[hi] ?? width / 2) * t
        );
    };

    /** Drift is allowed in proportion to the column the theme belongs to. The
     *  prior-work column is deliberately narrow, and a slack figure borrowed
     *  from a wide column would let its three themes fan out into the card's
     *  corner instead of stacking under their own mark. */
    const slackAt = (band: number) =>
        bandSlack[Math.min(Math.round(band), bandSlack.length - 1)] ?? 60;

    // Padding in px, not fractions: the outline is inflated a fixed amount
    // beyond the labels, and the area caption sits above that again. A label is
    // centred on its node, so the side padding has to clear half the widest one
    // or the outermost label runs off the edge.
    const widest = labelWidths.length ? Math.max(...labelWidths) : 0;
    const padX = Math.max(width * 0.06, 56, widest / 2 + 14);
    const padTop = 62;
    const padBottom = 44;
    const boxW = Math.max(width - padX * 2, 1);
    const boxH = Math.max(height - padTop - padBottom, 1);

    // start each theme already under its column; only the vertical placement is
    // left to the simulation
    const pos: Point[] = themes.map((t, i) => ({
        x: targetX(t.band),
        y: ((i % 3) - 1) * boxH * 0.22,
    }));

    const rest = Math.min(boxW, boxH) * 0.36;
    const spread = rest * rest * 0.5;
    const STEPS = 600;

    for (let step = 0; step < STEPS; step++) {
        const cool = 1 - step / STEPS;
        const fx = new Float64Array(n);
        const fy = new Float64Array(n);

        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const dx = pos[i].x - pos[j].x;
                const dy = pos[i].y - pos[j].y;
                const d = Math.hypot(dx, dy) || 0.01;
                const ux = dx / d;
                const uy = dy / d;

                // general spreading, stronger across research areas so the
                // group outlines end up clearly apart
                const apart = groups[i] === groups[j] ? 1 : 2.1;
                let f = (spread * apart) / (d * d);

                // plus a hard shove if the two labels would overlap
                const sepX = (labelWidths[i] + labelWidths[j]) / 2 + 40;
                const overlap = Math.hypot(dx / sepX, dy / LABEL_GAP_Y);
                if (overlap < 1) f += (1 - overlap) * rest * 0.6;

                fx[i] += ux * f;
                fy[i] += uy * f;
                fx[j] -= ux * f;
                fy[j] -= uy * f;
            }
        }

        for (const e of edges) {
            const dx = pos[e.b].x - pos[e.a].x;
            const dy = pos[e.b].y - pos[e.a].y;
            const d = Math.hypot(dx, dy) || 0.01;
            const f = (d - rest) * 0.06 * e.w;
            fx[e.a] += (dx / d) * f;
            fy[e.a] += (dy / d) * f;
            fx[e.b] -= (dx / d) * f;
            fy[e.b] -= (dy / d) * f;
        }

        for (let i = 0; i < n; i++) {
            // hold the theme under its column — this is what makes a label on
            // the scale mean something for the dots below it — but leave slack
            // so two themes sharing a column can still step aside from one
            // another rather than stacking on the same x
            const home = targetX(themes[i].band);
            const slack = slackAt(themes[i].band);
            const drift = pos[i].x - home;
            if (Math.abs(drift) > slack) {
                fx[i] += (home + Math.sign(drift) * slack - pos[i].x) * 0.6;
            } else {
                fx[i] += -drift * 0.012;
            }
            // a theme running across several stages reads as the spine, so it
            // settles above the ones that belong to a single stage. The prior
            // stretch has a narrow column and can't step sideways out of the
            // main cluster's way, so it is held to the middle height instead of
            // being shoved down into the corner.
            fy[i] -=
                (themes[i].spans ? boxH * 0.22 : 0) +
                pos[i].y * (themes[i].prior ? 0.2 : 0.14);
        }

        const cap = rest * 0.08 * cool;
        for (let i = 0; i < n; i++) {
            const m = Math.hypot(fx[i], fy[i]) || 1;
            const move = Math.min(m * 0.03, cap);
            pos[i].x += (fx[i] / m) * move;
            pos[i].y += (fy[i] / m) * move;

            // A label is centred on its node, so a node near the edge of the
            // last column would run its label off the card. Column centres set
            // x directly, bypassing the box padding, so the wall goes here.
            const half = labelWidths[i] / 2 + 12;
            pos[i].x = Math.min(Math.max(pos[i].x, half), width - half);
        }
    }

    // fit the settled graph into the padded box
    // x already carries meaning, so it is left alone. y is translated, and only
    // compressed if the run overshot the box — never stretched, which would undo
    // the gaps the label-collision rule just earned.
    const ys = pos.map((p) => p.y);
    const minY = Math.min(...ys);
    const spanY = Math.max(Math.max(...ys) - minY, 1);
    const scaleY = Math.min(boxH / spanY, 1);
    const offsetY = padTop + (boxH - spanY * scaleY) / 2;

    return pos.map((p) => ({
        x: p.x,
        y: offsetY + (p.y - minY) * scaleY,
    }));
}

export default function KeywordField() {
    const { themes, edges } = useMemo(buildGraph, []);
    const groups = useMemo(
        () => findGroups(themes.length, edges),
        [themes, edges]
    );
    const wrapRef = useRef<HTMLDivElement>(null);
    const scaleRef = useRef<HTMLOListElement>(null);
    const plotRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const hoverRef = useRef(-1);
    const openRef = useRef(-1);
    const [open, setOpen] = useState(-1);
    const [anchor, setAnchor] = useState({ x: 0, y: 0, flip: false });

    useEffect(() => {
        openRef.current = open;
    }, [open]);

    useEffect(() => {
        const canvas = canvasRef.current;
        // the plot box sits below the scale; measuring it keeps every padding
        // figure in solve() relative to the area the graph actually occupies
        const wrap = plotRef.current;
        if (!canvas || !wrap || themes.length === 0) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const font = '400 10px "IBM Plex Mono", monospace';
        let width = 0;
        let height = 0;
        let anchors: Point[] = [];
        let labelWidths: number[] = [];
        let raf = 0;
        let start = 0;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const rect = wrap.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            ctx.font = font;
            labelWidths = themes.map(
                (t) => ctx.measureText(t.label.toUpperCase()).width
            );

            const marks = [...(scaleRef.current?.querySelectorAll("li") ?? [])];
            const bandX = marks.map((li) => {
                const r = li.getBoundingClientRect();
                return r.left + r.width / 2 - rect.left;
            });
            const bandSlack = marks.map(
                (li) => li.getBoundingClientRect().width * 0.45
            );


            anchors = solve(
                themes,
                edges,
                groups,
                labelWidths,
                bandX,
                bandSlack,
                width,
                height
            );
        };

        const now = () => (still || !start ? 0 : (performance.now() - start) / 1000);

        const at = (i: number, time: number) => {
            const a = anchors[i] ?? { x: 0, y: 0 };
            const t = themes[i];
            return {
                x: a.x + Math.cos(time * 0.2 + t.phase) * t.orbit,
                y: a.y + Math.sin(time * 0.16 + t.phase * 1.4) * t.orbit,
            };
        };

        const draw = (time: number) => {
            ctx.clearRect(0, 0, width, height);
            const pts = themes.map((_, i) => at(i, time));
            const active = openRef.current >= 0 ? openRef.current : hoverRef.current;

            // group outlines sit behind the graph
            const clouds = new Map<number, Point[]>();
            const members = new Map<number, number[]>();
            pts.forEach((p, i) => {
                const dot = 2.8 + Math.min(themes[i].papers.length, 4) * 0.5;
                const half = (labelWidths[i] ?? 60) / 2;
                const top = p.y - dot - 3;
                const textY = p.y + dot + 17;
                const cloud = clouds.get(groups[i]) ?? [];
                cloud.push(
                    { x: p.x - half, y: top },
                    { x: p.x + half, y: top },
                    { x: p.x - half, y: textY + 8 },
                    { x: p.x + half, y: textY + 8 }
                );
                clouds.set(groups[i], cloud);
                members.set(groups[i], [...(members.get(groups[i]) ?? []), i]);
            });

            clouds.forEach((cloud, g) => {
                // a lone keyword is not an area
                if ((members.get(g) ?? []).length < 2) return;
                const outline = roundOutline(cloud, 16);
                if (outline.length < 3) return;

                const lit = active >= 0 && groups[active] === g;
                traceBlob(ctx, outline);
                ctx.fillStyle = `rgba(${ACCENT}, ${lit ? 0.07 : 0.04})`;
                ctx.fill();
                ctx.strokeStyle = `rgba(${ACCENT}, ${lit ? 0.32 : 0.18})`;
                ctx.lineWidth = 1;
                ctx.stroke();

            });

            for (const e of edges) {
                const lit = active === e.a || active === e.b;
                ctx.beginPath();
                ctx.moveTo(pts[e.a].x, pts[e.a].y);
                ctx.lineTo(pts[e.b].x, pts[e.b].y);
                ctx.strokeStyle = lit
                    ? `rgba(${ACCENT}, 0.45)`
                    : `rgba(${INK}, ${0.08 + Math.min(e.w, 3) * 0.03})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // one shared breath for every selected theme, rather than each node
            // on its own phase — a field of independent blinks reads as noise
            const breath = 0.5 + 0.5 * Math.sin(time * 0.85);

            pts.forEach((p, i) => {
                const lit = active === i;
                const glow = themes[i].current;
                const weight = Math.min(themes[i].papers.length, 4);
                const dot = 2.8 + weight * 0.5;

                // the bloom that marks selected work: a soft radial falloff, wide
                // enough to be felt before it is seen
                if (glow) {
                    const r = dot + 17 + breath * 6;
                    const bloom = ctx.createRadialGradient(
                        p.x,
                        p.y,
                        dot * 0.5,
                        p.x,
                        p.y,
                        r
                    );
                    bloom.addColorStop(0, `rgba(${ACCENT}, ${0.26 + breath * 0.1})`);
                    bloom.addColorStop(
                        0.5,
                        `rgba(${ACCENT}, ${0.09 + breath * 0.04})`
                    );
                    bloom.addColorStop(1, `rgba(${ACCENT}, 0)`);
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
                    ctx.fillStyle = bloom;
                    ctx.fill();
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, dot + (lit ? 8 : 5), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${ACCENT}, ${lit ? 0.18 : 0.09})`;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(p.x, p.y, dot + (glow ? 0.8 : 0), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${ACCENT}, ${
                    lit ? 0.95 : glow ? 0.88 : 0.6
                })`;
                ctx.fill();

                ctx.font = font;
                if ("letterSpacing" in ctx) {
                    (ctx as CanvasRenderingContext2D & { letterSpacing: string })
                        .letterSpacing = "0.14em";
                }
                ctx.fillStyle = `rgba(${INK}, ${
                    lit ? 0.92 : glow ? 0.72 : 0.42
                })`;
                ctx.fillText(themes[i].label.toUpperCase(), p.x, p.y + dot + 17);
            });
        };

        const frame = (ts: number) => {
            if (!start) start = ts;
            draw((ts - start) / 1000);
            raf = requestAnimationFrame(frame);
        };

        const hit = (e: PointerEvent) => {
            const rect = wrap.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            const time = now();
            let found = -1;
            themes.forEach((_, i) => {
                const p = at(i, time);
                if (Math.hypot(p.x - mx, p.y - my) < 30) found = i;
            });
            return { found, time };
        };

        const onMove = (e: PointerEvent) => {
            const { found } = hit(e);
            hoverRef.current = found;
            wrap.style.cursor = found >= 0 ? "pointer" : "";
            if (still) draw(0);
        };

        const onLeave = () => {
            hoverRef.current = -1;
            if (still) draw(0);
        };

        const onClick = (e: PointerEvent) => {
            const { found, time } = hit(e);
            if (found < 0) {
                setOpen(-1);
                return;
            }
            const p = at(found, time);
            // keep the card on screen, and open upward from a low node
            const half = 170;
            setAnchor({
                x: Math.min(Math.max(p.x, half), width - half),
                y: p.y,
                flip: p.y > height * 0.55,
            });
            setOpen((prev) => (prev === found ? -1 : found));
        };

        const observer = new ResizeObserver(() => {
            resize();
            if (still) draw(0);
        });

        let cancelled = false;
        // wait for the mono face, or labels measure and paint as a fallback
        document.fonts.ready.then(() => {
            if (cancelled) return;
            resize();
            observer.observe(wrap);
            wrap.addEventListener("pointermove", onMove);
            wrap.addEventListener("pointerleave", onLeave);
            wrap.addEventListener("click", onClick as EventListener);
            if (still) draw(0);
            else raf = requestAnimationFrame(frame);
        });

        return () => {
            cancelled = true;
            cancelAnimationFrame(raf);
            observer.disconnect();
            wrap.removeEventListener("pointermove", onMove);
            wrap.removeEventListener("pointerleave", onLeave);
            wrap.removeEventListener("click", onClick as EventListener);
        };
    }, [themes, edges, groups]);

    useEffect(() => {
        if (open < 0) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(-1);
        const onOutside = (e: MouseEvent) => {
            if (!wrapRef.current?.contains(e.target as Node)) setOpen(-1);
        };
        window.addEventListener("keydown", onKey);
        window.addEventListener("click", onOutside);
        return () => {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("click", onOutside);
        };
    }, [open]);

    if (themes.length === 0) return null;

    const theme = open >= 0 ? themes[open] : null;

    return (
        <div className="field" ref={wrapRef}>
            {/* the scale the map is read against: what each current system
                returns once it stops returning an answer */}
            <ol className="field-scale" ref={scaleRef}>
                {stages.map((st) => (
                    <li key={st.kind} className={st.prior ? "prior" : undefined}>
                        <span className="lbl">{st.kind}</span>
                        <span className="note">{st.note}</span>
                        {st.project && <span className="proj">{st.project}</span>}
                    </li>
                ))}
            </ol>

            <div className="field-plot" ref={plotRef}>
                <canvas ref={canvasRef} aria-hidden="true" />

            {theme && (
                <div
                    className={`theme-pop${anchor.flip ? " flip" : ""}`}
                    style={{ left: anchor.x, top: anchor.y }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="theme-pop-close"
                        onClick={() => setOpen(-1)}
                        aria-label="Close"
                    >
                        ✕
                    </button>

                    <div className="theme-pop-head">
                        <em>{theme.label}</em>
                        <span>
                            {theme.papers.length} paper
                            {theme.papers.length === 1 ? "" : "s"}
                        </span>
                    </div>

                    <div className="theme-pop-list">
                        {theme.papers.map((pub, i) => (
                            <div
                                className={`theme-pop-item${
                                    pub.isSelected ? " current" : ""
                                }`}
                                key={i}
                            >
                                <span className="venue">
                                    {pub.venueShort ?? pub.venue} · {pub.year}
                                </span>
                                <span className="title">{pub.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            </div>

            {/* a row of its own rather than a caption floating over the plot
                — the prior-work cluster sits low in its column and was landing
                on top of it */}
            <div className="field-foot">
                <span className="field-hint">
                    Lit nodes carry selected work — select one to see the papers
                </span>
            </div>

        </div>
    );
}
