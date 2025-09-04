import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

function makeMarkdownExcerpt(md, { maxWords = 40 } = {}) {
	if (!md) return "";

	const para =
		md
			.split(/\r?\n\r?\n+/)
			.map((s) => s.trim())
			.find((s) => s.length > 0) || "";

	const words = para.replace(/\s+/g, " ").split(" ");
	const sliced = words.slice(0, maxWords).join(" ");
	let out = sliced + (words.length > maxWords ? "…" : "");

	const openStars = (out.match(/\*\*/g) || []).length;
	if (openStars % 2 === 1) out = out.replace(/\*\*?$/, "");

	const openUnders = (out.match(/__/g) || []).length;
	if (openUnders % 2 === 1) out = out.replace(/_+$/, "");

	const backticks = (out.match(/`/g) || []).length;
	if (backticks % 2 === 1) out = out.replace(/`+$/, "");

	return out;
}

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
			baseData.excerpt = makeMarkdownExcerpt(content, {
				maxWords: excerptLength,
			});
		}

		if (useMtime) {
			const { mtime } = fs.statSync(filePath);
			baseData.date = mtime;
		}

		const stats = fs.statSync(filePath);
		const fmDate = frontmatter?.date ? new Date(frontmatter.date) : null;

		const created = stats.birthtime ?? stats.ctime ?? stats.mtime;
		const modified = stats.mtime;

		baseData.date = fmDate || (useMtime ? modified : created);
		baseData.modifiedAt = modified;

		return baseData;
	});

	const sortedContent = content.sort((a, b) => {
		const dateA = new Date(a.date);
		const dateB = new Date(b.date);
		return dateB - dateA;
	});

	const limitedContent = limit ? sortedContent.slice(0, limit) : sortedContent;

	if (useMtime) {
		return limitedContent.map((item) => ({
			...item,
			displayDate: new Date(item.date).toLocaleString("en-US", {
				year: "numeric",
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
		useMtime: false,
		...options,
	});
}

export async function getProjects(options = {}) {
	return getMdxContent({
		directory: "projects",
		...options,
	});
}
