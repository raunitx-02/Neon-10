"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Zap, TrendingUp, TrendingDown } from "lucide-react";

const campaigns = [
  { name: "Bamboo Board - Auto", type: "Auto", spend: 1840, revenue: 8920, acos: 20.6, roas: 4.85, clicks: 2841, impressions: 48200, ctr: "5.9%", status: "Active" },
  { name: "Bamboo Board - Exact KW", type: "Exact", spend: 2310, revenue: 14100, acos: 16.4, roas: 6.10, clicks: 3812, impressions: 89400, ctr: "4.3%", status: "Active" },
  { name: "Water Bottle - Broad", type: "Broad", spend: 980, revenue: 3240, acos: 30.2, roas: 3.31, clicks: 1892, impressions: 41200, ctr: "4.6%", status: "Active" },
  { name: "Yoga Mat - Sponsored Brand", type: "SB", spend: 1240, revenue: 6800, acos: 18.2, roas: 5.48, clicks: 2104, impressions: 62800, ctr: "3.3%", status: "Active" },
  { name: "Desk Lamp - Phrase Match", type: "Phrase", spend: 640, revenue: 1920, acos: 33.3, roas: 3.00, clicks: 1204, impressions: 28900, ctr: "4.2%", status: "Paused" },
  { name: "Kitchen Utensil - Product Targeting", type: "PAT", spend: 520, revenue: 3100, acos: 16.8, roas: 5.96, clicks: 892, impressions: 19800, ctr: "4.5%", status: "Active" },
];

const chartData = [
  { day: "Mon", spend: 980, revenue: 4820 }, { day: "Tue", spend: 1240, revenue: 6100 },
  { day: "Wed", spend: 1100, revenue: 5400 }, { day: "Thu", spend: 1380, revenue: 7200 },
  { day: "Fri", spend: 1520, revenue: 8100 }, { day: "Sat", spend: 1820, revenue: 9400 },
  { day: "Sun", spend: 1490, revenue: 7800 },
];

const statusBadge: Record<string, string> = { "Active": "badge-success", "Paused": "badge-warning" };
const typeBadge: Record<string, string> = { "Auto": "badge-blue", "Exact": "badge-success", "Broad": "badge-accent", "Phrase": "badge-purple", "SB": "badge-warning", "PAT": "badge-blue" };

export default function AdsPage() {
  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);
  const avgAcos = (campaigns.reduce((s, c) => s + c.acos, 0) / campaigns.length).toFixed(1);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Ads (Adtomic)</h1>
          <p className="page-subtitle">AI-powered PPC management — automate bids, reduce ACoS, and maximize ROAS</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 8 }}><Zap size={15} />Auto-Optimize Bids</button>
          <button className="btn-accent">+ Create Campaign</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Ad Spend", value: `$${totalSpend.toLocaleString()}`, color: "var(--danger)" },
          { label: "Total Ad Revenue", value: `$${totalRevenue.toLocaleString()}`, color: "var(--success)" },
          { label: "Avg ACoS", value: `${avgAcos}%`, color: parseFloat(avgAcos) < 25 ? "var(--success)" : "var(--warning)" },
          { label: "Total Clicks", value: totalClicks.toLocaleString(), color: "var(--blue)" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <p style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Weekly Chart */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 4 }}>Weekly Ad Performance</h2>
        <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 20 }}>Spend vs. Revenue by day this week</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} barGap={4} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(1)}k`} />
            <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10 }} formatter={(v: any) => [`$${v.toLocaleString()}`, ""]} />
            <Legend wrapperStyle={{ color: "var(--text-secondary)", fontSize: 13 }} />
            <Bar dataKey="spend" fill="var(--danger)" radius={[4, 4, 0, 0]} name="Ad Spend" opacity={0.8} />
            <Bar dataKey="revenue" fill="var(--success)" radius={[4, 4, 0, 0]} name="Ad Revenue" opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Campaigns Table */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 20 }}>Active Campaigns</h2>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr><th>CAMPAIGN</th><th>TYPE</th><th>SPEND</th><th>REVENUE</th><th>ACoS</th><th>ROAS</th><th>CLICKS</th><th>CTR</th><th>STATUS</th></tr>
            </thead>
            <tbody>
              {campaigns.map(c => (
                <tr key={c.name}>
                  <td style={{ fontWeight: 500, color: "var(--text-primary)", fontSize: 13 }}>{c.name}</td>
                  <td><span className={`badge ${typeBadge[c.type]}`} style={{ fontSize: 11 }}>{c.type}</span></td>
                  <td style={{ color: "var(--danger)", fontWeight: 600 }}>${c.spend.toLocaleString()}</td>
                  <td style={{ color: "var(--success)", fontWeight: 700 }}>${c.revenue.toLocaleString()}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: c.acos < 20 ? "var(--success)" : c.acos < 30 ? "var(--warning)" : "var(--danger)" }}>{c.acos}%</span>
                  </td>
                  <td style={{ fontWeight: 700, color: "var(--blue)" }}>{c.roas}x</td>
                  <td style={{ color: "var(--text-secondary)" }}>{c.clicks.toLocaleString()}</td>
                  <td style={{ color: "var(--text-muted)" }}>{c.ctr}</td>
                  <td><span className={`badge ${statusBadge[c.status]}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={18} color="var(--accent)" />
          </div>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>AI Bid Optimization Suggestions</h2>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Based on your 30-day performance data</p>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { campaign: "Bamboo Board - Auto", action: "Increase bid", keyword: "bamboo cutting board", current: "$0.82", suggested: "$1.04", reason: "Conversion rate +34% above average" },
            { campaign: "Water Bottle - Broad", action: "Decrease bid", keyword: "cheap water bottle", current: "$0.65", suggested: "$0.38", reason: "ACoS is 58% — not profitable" },
            { campaign: "Yoga Mat - Sponsored Brand", action: "Pause keyword", keyword: "fitness mat generic", current: "$0.44", suggested: "$0", reason: "0 conversions in 120 clicks" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", borderRadius: 12, background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: s.action === "Increase bid" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {s.action === "Increase bid" ? <TrendingUp size={16} color="var(--success)" /> : <TrendingDown size={16} color="var(--danger)" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>{s.campaign} — <span style={{ color: "var(--text-muted)" }}>{s.keyword}</span></div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{s.reason}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.current}</span>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>→</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: s.action === "Increase bid" ? "var(--success)" : "var(--danger)" }}>{s.suggested}</span>
                <button className="btn-accent" style={{ fontSize: 12, padding: "6px 14px" }}>Apply</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
