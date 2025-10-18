import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 *
 * Props:
 * - title: report title
 * - date: publish date
 * - excerpt: short excerpt of the post
 * - slug: used to generate the link to the post
 */

export default function ReportCard({ title, date, excerpt, slug }) {
    return (
        <article className="p-4 space-y-2 card">
            <span className="block mb-2 text-xs text-slate-400">{date}</span>
            <h3 className="text-xl font-semibold">
                <Link
                    href={`/reports/${slug}`}
                    className="text-lg font-semibold"
                >
                    {title}
                </Link>
            </h3>

            <div className="mb-3 text-sm text-slate-300 prose dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {excerpt}
                </ReactMarkdown>
            </div>
            <Link href={`/reports/${slug}`} className="text-sm">
                Read more
            </Link>
        </article>
    );
}
