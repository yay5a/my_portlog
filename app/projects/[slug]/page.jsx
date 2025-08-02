import { getProjects } from "@/utils/mdxUtils";
import { notFound } from "next/navigation";

// return a list of static paths at build time
export async function generateStaticParams() {
    try {
        const projects = await getProjects();
        return projects.map((project) => ({
            slug: project.slug,
        }));
    } catch (error) {
        return [];
    }
}

// (optional) on-demand dynamic routes
export const dynamicParams = false;

export default async function Page({ params }) {
    const { slug } = await params;
    try {
        // import MDX file and its frontmatter
        const { default: Project, metadata } = await import(
            `@/content/projects/${slug}.mdx`
        );
        return (
            <article className="py-8 mx-auto">
                <header className="mb-8">
                    <h1 className="mb-2 text-4xl font-bold">
                        {metadata.title}
                    </h1>
                    {metadata.description && (
                        <p className="mt-2 text-gray-600">
                            {metadata.description}
                        </p>
                    )}
                </header>
                <div className="prose prose-lg dark:prose-invert">
                    <Project />
                </div>
            </article>
        );
    } catch (error) {
        notFound();
    }
}
