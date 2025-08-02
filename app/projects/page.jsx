import fs from "fs";
import path from "path";
import ProjectCard from "../components/ProjectCard";

export default async function ProjectPage() {
    // read all in /content/projects
    const projectsDir = path.join(process.cwd(), "content", "projects");
    const files = fs.readdirSync(projectsDir);

    // derive slugs by removing .mdx extension
    const projects = files
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => ({
            slug: file.replace(/\.mdx$/, ""),
            title: file.replace(/\.mdx$/, "").replace(/-/g, " "),
        }));

    return (
        <div className="max-w-2xl py-8 mx-auto">
            <h1 className="mb-4 text-3xl font-bold">Projects</h1>
            <ul className="space-y-4">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.slug}
                        name={project.name}
                        description={project.description}
                        slug={project.slug}
                    />
                ))}
            </ul>
        </div>
    );
}
