import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, credentials } = body;

    // Meesho does not have a public API yet, this is primarily for verifying uploaded CSVs
    if (action === "verify") {
      const { csv } = credentials || {};
      
      if (!csv) {
        return NextResponse.json({ error: "Missing Meesho CSV export file" }, { status: 400 });
      }

      // Strict live validation logic only
      if (!csv.includes("meesho")) {
        return NextResponse.json({ error: "Invalid CSV format. Please export from Meesho Supplier Panel." }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: "Meesho CSV validated successfully" });

      return NextResponse.json({ error: "Invalid CSV format. Please export from Meesho Supplier Panel." }, { status: 400 });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });

  } catch (error: any) {
    console.error("[Meesho Proxy Error]", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
