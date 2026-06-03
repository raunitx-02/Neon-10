import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { findUser } from "@/lib/db";
import { corsResponse, getCorsHeaders } from "@/lib/cors";

export const dynamic = "force-dynamic";

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(req),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return corsResponse(req, NextResponse.json({ error: "Email and password are required" }, { status: 400 }));
    }

    // Standard hardcoded admin check
    if (email === "admin@admin.com" && password === "Admin@2345") {
      const cookieStore = await cookies();
      cookieStore.set("retailstacker_user", "admin@admin.com", { path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 30 * 24 * 60 * 60 });
      cookieStore.set("retailstacker_plan", "Diamond", { path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 30 * 24 * 60 * 60 });
      cookieStore.set("retailstacker_role", "admin", { path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 30 * 24 * 60 * 60 });
      return corsResponse(req, NextResponse.json({
        success: true,
        user: { email: "admin@admin.com", plan: "Diamond", role: "admin", firstName: "Admin" }
      }));
    }

    if (email === "admin@retailstacker.com" && password === "Admin@0987") {
      const cookieStore = await cookies();
      cookieStore.set("retailstacker_user", "admin@retailstacker.com", { path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 30 * 24 * 60 * 60 });
      cookieStore.set("retailstacker_plan", "Diamond", { path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 30 * 24 * 60 * 60 });
      cookieStore.set("retailstacker_role", "admin", { path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 30 * 24 * 60 * 60 });
      return corsResponse(req, NextResponse.json({
        success: true,
        user: { email: "admin@retailstacker.com", plan: "Diamond", role: "admin", firstName: "Admin" }
      }));
    }

    const user = findUser(email);
    if (!user) {
      return corsResponse(req, NextResponse.json({ error: "User not found. Please register." }, { status: 404 }));
    }

    if (user.password !== hashPassword(password)) {
      return corsResponse(req, NextResponse.json({ error: "Incorrect password." }, { status: 401 }));
    }

    const cookieStore = await cookies();
    cookieStore.set("retailstacker_user", user.email, { path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 30 * 24 * 60 * 60 });
    cookieStore.set("retailstacker_plan", user.plan || "Free", { path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 30 * 24 * 60 * 60 });
    cookieStore.set("retailstacker_role", user.role || "user", { path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 30 * 24 * 60 * 60 });

    return corsResponse(req, NextResponse.json({
      success: true,
      user: {
        email: user.email,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        plan: user.plan || "Free",
        role: user.role || "user"
      }
    }));
  } catch (err: any) {
    console.error("Extension login error:", err);
    return corsResponse(req, NextResponse.json({ error: "Internal Server Error" }, { status: 500 }));
  }
}

