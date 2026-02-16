import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/data/blog";

export default function BlogCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="card-premium block group">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {post.cover && (
          <>
            <Image
              src={post.cover}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        )}
      </div>
      <div className="p-6 space-y-4">
        <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">
          {new Date(post.date).toLocaleDateString("ru-RU")}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 leading-tight group-hover:text-accent transition-colors duration-300">
          {post.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 font-normal">
          {post.excerpt}
        </p>
        <div className="pt-2 text-sm font-semibold text-accent group-hover:text-accent-dark transition-colors">
          Читать далее →
        </div>
      </div>
    </Link>
  );
}
