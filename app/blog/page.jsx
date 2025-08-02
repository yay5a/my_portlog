import BlogCard from "@/components/BlogCard";
import { getBlogPosts } from "@/utils/mdxUtils";

export default async function BlogPage() {
    const posts = await getBlogPosts();

    return (
        <div className="max-w-2xl py-8 mx-auto space-y-4">
            <h1 className="mb-4 text-3xl font-bold">Blogs</h1>
            {posts.map((post) => (
                <BlogCard
                    key={post.slug}
                    title={post.title}
                    date={post.displayDate}
                    excerpt={post.excerpt}
                    slug={post.slug}
                />
            ))}
        </div>
    );
}
