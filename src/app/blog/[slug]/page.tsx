import { notFound } from "next/navigation";
import { posts } from "@/data/blog";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return notFound();
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-xs text-[color:var(--secondary-foreground)]">{new Date(post.date).toLocaleDateString("ru-RU")}</div>
      <h1 className="text-3xl font-bold text-[color:var(--foreground)]">{post.title}</h1>
      {post.content.map((p, i) => (
        <p className="text-[color:var(--secondary-foreground)]" key={i}>{p}</p>
      ))}
    </div>
  );
}


