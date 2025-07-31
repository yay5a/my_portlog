/** @type {import('next').NextConfig} */
import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

const nextConfig = {
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    reactStrictMode: true,
};

const withMDX = createMDX({
    options: {
        remarkPlugins: [
            remarkFrontmatter,
            [remarkMdxFrontmatter, { name: "metadata" }],
        ],
        rehypePlugins: [],
    },
    extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
