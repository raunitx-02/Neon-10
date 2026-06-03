import { NextRequest, NextResponse } from "next/server";

import { corsResponse, getCorsHeaders } from "@/lib/cors";

export const dynamic = "force-dynamic";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(req),
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    if (!query) {
      return corsResponse(req, NextResponse.json({ suggestions: [] }));
    }

    const limit = searchParams.get("limit") || "10";

    const res = await fetch(
      `https://completion.amazon.in/api/2017/suggestions?limit=${limit}&prefix=${encodeURIComponent(query)}&alias=aps&site-variant=desktop&version=2`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json",
        }
      }
    );

    if (!res.ok) {
      throw new Error(`Amazon suggestions API returned status ${res.status}`);
    }

    const data = await res.json();
    return corsResponse(req, NextResponse.json(data));
  } catch (err: any) {
    console.error("Next.js backend suggestions API error:", err);
    return corsResponse(req, NextResponse.json({ suggestions: [] }, { status: 500 }));
  }
}

