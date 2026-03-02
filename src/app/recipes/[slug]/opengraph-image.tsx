import { ImageResponse } from "next/og";
import { recipes } from "@/data/recipes";

export const runtime = "edge";
export const alt = "Latvbelfruits — рецепт";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image({ params }: { params: { slug: string } }) {
  const r = recipes.find((x) => x.slug === params.slug);
  const title = r?.title ?? "Рецепт";
  return new ImageResponse(
    (
      <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#faf7f9" }}>
        <div style={{ fontSize: 56, fontWeight: 700, color: "#1f2937", padding: 48, borderRadius: 24, background: "linear-gradient(180deg, rgba(232,167,180,.25), rgba(232,167,180,.06))" }}>
          {title}
        </div>
      </div>
    ),
    size
  );
}


