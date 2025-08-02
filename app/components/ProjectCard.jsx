import Link from "next/link";
import Image from "next/image";

/**
 * Props:
 * - name: project name
 * - link: URL to the project (defaults to '#'
 * - description: short description of the project
 * - image: URL to the project image
 */

export default function ProjectCard({ name, link = "#", description, image }) {
    return (
        <article className="p-6 space-y-2 card">
            <h3 className="text-xl font-semibold">
                {link ? (
                    <Link href={link} className="text-lg font-semibold">
                        {name}
                    </Link>
                ) : (
                    <span className="text-lg font-semibold">{name}</span>
                )}
            </h3>
            <div className="mb-4">
                <Image
                    src="/self.jpg" // Replace with image URL if provided
                    alt="Portrait"
                    width={120}
                    height={120}
                    className="mx-auto mb-4 rounded"
                />
            </div>
            <p className="mb-3 text-sm text-slate-300">{description}</p>
            {link ? (
                <Link href={link} className="text-sm">
                    View project
                </Link>
            ) : (
                <a href="_blank" className="text-sm">
                    View Project
                </a>
            )}
        </article>
    );
}
