import Link from "next/link";

/**
 *
 * Props:
 * - title: post title
 * - date: publish date
 * - excerpt: short excerpt of the post
 * - slug: used to generate the link to the post
 */

export default function BlogCard({ title, date, excerpt, slug }) {
    return (
        <article className="p-4 space-y-2 card">
            <span className="block mb-2 text-xs text-slate-400">{date}</span>
            <h3 className="text-xl font-semibold">
                <Link href={`/blog/${slug}`} className="text-lg font-semibold">
                    {title}
                </Link>
            </h3>
            <p className="mb-3 text-sm text-slate-300">{excerpt}</p>
            <Link href={`/blog/${slug}`} className="text-sm">
                Read more
            </Link>
        </article>
    );
}
