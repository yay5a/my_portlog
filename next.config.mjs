/** @type {import('next').NextConfig} */
import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";

const nextConfig = {
    outputFileTracingRoot: process.cwd(),
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    reactStrictMode: true,
    transpilePackages: [
        "@tsparticles/react",
        "@tsparticles/engine",
        "@tsparticles/slim", // or '@tsparticles/all' / 'tsparticles'
    ],
};

const withMDX = createMDX({
    options: {
        remarkPlugins: [
            remarkFrontmatter,
            [remarkMdxFrontmatter, { name: "metadata" }],
            remarkGfm,
        ],
        rehypePlugins: [],
    },
    extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
