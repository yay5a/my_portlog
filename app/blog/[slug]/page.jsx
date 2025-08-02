import { getBlogPosts } from "@/utils/mdxUtils";
import { notFound } from "next/navigation";

// return a list of static paths at build time
export async function generateStaticParams() {
    const posts = await getBlogPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
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
                    <h1 className="mb-2 text-4xl font-bold">
                        {metadata.title}
                    </h1>
                    <time className="text-gray-500">
                        {new Date(metadata.date).toLocaleDateString()}
                    </time>
                    {metadata.description && (
                        <p className="mt-2 text-gray-600">
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
