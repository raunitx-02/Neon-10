"use client";
import { useState } from "react";
import { Zap, Search, Star, TrendingUp, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

  const handleSearch = () => {
    if (!asin.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSearched(true); }, 1500);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Xray — Market Analysis</h1>
          <p className="page-subtitle">Instant competitive intelligence for any Amazon product niche</p>
        </div>
        <span className="badge badge-accent" style={{ fontSize: 13, padding: "6px 14px" }}>Chrome Extension</span>
      </div>

      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>Enter an ASIN or Amazon URL to analyze the competitive landscape</p>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            className="input-field"
            placeholder="Enter ASIN (e.g. B08XYZ1234) or Amazon product URL..."
            value={asin}
            onChange={e => setAsin(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            style={{ flex: 1 }}
          />
          <button className="btn-accent" onClick={handleSearch} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 140 }}>
            {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Analyzing...</> : <><Zap size={15} /> Run Xray</>}
          </button>
        </div>
        {!searched && (
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            {["B08XYZ1234", "B09ABC5678", "B07DEF9012"].map(a => (
              <button key={a} className="btn-ghost" style={{ fontSize: 12, padding: "5px 12px" }} onClick={() => { setAsin(a); }}>
                {a}
              </button>
            ))}
          </div>
        )}
      </div>

      {searched && (
        <>
          {/* Summary Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            {summaryStats.map(s => (
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

          {/* Revenue Chart */}
          <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 4 }}>Monthly Revenue by Competitor</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 20 }}>Top sellers in this niche ranked by estimated monthly revenue</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={xrayData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, "Revenue"]} contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10 }} />
                <Bar dataKey="revenue" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Competitor Table */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 20 }}>Competitor Breakdown</h2>
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
                {xrayData.map((p, i) => (
                  <tr key={p.name}>
                    <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>{p.name}</td>
                    <td style={{ fontWeight: 700, color: "var(--text-primary)" }}>${p.price}</td>
                    <td style={{ color: i < 2 ? "var(--success)" : i < 4 ? "var(--warning)" : "var(--danger)", fontWeight: 600 }}>#{p.bsr.toLocaleString()}</td>
                    <td style={{ color: "var(--accent)", fontWeight: 700 }}>${p.revenue.toLocaleString()}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{p.reviews.toLocaleString()}</td>
                    <td style={{ color: "var(--danger)" }}>${p.fbaFee}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div className="progress-bar" style={{ width: 60 }}>
                          <div className="progress-bar-fill" style={{ width: `${Math.round((1 - i / xrayData.length) * 100)}%`, background: i < 2 ? "var(--success)" : "var(--accent)" }} />
                        </div>
                        <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{Math.round((1 - i / xrayData.length) * 100)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
