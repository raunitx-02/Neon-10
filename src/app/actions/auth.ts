"use server";
import { findUser, saveUser, setOtp, verifyOtp } from "@/lib/db";
import { cookies } from "next/headers";
import crypto from "crypto";
import nodemailer from "nodemailer";

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function loginAction(email: string, password: string) {
  const user = findUser(email);
  if (!user) return { error: "User not found. Please register." };
  
  if (user.password !== hashPassword(password)) {
    return { error: "Incorrect password." };
  }

  const cookieStore = await cookies();
  cookieStore.set("neon10_user", user.email, { path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production" });
  cookieStore.set("neon10_plan", user.plan || "Free", { path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production" });

  return { success: true };
}

export async function sendOtpAction(email: string) {
  const user = findUser(email);
  if (user) return { error: "Email is already registered. Please log in." };

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  setOtp(email, otp);

  // In production, configure SMTP here. For demo, we use Ethereal or log it.
  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });

    const info = await transporter.sendMail({
      from: '"Neon 10" <noreply@neon10.com>',
      to: email,
      subject: "Your OTP for Neon 10",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
      html: `<h2>Welcome to Neon 10</h2><p>Your OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`,
    });

    console.log("OTP Sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
    console.log("OTP IS:", otp); // For easy local testing without checking ethereal link

  } catch (err) {
    console.error("Nodemailer error:", err);
    // Fallback to console log if network fails
    console.log("FALLBACK OTP IS:", otp);
  }

  return { success: true, message: "OTP sent to your email. Check your console/terminal for the OTP." };
}

export async function registerAction(email: string, password: string, otp: string) {
  if (!verifyOtp(email, otp)) {
    return { error: "Invalid or expired OTP." };
  }

  const newUser = {
    email,
    password: hashPassword(password),
    plan: "Free", // default
    createdAt: Date.now()
  };

  saveUser(newUser);

  const cookieStore = await cookies();
  cookieStore.set("neon10_user", email, { path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production" });
  cookieStore.set("neon10_plan", "Free", { path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production" });

  return { success: true };
}
