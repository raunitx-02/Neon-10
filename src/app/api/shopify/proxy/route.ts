import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, credentials } = body;

    if (action === "verify") {
      const { storeUrl, accessToken } = credentials || {};
      
      if (!storeUrl || !accessToken) {
        return NextResponse.json({ error: "Missing required Shopify credentials" }, { status: 400 });
      }

      // No demo bypass - strict live checking only

      // Clean the store URL (e.g. from "mystore.myshopify.com" to just the base URL)
      let cleanUrl = storeUrl.trim();
      if (!cleanUrl.startsWith("http")) {
        cleanUrl = `https://${cleanUrl}`;
      }
      
      // Ping the Shopify Store Admin API to verify the token
      const tokenUrl = `${cleanUrl}/admin/api/2024-01/shop.json`;
      
      const response = await fetch(tokenUrl, {
        method: "GET",
        headers: { 
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: "Invalid Shopify credentials or Store URL" },
          { status: 401 }
        );
      }

      return NextResponse.json({ success: true, verified: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });

  } catch (error: any) {
    console.error("[Shopify Proxy Error]", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
