"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Project } from "../../types/project";

interface ModalProps {
    project: Project | null;
    onClose: () => void;
}

export function ProjectModal({ project, onClose }: ModalProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!project) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [project, onClose]);

    if (!project || !mounted) return null;

    const src =
        typeof project.imageUrl === "string" ? project.imageUrl : project.imageUrl?.src;

    // Portalled to <body>: the page's entrance transform would otherwise become
    // the containing block for this fixed overlay.
    return createPortal(
        <div className="overlay" role="dialog" aria-modal="true" aria-label={project.title}>
            <div className="overlay-scrim" onClick={onClose} />

            <div className="overlay-card">
                <div className="overlay-bar">
                    <span>
                        {project.year} · {project.tags.join(" · ")}
                    </span>
                    <button className="overlay-close" onClick={onClose}>
                        Close
                    </button>
                </div>

                {src && (
                    <div className="overlay-shot">
                        <img src={src} alt={project.title} />
                    </div>
                )}

                <div className="overlay-body">
                    <h2>{project.title}</h2>

                    <div className="overlay-grid">
                        {/* an entry with nothing written for it yet says so,
                            rather than borrowing another project's paragraph */}
                        {project.detailDescription || project.description ? (
                            <p>{project.detailDescription || project.description}</p>
                        ) : (
                            <p className="overlay-todo">Write-up to come.</p>
                        )}

                        <div className="overlay-side">
                            {project.role && (
                                <div>
                                    <h5>Role</h5>
                                    <div className="val">{project.role}</div>
                                </div>
                            )}
                            {project.technologies && (
                                <div>
                                    <h5>Built with</h5>
                                    <div className="chips">
                                        {project.technologies.map((tech) => (
                                            <span key={tech}>{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {((project.projectUrl && project.projectUrl !== "#") ||
                        project.githubUrl) && (
                        <div className="overlay-links">
                            {project.projectUrl && project.projectUrl !== "#" && (
                                <a
                                    href={project.projectUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Visit ↗
                                </a>
                            )}
                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    GitHub ↗
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
