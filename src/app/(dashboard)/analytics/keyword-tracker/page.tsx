"use client";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const keywords = [
  { kw: "bamboo cutting board", vol: 48200, rank: 4, prev: 7, change: 3, peak: 2, tracked: 30 },
  { kw: "cutting board set", vol: 38900, rank: 12, prev: 9, change: -3, peak: 6, tracked: 30 },
  { kw: "large cutting board", vol: 29400, rank: 8, prev: 11, change: 3, peak: 5, tracked: 30 },
  { kw: "bamboo kitchen board", vol: 18700, rank: 3, prev: 3, change: 0, peak: 1, tracked: 28 },
  { kw: "chopping board bamboo", vol: 14200, rank: 6, prev: 14, change: 8, peak: 4, tracked: 25 },
  { kw: "eco friendly cutting board", vol: 11800, rank: 21, prev: 18, change: -3, peak: 12, tracked: 20 },
  { kw: "juice groove cutting board", vol: 9200, rank: 1, prev: 2, change: 1, peak: 1, tracked: 30 },
  { kw: "non slip cutting board", vol: 7800, rank: 15, prev: 22, change: 7, peak: 10, tracked: 15 },
  { kw: "reversible bamboo board", vol: 6800, rank: 9, prev: 9, change: 0, peak: 7, tracked: 30 },
  { kw: "sustainable cutting board", vol: 4200, rank: 38, prev: 29, change: -9, peak: 22, tracked: 12 },
];

const Sparkline = ({ rank }: { rank: number }) => {
  const points = Array.from({ length: 14 }, (_, i) => Math.max(1, rank + Math.round((Math.random() - 0.5) * 6)));
  const max = Math.max(...points);
  const h = 30;
  const path = points.map((p, i) => `${(i / (points.length - 1)) * 80},${h - (((max - p) / max) * h)}`).join(" L ");
  return (
    <svg width="80" height={h} viewBox={`0 0 80 ${h}`}>
      <polyline points={path} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default function KeywordTrackerPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Keyword Tracker</h1>
          <p className="page-subtitle">Monitor your organic keyword rankings daily and track SEO performance over time</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <select className="input-field" style={{ width: "auto" }}>
            <option>B08XYZ1234 — Bamboo Cutting Board</option>
            <option>B09ABC5678 — Water Bottle</option>
          </select>
          <button className="btn-accent">+ Add Keywords</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Keywords Tracked", value: keywords.length, color: "var(--text-secondary)" },
          { label: "Avg Rank", value: "#11.7", color: "var(--blue)" },
          { label: "Improved Today", value: keywords.filter(k => k.change > 0).length, color: "var(--success)" },
          { label: "Declined Today", value: keywords.filter(k => k.change < 0).length, color: "var(--danger)" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <p style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>KEYWORD</th><th>SEARCH VOLUME</th><th>CURRENT RANK</th><th>PREV. RANK</th>
                <th>CHANGE</th><th>PEAK RANK</th><th>30-DAY TREND</th><th>DAYS TRACKED</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map(kw => (
                <tr key={kw.kw}>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{kw.kw}</td>
                  <td>{kw.vol.toLocaleString()}</td>
                  <td>
                    <span style={{ fontWeight: 800, fontSize: 16, color: kw.rank <= 5 ? "var(--success)" : kw.rank <= 15 ? "var(--warning)" : "var(--danger)" }}>#{kw.rank}</span>
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>#{kw.prev}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {kw.change > 0
                        ? <><TrendingUp size={14} color="var(--success)" /><span style={{ color: "var(--success)", fontWeight: 700 }}>+{kw.change}</span></>
                        : kw.change < 0
                        ? <><TrendingDown size={14} color="var(--danger)" /><span style={{ color: "var(--danger)", fontWeight: 700 }}>{kw.change}</span></>
                        : <><Minus size={14} color="var(--text-muted)" /><span style={{ color: "var(--text-muted)" }}>0</span></>}
                    </div>
                  </td>
                  <td style={{ color: "var(--purple)", fontWeight: 700 }}>#{kw.peak}</td>
                  <td><Sparkline rank={kw.rank} /></td>
                  <td style={{ color: "var(--text-muted)" }}>{kw.tracked}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
