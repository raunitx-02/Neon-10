"use client";

import { useState, useCallback } from "react";
import {
  Target, Download, TrendingUp, TrendingDown,
  Search, Languages, Zap, ChevronDown, ChevronUp, X,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface MagnetKeyword {
  keyword: string;
  searchVol: number;
  iqScore: number;
  competition: "Low" | "Medium" | "High";
  cpc: string;
  growth: string;
  trend: "up" | "down";
  competingProducts: number;
  sponsored: boolean;
  hinglish: boolean;
}

interface MagnetData {
  keywords: MagnetKeyword[];
  totalKeywords: number;
  totalSearchVolume: number;
  avgIQScore: number;
  lowCompetitionPct: number;
  seedKeyword: string;
}

const compColors = {
  Low: { bg: "var(--success-muted)", color: "var(--success)" },
  Medium: { bg: "var(--warning-muted)", color: "var(--warning)" },
  High: { bg: "var(--danger-muted)", color: "var(--danger)" },
};

const SEED_EXAMPLES = [
  "yoga mat", "water bottle steel", "phone stand", "kitchen organizer",
  "face wash men", "earphones wireless", "notebook diary",
];

type SortField = "searchVol" | "iqScore" | "competingProducts";

export default function MagnetPage() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MagnetData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("searchVol");
  const [sortAsc, setSortAsc] = useState(false);
  const [filterHinglish, setFilterHinglish] = useState(false);
  const [filterLowComp, setFilterLowComp] = useState(false);
  const [minIQ, setMinIQ] = useState("");

  const handleSearch = useCallback(async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`/api/amazon/magnet?keyword=${encodeURIComponent(keyword.trim())}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortAsc(v => !v);
    else { setSortField(field); setSortAsc(false); }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown size={11} style={{ opacity: 0.3 }} />;
    return sortAsc ? <ChevronUp size={11} color="var(--accent)" /> : <ChevronDown size={11} color="var(--accent)" />;
  };

  const filtered = (data?.keywords || [])
    .filter(k => !filterHinglish || k.hinglish)
    .filter(k => !filterLowComp || k.competition === "Low")
    .filter(k => !minIQ || k.iqScore >= Number(minIQ))
    .sort((a, b) => {
      const av = a[sortField] as number, bv = b[sortField] as number;
      return sortAsc ? av - bv : bv - av;
    });

  const exportCSV = () => {
    const headers = ["Keyword", "Search Volume", "IQ Score", "Competition", "CPC", "Growth", "Competing Products", "Sponsored", "Hinglish"];
    const rows = filtered.map(k => [
      `"${k.keyword}"`, k.searchVol, k.iqScore, k.competition,
      k.cpc, k.growth, k.competingProducts, k.sponsored, k.hinglish,
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `magnet-india-${keyword.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Magnet India</h1>
          <p className="page-subtitle">
            Keyword aggregation engine — discover high-volume search clusters from a single seed keyword on Amazon.in
          </p>
        </div>
        {data && (
          <button className="btn-ghost" onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Download size={15} /> Export CSV
          </button>
        )}
      </div>

      {/* ── Search ── */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            className="input-field"
            placeholder="Enter a seed keyword — e.g. yoga mat, water bottle, face wash..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            style={{ flex: 1 }}
          />
          {keyword && (
            <button className="btn-ghost" style={{ padding: "10px 14px" }} onClick={() => { setKeyword(""); setData(null); }}>
              <X size={15} />
            </button>
          )}
          <button
            className="btn-accent"
            onClick={handleSearch}
            disabled={loading || !keyword.trim()}
            style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 180 }}
          >
            {loading
              ? <><div className="spinner" style={{ width: 16, height: 16 }} />Aggregating...</>
              : <><Target size={15} />Get Keywords</>}
          </button>
        </div>
        {!data && (
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", alignSelf: "center" }}>Quick seeds:</span>
            {SEED_EXAMPLES.map(k => (
              <button key={k} className="btn-ghost"
                style={{ fontSize: 12, padding: "4px 12px" }}
                onClick={() => setKeyword(k)}>
                {k}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{ background: "var(--danger-muted)", border: "1px solid var(--danger)", borderRadius: 12, padding: "14px 20px", marginBottom: 20, color: "var(--danger)", fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="glass-card" style={{ padding: 40, textAlign: "center" }}>
          <div className="spinner" style={{ margin: "0 auto 16px" }} />
          <div style={{ color: "var(--text-muted)", fontSize: 14 }}>Fetching keyword cluster from Keepa...</div>
        </div>
      )}

      {/* ── Results ── */}
      {data && !loading && (
        <>
          {/* Summary stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Keywords Found", value: data.totalKeywords.toLocaleString(), color: "var(--accent)" },
              { label: "Total Search Volume", value: data.totalSearchVolume.toLocaleString(), color: "var(--success)" },
              { label: "Avg IQ Score", value: data.avgIQScore.toString(), color: "var(--blue)" },
              { label: "Low Competition", value: `${data.lowCompetitionPct}%`, color: "var(--purple)" },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ padding: 16 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters row */}
          <div className="glass-card" style={{ padding: "12px 20px", marginBottom: 16, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Filter:</span>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}>
              <input type="checkbox" checked={filterLowComp} onChange={e => setFilterLowComp(e.target.checked)} />
              Low competition only
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}>
              <input type="checkbox" checked={filterHinglish} onChange={e => setFilterHinglish(e.target.checked)} />
              <Languages size={14} color="var(--purple)" /> Hinglish
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Min IQ:</span>
              <input className="input-field" type="number" placeholder="e.g. 70" value={minIQ}
                onChange={e => setMinIQ(e.target.value)} style={{ width: 80 }} />
            </div>
            <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--text-muted)" }}>
              Showing {filtered.length} of {data.totalKeywords}
            </span>
          </div>

          {/* Keyword table */}
          <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>KEYWORD</th>
                    <th style={{ cursor: "pointer" }} onClick={() => handleSort("searchVol")}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>SEARCH VOLUME <SortIcon field="searchVol" /></span>
                    </th>
                    <th style={{ cursor: "pointer" }} onClick={() => handleSort("iqScore")}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>MAGNET IQ <SortIcon field="iqScore" /></span>
                    </th>
                    <th>COMPETITION</th>
                    <th>AVG CPC</th>
                    <th>GROWTH</th>
                    <th style={{ cursor: "pointer" }} onClick={() => handleSort("competingProducts")}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>COMPETING <SortIcon field="competingProducts" /></span>
                    </th>
                    <th>TREND</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(kw => (
                    <tr key={kw.keyword}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{kw.keyword}</span>
                          {kw.hinglish && (
                            <span style={{ background: "var(--purple-muted)", color: "var(--purple)", borderRadius: 50, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>हिं</span>
                          )}
                          {kw.sponsored && (
                            <span style={{ background: "var(--warning-muted)", color: "var(--warning)", borderRadius: 50, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>
                              <Zap size={9} style={{ display: "inline" }} />
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 60, height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: 3, background: "var(--accent)", width: `${Math.min(100, (kw.searchVol / 50000) * 100)}%` }} />
                          </div>
                          <span style={{ fontWeight: 700, color: "var(--text-primary)", minWidth: 55 }}>
                            {kw.searchVol.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 48, height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: 3, width: `${kw.iqScore}%`,
                              background: kw.iqScore >= 75 ? "var(--success)" : kw.iqScore >= 55 ? "var(--warning)" : "var(--danger)" }} />
                          </div>
                          <span style={{ fontWeight: 800, color: kw.iqScore >= 75 ? "var(--success)" : kw.iqScore >= 55 ? "var(--warning)" : "var(--danger)" }}>
                            {kw.iqScore}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{ background: compColors[kw.competition].bg, color: compColors[kw.competition].color, borderRadius: 50, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>
                          {kw.competition}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{kw.cpc}</td>
                      <td style={{ fontWeight: 700, color: kw.growth.startsWith("+") ? "var(--success)" : "var(--danger)" }}>{kw.growth}</td>
                      <td style={{ color: "var(--text-secondary)" }}>{kw.competingProducts.toLocaleString()}</td>
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
        </>
      )}

      {/* ── Intro state ── */}
      {!data && !loading && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {[
            { icon: <Target size={24} color="var(--accent)" />, title: "Seed Keyword Expansion", desc: "One keyword → 80+ related search terms specific to Amazon.in buyers" },
            { icon: <Search size={24} color="var(--success)" />, title: "IQ Score", desc: "Proprietary score balancing volume, competition, and review barrier" },
            { icon: <Languages size={24} color="var(--purple)" />, title: "Hinglish Intelligence", desc: "Detects Hindi/Hinglish variants that Indian buyers actually search" },
            { icon: <Zap size={24} color="var(--warning)" />, title: "PPC CPC Estimation", desc: "Avg CPC for each keyword in Amazon India sponsored ads" },
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
