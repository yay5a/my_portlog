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
    console.log("📦 slug:", await params);
    try {
        // import MDX file
        const { default: Post } = await import(`@/content/posts/${slug}.mdx`);
        return (
            <article className="py-8 mx-auto prose">
                <Post />
            </article>
        );
    } catch (error) {
        notFound();
    }
}
