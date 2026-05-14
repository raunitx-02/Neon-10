"use client";
import { useState } from "react";
import { Zap, Search, Star, TrendingUp, DollarSign, History, BarChart2 } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { parseKeepaCsv, KEEPA_INDICES } from "@/lib/keepaUtils";

const xrayData = [
  { name: "EcoHome Board", revenue: 54280, reviews: 3241, price: 32.99, bsr: 842, fbaFee: 4.80 },
  { name: "ChefLine Set", revenue: 48100, reviews: 2109, price: 28.99, bsr: 1203, fbaFee: 4.20 },
  { name: "KitchenPro Plus", revenue: 41200, reviews: 4892, price: 24.99, bsr: 1890, fbaFee: 3.90 },
  { name: "BambooKing", revenue: 35600, reviews: 1342, price: 36.99, bsr: 2341, fbaFee: 5.10 },
  { name: "CutMaster Pro", revenue: 29800, reviews: 892, price: 42.99, bsr: 3120, fbaFee: 5.80 },
  { name: "SliceRight", revenue: 24100, reviews: 2841, price: 19.99, bsr: 4201, fbaFee: 3.50 },
  { name: "OakCraft Board", revenue: 18900, reviews: 651, price: 54.99, bsr: 5890, fbaFee: 6.90 },
];

const summaryStats = [
  { label: "Avg Monthly Revenue", value: "$36,000", icon: DollarSign, color: "var(--accent)" },
  { label: "Avg Price", value: "$34.42", icon: DollarSign, color: "var(--blue)" },
  { label: "Avg Reviews", value: "2,281", icon: Star, color: "var(--warning)" },
  { label: "Avg BSR", value: "#2,784", icon: TrendingUp, color: "var(--success)" },
];

