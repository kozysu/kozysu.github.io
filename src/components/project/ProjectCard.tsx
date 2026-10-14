import { Project } from "../../types/project";

interface ProjectCardProps {
    project: Project;
    onViewDetail: (project: Project) => void;
}

export function ProjectCard({ project, onViewDetail }: ProjectCardProps) {
    const { title, year, tags, imageUrl } = project;
    const src = typeof imageUrl === "string" ? imageUrl : imageUrl?.src;

    return (
        <button className="work" onClick={() => onViewDetail(project)}>
            <div className={`work-shot${src ? "" : " empty"}`}>
                {src ? (
                    <img src={src} alt={title} loading="lazy" />
                ) : (
                    <span>Figure to come</span>
                )}
            </div>

            <h3>{title}</h3>
            <p className="meta">
                {year} · {tags.join(", ")}
            </p>
        </button>
    );
}
