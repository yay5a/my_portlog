import BlogCard from "@/components/BlogCard";
import ProjectCard from "@/components/ProjectCard";
import React from "react";
import Image from "next/image";
import { getBlogPosts, getProjects } from "@/utils/mdxUtils";

export default function Home() {
    const posts = getBlogPosts(3);
    const projects = getProjects(3);

    return (
        <div className="container mx-auto p-4 sm:p-8 md:grid md:grid-cols-[260px_1fr] gap-8 font-[family-name:var(--font-geist-sans)]">
            <aside className="space-y-6">
                <section className="p-6 text-center card">
                    <Image
                        src="/self.jpg"
                        alt="Portrait"
                        width={120}
                        height={120}
                        className="mx-auto mb-4 rounded-full"
                    />
                    <h2 className="mb-2 text-2xl font-bold">About</h2>
                    <p className="text-sm muted">
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
            </aside>

            <main className="mt-8 space-y-6 md:mt-0">
                {/* Projects section */}
                <section className="space-y-6">
                    <h2 className="mb-3 text-xl font-bold">Latest Projects</h2>
                    {projects.map((project) => (
                        <ProjectCard key={project.slug} {...project} />
                    ))}
                </section>
                <hr />
                {/* Blog posts */}
                <section className="space-y-6">
                    <h2 className="mb-3 text-xl font-bold">
                        Latest Blog Posts
                    </h2>
                    {posts.map((post) => (
                        <BlogCard
                            key={post.slug}
                            title={post.title}
                            date={post.displayDate}
                            excerpt={post.excerpt}
                            slug={post.slug}
                        />
                    ))}
                </section>
            </main>
        </div>
    );
}