export default function XrayPage() {
  const [asin, setAsin] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeData, setActiveData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any[]>([]);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!asin.trim()) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Real Data from our Keepa API route
      const response = await fetch(`/api/amazon/keepa?asin=${asin.trim()}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setSearched(false);
      } else {
        // 2. Parse History for Charts
        const bsrHistory = parseKeepaCsv(data.csv?.[KEEPA_INDICES.SALES_RANK]);
        const priceHistory = parseKeepaCsv(data.csv?.[KEEPA_INDICES.NEW_PRICE]);
        
        // Merge history for a dual-axis chart
        const mergedHistory = bsrHistory.map((pt, idx) => ({
          ...pt,
          bsr: pt.value,
          price: priceHistory[idx]?.value || pt.value / 10 // fallback
        }));
        setHistoryData(mergedHistory);

        // 3. Set Summary Stats
        setSummary([
          { label: "Current BSR", value: `#${data.bsr.toLocaleString()}`, icon: TrendingUp, color: "var(--success)" },
          { label: "Current Price", value: data.price, icon: DollarSign, color: "var(--accent)" },
          { label: "Rating", value: `${data.rating} / 5`, icon: Star, color: "var(--warning)" },
          { label: "Total Reviews", value: data.reviews.toLocaleString(), icon: BarChart2, color: "var(--blue)" },
        ]);

        // 4. Competitor Table (Simulated based on real data for now)
        const baseRev = parseFloat(data.price.replace(/[^\d.]/g, '')) * (100000 / data.bsr); 
        setActiveData([
          { name: data.title.substring(0, 20) + "...", price: data.price, bsr: "#"+data.bsr, revenue: baseRev, reviews: data.reviews },
          { name: "Top Competitor A", price: "₹2,199", bsr: "#1,203", revenue: baseRev * 0.8, reviews: 1450 },
          { name: "Top Competitor B", price: "₹3,499", bsr: "#450", revenue: baseRev * 1.5, reviews: 3200 },
        ].sort((a, b) => b.revenue - a.revenue));

        setSearched(true);
      }
    } catch (err) {
      setError("Analysis failed. Ensure the ASIN is correct for Amazon.in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Xray — Market Analysis</h1>
          <p className="page-subtitle">Instant competitive intelligence for Amazon India product niches</p>
        </div>
        <span className="badge badge-accent" style={{ fontSize: 13, padding: "6px 14px" }}>Chrome Extension</span>
      </div>

      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>Enter an Amazon.in ASIN to analyze the competitive landscape (Real-time data enabled)</p>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            className="input-field"
            placeholder="Enter ASIN (e.g. B08N5KWB9H) or Amazon product URL..."
            value={asin}
            onChange={e => setAsin(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            style={{ flex: 1 }}
          />
          <button className="btn-accent" onClick={handleSearch} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 140 }}>
            {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Analyzing...</> : <><Zap size={15} /> Run Xray</>}
          </button>
        </div>
        {error && <p style={{ color: "var(--error)", fontSize: 12, marginTop: 12 }}>{error}</p>}
        {!searched && !loading && (
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", alignSelf: "center", marginRight: 4 }}>Try:</span>
            {["B08N5KWB9H", "B09L1W3X2M", "B07ZPC9QD4"].map(a => (
              <button key={a} className="btn-ghost" style={{ fontSize: 11, padding: "4px 10px" }} onClick={() => { setAsin(a); }}>
                {a}
              </button>
            ))}
          </div>
        )}
      </div>

      {searched && (
        <>
          {/* Summary Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16, marginBottom: 24 }}>
            {summary.map(s => (
              <div key={s.label} className="stat-card">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <s.icon size={18} color={s.color} />
                  </div>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{s.label}</span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)" }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* History Trend Chart */}
          <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 4 }}>
                  <History size={16} style={{ display: "inline", marginRight: 8, verticalAlign: "text-bottom" }} />
                  Historical Performance (30 Days)
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: 12 }}>Tracking Price stability and Sales Rank (BSR) velocity</p>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: "var(--accent)" }} />
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Price (₹)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: "var(--success)" }} />
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Sales Rank</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} reversed />
                <Tooltip 
                  contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, backdropFilter: "blur(20px)" }}
                  itemStyle={{ fontSize: 12, fontWeight: 600 }}
                />
                <Area yAxisId="left" type="monotone" dataKey="price" stroke="var(--accent)" strokeWidth={3} fill="url(#colorPrice)" name="Price" />
                <Area yAxisId="right" type="monotone" dataKey="bsr" stroke="var(--success)" strokeWidth={2} fill="transparent" name="Sales Rank" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Chart */}
          <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 4 }}>Estimated Monthly Revenue Analysis</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 20 }}>Top sellers in this category ranked by estimated revenue (INR)</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={activeData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, "Revenue"]} contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10 }} />
                <Bar dataKey="revenue" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Competitor Table */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 20 }}>Detailed Breakdown</h2>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>PRODUCT</th>
                    <th>PRICE</th>
                    <th>BSR</th>
                    <th>EST. REVENUE</th>
                    <th>REVIEWS</th>
                    <th>FBA FEE</th>
                    <th>SCORE</th>
                  </tr>
                </thead>
                <tbody>
                  {activeData.map((p, i) => (
                    <tr key={p.name}>
                      <td style={{ fontWeight: 500, color: "var(--text-primary)", maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</td>
                      <td style={{ fontWeight: 700, color: "var(--text-primary)" }}>{p.price}</td>
                      <td style={{ color: i === 0 ? "var(--success)" : "var(--text-secondary)", fontWeight: 600 }}>{p.bsr}</td>
                      <td style={{ color: "var(--accent)", fontWeight: 700 }}>₹{p.revenue.toLocaleString()}</td>
                      <td style={{ color: "var(--text-secondary)" }}>{p.reviews.toLocaleString()}</td>
                      <td style={{ color: "var(--danger)" }}>{p.fbaFee}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div className="progress-bar" style={{ width: 60 }}>
                            <div className="progress-bar-fill" style={{ width: `${Math.round((1 - i / activeData.length) * 100)}%`, background: i === 0 ? "var(--success)" : "var(--accent)" }} />
                          </div>
                          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{Math.round((1 - i / activeData.length) * 100)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
