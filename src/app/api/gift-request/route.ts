import { NextResponse } from "next/server";
import { notifyLead } from "@/lib/notify";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  let payload: Record<string, unknown> = {};
  if (contentType.includes("application/json")) {
    payload = await request.json();
  } else {
    const form = await request.formData();
    form.forEach((value, key) => {
      payload[key] = value.toString();
    });
  }
  console.log("gift-request", payload);
  await notifyLead("gift", payload);
  return NextResponse.json({ ok: true });
}


