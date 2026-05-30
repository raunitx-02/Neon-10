"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Scan,
  Star,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Zap,
  BarChart2,
  Package,
  Sparkles,
  ShieldCheck,
  Search,
  X,
  Shield,
  ArrowRight,
  Activity,
  FileText,
  Pause,
  Play,
  Download,
  Filter,
  CheckSquare
} from "lucide-react";

interface Checklist {
  titleLength: number;
  titleGrade: "Excellent" | "Good" | "Poor";
  bulletCount: number;
  bulletGrade: "Excellent" | "Good" | "Poor";
  imageCount: number;
  imageGrade: "Excellent" | "Good" | "Poor";
  descriptionLength: number;
  descriptionGrade: "Excellent" | "Good" | "Poor";
  hasAplus: boolean;
}

interface SeoAnalysis {
  score: number;
  issues: string[];
  wins: string[];
  checklist: Checklist;
}

interface Listing {
  asin: string;
  title: string;
  shortTitle: string;
  img: string;
  brand: string;
  price: number;
  formattedPrice: string;
  bsr: number;
  reviews: number;
  rating: number;
  monthlySold: number;
  monthlyRevenue: number;
  formattedMonthlyRevenue: string;
  fbaFee: number;
  formattedFbaFee: string;
  referralFeePercent: number;
  referralFee: number;
  formattedReferralFee: string;
  gstPercent: number;
  gst: number;
  formattedGst: string;
  cogs: number;
  formattedCogs: string;
  netProfit: number;
  formattedNetProfit: string;
  netMargin: number;
  bulletCount: number;
  descriptionLength: number;
  buyBoxOwner: string;
  priceAvg30: number;
  formattedPriceAvg30: string;
  priceAvg90: number;
  formattedPriceAvg90: string;
  priceStability: "Stable" | "Highly Volatile" | "Price War Alert";
  opportunity: "High" | "Medium" | "Low";
  seo: SeoAnalysis;
  keywords: string[];
}

interface AccountHealth {
  score: number;
  alerts: string[];
  positives: string[];
}

interface GrowthPrediction {
  asin: string;
  title: string;
  prediction: string;
  action: string;
  potential: string;
  checklist: string[];
}

interface KeywordFrequency {
  word: string;
  count: number;
  listingsPercentage: number;
}

