import { NextResponse } from "next/server";
import { getPlans, savePlans } from "@/lib/db";
import { cookies } from "next/headers";

// Verify admin middleware helper
async function isAdmin() {
  const cookieStore = await cookies();
  const role = cookieStore.get("retailstacker_role")?.value;
  const user = cookieStore.get("retailstacker_user")?.value;
  return role === "admin" || user === "admin@retailstacker.com" || user === "admin@admin.com";
}

export async function GET() {
  try {
    const plans = getPlans();
    return NextResponse.json({ success: true, plans });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!await isAdmin()) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const { plans } = await req.json();
    if (!plans || !Array.isArray(plans)) {
      return NextResponse.json({ error: "Invalid plans list" }, { status: 400 });
    }

    savePlans(plans);
    return NextResponse.json({ success: true, plans });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
