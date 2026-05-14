import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const asin = searchParams.get("asin");
  const domain = searchParams.get("domain") || "10"; // 10 is Amazon.in
  const apiKey = process.env.KEEPA_API_KEY;

  if (!asin) {
    return NextResponse.json({ error: "ASIN is required" }, { status: 400 });
  }

  if (!apiKey || apiKey === "YOUR_KEEPA_KEY") {
    // Return informative mock data if key is missing
    return NextResponse.json({
      isMock: true,
      message: "Please configure KEEPA_API_KEY in environment variables",
      product: {
        title: "Sample Product (Configure Keepa Key)",
        asin: asin,
        imagesCSV: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        stats: {
          current: [249900, 199900, -1], // Keepa price format (multiplied by 100)
          avg: [220000, 180000]
        }
      }
    });
  }

  try {
    // Keepa API Endpoint for Product Data
    // stats=1 gives us the history and summary stats
    const response = await fetch(
      `https://api.keepa.com/product?key=${apiKey}&domain=${domain}&asin=${asin}&stats=1`
    );
    const data = await response.json();

    if (!data.products || data.products.length === 0) {
      return NextResponse.json({ error: "Product not found on Keepa" }, { status: 404 });
    }

    const product = data.products[0];

    // Keepa returns data in a complex CSV-like array format.
    // We simplify it for our frontend.
    return NextResponse.json({
      isMock: false,
      asin: product.asin,
      title: product.title,
      images: product.imagesCSV?.split(","),
      brand: product.brand,
      category: product.categoryTree?.[0]?.name || "Amazon India",
      // Keepa prices are integers (e.g., 14999 means 149.99 or 14999 INR depending on marketplace)
      // For India, prices are usually direct but Keepa sometimes scales them.
      price: product.stats?.current?.[0] ? `₹${(product.stats.current[0] / 1).toLocaleString()}` : "N/A",
      bsr: product.stats?.current?.[3] || "N/A",
      rating: (product.stats?.current?.[16] / 10) || 0,
      reviews: product.stats?.current?.[17] || 0,
      // Raw history for charts
      csv: product.csv 
    });
  } catch (error) {
    console.error("Keepa API Error:", error);
    return NextResponse.json({ error: "Failed to fetch data from Keepa" }, { status: 500 });
  }
}
