import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { findUser, saveUser } from "@/lib/db";
import { corsResponse, getCorsHeaders } from "@/lib/cors";

export const dynamic = "force-dynamic";

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function appendSignupCsv(data: { firstName: string; lastName: string; email: string; mobile: string; role: string; plan: string }) {
  const CSV_PATH = path.join(process.cwd(), "signups.csv");
  const header = "Date,First Name,Last Name,Email,Mobile,Role,Plan\n";
  const row = `${new Date().toISOString()},${data.firstName},${data.lastName},${data.email},${data.mobile},${data.role},${data.plan}\n`;
  try {
    if (!fs.existsSync(CSV_PATH)) fs.writeFileSync(CSV_PATH, header, "utf8");
    fs.appendFileSync(CSV_PATH, row, "utf8");
  } catch (e) {
    console.error("Failed to write signups.csv:", e);
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(req),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName, mobile } = await req.json();

    if (!email || !password) {
      return corsResponse(req, NextResponse.json({ error: "Email and password are required" }, { status: 400 }));
    }

    const existingUser = findUser(email);
    if (existingUser) {
      return corsResponse(req, NextResponse.json({ error: "Email is already registered. Please log in." }, { status: 409 }));
    }

    // Default registration payload
    const newUser = {
      email,
      password: hashPassword(password),
      firstName: firstName || "",
      lastName: lastName || "",
      mobile: mobile || "",
      role: "user",
      plan: "Free",
      createdAt: Date.now()
    };

    // Save to file DB (data.json)
    saveUser(newUser);

    // Save to CSV so it shows in the Admin dashboard
    appendSignupCsv({
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      mobile: newUser.mobile,
      role: newUser.role,
      plan: newUser.plan
    });

    // Set SSO cookies
    const cookieStore = await cookies();
    cookieStore.set("retailstacker_user", email, { path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 30 * 24 * 60 * 60 });
    cookieStore.set("retailstacker_plan", "Free", { path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 30 * 24 * 60 * 60 });
    cookieStore.set("retailstacker_role", "user", { path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 30 * 24 * 60 * 60 });

    return corsResponse(req, NextResponse.json({
      success: true,
      user: {
        email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        plan: "Free",
        role: "user"
      }
    }));
  } catch (err: any) {
    console.error("Extension register error:", err);
    return corsResponse(req, NextResponse.json({ error: "Internal Server Error" }, { status: 500 }));
  }
}

