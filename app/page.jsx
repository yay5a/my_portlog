import React from "react";
import Image from "next/image";
import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import ProjectCard from "@/components/ProjectCard";
import LogoCard from "@/components/LogoCard";
import { getBlogPosts, getProjects, getReports } from "@/utils/mdxUtils";

export default async function Home() {
    const posts = await getBlogPosts({ limit: 3 });
    const projects = await getProjects({ limit: 2 });
    const reports = await getReports({ limit: 2 });

    return (
        <>
            {/* Hero Section */}
            <section className="relative py-20 container mx-auto text-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
                    aria-hidden="true"
                ></div>
                <LogoCard />
                <h2 className="text-3xl font-semibold">My name is Yaysa...</h2>
                <h1 className="text-4xl md:text-5xl font-bold relative z-10">
                    Welcome to my Portfolio
                </h1>
                <p className="mt-4 text-lg relative z-10">
                    Looking in from the outside, I exist at the intersection of
                    technology and philosophy building reliable and meaningful
                    modern "soulutions" to modern questions.
                </p>
            </section>
            <hr />

            {/* Reports Section */}
            <section className="py-12 container mx-auto">
                <h2 className="mb-6 text-2xl font-bold text-center">
                    Technical Reports
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reports.map((report) => (
                        <BlogCard
                            key={report.slug}
                            title={report.title}
                            date={report.displayDate}
                            excerpt={report.excerpt}
                            slug={report.slug}
                        />
                    ))}
                </div>
            </section>
            <hr />

            {/* Projects Section */}
            <section className="py-12 container mx-auto">
                <h2 className="mb-6 text-2xl font-bold text-center">
                    Latest Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project) => (
                        <ProjectCard key={project.slug} {...project} />
                    ))}
                </div>
            </section>
            <hr />

            {/* Blog Posts Section */}
            <section className="py-12 container mx-auto">
                <h2 className="mb-6 text-2xl font-bold text-center">
                    Latest Blog Posts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <BlogCard
                            key={post.slug}
                            title={post.title}
                            date={post.displayDate}
                            excerpt={post.excerpt}
                            slug={post.slug}
                        />
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12">
                <div className="text-center mb-12 p-2">
                    <h2 className="text-3xl font-semibold">
                        Why Connect With Me?
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-2xl flex flex-col items-center space-y-4 shadow">
                        <a
                            href="/contact"
                            className="rounded-full bg-gray-900 p-4"
                        >
                            <Image
                                src="/self.jpg"
                                alt="Logo"
                                width={40}
                                height={40}
                            />
                        </a>
                        <p className="text-center">
                            Open to collaboration and new ideas.
                        </p>
                    </div>
                    <div className="p-8 rounded-2xl flex flex-col items-center space-y-4 shadow">
                        <a
                            href="https://github.com/yay5a"
                            className="rounded-full bg-gray-900 p-4"
                        >
                            <span className="text-2xl">💡</span>
                        </a>
                        <p className="text-center">
                            Sharing knowledge and learning together.
                        </p>
                    </div>
                    <div className="p-8 rounded-2xl flex flex-col items-center space-y-4 shadow">
                        <a
                            href="/contact"
                            className="rounded-full bg-gray-900 p-4"
                        >
                            <span className="text-2xl">🌐</span>
                        </a>
                        <p className="text-center">
                            Connect on multiple platforms.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
