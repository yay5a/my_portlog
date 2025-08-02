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
        <div className="grid max-w-4xl grid-cols-1 gap-8 px-6 py-12 mx-auto md:grid-cols-4">
            <main className="prose prose-lg md:col-span-3 prose-indigo dark:prose-invert">
                {children}
            </main>

            {/* Sidebar */}
            <aside className="hidden space-y-8 md:block">
                <section>
                    <div className="flex items-center space-x-4">
                        <Image
                            src="/self.jpg"
                            alt="Your avatar"
                            width={48}
                            height={48}
                            className="rounded-full"
                        />
                        <p className="text-sm text-gray-700 dark:text-gray-300">
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
