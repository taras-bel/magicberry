import { NextResponse } from "next/server";
import { getCmsStores } from "@/lib/cms";

export async function GET() {
  const stores = await getCmsStores();
  return NextResponse.json({ stores });
}


