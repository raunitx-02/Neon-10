import { NextRequest, NextResponse } from "next/server";

const KEEPA_KEY = process.env.KEEPA_API_KEY!;
const KEEPA_DOMAIN = "10"; // Amazon India

export const dynamic = "force-dynamic";

function bestImage(imagesCSV: string | undefined, asin: string): string {
  if (imagesCSV) {
    const first = imagesCSV.split(",")[0]?.trim();
    if (first && first.length > 5) {
      return `https://m.media-amazon.com/images/I/${first}._AC_SL300_.jpg`;
    }
  }
  return `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`;
}

function np(raw: number | undefined | null, divisor: number = 100): number | null {
  if (!raw || raw <= 0 || raw === -1) return null;
  return Math.round(raw / divisor);
}

// Keepa allows fetching up to 100 ASINs per request, let's chunk by 50
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const asins: string[] = body.asins || [];

    if (!Array.isArray(asins) || asins.length === 0) {
      return NextResponse.json({ error: "No ASINs provided" }, { status: 400 });
    }

    // Limit to 200 ASINs max per request to avoid timeouts/overuse
    const uniqueAsins = [...new Set(asins)].slice(0, 200);
    const chunks = chunkArray(uniqueAsins, 50);

    let allProducts: any[] = [];

    for (const chunk of chunks) {
      const asinList = chunk.join(",");
      const url = new URL("https://api.keepa.com/product");
      url.searchParams.set("key", KEEPA_KEY);
      url.searchParams.set("domain", KEEPA_DOMAIN);
      url.searchParams.set("asin", asinList);
      url.searchParams.set("stats", "1");
      url.searchParams.set("history", "0");

      const res = await fetch(url.toString(), { next: { revalidate: 0 } });
      const data = await res.json();

      if (data.products && Array.isArray(data.products)) {
        const parsed = data.products.map((p: any) => {
          const stats = p.stats?.current || [];
          const buyBox = np(stats[18]);
          const newPrice = np(stats[1]);
          const price = buyBox || newPrice;
          
          const bsr = stats[3] > 0 ? stats[3] : null;
          
          return {
            asin: p.asin,
            title: p.title || "Unknown Product",
            brand: p.brand || p.manufacturer || "Unknown Brand",
            image: bestImage(p.imagesCSV, p.asin),
            price,
            bsr,
            rating: stats[16] > 0 ? stats[16] / 10 : null,
            reviews: stats[17] > 0 ? stats[17] : null,
            category: p.categoryTree?.[p.categoryTree.length - 1]?.name || "General",
          };
        });
        allProducts = [...allProducts, ...parsed];
      }
    }

    return NextResponse.json({ products: allProducts });
  } catch (err) {
    console.error("Bulk analyze error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
