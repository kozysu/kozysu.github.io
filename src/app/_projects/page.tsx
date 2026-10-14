"use client";

import { useState } from "react";
import { projects } from "../../data/projects";
import { ProjectCard } from "../../components/project/ProjectCard";
import { ProjectModal } from "../../components/project/ProjectModal";
import { Project } from "../../types/project";

export default function ProjectPage() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [year, setYear] = useState<string>("all");

    const ordered = [...projects].sort((a, b) => Number(b.year) - Number(a.year));

    const years = [...new Set(ordered.map((p) => p.year))];
    const filters = [
        { key: "all", label: "All", count: ordered.length },
        ...years.map((y) => ({
            key: y,
            label: y,
            count: ordered.filter((p) => p.year === y).length,
        })),
    ];

    const shown = year === "all" ? ordered : ordered.filter((p) => p.year === year);

    return (
        <>
            <div className="page-head">
                <h1 className="display">Projects</h1>

                <div className="filters">
                    {filters.map(({ key, label, count }) => (
                        <button
                            key={key}
                            className={`filter${year === key ? " active" : ""}`}
                            onClick={() => setYear(key)}
                        >
                            {label}
                            <span className="n">{count}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="work-grid">
                {shown.map((project, idx) => (
                    <ProjectCard
                        key={`${project.title}-${idx}`}
                        project={project}
                        onViewDetail={setSelectedProject}
                    />
                ))}
            </div>

            <ProjectModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </>
    );
}
