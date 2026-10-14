export interface Project {
    title: string;
    year: string;
    description: string;
    detailDescription?: string;
    tags: string[];
    role?: string;
    technologies?: string[];
    imageUrl?: any;
    projectUrl?: string;
    githubUrl?: string;
}
