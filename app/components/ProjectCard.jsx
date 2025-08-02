import Link from "next/link";
import Image from "next/image";

/**
 * Props:
 * - title: project title
 * - slug: URL to the project (defaults to '#')
 * - description: short description of the project
 * - image: URL to the project image
 */

export default function ProjectCard({ title, slug, description, image }) {
    return (
        <article className="p-4 space-y-2 card">
            <h3 className="text-xl font-semibold">
                <Link
                    href={`/projects/${slug}`}
                    className="text-lg font-semibold">
                    {title}
                </Link>
            </h3>
            <div className="mb-4">
                <Image
                    src={
                        image?.endsWith(".jpg") || image?.endsWith(".png")
                            ? image
                            : `/content/projects/${image}`
                    } // Supports both absolute and relative URLs
                    alt={
                        title
                            ? `${title} project image`
                            : description || "Project image"
                    }
                    width={300}
                    height={200}
                    className="object-contain mx-auto mb-4 rounded"
                />
            </div>
            <p className="mb-3 text-sm text-slate-700">{description}</p>
            <Link href={`/projects/${slug}`} className="text-sm">
                View project
            </Link>
        </article>
    );
}
