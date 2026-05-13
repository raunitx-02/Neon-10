"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const trendData = [
  { month: "Jun 24", bsr: 8200, price: 31.99 }, { month: "Jul 24", bsr: 6100, price: 32.99 },
  { month: "Aug 24", bsr: 4800, price: 34.99 }, { month: "Sep 24", bsr: 9200, price: 29.99 },
  { month: "Oct 24", bsr: 5100, price: 32.99 }, { month: "Nov 24", bsr: 1200, price: 27.99 },
  { month: "Dec 24", bsr: 800, price: 24.99 }, { month: "Jan 25", bsr: 7400, price: 32.99 },
  { month: "Feb 25", bsr: 9800, price: 33.99 }, { month: "Mar 25", bsr: 8100, price: 31.99 },
  { month: "Apr 25", bsr: 6200, price: 32.99 }, { month: "May 25", bsr: 3400, price: 34.99 },
];

const insights = [
  { label: "Peak Sales Season", value: "Nov – Dec", color: "var(--success)", icon: "🎯" },
  { label: "Off-Season", value: "Jan – Mar", color: "var(--danger)", icon: "📉" },
  { label: "Avg Annual BSR", value: "#6,358", color: "var(--blue)", icon: "📊" },
  { label: "Price Volatility", value: "Low (±$7)", color: "var(--warning)", icon: "💰" },
];

export default function TrendsterPage() {
  const [asin, setAsin] = useState("B08XYZ1234");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(true);

  const handleSearch = () => {
    if (!asin) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSearched(true); }, 1200);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Trendster</h1>
          <p className="page-subtitle">Analyze product seasonality and historical price trends</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <input className="input-field" placeholder="Enter ASIN..." value={asin} onChange={e => setAsin(e.target.value)} style={{ flex: 1 }} onKeyDown={e => e.key === "Enter" && handleSearch()} />
          <button className="btn-accent" onClick={handleSearch} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 160 }}>
            {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} />Analyzing...</> : <><TrendingUp size={15} />Analyze Trends</>}
          </button>
        </div>
      </div>

      {searched && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
            {insights.map(ins => (
              <div key={ins.label} className="stat-card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 24 }}>{ins.icon}</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{ins.label}</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: ins.color }}>{ins.value}</span>
              </div>
            ))}
          </div>

          <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 4 }}>BSR & Price History — Last 12 Months</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 20 }}>
              Lower BSR = better ranking. Spikes in Nov–Dec indicate holiday demand surge.
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickLine={false} axisLine={false} reversed tickFormatter={v => `#${(v/1000).toFixed(0)}k`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10 }} />
                <Legend wrapperStyle={{ color: "var(--text-secondary)", fontSize: 13 }} />
                <Line yAxisId="left" type="monotone" dataKey="bsr" stroke="var(--accent)" strokeWidth={2.5} dot={{ fill: "var(--accent)", r: 4 }} name="BSR Rank" />
                <Line yAxisId="right" type="monotone" dataKey="price" stroke="var(--blue)" strokeWidth={2.5} dot={{ fill: "var(--blue)", r: 4 }} name="Price ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 12 }}>Seasonality Analysis</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: 6 }}>
              {trendData.map((d, i) => {
                const strength = Math.round(((10000 - d.bsr) / 10000) * 100);
                return (
                  <div key={d.month} style={{ textAlign: "center" }}>
                    <div style={{ height: 80, display: "flex", flexDirection: "column", justifyContent: "flex-end", marginBottom: 6 }}>
                      <div style={{
                        height: `${strength}%`,
                        background: strength > 85 ? "var(--accent)" : strength > 60 ? "var(--warning)" : "var(--blue)",
                        borderRadius: "4px 4px 0 0",
                        minHeight: 8,
                        opacity: 0.9,
                      }} />
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{d.month.split(" ")[0]}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: strength > 85 ? "var(--accent)" : "var(--text-secondary)" }}>{strength}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
