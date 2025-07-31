import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

// return a list of static paths at build time
export async function generateStaticParams() {
    const postsDir = path.join(process.cwd(), "content", "posts");
    const files = fs.readdirSync(postsDir);
    return files
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => ({ slug: file.replace(/\.mdx$/, "") }));
}

// (optional) on-demand dynamic routes
export const dynamicParams = false;

export default async function Page({ params }) {
    const { slug } = await params;
    try {
        // import MDX file and its frontmatter
        const { default: Post, metadata } = await import(
            `@/content/posts/${slug}.mdx`
        );
        return (
            <article className="py-8 mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        {metadata.title}
                    </h1>
                    <time className="text-gray-500">
                        {new Date(metadata.date).toLocaleDateString()}
                    </time>
                    {metadata.description && (
                        <p className="text-gray-600 mt-2">
                            {metadata.description}
                        </p>
                    )}
                </header>
                <div className="prose prose-lg dark:prose-invert">
                    <Post />
                </div>
            </article>
        );
    } catch (error) {
        console.error(error);
        notFound();
    }
}
