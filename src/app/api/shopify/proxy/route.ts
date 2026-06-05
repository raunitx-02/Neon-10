import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, credentials } = body;

    if (action === "verify") {
      const { storeUrl, shopDomain, accessToken } = credentials || {};
      const actualStoreUrl = storeUrl || shopDomain;
      
      if (!actualStoreUrl || !accessToken) {
        return NextResponse.json({ error: "Missing required Shopify credentials" }, { status: 400 });
      }

      // Handle sandbox/demo bypass
      if (actualStoreUrl === "sandbox_credentials" || accessToken === "sandbox_credentials") {
        return NextResponse.json({ success: true, verified: true, sandbox: true });
      }

      // Clean the store URL (e.g. from "mystore.myshopify.com" to just the base URL)
      let cleanUrl = actualStoreUrl.trim();
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
