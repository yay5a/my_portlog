import Image from "next/image";
import "../globals.css";
import { getProjects } from "@/utils/mdxUtils";
import { use } from "react";

export const metadata = {
    title: "Yaysa's • Projects",
};

export default function ProjectsLayout({ children }) {
    const projects = use(getProjects())
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    return (
        <div className="grid max-w-6xl grid-cols-1 gap-8 px-6 py-12 mx-auto md:grid-cols-3 lg:grid-cols-4">
            <main className="prose prose-lg md:col-span-2 lg:col-span-3 prose-indigo dark:prose-invert">
                {children}
            </main>

            {/* Sidebar */}
            <aside className="hidden space-y-8 md:block">
                <section className="sticky top-8">
                    <div className="flex flex-col space-y-4">
                        <Image
                            src="/outlook.jpg"
                            alt="Your avatar"
                            width={240}
                            height={240}
                            className="object-cover w-full h-auto transition-shadow duration-300 rounded-lg shadow-md hover:shadow-lg"
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-300">
                            Projects are an outlet; a canvas to express my
                            creativity, and a dojo to sharpen my skills. Here, I
                            share my journey through code, design, and
                            innovation. Each project is a step towards mastering
                            the art of selfware development.
                        </p>
                    </div>
                </section>
            </aside>
        </div>
    );
}
