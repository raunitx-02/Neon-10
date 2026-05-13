"use client";
import { useState } from "react";
import { Cpu, Download, TrendingUp, TrendingDown } from "lucide-react";

const cerebroResults = [
  { keyword: "bamboo cutting board", searchVol: 48200, myRank: 12, compRank: 3, cpr: 320, trend: "up", match: "Organic" },
  { keyword: "cutting board set", searchVol: 38900, myRank: 21, compRank: 7, cpr: 280, trend: "up", match: "Organic" },
  { keyword: "large cutting board", searchVol: 29400, myRank: 8, compRank: 2, cpr: 190, trend: "up", match: "Organic" },
  { keyword: "wood cutting board", searchVol: 24100, myRank: 35, compRank: 14, cpr: 160, trend: "down", match: "Organic" },
  { keyword: "bamboo kitchen board", searchVol: 18700, myRank: 5, compRank: 1, cpr: 120, trend: "up", match: "Organic" },
  { keyword: "chopping board bamboo", searchVol: 14200, myRank: 3, compRank: 4, cpr: 94, trend: "up", match: "Organic" },
  { keyword: "eco friendly cutting board", searchVol: 11800, myRank: 18, compRank: 9, cpr: 78, trend: "up", match: "Organic" },
  { keyword: "plastic free cutting board", searchVol: 9400, myRank: 42, compRank: 28, cpr: 62, trend: "down", match: "Organic" },
  { keyword: "kitchen board set of 3", searchVol: 8100, myRank: null, compRank: 6, cpr: 54, trend: "up", match: "Sponsored" },
  { keyword: "reversible bamboo board", searchVol: 6800, myRank: 7, compRank: 3, cpr: 45, trend: "up", match: "Organic" },
  { keyword: "cutting board with juice groove", searchVol: 32100, myRank: 29, compRank: 11, cpr: 213, trend: "up", match: "Organic" },
  { keyword: "end grain cutting board", searchVol: 21900, myRank: null, compRank: 22, cpr: 146, trend: "down", match: "Sponsored" },
];

export default function CerebroPage() {
  const [asin, setAsin] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState("searchVol");

  const sorted = [...cerebroResults].sort((a, b) => (b[sortBy as keyof typeof b] as number) - (a[sortBy as keyof typeof a] as number));

  const handleSearch = () => {
    if (!asin.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSearched(true); }, 1400);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Cerebro</h1>
          <p className="page-subtitle">Reverse ASIN lookup — discover every keyword your competitors rank for</p>
        </div>
        {searched && (
          <button className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Download size={15} /> Export CSV
          </button>
        )}
      </div>

      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>Enter up to 10 ASINs separated by commas to compare keyword rankings</p>
        <div style={{ display: "flex", gap: 12 }}>
          <input className="input-field" placeholder="e.g. B08XYZ1234, B09ABC5678, B07DEF9012" value={asin} onChange={e => setAsin(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} style={{ flex: 1 }} />
          <button className="btn-accent" onClick={handleSearch} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 160 }}>
            {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} />Scanning...</> : <><Cpu size={15} />Get Keywords</>}
          </button>
        </div>
        {!searched && (
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {["B08XYZ1234", "B09ABC5678"].map(a => (
              <button key={a} className="btn-ghost" style={{ fontSize: 12, padding: "5px 12px" }} onClick={() => setAsin(a)}>{a}</button>
            ))}
          </div>
        )}
      </div>

      {searched && (
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                Found <span style={{ color: "var(--accent)", fontWeight: 700 }}>{cerebroResults.length}</span> keywords — Total Search Volume:{" "}
                <span style={{ color: "var(--success)", fontWeight: 700 }}>289,100</span>
              </span>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Sort by:</span>
              <select className="input-field" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: "auto" }}>
                <option value="searchVol">Search Volume</option>
                <option value="cpr">CPR Score</option>
                <option value="compRank">Competitor Rank</option>
              </select>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>KEYWORD</th>
                  <th>SEARCH VOLUME</th>
                  <th>MY RANK</th>
                  <th>COMPETITOR RANK</th>
                  <th>CPR 8-DAY</th>
                  <th>MATCH TYPE</th>
                  <th>TREND</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((kw) => (
                  <tr key={kw.keyword}>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{kw.keyword}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="progress-bar" style={{ width: 60 }}>
                          <div className="progress-bar-fill" style={{ width: `${Math.min((kw.searchVol / 50000) * 100, 100)}%` }} />
                        </div>
                        <span style={{ fontWeight: 700, color: "var(--text-primary)", minWidth: 50 }}>{kw.searchVol.toLocaleString()}</span>
                      </div>
                    </td>
                    <td>
                      {kw.myRank
                        ? <span style={{ fontWeight: 700, color: kw.myRank <= 10 ? "var(--success)" : kw.myRank <= 30 ? "var(--warning)" : "var(--danger)" }}>#{kw.myRank}</span>
                        : <span style={{ color: "var(--text-muted)" }}>—</span>}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: kw.compRank <= 5 ? "var(--danger)" : "var(--warning)" }}>#{kw.compRank}</span>
                    </td>
                    <td><span className="badge badge-purple">{kw.cpr}</span></td>
                    <td><span className={`badge ${kw.match === "Organic" ? "badge-success" : "badge-blue"}`}>{kw.match}</span></td>
                    <td>
                      {kw.trend === "up"
                        ? <TrendingUp size={16} color="var(--success)" />
                        : <TrendingDown size={16} color="var(--danger)" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
