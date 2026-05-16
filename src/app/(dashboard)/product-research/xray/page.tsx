"use client";

import { useState, useCallback } from "react";
import {
  Zap, Search, Star, TrendingUp, TrendingDown, IndianRupee, History,
  BarChart2, ExternalLink, Package, ShieldCheck, AlertTriangle,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────
interface XrayProduct {
  asin: string;
  title: string;
  img: string;
  brand: string;
  price: string;
  priceNum: number;
  bsr: number;
  rating: number;
  reviews: number;
  revenueEstimate: string;
  revenueNum: number;
  monthlySales: number;
  fbaFee: string;
  margin: string;
  marginNum: number;
  gstSlab: string;
  opportunity: "High" | "Medium" | "Low";
  trend: "up" | "down" | "stable";
}

interface XraySummary {
  avgRevenue: string;
  avgPrice: string;
  avgReviews: string;
  avgBsr: string;
  totalRevenue: string;
  opportunityScore: number;
}

interface XrayData {
  products: XrayProduct[];
  summary: XraySummary;
  priceHistory: { date: string; price: number; bsr: number }[];
  category: string;
}

const oppColors = {
  High: { bg: "var(--success-muted)", color: "var(--success)" },
  Medium: { bg: "var(--warning-muted)", color: "var(--warning)" },
  Low: { bg: "var(--danger-muted)", color: "var(--danger)" },
};

export default function XrayPage() {
  const [asinInput, setAsinInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<XrayData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    const input = asinInput.trim();
    if (!input) return;

    // Extract ASIN from URL if pasted
    let asin = input;
    const urlMatch = input.match(/\/dp\/([A-Z0-9]{10})/);
    if (urlMatch) asin = urlMatch[1];
    asin = asin.toUpperCase().trim();

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/amazon/xray?asin=${encodeURIComponent(asin)}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [asinInput]);

  return (
    <div>
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Xray — Live Market Analysis</h1>
          <p className="page-subtitle">
            Competitive intelligence for Amazon.in product niches — real BSR, revenue, margin & price history
          </p>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
          Enter an Amazon.in ASIN or paste a product URL to analyze the competitive landscape
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            className="input-field"
            placeholder="ASIN (B08XYZ1234) or Amazon.in product URL..."
            value={asinInput}
            onChange={e => setAsinInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            style={{ flex: 1 }}
          />
          <button
            className="btn-accent"
            onClick={handleSearch}
            disabled={loading || !asinInput.trim()}
            style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 160 }}
          >
            {loading
              ? <><div className="spinner" style={{ width: 16, height: 16 }} />Analyzing...</>
              : <><Zap size={15} />Run Xray</>}
          </button>
        </div>
        {!data && (
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", alignSelf: "center" }}>Try:</span>
            {["B00YUNKKP8", "B09W9FND7L", "B0CHX3THBM"].map(a => (
              <button key={a} className="btn-ghost"
                style={{ fontSize: 12, padding: "4px 12px", fontFamily: "monospace" }}
                onClick={() => setAsinInput(a)}>
                {a}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{ background: "var(--danger-muted)", border: "1px solid var(--danger)", borderRadius: 12, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <AlertTriangle size={16} color="var(--danger)" />
          <span style={{ color: "var(--danger)", fontSize: 14 }}>{error}</span>
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="glass-card" style={{ padding: 40, textAlign: "center" }}>
          <div className="spinner" style={{ margin: "0 auto 16px" }} />
          <div style={{ color: "var(--text-muted)", fontSize: 14 }}>Fetching real-time data from Keepa...</div>
        </div>
      )}

      {/* ── Results ── */}
      {data && !loading && (
        <>
          {/* Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
            {[
              { label: "Avg Monthly Revenue", value: data.summary.avgRevenue, icon: IndianRupee, color: "var(--accent)" },
              { label: "Avg Price", value: data.summary.avgPrice, icon: IndianRupee, color: "var(--blue)" },
              { label: "Avg Reviews", value: data.summary.avgReviews, icon: Star, color: "var(--warning)" },
              { label: "Avg BSR", value: data.summary.avgBsr, icon: TrendingUp, color: "var(--success)" },
              { label: "Total Niche Revenue", value: data.summary.totalRevenue, icon: BarChart2, color: "var(--purple)" },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <s.icon size={18} color={s.color} />
                  </div>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Price History Chart */}
          {data.priceHistory.length > 0 && (
            <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 4 }}>
                    <History size={16} style={{ display: "inline", marginRight: 8, verticalAlign: "text-bottom" }} />
                    Price & BSR History
                  </h2>
                  <p style={{ color: "var(--text-muted)", fontSize: 12 }}>90-day price stability and sales rank velocity</p>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: "var(--accent)" }} />
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Price (₹)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: "var(--success)" }} />
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>BSR Rank</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data.priceHistory}>
                  <defs>
                    <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="bsrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--success)" stopOpacity={0.08} />
                      <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} reversed tickFormatter={v => `#${v}`} />
                  <Tooltip
                    contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, backdropFilter: "blur(20px)" }}
                    itemStyle={{ fontSize: 12, fontWeight: 600 }}
                    formatter={(val: any, name: any) => [name === "price" ? `₹${val}` : `#${val}`, name === "price" ? "Price" : "BSR"] as any}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="price" stroke="var(--accent)" strokeWidth={2.5} fill="url(#priceGrad)" />
                  <Area yAxisId="right" type="monotone" dataKey="bsr" stroke="var(--success)" strokeWidth={2} fill="url(#bsrGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Revenue bar chart */}
          <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 4 }}>
              Estimated Revenue Landscape
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 20 }}>
              Top sellers ranked by monthly revenue estimate — category: {data.category}
            </p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.products.slice(0, 8)} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="brand" tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickLine={false} axisLine={false}
                  tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v: any) => [`₹${Number(v).toLocaleString("en-IN")}`, "Est. Revenue/mo"]}
                  contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10 }}
                />
                <Bar dataKey="revenueNum" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Product table */}
          <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
              <Package size={16} color="var(--accent)" />
              <span style={{ fontWeight: 700, fontSize: 15 }}>{data.products.length} Products Analyzed</span>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>· Amazon.in · Live Keepa Data</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>PRODUCT</th>
                    <th>PRICE</th>
                    <th>BSR</th>
                    <th>EST. REV/MO</th>
                    <th>REVIEWS</th>
                    <th>RATING</th>
                    <th>MARGIN</th>
                    <th>FBA FEE</th>
                    <th>GST</th>
                    <th>SCORE</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.map(p => (
                    <tr key={p.asin}>
                      <td style={{ minWidth: 250 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", background: "#fff", flexShrink: 0, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <img
                              src={p.img}
                              alt={p.title}
                              onError={e => { (e.target as HTMLImageElement).src = `https://images.amazon.com/images/P/${p.asin}.01._SCLZZZZZZZ_.jpg`; }}
                              style={{ width: 40, height: 40, objectFit: "contain" }}
                            />
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, fontFamily: "monospace" }}>{p.asin}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700 }}>{p.price}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: p.bsr < 5000 ? "var(--success)" : p.bsr < 20000 ? "var(--warning)" : "var(--danger)" }}>
                          #{p.bsr.toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: "var(--accent)" }}>{p.revenueEstimate}</td>
                      <td style={{ color: "var(--text-secondary)" }}>{p.reviews.toLocaleString()}</td>
                      <td>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Star size={11} fill="var(--warning)" color="var(--warning)" />
                          <span style={{ fontWeight: 600, color: "var(--warning)" }}>{p.rating.toFixed(1)}</span>
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: p.marginNum > 25 ? "var(--success)" : p.marginNum > 15 ? "var(--warning)" : "var(--danger)" }}>{p.margin}</td>
                      <td style={{ color: "var(--danger)", fontWeight: 600 }}>{p.fbaFee}</td>
                      <td><span style={{ background: "var(--blue-muted)", color: "var(--blue)", borderRadius: 50, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{p.gstSlab}</span></td>
                      <td>
                        <span style={{ background: oppColors[p.opportunity].bg, color: oppColors[p.opportunity].color, borderRadius: 50, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
                          {p.opportunity}
                        </span>
                      </td>
                      <td>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                          onClick={() => window.open(`https://www.amazon.in/dp/${p.asin}`, "_blank")}>
                          <ExternalLink size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Intro state ── */}
      {!data && !loading && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {[
            { icon: <Zap size={24} color="var(--accent)" />, title: "Live Competitive Intel", desc: "Instantly analyze any Amazon.in ASIN's complete competitive landscape" },
            { icon: <History size={24} color="var(--blue)" />, title: "90-Day Price History", desc: "Track price stability and BSR velocity over the last 3 months" },
            { icon: <IndianRupee size={24} color="var(--success)" />, title: "Revenue Landscape", desc: "Estimated category revenue calibrated for Amazon India's BSR model" },
            { icon: <ShieldCheck size={24} color="var(--purple)" />, title: "Margin Intelligence", desc: "FBA fees, GST slabs and effective margin for each competitor" },
          ].map(card => (
            <div key={card.title} className="stat-card">
              <div style={{ marginBottom: 12 }}>{card.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{card.title}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{card.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
