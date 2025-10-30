import Link from "next/link";
import Image from "next/image";
import "../globals.css";
import { getReports } from "@/utils/mdxUtils";
import { use } from "react";

export const metadata = {
    title: "Technical Reports ",
};

export default function ReportsLayout({ children }) {
    // Await blog posts using React's experimental use() hook
    const reports = use(getReports())
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    return (
        <div className="grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 mx-auto md:grid-cols-4">
            {/* Main content */}
            <main className="prose prose-lg md:col-span-3 prose-indigo dark:prose-invert">
                {children}
            </main>

            {/* Sidebar */}
            <aside className="hidden space-y-8 md:block">
                <section>
                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                        About
                    </h2>
                    <div className="flex items-center space-x-4">
                        <Image
                            src="/self.jpg"
                            alt="Your avatar"
                            width={48}
                            height={48}
                            className="rounded-full"
                        />
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            These reports are investigations into anomalies
                            observed on my home network. Ultimately, they
                            reflect my self-directed learning process with AI
                            LLMs, manually analyzing and verifying with a steep
                            learning curve.
                        </p>
                    </div>
                </section>
            </aside>
        </div>
    );
}
