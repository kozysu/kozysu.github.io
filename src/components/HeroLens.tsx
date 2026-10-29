"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's one moving thing: a lens over a field of faint dots, the same
 * picture as the "Reveal" principle. It drifts after the pointer while the
 * pointer is over the hero, and the dots it covers come into view with the
 * lines between them. Left alone it rests on three dots, so the still frame
 * matches the lens figure.
 */

const W = 168;
const H = 72;
const R = 20;
const REST = { x: 78, y: 34 };

const DOTS: [number, number][] = [
    [12, 18], [24, 50], [40, 30], [52, 60], [58, 12], [66, 28], [70, 48],
    [84, 26], [96, 58], [108, 14], [116, 40], [132, 56], [140, 22], [156, 44],
];

export function HeroLens() {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const svg = svgRef.current;
        const hero = svg?.closest(".home-hero");
        if (!svg || !hero) return;

        const ring = svg.querySelector<SVGCircleElement>(".hl-ring")!;
        const links = svg.querySelector<SVGPathElement>(".hl-links")!;
        const dots = Array.from(svg.querySelectorAll<SVGCircleElement>(".hl-dot"));

        const pos = { ...REST };
        const target = { ...REST };
        let frame = 0;

        const draw = () => {
            ring.setAttribute("cx", pos.x.toFixed(2));
            ring.setAttribute("cy", pos.y.toFixed(2));

            const inside: [number, number][] = [];
            DOTS.forEach(([x, y], i) => {
                const on = Math.hypot(x - pos.x, y - pos.y) < R;
                dots[i].classList.toggle("on", on);
                if (on) inside.push([x, y]);
            });

            let d = "";
            for (let i = 0; i < inside.length; i++)
                for (let j = i + 1; j < inside.length; j++)
                    d += `M${inside[i][0]} ${inside[i][1]} L${inside[j][0]} ${inside[j][1]} `;
            links.setAttribute("d", d);
        };

        const step = () => {
            pos.x += (target.x - pos.x) * 0.08;
            pos.y += (target.y - pos.y) * 0.08;
            draw();
            frame =
                Math.hypot(target.x - pos.x, target.y - pos.y) > 0.05
                    ? requestAnimationFrame(step)
                    : 0;
        };

        const go = () => {
            if (!frame) frame = requestAnimationFrame(step);
        };

        draw();

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        // the whole hero steers the lens, mapped onto the field, so the
        // pointer need not be over the drawing itself
        const onMove = (e: Event) => {
            const { clientX, clientY } = e as PointerEvent;
            const r = hero.getBoundingClientRect();
            const u = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
            const v = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
            target.x = R + u * (W - 2 * R);
            target.y = R * 0.6 + v * (H - 1.2 * R);
            go();
        };
        const onLeave = () => {
            target.x = REST.x;
            target.y = REST.y;
            go();
        };

        hero.addEventListener("pointermove", onMove);
        hero.addEventListener("pointerleave", onLeave);
        return () => {
            hero.removeEventListener("pointermove", onMove);
            hero.removeEventListener("pointerleave", onLeave);
            cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <svg ref={svgRef} className="hero-lens" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            <path className="hl-links" d="" />
            {DOTS.map(([x, y]) => (
                <circle key={`${x}-${y}`} className="hl-dot" cx={x} cy={y} r="1.8" />
            ))}
            <circle className="hl-ring" cx={REST.x} cy={REST.y} r={R} />
        </svg>
    );
}
