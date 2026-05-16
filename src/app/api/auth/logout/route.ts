import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("neon10_plan");
  response.cookies.delete("neon10_user");
  return response;
}
