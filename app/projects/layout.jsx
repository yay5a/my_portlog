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
        <div className="max-w-4xl px-6 py-12 mx-auto">
            <main className="prose prose-lg dark:prose-invert">{children}</main>
        </div>
    );
}
