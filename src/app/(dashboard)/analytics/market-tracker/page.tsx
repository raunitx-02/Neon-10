"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";

const shareData = [
  { name: "EcoHome (You)", value: 18.4, color: "var(--accent)" },
  { name: "ChefLine Pro", value: 14.2, color: "var(--blue)" },
  { name: "KitchenPro", value: 12.8, color: "var(--purple)" },
  { name: "BambooKing", value: 9.1, color: "var(--success)" },
  { name: "CutMaster", value: 7.6, color: "var(--warning)" },
  { name: "Others", value: 37.9, color: "#334155" },
];

const volumeData = [
  { month: "Nov", vol: 48200 }, { month: "Dec", vol: 89400 }, { month: "Jan", vol: 32100 },
  { month: "Feb", vol: 29800 }, { month: "Mar", vol: 41200 }, { month: "Apr", vol: 54800 },
  { month: "May", vol: 61200 },
];

const competitors = [
  { brand: "EcoHome (You)", revenue: "$54,280", share: "18.4%", rank: 1, change: "+2.1%", trend: "up" },
  { brand: "ChefLine Pro", revenue: "$41,800", share: "14.2%", rank: 2, change: "+0.8%", trend: "up" },
  { brand: "KitchenPro", revenue: "$37,600", share: "12.8%", rank: 3, change: "-1.3%", trend: "down" },
  { brand: "BambooKing", revenue: "$26,700", share: "9.1%", rank: 4, change: "+0.3%", trend: "up" },
  { brand: "CutMaster", revenue: "$22,300", share: "7.6%", rank: 5, change: "-0.5%", trend: "down" },
];

export default function MarketTrackerPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Market Tracker</h1>
          <p className="page-subtitle">Niche-level intelligence — track market share, volume trends, and competitor movements</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <select className="input-field" style={{ width: "auto" }}><option>Bamboo Cutting Boards</option><option>Water Bottles</option><option>Yoga Mats</option></select>
          <button className="btn-accent">+ Track New Market</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Market Size (Monthly)", value: "$294,000", color: "var(--accent)" },
          { label: "Your Market Share", value: "18.4%", color: "var(--success)" },
          { label: "Total Competitors", value: "142", color: "var(--blue)" },
          { label: "Market Growth", value: "+12.3%", color: "var(--purple)" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <p style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Pie Chart */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 4 }}>Market Share Distribution</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 16 }}>Top 5 sellers by estimated revenue share</p>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={shareData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" stroke="none">
                  {shareData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [`${v}%`, "Share"]} contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {shareData.map(d => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: d.color, display: "inline-block", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{d.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginLeft: "auto" }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Volume Trend */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 4 }}>Market Volume Trend</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 16 }}>Monthly total search volume for the niche</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={volumeData}>
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--purple)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--purple)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 10 }} formatter={(v: any) => [v.toLocaleString(), "Searches"]} />
              <Area type="monotone" dataKey="vol" stroke="var(--purple)" strokeWidth={2} fill="url(#volGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 20 }}>Competitor Intelligence</h2>
        <table className="data-table">
          <thead><tr><th>RANK</th><th>BRAND</th><th>EST. REVENUE</th><th>MARKET SHARE</th><th>SHARE CHANGE</th></tr></thead>
          <tbody>
            {competitors.map(c => (
              <tr key={c.brand} style={{ background: c.brand.includes("You") ? "rgba(255,107,53,0.04)" : undefined }}>
                <td style={{ fontWeight: 800, fontSize: 18, color: c.rank === 1 ? "var(--accent)" : "var(--text-muted)" }}>#{c.rank}</td>
                <td style={{ fontWeight: 600, color: c.brand.includes("You") ? "var(--accent)" : "var(--text-primary)" }}>{c.brand}</td>
                <td style={{ fontWeight: 700, color: "var(--success)" }}>{c.revenue}</td>
                <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div className="progress-bar" style={{ width: 80 }}><div className="progress-bar-fill" style={{ width: c.share, background: c.brand.includes("You") ? "var(--accent)" : "var(--blue)" }} /></div><span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{c.share}</span></div></td>
                <td style={{ color: c.change.startsWith("+") ? "var(--success)" : "var(--danger)", fontWeight: 700 }}>{c.change}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
