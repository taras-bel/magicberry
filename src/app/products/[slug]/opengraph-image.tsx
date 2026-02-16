import { ImageResponse } from "next/og";
import { products } from "@/data/products";

export const runtime = "edge";

export const alt = "Magic berry — продукт";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: { slug: string } };

export default function Image({ params }: Props) {
  const product = products.find((p) => p.slug === params.slug);
  const title = product?.name ?? "Magic berry";
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf7f9",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#1f2937",
            padding: 48,
            borderRadius: 24,
            background:
              "linear-gradient(180deg, rgba(232,167,180,.25), rgba(232,167,180,.06))",
          }}
        >
          {title}
        </div>
      </div>
    ),
    size
  );
}


