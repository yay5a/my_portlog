import fs from "fs";
import path from "path";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
    const postsDir = path.join(process.cwd(), "content", "posts");
    const files = fs
        .readdirSync(postsDir)
        .filter((file) => file.endsWith(".mdx"));

    const posts = files
        .map((file) => {
            const slug = file.replace(/\.mdx$/, "");
            const filePath = path.join(postsDir, file);
            const content = fs.readFileSync(filePath, "utf8");
            const excerpt =
                content
                    .replace(/\n+/g, " ")
                    .split(/\s+/)
                    .slice(0, 20)
                    .join(" ") + "...";
            const { mtime } = fs.statSync(filePath);
            return {
                slug,
                title: slug.replace(/-/g, " "),
                excerpt,
                date: mtime,
            };
        })
        .sort((a, b) => b.date - a.date)
        .map((post) => ({
            ...post,
            displayDate: post.date.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
            }),
        }));

    const projects = ["Project 1", "Project 2", "Project 3"];

    return (
        <div className="container mx-auto p-4 sm:p-8 md:grid md:grid-cols-[260px_1fr] gap-8 font-[family-name:var(--font-geist-sans)]">
            <aside className="space-y-6">
                <section className="card p-6 text-center">
                    <Image
                        src="/self.jpg"
                        alt="Portrait"
                        width={120}
                        height={120}
                        className="rounded-full mx-auto mb-4"
                    />
                    <h2 className="text-2xl font-bold mb-2">About</h2>
                    <p className="muted text-sm">
                        My name is Yaysa—a professional selfware-developer
                        driven by a relentless curiosity and commitment to
                        autonomy. My path has been anything but linear: from
                        grappling with personal setbacks to embracing critical
                        thinking as my compass, I have transformed adversity
                        into an engine for growth. I stand at the intersection
                        of technology and philosophical introspection. Learning
                        to not just to build reliable systems, but meaningful
                        ones.
                    </p>
                </section>
                <section className="card p-6">
                    <h2 className="text-xl font-bold mb-3">Projects</h2>
                    <ul className="space-y-2">
                        {projects.map((name) => (
                            <li key={name}>
                                <Link
                                    href="/projects"
                                    className="link-underline">
                                    {name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            </aside>
            <main className="space-y-6 mt-8 md:mt-0">
                <div className="space-y-4">
                    {posts.map((post) => (
                        <article key={post.slug} className="card p-6 space-y-2">
                            <p className="text-sm muted">{post.displayDate}</p>
                            <h2 className="text-xl font-semibold">
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="link-underline">
                                    {post.title}
                                </Link>
                            </h2>
                            <p className="muted text-sm">{post.excerpt}</p>
                            <Link
                                href={`/blog/${post.slug}`}
                                className="text-blue-400 hover:text-blue-300 text-sm">
                                Read more
                            </Link>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}
