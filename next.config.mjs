/** @type {import('next').NextConfig} */
import createMDX from "@next/mdx";
const withMDX = createMDX();
const nextConfig = withMDX({
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
});

export default nextConfig;
