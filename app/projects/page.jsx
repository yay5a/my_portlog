import Image from "next/image";
import { getProjects } from "../../utils/mdxUtils";
import ProjectCard from "../components/ProjectCard";

export default async function ProjectPage() {
    const projects = await getProjects();

    return (
        <div className="max-w-2xl py-8 mx-auto">
            <h1 className="mb-4 text-3xl font-bold">Projects</h1>
            {projects.map((project) => (
                <ProjectCard
                    key={project.slug}
                    title={project.title}
                    description={project.description}
                    image={project.image}
                    slug={project.slug}
                />
            ))}
        </div>
    );
}
