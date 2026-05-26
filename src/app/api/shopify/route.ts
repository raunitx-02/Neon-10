/**
 * Shopify Admin API Proxy
 * POST /api/shopify
 * Body: { resource, shop, accessToken, params? }
 * Proxies requests to Shopify Admin REST API 2024-01
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const SHOPIFY_API_VERSION = "2024-01";

type ShopifyResource = "products" | "orders" | "inventory_levels" | "customers" | "shop" | "smart_collections" | "custom_collections";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resource, shop, accessToken, params = {} } = body as {
      resource: ShopifyResource;
      shop: string;
      accessToken: string;
      params?: Record<string, string | number>;
    };

    if (!resource || !shop || !accessToken) {
      return NextResponse.json({ error: "Missing required fields: resource, shop, accessToken" }, { status: 400 });
    }

    // Sanitize shop domain
    const shopDomain = shop.replace(/^https?:\/\//, "").replace(/\/$/, "");
    if (!shopDomain.includes("myshopify.com") && !shopDomain.includes(".")) {
      return NextResponse.json({ error: "Invalid shop domain format. Use: yourstore.myshopify.com" }, { status: 400 });
    }

    // Build query string
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => queryParams.set(k, String(v)));
    const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : "";

    const url = `https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}/${resource}.json${queryStr}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `Shopify API error ${response.status}: ${errText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (err: any) {
    console.error("[Shopify API Proxy Error]", err);
    return NextResponse.json({ error: err.message || "Shopify API request failed" }, { status: 500 });
  }
}

/**
 * GET /api/shopify — health check
 */
export async function GET() {
  return NextResponse.json({ status: "Shopify API proxy active", version: SHOPIFY_API_VERSION });
}
