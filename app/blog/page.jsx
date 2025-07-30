import fs from "fs";
import path from "path";
import Link from "next/link";

export default async function BlogPage() {
    // read all in /content/posts
    const postsDir = path.join(process.cwd(), "content", "posts");
    const files = fs.readdirSync(postsDir);

    // derive slugs by removing .mdx extension
    const posts = files
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => ({
            slug: file.replace(/\.mdx$/, ""),
            title: file.replace(/\.mdx$/, "").replace(/-/g, " "),
        }));

    return (
        <div className="max-w-prose mx-auto p-4 flex">
            <h1 className="text-2xl font-bold mb-4">Blog Posts</h1>
            <ul className="list-disc pl-5 space-y-2">
                {posts.map((post) => (
                    <li key={post.slug}>
                        <Link
                            href={`/blog/${post.slug}`}
                            className="text-blue-600 underline">
                            {posts.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
