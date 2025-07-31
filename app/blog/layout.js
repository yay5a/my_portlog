import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import "../globals.css";
import fs from "fs";
import path from "path";

export const metadata = {
    title: "Yaysa&apos;s • Blog ",
};

export default function BlogLayout({ children }) {
    const postsDir = path.join(process.cwd(), "content", "posts");
    const files = fs.readdirSync(postsDir);

    // Sort posts by date descending
    const posts = files
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    return (
        <div className="grid max-w-4xl grid-cols-1 gap-8 px-6 py-12 mx-auto md:grid-cols-4">
            {/* Main content */}
            <main className="prose prose-lg md:col-span-3 prose-indigo dark:prose-invert">
                {children}
            </main>

            {/* Sidebar */}
            <aside className="hidden space-y-8 md:block">
                {/* <section>
                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                        Recent Posts
                    </h2>
                    <ul className="space-y-2">
                        {posts.map((post) => (
                            <li key={post.slug}>
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="block p-3 transition rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                        {post.title}
                                    </h3>
                                    <time className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(
                                            post.date
                                        ).toLocaleDateString()}
                                    </time>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section> */}

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                        About Me
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
                            I&apos;m Yaysa, a selfware-developer exploring web,
                            security, and AI. Welcome to my corner of the
                            internet!
                        </p>
                    </div>
                </section>
            </aside>
        </div>
    );
}
