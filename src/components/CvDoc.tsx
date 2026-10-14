"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentLoadingTask, RenderTask } from "pdfjs-dist";

/**
 * Draws the CV's pages onto canvases with pdf.js rather than handing the file
 * to the browser's PDF plugin. The plugin brings its own dark viewer chrome
 * and its own toolbar, is switched off in some browsers entirely, and cannot
 * be styled; this renders the pages as sheets on the page's own ground.
 *
 * If pdf.js cannot run at all — a blocked worker, an old browser — the file is
 * handed to the plugin after all rather than leaving the reader with nothing.
 * The PDF stays the single source of truth: replace `public/cv.pdf` and the
 * page follows.
 */
export function CvDoc({ src }: { src: string }) {
    const host = useRef<HTMLDivElement>(null);
    const [state, setState] = useState<"loading" | "ready" | "failed">("loading");

    useEffect(() => {
        let cancelled = false;
        let loading: PDFDocumentLoadingTask | undefined;
        let task: RenderTask | undefined;

        (async () => {
            try {
                const pdfjs = await import("pdfjs-dist");
                pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

                loading = pdfjs.getDocument({ url: src });
                const doc = await loading.promise;
                if (cancelled || !host.current) return;

                // the effect runs twice in development; clear whatever the
                // previous pass drew before this one starts
                host.current.replaceChildren();

                for (let n = 1; n <= doc.numPages; n++) {
                    const page = await doc.getPage(n);
                    if (cancelled || !host.current) return;

                    // draw at the display's own density so the type stays sharp
                    const density = Math.min(window.devicePixelRatio || 1, 2);
                    const viewport = page.getViewport({ scale: density * 1.5 });

                    const canvas = document.createElement("canvas");
                    canvas.className = "cv-page";
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    canvas.setAttribute("role", "img");
                    canvas.setAttribute(
                        "aria-label",
                        `Curriculum vitae, page ${n} of ${doc.numPages}`
                    );

                    const ctx = canvas.getContext("2d");
                    if (!ctx) throw new Error("no 2d context");

                    host.current.append(canvas);

                    task = page.render({ canvas, canvasContext: ctx, viewport });
                    await task.promise;
                    task = undefined;

                    // the first page is enough to call this a success; a later
                    // page failing should not blank the ones already drawn
                    if (!cancelled && n === 1) setState("ready");
                }
            } catch (err) {
                if (cancelled) return;
                console.error("[CvDoc] could not render the PDF:", err);
                setState((s) => (s === "ready" ? s : "failed"));
            }
        })();

        return () => {
            cancelled = true;
            task?.cancel();
            loading?.destroy();
        };
    }, [src]);

    if (state === "failed") {
        return (
            <>
                {/* pdf.js could not run, so let the browser try */}
                <object
                    className="cv-doc cv-embed"
                    data={`${src}#view=FitH`}
                    type="application/pdf"
                >
                    <p className="empty">
                        This browser will not display the PDF.{" "}
                        <a href={src}>Download the CV</a> instead.
                    </p>
                </object>
            </>
        );
    }

    return (
        <>
            <div className="cv-doc" ref={host} />
            {state === "loading" && <p className="empty">Loading the document…</p>}
        </>
    );
}
