/**
 * Keepa Time is minutes since 2011-01-01 00:00:00 UTC
 */
export const keepaTimeToDate = (keepaTime: number) => {
  return new Date((keepaTime + 21575040) * 60000);
};

/**
 * Parses Keepa CSV array into a format suitable for Recharts
 * @param csv The raw csv array from Keepa (e.g. product.csv[0] for Price)
 * @param valueScale The scale factor (usually 1 for INR, 100 for USD cents)
 */
export const parseKeepaCsv = (csv: number[] | undefined, valueScale: number = 1) => {
  if (!csv || csv.length < 2) return [];
  
  const points = [];
  for (let i = 0; i < csv.length; i += 2) {
    const time = csv[i];
    const value = csv[i + 1];
    
    if (value < 0) continue; // Skip negative values (out of stock)
    
    points.push({
      date: keepaTimeToDate(time).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      timestamp: keepaTimeToDate(time).getTime(),
      value: value / valueScale
    });
  }
  
  // Return only the last 30 points to keep charts clean, or filter by date
  return points.slice(-30);
};

/**
 * Common Keepa CSV Indices:
 * 0: Amazon Price
 * 1: New Price
 * 2: Used Price
 * 3: Sales Rank (BSR)
 * 6: List Price
 * 10: Buy Box Price
 */
export const KEEPA_INDICES = {
  AMAZON_PRICE: 0,
  NEW_PRICE: 1,
  SALES_RANK: 3,
  BUY_BOX: 10,
  RATING: 16,
  REVIEWS: 17
};
