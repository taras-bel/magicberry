import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Latvbelfruits";
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
    { width: 1200, height: 630 }
  );
}


