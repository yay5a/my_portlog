import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Only .mdx (and .md if desired) become MDX pages
    pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
};

const withMDX = createMDX({
    extension: /\.mdx?$/, // <-- match .mdx files
    options: {
        providerImportSource: "@mdx-js/react", // <-- use MDX v1-compatible output
        remarkPlugins: [], // add remark plugins if needed
        rehypePlugins: [], // add rehype plugins if needed
    },
});

export default withMDX(nextConfig);
