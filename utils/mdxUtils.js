import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export async function getMdxContent({
    directory,
    limit = undefined,
    includeExcerpt = false,
    excerptLength = 20,
    useMtime = false,
}) {
    const dir = path.join(CONTENT_DIR, directory);
    const files = fs.readdirSync(dir).filter((file) => file.endsWith(".mdx"));

    const content = files.map((file) => {
        const slug = file.replace(/\.mdx$/, "");
        const filePath = path.join(dir, file);
        const raw = fs.readFileSync(filePath, "utf8");
        const { data: frontmatter, content } = matter(raw);

        const baseData = {
            slug,
            title: slug.replace(/-/g, " "),
            ...frontmatter,
        };

        if (includeExcerpt) {
            const excerpt =
                content
                    .replace(/\n+/g, " ")
                    .split(/\s+/)
                    .slice(0, excerptLength)
                    .join(" ") + "...";
            baseData.excerpt = excerpt;
        }

        if (useMtime) {
            const { mtime } = fs.statSync(filePath);
            baseData.date = mtime;
        }

        return baseData;
    });

    const sortedContent = content.sort((a, b) => {
        const dateA = useMtime ? a.date : new Date(a.date);
        const dateB = useMtime ? b.date : new Date(b.date);
        return dateB - dateA;
    });

    const limitedContent = limit
        ? sortedContent.slice(0, limit)
        : sortedContent;

    if (useMtime) {
        return limitedContent.map((item) => ({
            ...item,
            displayDate: item.date.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
            }),
        }));
    }

    return limitedContent;
}

export async function getBlogPosts(options = {}) {
    return getMdxContent({
        directory: "posts",
        includeExcerpt: true,
        useMtime: true,
        ...options,
    });
}

export async function getProjects(options = {}) {
    return getMdxContent({
        directory: "projects",
        ...options,
    });
}
