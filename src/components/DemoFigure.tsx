"use client";

import { ReactNode, useState } from "react";

interface DemoFigureProps {
    className: string;
    /** the animated demo, if the paper has one; without it this is a plain box */
    demo?: any;
    /** the still figure */
    children: ReactNode;
}

/**
 * A paper's figure box. Where the paper has a demo, the still stays until a
 * mouse rests on the box or the box is clicked (a tap, on a touch screen), and
 * then the demo takes its place — the still is hidden once the demo has
 * loaded, so the two are never seen at once. The demo is fetched only then,
 * and starts from its first frame each time, since the image is put back
 * fresh.
 */
export function DemoFigure({ className, demo, children }: DemoFigureProps) {
    const [playing, setPlaying] = useState(false);
    const [ready, setReady] = useState(false);

    if (!demo) return <div className={className}>{children}</div>;

    const src = typeof demo === "string" ? demo : demo.src;
    const play = (on: boolean) => {
        setPlaying(on);
        if (!on) setReady(false);
    };

    // a hover is a mouse's; a touch screen fakes one on every tap, which
    // would fight the tap's own toggle
    const calm = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return (
        <div
            className={`${className} has-demo${playing ? " playing" : ""}${
                playing && ready ? " ready" : ""
            }`}
            onPointerEnter={(e) => e.pointerType === "mouse" && !calm() && play(true)}
            onPointerLeave={(e) => e.pointerType === "mouse" && play(false)}
            onClick={(e) => {
                // the box sits inside a card link on the home row; a click here
                // is for the demo, and the title still leads on
                e.preventDefault();
                e.stopPropagation();
                play(!playing);
            }}
        >
            <span className="still">{children}</span>
            {playing && (
                <img
                    className="demo"
                    src={src}
                    alt=""
                    onLoad={() => setReady(true)}
                />
            )}
            <span className="demo-mark" aria-hidden="true" />
        </div>
    );
}
