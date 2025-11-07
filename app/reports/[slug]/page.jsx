import { getReports } from "@/utils/mdxUtils";
import { notFound } from "next/navigation";

// return a list of static paths at build time
export async function generateStaticParams() {
    const reports = await getReports();
    return reports.map((report) => ({
        slug: report.slug,
    }));
}

// (optional) on-demand dynamic routes
export const dynamicParams = false;

export default async function Page({ params }) {
    const { slug } = await params;
    try {
        // import MDX file and its frontmatter
        const { default: Reports, metadata } = await import(
            `@/content/reports/${slug}.mdx`
        );
        console.log(
            "Full import result ",
            JSON.stringify({ Reports: typeof Reports, metadata }, null, 2),
        );
        console.log(" exactly? ", metadata);
        return (
            <article className="py-8 mx-auto">
                <header className="mb-8">
                    <h1 className="mb-2 text-4xl font-bold">
                        {metadata.title}
                    </h1>
                    <time className="text-gray-300">
                        {new Date(metadata.date).toLocaleDateString()}
                    </time>
                    {metadata.description && (
                        <p className="mt-2 text-gray-400">
                            {metadata.description}
                        </p>
                    )}
                </header>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <Reports />
                </div>
            </article>
        );
    } catch (error) {
        console.error(error);
        notFound();
    }
}
