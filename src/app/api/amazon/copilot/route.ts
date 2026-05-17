import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const query = message.toLowerCase();

    let responseText = "";

    if (query.includes("sales") && (query.includes("gir") || query.includes("down") || query.includes("drop"))) {
      responseText = `I've analyzed your account health and recent metrics. Your sales drop is directly tied to the following critical issues:

**1. CTR (Click-Through Rate) Down**
Your main image on the top-selling ASINs is losing traction. Your competitors have updated their main images with better lighting and higher resolution, causing a 2.4% drop in your CTR over the last 7 days.

**2. Reviews Issue**
You received two 1-star reviews recently which pushed your average rating below 4.0 stars on a high-volume product. This immediately suppressed your conversion rate.

**3. Keyword Ranking Drop**
Your organic rank for your top 3 primary keywords dropped from Page 1 to Page 2.

**4. Competitor Discounting**
Your closest competitor (B0XXXXXX) is currently running a 15% Lightning Deal, stealing your usual Buy Box share.

**5. Image Quality Weak**
Infographics in your gallery are outdated and not mobile-optimized. Customers are bouncing off your listing because the dimensions/features aren't clear.

---
### 🔥 Actionable Steps to Recover Sales:
*   **Step 1:** Immediately run a 5% off coupon. This will add a green badge to your listing, artificially boosting CTR to counteract the competitor's discount.
*   **Step 2:** Request reviews from past buyers using the 'Request a Review' button in Seller Central to drown out the recent negative reviews.
*   **Step 3:** Increase your top-of-search PPC bids by 20% for your 3 main keywords to force your listing back onto Page 1 while your organic rank recovers.
*   **Step 4:** A/B test a new, brighter main image using Amazon's Manage Experiments tool.
`;
    } else if (query.includes("hijacker") || query.includes("fake seller")) {
      responseText = `I detect a potential hijacker on your listing. 

**Immediate Action Required:**
1. Lower your price by ₹1 below their price to instantly win back the Buy Box.
2. Send a Cease & Desist message through the Buyer-Seller messaging system.
3. If you have Brand Registry, report a violation immediately via the Brand Registry portal.
`;
    } else {
      responseText = `I'm analyzing your Amazon storefront data. Currently, I don't see any critical red flags related to that query. 

However, if you're looking for ways to optimize, I recommend checking your **Listing SEO** or reviewing your **Keyword Tracker** to see if any competitors are out-bidding you on generic search terms. How else can I assist your growth today?`;
    }

    // Simulate network delay for AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({ reply: responseText });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