function ScoreRing({ score, size = 80, strokeWidth }: { score: number; size?: number; strokeWidth?: number }) {
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const sWidth = strokeWidth || size * 0.1;
  const color = score >= 75 ? "var(--success)" : score >= 50 ? "var(--warning)" : "var(--danger)";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={sWidth} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={sWidth}
        strokeDasharray={`${(score / 100) * circ} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontSize={size * 0.22}
        fontWeight="900"
      >
        {Math.round(score)}%
      </text>
    </svg>
  );
}

function GradeBadge({ grade }: { grade: "Excellent" | "Good" | "Poor" }) {
  const bg =
    grade === "Excellent"
      ? "var(--success-muted)"
      : grade === "Good"
      ? "var(--warning-muted)"
      : "var(--danger-muted)";
  const color =
    grade === "Excellent"
      ? "var(--success)"
      : grade === "Good"
      ? "var(--warning)"
      : "var(--danger)";
  return (
    <span
      style={{
        background: bg,
        color,
        fontSize: 11,
        fontWeight: 700,
        padding: "2px 8px",
        borderRadius: 4,
        textTransform: "uppercase",
      }}
    >
      {grade}
    </span>
  );
}

export default function ScannerPage() {
  const [input, setInput] = useState("");
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlerStatus, setCrawlerStatus] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [totalItemsFound, setTotalItemsFound] = useState(0);
  const [itemsScanned, setItemsScanned] = useState(0);
  const [activeListings, setActiveListings] = useState<Listing[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Scraper control references
  const abortControllerRef = useRef<AbortController | null>(null);
  const isPausedRef = useRef(false);
  const [isPaused, setIsPausedState] = useState(false);
  
  // Brand name metadata
  const [brandName, setBrandName] = useState("Storefront Catalog");
  const [scannedAt, setScannedAt] = useState<string>("");

  // Filters & Interactivity states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("monthlyRevenue");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterMargin, setFilterMargin] = useState<string>("all");
  const [filterBuyBox, setFilterBuyBox] = useState<string>("all");
  const [filterSEO, setFilterSEO] = useState<string>("all");
  
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"portfolio" | "seo" | "finance" | "buybox" | "roadmap" | "keywords">("portfolio");

  // Dynamic calculations based on active listings
  const totalRevenue = activeListings.reduce((sum, l) => sum + l.monthlyRevenue, 0);
  const totalUnitsSold = activeListings.reduce((sum, l) => sum + l.monthlySold, 0);
  const bsrList = activeListings.filter(l => l.bsr > 0);
  const avgBSR = bsrList.length > 0 ? Math.round(bsrList.reduce((sum, l) => sum + l.bsr, 0) / bsrList.length) : 0;
  const ratingList = activeListings.filter(l => l.rating > 0);
  const avgRating = ratingList.length > 0 ? Number((ratingList.reduce((sum, l) => sum + l.rating, 0) / ratingList.length).toFixed(1)) : 0;
  const totalReviews = activeListings.reduce((sum, l) => sum + l.reviews, 0);

  // SEO Score & Account integrity calculations
  const avgSeoScore = activeListings.length > 0 ? Math.round(activeListings.reduce((sum, l) => sum + l.seo.score, 0) / activeListings.length) : 0;
  
  // Calculate account health dynamically
  const buildAccountHealth = (): AccountHealth => {
    const alerts: string[] = [];
    const positives: string[] = [];
    let score = 100;

    const highBSRCount = activeListings.filter(s => s.bsr > 100000).length;
    if (highBSRCount > 0) {
      alerts.push(`${highBSRCount} product(s) with BSR > 100,000 — consider repricing or optimization`);
      score -= highBSRCount * 3;
    }

    const lowRatedCount = activeListings.filter(s => s.rating > 0 && s.rating < 3.5).length;
    if (lowRatedCount > 0) {
      alerts.push(`${lowRatedCount} listing(s) rated below 3.5★ — high return risk`);
      score -= lowRatedCount * 6;
    }

    const goodBSRCount = activeListings.filter(s => s.bsr > 0 && s.bsr < 20000).length;
    if (goodBSRCount > 0) positives.push(`${goodBSRCount} products with strong BSR (< 20,000)`);

    const directAmazonCount = activeListings.filter(s => s.buyBoxOwner === "Amazon").length;
    if (directAmazonCount > 0) {
      alerts.push(`${directAmazonCount} listings compete with Amazon Retail directly in Buy Box`);
      score -= directAmazonCount * 5;
    }

    const stablePricing = activeListings.filter(s => s.priceStability === "Stable").length;
    if (stablePricing > 0) positives.push(`${stablePricing} listings with stable pricing policies`);

    if (activeListings.length > 0) positives.push(`${activeListings.length} products tracked successfully`);

    return {
      score: Math.max(0, Math.min(100, score)),
      alerts,
      positives
    };
  };

  const accountHealth = buildAccountHealth();
  const overallScore = activeListings.length > 0 ? Math.round((avgSeoScore * 0.4) + (accountHealth.score * 0.4) + (avgRating >= 4.0 ? 20 : avgRating >= 3.5 ? 10 : 0)) : 0;

  // Niche Benchmarking and Gaps
  const avgReviews = activeListings.length > 0 ? Math.round(totalReviews / activeListings.length) : 0;
  const competitorGaps = [
    avgReviews < 300 ? `Average reviews is ${avgReviews} — lower saturated market entry` : `High reviews barrier: avg catalog reviews is ${avgReviews}`,
    avgBSR > 0 ? `Brand average category rank (BSR): #${avgBSR.toLocaleString("en-IN")}` : "No active category rank history found",
    `Average listing rating is ${avgRating}★`,
    activeListings.filter(s => s.bulletCount < 5).length > 0
      ? `${activeListings.filter(s => s.bulletCount < 5).length} listing(s) have weak bullet point structures`
      : "Excellent bullet points structure overall",
  ];

  // AI Growth Roadmap list
  const growthRoadmap: GrowthPrediction[] = activeListings.slice(0, 5).map((l, idx) => {
    let prediction = "Stable — optimize margins";
    let action = "Audit FBA fees + GST slabs for margin expansion";
    let potential = "+10-15% margins";
    let checklist = ["Optimize PPC ad bids to align with the target contribution margin", "Create bundled multipacks to avoid direct Buy Box competition"];

    if (l.seo.score < 60) {
      prediction = "Low Visibility — SEO Required";
      action = "Rebuild product title keywords and backend search terms using Frankenstein";
      potential = "+35% organic ranking";
      checklist = ["Inject high-volume competitor search term backend keywords", "Re-write description to match listing guidelines"];
    } else if (l.bsr < 10000 && l.reviews > 100) {
      prediction = "High Volume — Scale PPC";
      action = "Launch Sponsored Products PPC campaigns targeting top search queries";
      potential = "+40-60% sales velocity";
      checklist = ["Aggressively target top 5 competitor listing keyword targets", "Audit Buy Box stability trends"];
    }

    return {
      asin: l.asin,
      title: l.shortTitle,
      prediction,
      action,
      potential,
      checklist
    };
  });

  // Calculate Keyword Frequencies across all products
  const keywordFrequencies: KeywordFrequency[] = (() => {
    const counts: Record<string, number> = {};
    for (const l of activeListings) {
      if (l.keywords) {
        for (const kw of l.keywords) {
          counts[kw] = (counts[kw] || 0) + 1;
        }
      }
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, count]) => ({
        word,
        count,
        listingsPercentage: Math.round((count / activeListings.length) * 100)
      }));
  })();

  // ─── Scraper Core Execution Logic ────────────────────────────────────────────────
  const startScan = useCallback(async () => {
    if (!input.trim()) return;
    
    // Reset state
    setError(null);
    setIsCrawling(true);
    setCrawlerStatus("Contacting RetailStacker live Keepa API tunnel...");
    setProgressPercent(0);
    setItemsScanned(0);
    setTotalItemsFound(0);
    setActiveListings([]);
    setIsPausedState(false);
    isPausedRef.current = false;
    
    abortControllerRef.current = new AbortController();

    try {
      // 1. Initial Handshake / Scraper Initialization
      const initRes = await fetch("/api/amazon/scanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "initialize", input: input.trim() }),
        signal: abortControllerRef.current.signal
      });

      if (!initRes.ok) {
        const errJson = await initRes.json();
        throw new Error(errJson.error || "Initialization failed");
      }

      const initData = await initRes.json();
      const asins: string[] = initData.asins || [];
      const fetchedBrandName = initData.brandName || "Brand Storefront";
      
      setBrandName(fetchedBrandName);
      setTotalItemsFound(asins.length);
      setScannedAt(new Date().toLocaleString());

      if (asins.length === 0) {
        throw new Error("No active product listings found for this storefront.");
      }

      setCrawlerStatus(`Discovered ${asins.length} active products. Beginning high-fidelity scan...`);

      // 2. Progressive batch crawling
      const batchSize = 10;
      let loadedListings: Listing[] = [];

      for (let i = 0; i < asins.length; i += batchSize) {
        // Handle Pause state
        while (isPausedRef.current) {
          setCrawlerStatus("Crawling paused by user. Click resume to continue...");
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        const batch = asins.slice(i, i + batchSize);
        setCrawlerStatus(`Scanning listings ${i + 1} to ${Math.min(i + batchSize, asins.length)} of ${asins.length}...`);

        const batchRes = await fetch("/api/amazon/scanner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "batch", asins: batch }),
          signal: abortControllerRef.current.signal
        });

        if (!batchRes.ok) {
          console.warn(`Failed to crawl batch starting at index ${i}`);
          continue;
        }

        const batchData = await batchRes.json();
        const newListings: Listing[] = batchData.listings || [];

        loadedListings = [...loadedListings, ...newListings];
        setActiveListings(loadedListings);
        
        const currentScanned = Math.min(i + batch.length, asins.length);
        setItemsScanned(currentScanned);
        setProgressPercent(Math.round((currentScanned / asins.length) * 100));
      }

      setCrawlerStatus("Brand scan completed successfully! A to Z audited.");
      setIsCrawling(false);

    } catch (err: any) {
      if (err.name === "AbortError") {
        setCrawlerStatus("Scan audit cancelled by user.");
      } else {
        setError(err.message || "Auditing process failed");
      }
      setIsCrawling(false);
    }
  }, [input]);

  const togglePause = () => {
    isPausedRef.current = !isPausedRef.current;
    setIsPausedState(isPausedRef.current);
  };

  const cancelScan = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsCrawling(false);
  };

  // CSV Data Exporter
  const exportCSV = () => {
    if (activeListings.length === 0) return;
    
    const headers = [
      "ASIN", "Title", "Brand", "Price (INR)", "BSR", "Reviews", "Rating", 
      "Est Monthly Sales", "Monthly Revenue (INR)", "FBA Fee (INR)", 
      "Referral Fee", "GST Fee", "Net profit (INR)", "Net Margin (%)", "SEO Score"
    ];

    const rows = activeListings.map(l => [
      l.asin,
      `"${l.title.replace(/"/g, '""')}"`,
      l.brand,
      l.price,
      l.bsr,
      l.reviews,
      l.rating,
      l.monthlySold,
      l.monthlyRevenue,
      l.fbaFee,
      l.referralFee,
      l.gst,
      l.netProfit,
      l.netMargin,
      l.seo.score
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `retailstacker_seller_scan_${brandName.replace(/\s+/g, "_").toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sorting & Filtering Listings
  const getProcessedListings = () => {
    let result = [...activeListings];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        l => l.asin.toLowerCase().includes(q) || 
             l.title.toLowerCase().includes(q) || 
             l.brand.toLowerCase().includes(q)
      );
    }

    // Margin filter
    if (filterMargin === "high") {
      result = result.filter(l => l.netMargin >= 30);
    } else if (filterMargin === "medium") {
      result = result.filter(l => l.netMargin >= 15 && l.netMargin < 30);
    } else if (filterMargin === "low") {
      result = result.filter(l => l.netMargin < 15);
    }

    // Buy Box filter
    if (filterBuyBox === "amazon") {
      result = result.filter(l => l.buyBoxOwner === "Amazon");
    } else if (filterBuyBox === "fba") {
      result = result.filter(l => l.buyBoxOwner === "FBA Seller");
    } else if (filterBuyBox === "suppressed") {
      result = result.filter(l => l.buyBoxOwner === "Suppressed");
    }

    // SEO score filter
    if (filterSEO === "poor") {
      result = result.filter(l => l.seo.score < 50);
    } else if (filterSEO === "good") {
      result = result.filter(l => l.seo.score >= 50 && l.seo.score < 75);
    } else if (filterSEO === "excellent") {
      result = result.filter(l => l.seo.score >= 75);
    }

    // Sorting
    result.sort((a: any, b: any) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle nested values
      if (sortField === "seoScore") {
        valA = a.seo.score;
        valB = b.seo.score;
      }

      if (typeof valA === "string") {
        return sortDirection === "asc" 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      } else {
        return sortDirection === "asc" 
          ? (valA || 0) - (valB || 0) 
          : (valB || 0) - (valA || 0);
      }
    });

    return result;
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getStatusColor = (score: number) => {
    return score >= 75 ? "var(--success)" : score >= 50 ? "var(--warning)" : "var(--danger)";
  };

  const getPriceStabilityColor = (stability: string) => {
    if (stability === "Stable") return "var(--success)";
    if (stability === "Highly Volatile") return "var(--warning)";
    return "var(--danger)";
  };

  const getBuyBoxBadge = (owner: string) => {
    if (owner === "Amazon") {
      return { bg: "var(--danger-muted)", color: "var(--danger)", label: "Amazon Held" };
    }
    if (owner === "FBA Seller") {
      return { bg: "var(--success-muted)", color: "var(--success)", label: "FBA Seller" };
    }
    if (owner === "FBM Seller") {
      return { bg: "var(--warning-muted)", color: "var(--warning)", label: "FBM Seller" };
    }
    return { bg: "var(--border)", color: "var(--text-muted)", label: "Suppressed" };
  };

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px 80px" }}>
      {/* Page Title Header */}
      <div className="page-header" style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 12, fontWeight: 900 }}>
            <Scan color="var(--accent)" size={32} /> AI Seller Storefront Scanner
          </h1>
          <p className="page-subtitle">
            Crawl and audit 100% of products listed inside any Amazon seller storefront. Estimates monthly revenues, FBA margins, listing SEO audits, buy-box volatility, and aggregates seller keyword patterns live.
          </p>
        </div>
        {activeListings.length > 0 && (
          <div className="glass-card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 24px" }}>
            <ScoreRing score={overallScore} size={64} strokeWidth={6} />
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>Seller Standing</div>
              <div style={{ fontWeight: 800, fontSize: 16, color: getStatusColor(overallScore), marginTop: 2 }}>
                {overallScore >= 75 ? "Excellent (A Grade)" : overallScore >= 50 ? "Satisfactory" : "Critical Risk (Action Required)"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Module */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24, border: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--accent), var(--purple))" }} />
        <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 12, display: "flex", alignItems: "center", gap: 8, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
          <Search size={16} color="var(--accent)" /> Establish Crawl Target
        </h3>
        
        <div style={{ display: "flex", gap: 12 }}>
          <input
            className="input-field"
            placeholder="Paste Amazon Storefront URL (with seller/me parameter), brand name (e.g. Mamaearth), or list up to 100 ASINs separated by commas..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isCrawling && startScan()}
            disabled={isCrawling}
            style={{ flex: 1, fontSize: 14, padding: "14px 18px", borderRadius: 12 }}
          />
          {input && !isCrawling && (
            <button className="btn-ghost" style={{ padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 12 }} onClick={() => setInput("")}>
              <X size={15} />
            </button>
          )}
          <button
            className="btn-accent"
            onClick={startScan}
            disabled={isCrawling || !input.trim()}
            style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 180, justifyContent: "center", fontWeight: 700, padding: "14px 28px", borderRadius: 12 }}
          >
            <Scan size={16} /> Crawl Storefront A-Z
          </button>
        </div>
        
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 10, display: "flex", gap: 6, alignItems: "center" }}>
          <Sparkles size={14} color="var(--warning)" /> 
          <span>Supports crawling the entire, active storefront catalog without limits. Runs in background with dynamic batch fetch pipelines.</span>
        </p>
      </div>

      {/* Crawling Progress Panel */}
      {isCrawling && (
        <div className="glass-card" style={{ padding: 32, marginBottom: 24, border: "1px solid var(--border)", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 600, margin: "0 auto 12px" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>Real-Time Scraper Tunnel</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Scanned {itemsScanned} / {totalItemsFound > 0 ? totalItemsFound : "???"} Listings ({progressPercent}%)</span>
          </div>
          
          <div style={{ width: "100%", maxWidth: 600, height: 8, background: "var(--border)", borderRadius: 4, margin: "0 auto 20px", overflow: "hidden" }}>
            <div style={{ width: `${progressPercent}%`, height: "100%", background: "linear-gradient(90deg, var(--accent), var(--purple))", transition: "width 0.4s ease" }} />
          </div>

          <p style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 600, marginBottom: 20 }}>
            {crawlerStatus}
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button className="btn-ghost" onClick={togglePause} style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid var(--border)", padding: "8px 20px", borderRadius: 8 }}>
              {isPaused ? <Play size={14} /> : <Pause size={14} />} {isPaused ? "Resume Scrape" : "Pause Scrape"}
            </button>
            <button className="btn-ghost" onClick={cancelScan} style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--danger)", border: "1px solid var(--danger)", padding: "8px 20px", borderRadius: 8 }}>
              <X size={14} /> Stop & Audit Partial
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{ background: "var(--danger-muted)", border: "1px solid var(--danger)", borderRadius: 12, padding: "14px 20px", marginBottom: 24, color: "var(--danger)", display: "flex", alignItems: "center", gap: 10 }}>
          <AlertTriangle size={18} />
          <div>
            <div style={{ fontWeight: 700 }}>Crawl Process Aborted</div>
            <div style={{ fontSize: 13, marginTop: 2 }}>{error}</div>
          </div>
        </div>
      )}

      {/* Main Results Workspace */}
      {activeListings.length > 0 && (
        <div style={{ animation: "fadeIn 0.5s ease-out both" }}>
          
          {/* Brand Metadata Banner */}
          <div className="glass-card" style={{ padding: "16px 24px", marginBottom: 24, border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-secondary)" }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Currently Auditing</div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: "var(--text-primary)", marginTop: 2 }}>{brandName}</h2>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Last analyzed: <strong>{scannedAt}</strong></span>
              <button onClick={exportCSV} className="btn-accent" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 8, fontWeight: 700 }}>
                <Download size={14} /> Export Report CSV
              </button>
            </div>
          </div>

          {/* Real-time statistics cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Est. Seller Monthly Revenue", value: `₹${Math.round(totalRevenue).toLocaleString("en-IN")}`, icon: <TrendingUp size={18} color="var(--success)" />, border: "var(--success)" },
              { label: "Est. Monthly Units Sold", value: `${totalUnitsSold.toLocaleString("en-IN")} units`, icon: <Package size={18} color="var(--accent)" />, border: "var(--accent)" },
              { label: "Seller Average Rank (BSR)", value: avgBSR > 0 ? `#${avgBSR.toLocaleString("en-IN")}` : "N/A", icon: <BarChart2 size={18} color="var(--purple)" />, border: "var(--purple)" },
              { label: "Average Rating Score", value: avgRating > 0 ? `${avgRating} ★` : "N/A", icon: <Star size={18} color="var(--warning)" />, border: "var(--warning)" },
              { label: "Total Reviews Captured", value: totalReviews.toLocaleString("en-IN"), icon: <Activity size={18} color="var(--blue)" />, border: "var(--blue)" }
            ].map((c) => (
              <div key={c.label} className="stat-card" style={{ padding: 20, borderLeft: `4px solid ${c.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{c.label}</span>
                  {c.icon}
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "var(--text-primary)" }}>{c.value}</div>
              </div>
            ))}
          </div>

          {/* Health Diagnostics & Benchmark charts row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
            
            {/* Health Checklist overview */}
            <div className="glass-card" style={{ padding: 24, border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <Shield size={20} color="var(--accent)" />
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Catalog Health standing</h3>
                <span style={{ marginLeft: "auto" }}>
                  <ScoreRing score={accountHealth.score} size={48} strokeWidth={4} />
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--danger)", marginBottom: 8, textTransform: "uppercase" }}>⚠️ Core Vulnerabilities ({accountHealth.alerts.length})</div>
                  {accountHealth.alerts.length === 0 ? (
                    <div style={{ fontSize: 13, color: "var(--success)" }}>✓ No listings show structural risk elements.</div>
                  ) : (
                    accountHealth.alerts.map((a, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 12, alignItems: "flex-start" }}>
                        <AlertTriangle size={12} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
                        <span style={{ color: "var(--text-secondary)" }}>{a}</span>
                      </div>
                    ))
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--success)", marginBottom: 8, textTransform: "uppercase" }}>✓ Strong Metrics ({accountHealth.positives.length})</div>
                  {accountHealth.positives.map((p, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 12, alignItems: "flex-start" }}>
                      <CheckCircle size={12} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ color: "var(--text-secondary)" }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Benchmarking card */}
            <div className="glass-card" style={{ padding: 24, border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <BarChart2 size={20} color="var(--purple)" />
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Niche Benchmarking</h3>
              </div>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14 }}>
                Real-time competitor catalog positioning metrics. Highlights weaknesses that you can exploit.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {competitorGaps.map((gap, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 14px", background: "var(--bg-primary)", borderRadius: 8, border: "1px solid var(--border)", fontSize: 12, alignItems: "center" }}>
                    <ArrowRight size={14} color="var(--purple)" style={{ flexShrink: 0 }} />
                    <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{gap}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)", gap: 8, marginBottom: 20, overflowX: "auto" }}>
            {[
              { id: "portfolio", label: "📊 Catalog Products", desc: "Performance Directory" },
              { id: "keywords", label: "🔑 Competitor SEO Keywords", desc: "Frequency & Density Analysis" },
              { id: "seo", label: "🔍 SEO Audit checklist", desc: "Grades & Weaknesses" },
              { id: "finance", label: "💰 Financial Economics", desc: "Real Indian Unit Margins" },
              { id: "buybox", label: "📦 Buy Box & Pricing", desc: "Volatility & Competition" },
              { id: "roadmap", label: "🚀 AI Growth Priorities", desc: "Actions & Roadmap items" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: activeTab === tab.id ? "3px solid var(--accent)" : "3px solid transparent",
                  padding: "12px 18px",
                  color: activeTab === tab.id ? "var(--text-primary)" : "var(--text-muted)",
                  fontWeight: activeTab === tab.id ? 800 : 500,
                  fontSize: 14,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  textAlign: "left"
                }}
              >
                <div>{tab.label}</div>
                <div style={{ fontSize: 10, opacity: 0.6, fontWeight: 400, marginTop: 2 }}>{tab.desc}</div>
              </button>
            ))}
          </div>

          {/* TAB CONTENTS VIEW */}
          <div className="glass-card" style={{ padding: 24, border: "1px solid var(--border)", minHeight: 400 }}>
            
            {/* PORTFOLIO OVERVIEW */}
            {activeTab === "portfolio" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Analyzed Products Index</h4>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Search, filter, and sort through the entire audited competitor catalog.</p>
                  </div>
                  
                  {/* Advanced Filters */}
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ position: "relative", minWidth: 200 }}>
                      <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                      <input
                        className="input-field"
                        placeholder="Search title, asin, brand..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ paddingLeft: 34, fontSize: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 8 }}
                      />
                    </div>
                    
                    <select className="input-field" value={filterMargin} onChange={(e) => setFilterMargin(e.target.value)} style={{ width: "auto", fontSize: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 8 }}>
                      <option value="all">All Margins</option>
                      <option value="high">High Margins (&gt;30%)</option>
                      <option value="medium">Med Margins (15%-30%)</option>
                      <option value="low">Low Margins (&lt;15%)</option>
                    </select>

                    <select className="input-field" value={filterBuyBox} onChange={(e) => setFilterBuyBox(e.target.value)} style={{ width: "auto", fontSize: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 8 }}>
                      <option value="all">All Buy Box Owners</option>
                      <option value="amazon">Amazon Owned</option>
                      <option value="fba">FBA Seller Owned</option>
                      <option value="suppressed">Suppressed</option>
                    </select>

                    <select className="input-field" value={filterSEO} onChange={(e) => setFilterSEO(e.target.value)} style={{ width: "auto", fontSize: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 8 }}>
                      <option value="all">All SEO Scores</option>
                      <option value="excellent">Excellent (&gt;75)</option>
                      <option value="good">Good (50-75)</option>
                      <option value="poor">Poor (&lt;50)</option>
                    </select>
                  </div>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid var(--border)", fontSize: 12, color: "var(--text-muted)" }}>
                        <th style={{ padding: "12px", cursor: "pointer" }} onClick={() => handleSort("title")}>Listing Details {sortField === "title" && (sortDirection === "asc" ? "▲" : "▼")}</th>
                        <th style={{ padding: "12px", cursor: "pointer" }} onClick={() => handleSort("price")}>Price {sortField === "price" && (sortDirection === "asc" ? "▲" : "▼")}</th>
                        <th style={{ padding: "12px", cursor: "pointer" }} onClick={() => handleSort("bsr")}>Sales Rank (BSR) {sortField === "bsr" && (sortDirection === "asc" ? "▲" : "▼")}</th>
                        <th style={{ padding: "12px", cursor: "pointer" }} onClick={() => handleSort("monthlySold")}>Monthly Sales {sortField === "monthlySold" && (sortDirection === "asc" ? "▲" : "▼")}</th>
                        <th style={{ padding: "12px", cursor: "pointer" }} onClick={() => handleSort("monthlyRevenue")}>Est Revenue {sortField === "monthlyRevenue" && (sortDirection === "asc" ? "▲" : "▼")}</th>
                        <th style={{ padding: "12px", cursor: "pointer" }} onClick={() => handleSort("netMargin")}>Net Margin {sortField === "netMargin" && (sortDirection === "asc" ? "▲" : "▼")}</th>
                        <th style={{ padding: "12px", cursor: "pointer" }} onClick={() => handleSort("seoScore")}>SEO Score {sortField === "seoScore" && (sortDirection === "asc" ? "▲" : "▼")}</th>
                        <th style={{ padding: "12px", textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getProcessedListings().map((l) => {
                        const isExpanded = expandedRow === l.asin;
                        return (
                          <optgroup key={l.asin} label="" style={{ display: "contents" }}>
                            <tr
                              onClick={() => setExpandedRow(isExpanded ? null : l.asin)}
                              style={{
                                borderBottom: "1px solid var(--border)",
                                cursor: "pointer",
                                background: isExpanded ? "var(--bg-primary)" : "transparent",
                                fontSize: 13
                              }}
                              className="hover-row"
                            >
                              <td style={{ padding: "14px 12px", display: "flex", alignItems: "center", gap: 12, minWidth: 280 }}>
                                <div style={{ width: 40, height: 40, background: "#fff", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px solid var(--border)", flexShrink: 0 }}>
                                  <img src={l.img} alt={l.asin} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 2 }} />
                                </div>
                                <div style={{ minWidth: 0 }}>
                                  <div style={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-primary)" }}>{l.shortTitle}</div>
                                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, fontFamily: "monospace" }}>{l.asin} | {l.brand}</div>
                                </div>
                              </td>
                              <td style={{ padding: "14px 12px", fontWeight: 700, color: "var(--accent)" }}>{l.formattedPrice}</td>
                              <td style={{ padding: "14px 12px" }}>{l.bsr > 0 ? `#${l.bsr.toLocaleString("en-IN")}` : "N/A"}</td>
                              <td style={{ padding: "14px 12px", fontWeight: 600 }}>{l.monthlySold.toLocaleString("en-IN")} units</td>
                              <td style={{ padding: "14px 12px", fontWeight: 700 }}>{l.formattedMonthlyRevenue}</td>
                              <td style={{ padding: "14px 12px" }}>
                                <span style={{
                                  background: l.netMargin >= 30 ? "var(--success-muted)" : l.netMargin >= 15 ? "var(--warning-muted)" : "var(--danger-muted)",
                                  color: l.netMargin >= 30 ? "var(--success)" : l.netMargin >= 15 ? "var(--warning)" : "var(--danger)",
                                  fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4
                                }}>
                                  {l.netMargin}%
                                </span>
                              </td>
                              <td style={{ padding: "14px 12px" }}>
                                <span style={{ fontWeight: 800, color: getStatusColor(l.seo.score) }}>{l.seo.score}/100</span>
                              </td>
                              <td style={{ padding: "14px 12px", textAlign: "right" }}>
                                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", alignItems: "center" }}>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(`https://www.amazon.in/dp/${l.asin}`, "_blank");
                                    }}
                                    style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4 }}
                                  >
                                    <ExternalLink size={14} />
                                  </button>
                                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>
                              </td>
                            </tr>
                            
                            {/* Expanded Panel */}
                            {isExpanded && (
                              <tr style={{ background: "var(--bg-primary)" }}>
                                <td colSpan={8} style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
                                    {/* P&L Economics */}
                                    <div style={{ background: "var(--bg-secondary)", padding: 16, borderRadius: 8, border: "1px solid var(--border)" }}>
                                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase" }}>Quick unit economics</div>
                                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, margin: "4px 0" }}>
                                        <span>Retail Price:</span>
                                        <span style={{ fontWeight: 700 }}>{l.formattedPrice}</span>
                                      </div>
                                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, margin: "4px 0" }}>
                                        <span>Referral Comm:</span>
                                        <span>{l.formattedReferralFee}</span>
                                      </div>
                                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, margin: "4px 0" }}>
                                        <span>FBA Fees:</span>
                                        <span>{l.formattedFbaFee}</span>
                                      </div>
                                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, margin: "4px 0", borderBottom: "1px solid var(--border)", paddingBottom: 6 }}>
                                        <span>Estimated GST (18%):</span>
                                        <span>{l.formattedGst}</span>
                                      </div>
                                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, margin: "6px 0 0" }}>
                                        <span style={{ fontWeight: 700 }}>Net Unit Profit:</span>
                                        <span style={{ color: "var(--success)", fontWeight: 900 }}>{l.formattedNetProfit}</span>
                                      </div>
                                    </div>

                                    {/* SEO Wins */}
                                    <div>
                                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--success)", marginBottom: 8, textTransform: "uppercase" }}>SEO checklist wins</div>
                                      {l.seo.wins.slice(0, 3).map((w, idx) => (
                                        <div key={idx} style={{ display: "flex", gap: 6, fontSize: 12, marginBottom: 6 }}>
                                          <CheckCircle size={12} color="var(--success)" style={{ marginTop: 2, flexShrink: 0 }} />
                                          <span>{w}</span>
                                        </div>
                                      ))}
                                    </div>

                                    {/* SEO Fixes */}
                                    <div>
                                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--danger)", marginBottom: 8, textTransform: "uppercase" }}>Critical listing vulnerabilities</div>
                                      {l.seo.issues.length === 0 ? (
                                        <div style={{ fontSize: 12, color: "var(--success)" }}>✓ listing is optimized fully.</div>
                                      ) : (
                                        l.seo.issues.slice(0, 3).map((w, idx) => (
                                          <div key={idx} style={{ display: "flex", gap: 6, fontSize: 12, marginBottom: 6 }}>
                                            <AlertTriangle size={12} color="var(--danger)" style={{ marginTop: 2, flexShrink: 0 }} />
                                            <span style={{ color: "var(--text-secondary)" }}>{w}</span>
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </optgroup>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* COMPETITOR KEYWORD PROFILE */}
            {activeTab === "keywords" && (
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Competitor Keyword Strategy Profile</h4>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>
                  Automatically extracts search phrases and keywords from the competitor's active catalog. Identifies which keywords they rely on most to gain organic visibility.
                </p>

                {keywordFrequencies.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>No keyword statistics extracted. Scan storefront to generate analysis.</div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                    {/* Keyword Density List */}
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                          <tr style={{ borderBottom: "2px solid var(--border)", fontSize: 12, color: "var(--text-muted)" }}>
                            <th style={{ padding: "10px" }}>Extracted Keyword</th>
                            <th style={{ padding: "10px" }}>Total Occurrences</th>
                            <th style={{ padding: "10px" }}>Listings Share</th>
                            <th style={{ padding: "10px", width: "40%" }}>Visual Density</th>
                          </tr>
                        </thead>
                        <tbody>
                          {keywordFrequencies.map((kw, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--border)", fontSize: 13 }}>
                              <td style={{ padding: "12px 10px", fontWeight: 700, color: "var(--accent)" }}>{kw.word}</td>
                              <td style={{ padding: "12px 10px", fontWeight: 600 }}>{kw.count} times</td>
                              <td style={{ padding: "12px 10px" }}>{kw.listingsPercentage}% of listings</td>
                              <td style={{ padding: "12px 10px" }}>
                                <div style={{ width: "100%", height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                                  <div style={{ width: `${kw.listingsPercentage}%`, height: "100%", background: "var(--accent)" }} />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* SEO intelligence guidelines */}
                    <div className="glass-card" style={{ padding: 20, background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                      <h5 style={{ fontSize: 14, fontWeight: 800, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                        <Sparkles color="var(--warning)" size={16} /> AI Keyword Insights
                      </h5>
                      <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>
                        This competitor leverages <strong>{keywordFrequencies[0]?.word}</strong> as their primary target, appearing across <strong>{keywordFrequencies[0]?.listingsPercentage}%</strong> of their active inventory.
                      </p>
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {[
                          { title: "Niche Keywords Gaps", text: "Target low-competition variations to hijack organic traffic without competing head-on." },
                          { title: "PPC Attack Plan", text: "Create custom Sponsored Brand banner campaigns targeting their signature keyword phrase." },
                          { title: "Backend Search Optimizations", text: "Inject their top 5 signature keywords directly into your hidden search terms for indexing." }
                        ].map((item, idx) => (
                          <div key={idx} style={{ background: "var(--bg-primary)", padding: 12, borderRadius: 8, border: "1px solid var(--border)" }}>
                            <div style={{ fontWeight: 700, fontSize: 12, color: "var(--text-primary)" }}>{item.title}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{item.text}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SEO AUDIT CHECKLIST */}
            {activeTab === "seo" && (
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Granular SEO Checklist Grades</h4>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>
                  Detailed checklist evaluating listing properties for every product. Target Poor titles, missing A+ descriptions, and short bullets.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {getProcessedListings().map((l) => (
                    <div key={l.asin} className="glass-card" style={{ padding: 20, border: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 16, borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <img src={l.img} alt={l.asin} style={{ width: 36, height: 36, objectFit: "contain", background: "#fff", padding: 2, borderRadius: 4 }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14 }}>{l.title}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, fontFamily: "monospace" }}>{l.asin}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>SEO Score</span>
                          <ScoreRing score={l.seo.score} size={48} strokeWidth={4} />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 16 }}>
                        {/* Title length */}
                        <div style={{ background: "var(--bg-primary)", padding: 12, borderRadius: 8, border: "1px solid var(--border)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)" }}>TITLE LIMIT</span>
                            <GradeBadge grade={l.seo.checklist.titleGrade} />
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>{l.seo.checklist.titleLength} Chars</div>
                        </div>

                        {/* Bullets */}
                        <div style={{ background: "var(--bg-primary)", padding: 12, borderRadius: 8, border: "1px solid var(--border)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)" }}>BULLETS</span>
                            <GradeBadge grade={l.seo.checklist.bulletGrade} />
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>{l.seo.checklist.bulletCount} Feature Points</div>
                        </div>

                        {/* Images */}
                        <div style={{ background: "var(--bg-primary)", padding: 12, borderRadius: 8, border: "1px solid var(--border)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)" }}>GALLERY</span>
                            <GradeBadge grade={l.seo.checklist.imageGrade} />
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>{l.seo.checklist.imageCount} Images</div>
                        </div>

                        {/* Description */}
                        <div style={{ background: "var(--bg-primary)", padding: 12, borderRadius: 8, border: "1px solid var(--border)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)" }}>A+ CONTENT</span>
                            <span style={{ color: l.seo.checklist.hasAplus ? "var(--success)" : "var(--warning)", fontSize: 11, fontWeight: 700 }}>
                              {l.seo.checklist.hasAplus ? "Active" : "None"}
                            </span>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>{l.seo.checklist.descriptionLength} Chars</div>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div style={{ background: "var(--danger-muted)", padding: 12, borderRadius: 6, border: "1px solid rgba(255, 75, 75, 0.1)", fontSize: 12 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--danger)", marginBottom: 6 }}>🚨 ISSUES ({l.seo.issues.length})</div>
                          {l.seo.issues.map((iss, i) => (
                            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                              <AlertTriangle size={12} color="var(--danger)" style={{ marginTop: 2, flexShrink: 0 }} />
                              <span>{iss}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ background: "var(--success-muted)", padding: 12, borderRadius: 6, border: "1px solid rgba(52, 199, 89, 0.1)", fontSize: 12 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--success)", marginBottom: 6 }}>🏆 STRENGTHS ({l.seo.wins.length})</div>
                          {l.seo.wins.map((w, i) => (
                            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                              <CheckCircle size={12} color="var(--success)" style={{ marginTop: 2, flexShrink: 0 }} />
                              <span>{w}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FINANCIAL Economics */}
            {activeTab === "finance" && (
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Financial Margins & economics</h4>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>
                  Detailed unit economics calculated for FBA India. Assumes 35% COGS, referral fees, actual FBA logistics, and 18% standard GST.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {getProcessedListings().map((l) => (
                    <div key={l.asin} className="glass-card" style={{ padding: 20, border: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, borderBottom: "1px solid var(--border)", paddingBottom: 10 }}>
                        <img src={l.img} alt={l.asin} style={{ width: 36, height: 36, objectFit: "contain", background: "#fff", padding: 2, borderRadius: 4 }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{l.title}</div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>{l.asin}</div>
                        </div>
                        <span style={{
                          marginLeft: "auto",
                          background: l.netMargin >= 30 ? "var(--success-muted)" : l.netMargin >= 15 ? "var(--warning-muted)" : "var(--danger-muted)",
                          color: l.netMargin >= 30 ? "var(--success)" : l.netMargin >= 15 ? "var(--warning)" : "var(--danger)",
                          fontSize: 12, fontWeight: 800, padding: "4px 12px", borderRadius: 50
                        }}>
                          {l.netMargin}% Gross Net Margin
                        </span>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, borderBottom: "1px solid var(--border)", paddingBottom: 4, margin: "4px 0" }}>
                            <span style={{ color: "var(--text-muted)" }}>Target Unit Price:</span>
                            <span style={{ fontWeight: 700 }}>{l.formattedPrice}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, borderBottom: "1px solid var(--border)", paddingBottom: 4, margin: "4px 0" }}>
                            <span style={{ color: "var(--text-muted)" }}>COGS (Est 35%):</span>
                            <span>- {l.formattedCogs}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, borderBottom: "1px solid var(--border)", paddingBottom: 4, margin: "4px 0" }}>
                            <span style={{ color: "var(--text-muted)" }}>FBA Fulfillment Fee:</span>
                            <span>- {l.formattedFbaFee}</span>
                          </div>
                        </div>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, borderBottom: "1px solid var(--border)", paddingBottom: 4, margin: "4px 0" }}>
                            <span style={{ color: "var(--text-muted)" }}>Referral Commission ({l.referralFeePercent}%):</span>
                            <span>- {l.formattedReferralFee}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, borderBottom: "1px solid var(--border)", paddingBottom: 4, margin: "4px 0" }}>
                            <span style={{ color: "var(--text-muted)" }}>Estimated GST slab (18%):</span>
                            <span>- {l.formattedGst}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, borderBottom: "1px solid var(--border)", paddingBottom: 4, margin: "4px 0" }}>
                            <span style={{ fontWeight: 700, color: "var(--success)" }}>Unit Net Profit:</span>
                            <span style={{ fontWeight: 800, color: "var(--success)" }}>{l.formattedNetProfit}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BUY BOX & PRICING */}
            {activeTab === "buybox" && (
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Buy Box Contention Analysis</h4>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>
                  Tracks Buy Box owners and pricing history volatility. High price volatility represents price wars.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {getProcessedListings().map((l) => {
                    const badge = getBuyBoxBadge(l.buyBoxOwner);
                    return (
                      <div key={l.asin} className="glass-card" style={{ padding: 20, border: "1px solid var(--border)" }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, borderBottom: "1px solid var(--border)", paddingBottom: 10 }}>
                          <img src={l.img} alt={l.asin} style={{ width: 36, height: 36, objectFit: "contain", background: "#fff", padding: 2, borderRadius: 4 }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14 }}>{l.title}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>{l.asin}</div>
                          </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                          <div style={{ background: "var(--bg-primary)", padding: 14, borderRadius: 8, border: "1px solid var(--border)" }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>BUY BOX OWNER</div>
                            <span style={{ background: badge.bg, color: badge.color, fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 4 }}>
                              {badge.label}
                            </span>
                            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 10, margin: 0 }}>
                              {l.buyBoxOwner === "Amazon" ? "⚠️ Direct competition with Amazon retail makes indexing difficult." : "✓ Brand controls listings standing successfully."}
                            </p>
                          </div>

                          <div style={{ background: "var(--bg-primary)", padding: 14, borderRadius: 8, border: "1px solid var(--border)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>PRICE TRENDS</span>
                              <span style={{ color: getPriceStabilityColor(l.priceStability), fontSize: 11, fontWeight: 800 }}>
                                {l.priceStability}
                              </span>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, textAlign: "center", margin: "10px 0 0" }}>
                              <div>
                                <div style={{ fontSize: 9, color: "var(--text-muted)" }}>Current</div>
                                <div style={{ fontWeight: 800, fontSize: 12 }}>{l.formattedPrice}</div>
                              </div>
                              <div>
                                <div style={{ fontSize: 9, color: "var(--text-muted)" }}>30-Day Avg</div>
                                <div style={{ fontWeight: 800, fontSize: 12 }}>{l.formattedPriceAvg30}</div>
                              </div>
                              <div>
                                <div style={{ fontSize: 9, color: "var(--text-muted)" }}>90-Day Avg</div>
                                <div style={{ fontWeight: 800, fontSize: 12 }}>{l.formattedPriceAvg90}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AI GROWTH ROADMAP */}
            {activeTab === "roadmap" && (
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>AI Growth Roadmaps Priorities</h4>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>
                  Roadmap actions dynamically formulated based on weaknesses parsed from this seller's portfolio catalog.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {growthRoadmap.map((gp, idx) => (
                    <div key={gp.asin} className="glass-card" style={{ padding: 20, border: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ background: "var(--accent-muted)", width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "var(--accent)" }}>
                            {idx + 1}
                          </div>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{gp.title}... <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>({gp.asin})</span></div>
                        </div>
                        <span style={{ background: "var(--warning-muted)", color: "var(--warning)", fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 4 }}>
                          {gp.prediction}
                        </span>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 20, marginTop: 12 }}>
                        <div>
                          <div style={{ fontSize: 13, color: "var(--text-primary)", display: "flex", gap: 8, alignItems: "flex-start", fontWeight: 700 }}>
                            <Zap size={14} color="var(--accent)" style={{ marginTop: 3, flexShrink: 0 }} />
                            <span>{gp.action}</span>
                          </div>
                          
                          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6, paddingLeft: 22 }}>
                            {gp.checklist.map((item, i) => (
                              <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, alignItems: "center" }}>
                                <input type="checkbox" defaultChecked={false} style={{ cursor: "pointer" }} />
                                <span style={{ color: "var(--text-secondary)" }}>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div style={{ background: "rgba(52, 199, 89, 0.05)", border: "1px solid rgba(52, 199, 89, 0.2)", borderRadius: 8, padding: 12, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          <div style={{ fontSize: 10, color: "var(--success)", fontWeight: 700 }}>ESTIMATED OUTCOME</div>
                          <div style={{ fontSize: 15, color: "var(--success)", fontWeight: 800, margin: "4px 0" }}>{gp.potential}</div>
                          <div style={{ fontSize: 9, color: "var(--text-muted)" }}>inside 30 days</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Empty State Instruction Blocks */}
      {activeListings.length === 0 && !isCrawling && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginTop: 24 }}>
          {[
            { icon: <Search size={24} color="var(--accent)" />, title: "Unlimited Stores Crawling", desc: "Crawls a to z storefront listings dynamically. Handles 1 to 100,000 products by batch pipelines automatically." },
            { icon: <Package size={24} color="var(--success)" />, title: "True Indian FBA Margins", desc: "Calibrates estimates with Cost of Goods Sold (COGS), actual referral fees, FBA storage/shipping cost, and GST slabs." },
            { icon: <TrendingUp size={24} color="var(--warning)" />, title: "Price War & Buy Box Diagnostic", desc: "Tracks whether Amazon competes in buybox and analyzes pricing averages to instantly alert active pricing volatility." },
            { icon: <Sparkles size={24} color="var(--purple)" />, title: "SEO Competitor Keyword Map", desc: "Extracts primary search terms used across the entire competitor catalog to build your signature attack roadmap." }
          ].map((c, i) => (
            <div key={i} className="stat-card" style={{ padding: 24, textAlign: "center", border: "1px solid var(--border)" }}>
              <div style={{ display: "inline-flex", padding: 12, background: "var(--bg-primary)", borderRadius: "50%", marginBottom: 16, border: "1px solid var(--border)" }}>
                {c.icon}
              </div>
              <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 8, color: "var(--text-primary)" }}>{c.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
