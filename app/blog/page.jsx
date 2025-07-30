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
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-4">Holo-logs</h1>
            <ul className="space-y-4">
                {posts.map((post) => (
                    <li key={post.slug}>
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
