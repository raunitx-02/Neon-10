import { NextRequest, NextResponse } from "next/server";

export function getCorsHeaders(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const allowed = 
    origin.startsWith("chrome-extension://") || 
    origin === "http://localhost:3000" || 
    origin === "https://retailstacker.com" || 
    origin === "https://www.retailstacker.com";

  return {
    "Access-Control-Allow-Origin": allowed ? origin : "https://retailstacker.com",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie",
  };
}

export function corsResponse(req: NextRequest, response: NextResponse) {
  const headers = getCorsHeaders(req);
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}
