"use client";

import { useState, useCallback } from "react";
import { BookOpen, Sparkles, Download, Check, AlertTriangle, Plus, X, Languages, Target, FileText, Search } from "lucide-react";

// ─── Amazon India limits ─────────────────────────────────────────────────────
const LIMITS = { TITLE: 200, TITLE_OPTIMAL: 150, BULLET: 500, DESC: 2000, BACKEND: 249 };

interface FrankKeyword {
  rank: number; keyword: string; searchVol: number; frequency: number;
  placement: "Title" | "Bullet 1-5" | "Backend"; charCount: number;
}
interface FrankData {
  keywords: FrankKeyword[]; totalKeywords: number; suggestedTitle: string;
  backendTerms: string; productsAnalyzed: number;
  productSummary: { asin: string; title: string; brand: string; bsr: number }[];
}

const placementColors = {
  "Title": { bg: "var(--accent-muted)", color: "var(--accent)" },
  "Bullet 1-5": { bg: "var(--success-muted)", color: "var(--success)" },
  "Backend": { bg: "var(--purple-muted)", color: "var(--purple)" },
};

// ─── Listing Health Score ────────────────────────────────────────────────────
function calcScore(title: string, bullets: string, desc: string, backend: string, kwBank: FrankKeyword[]): number {
  const allText = (title + " " + bullets + " " + desc + " " + backend).toLowerCase();
  let score = 0;
  const titleKws = kwBank.filter(k => k.placement === "Title").slice(0, 10);
  const usedTitle = titleKws.filter(k => allText.includes(k.keyword)).length;
  score += Math.round((usedTitle / Math.max(titleKws.length, 1)) * 30);
  if (title.length >= 100) score += 10;
  if (title.length >= LIMITS.TITLE_OPTIMAL) score += 10;
  const bulletLines = bullets.split("\n").filter(b => b.trim().length > 20);
  score += Math.min(bulletLines.length * 6, 25);
  if (desc.length > 300) score += 10;
  if (backend.length > 100) score += 5;
  if (backend.length <= LIMITS.BACKEND) score += 5;
  const allKws = kwBank.slice(0, 30);
  const usedAll = allKws.filter(k => allText.includes(k.keyword)).length;
  score += Math.round((usedAll / Math.max(allKws.length, 1)) * 5);
  return Math.min(score, 100);
}

export default function ListingOptimizerPage() {
  const [activeTab, setActiveTab] = useState<"frankenstein" | "scribbles">("frankenstein");
  // Frankenstein state
  const [asinInput, setAsinInput] = useState("");
  const [seedInput, setSeedInput] = useState("");
  const [asinList, setAsinList] = useState<string[]>([]);
  const [seedList, setSeedList] = useState<string[]>([]);
  const [frankLoading, setFrankLoading] = useState(false);
  const [frankData, setFrankData] = useState<FrankData | null>(null);
  const [frankError, setFrankError] = useState<string | null>(null);
  // Scribbles state
  const [title, setTitle] = useState("");
  const [bullets, setBullets] = useState("• \n• \n• \n• \n• ");
  const [desc, setDesc] = useState("");
  const [backend, setBackend] = useState("");
  const [showSuggested, setShowSuggested] = useState(false);

  const addAsin = () => {
    const a = asinInput.trim().toUpperCase();
    if (a.length >= 10 && !asinList.includes(a)) { setAsinList(p => [...p, a]); setAsinInput(""); }
  };
  const addSeed = () => {
    const s = seedInput.trim().toLowerCase();
    if (s && !seedList.includes(s)) { setSeedList(p => [...p, s]); setSeedInput(""); }
  };

  const runFrankenstein = useCallback(async () => {
    if (asinList.length === 0 && seedList.length === 0) return;
    setFrankLoading(true); setFrankError(null); setFrankData(null);
    try {
      const res = await fetch("/api/amazon/frankenstein", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asins: asinList, keywords: seedList }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setFrankData(json);
      setBackend(json.backendTerms || "");
    } catch (e: any) { setFrankError(e.message); }
    finally { setFrankLoading(false); }
  }, [asinList, seedList]);

  const loadSuggested = () => {
    if (!frankData) return;
    setTitle(frankData.suggestedTitle);
    setBackend(frankData.backendTerms);
    setShowSuggested(true);
    setActiveTab("scribbles");
  };

  const exportCSV = () => {
    if (!frankData) return;
    const headers = ["Rank", "Keyword", "Search Volume", "Frequency", "Placement"];
    const rows = frankData.keywords.map(k => [k.rank, `"${k.keyword}"`, k.searchVol, k.frequency, k.placement]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = `frankenstein-${new Date().toISOString().split("T")[0]}.csv`; a.click();
  };

  const allText = (title + " " + bullets + " " + desc + " " + backend).toLowerCase();
  const kwBank = frankData?.keywords || [];
  const score = calcScore(title, bullets, desc, backend, kwBank);
  const scoreColor = score >= 80 ? "var(--success)" : score >= 55 ? "var(--warning)" : "var(--danger)";
  const usedKws = kwBank.filter(k => allText.includes(k.keyword));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Listing Optimizer</h1>
          <p className="page-subtitle">Frankenstein keyword extraction + Scribbles real-time editor — India-calibrated</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {frankData && <button className="btn-ghost" onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: 8 }}><Download size={15} />Export Keywords</button>}
          {activeTab === "scribbles" && <button className="btn-accent" style={{ display: "flex", alignItems: "center", gap: 8 }}><Sparkles size={15} />Save Listing</button>}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 24, maxWidth: 360 }}>
        <button className={`tab ${activeTab === "frankenstein" ? "active" : ""}`} onClick={() => setActiveTab("frankenstein")}>
          🧬 Frankenstein
        </button>
        <button className={`tab ${activeTab === "scribbles" ? "active" : ""}`} onClick={() => setActiveTab("scribbles")}>
          ✍️ Scribbles
        </button>
      </div>

      {/* ── Frankenstein Mode ── */}
      {activeTab === "frankenstein" && (
        <div>
          {/* Input card */}
          <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              {/* ASIN input */}
              <div>
                <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Competitor ASINs (Amazon.in)
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input className="input-field" placeholder="B08XYZ1234" value={asinInput}
                    onChange={e => setAsinInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addAsin()}
                    style={{ fontFamily: "monospace" }} />
                  <button className="btn-ghost" onClick={addAsin} style={{ padding: "10px 14px" }}><Plus size={15} /></button>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                  {asinList.map(a => (
                    <span key={a} style={{ background: "var(--accent-muted)", color: "var(--accent)", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontFamily: "monospace", display: "flex", alignItems: "center", gap: 6 }}>
                      {a} <X size={11} style={{ cursor: "pointer" }} onClick={() => setAsinList(p => p.filter(x => x !== a))} />
                    </span>
                  ))}
                </div>
              </div>
              {/* Seed keywords */}
              <div>
                <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Seed Keywords
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input className="input-field" placeholder="yoga mat, water bottle..." value={seedInput}
                    onChange={e => setSeedInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addSeed()} />
                  <button className="btn-ghost" onClick={addSeed} style={{ padding: "10px 14px" }}><Plus size={15} /></button>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                  {seedList.map(s => (
                    <span key={s} style={{ background: "var(--success-muted)", color: "var(--success)", borderRadius: 6, padding: "4px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                      {s} <X size={11} style={{ cursor: "pointer" }} onClick={() => setSeedList(p => p.filter(x => x !== s))} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button className="btn-accent" onClick={runFrankenstein}
                disabled={frankLoading || (asinList.length === 0 && seedList.length === 0)}
                style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 200 }}>
                {frankLoading ? <><div className="spinner" style={{ width: 16, height: 16 }} />Extracting Keywords...</> : <>🧬 Run Frankenstein</>}
              </button>
              {frankData && (
                <button className="btn-ghost" onClick={loadSuggested} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FileText size={15} />Load into Scribbles →
                </button>
              )}
            </div>
          </div>

          {frankError && <div style={{ background: "var(--danger-muted)", border: "1px solid var(--danger)", borderRadius: 12, padding: "14px 20px", marginBottom: 16, color: "var(--danger)" }}>{frankError}</div>}

          {frankLoading && (
            <div className="glass-card" style={{ padding: 40, textAlign: "center" }}>
              <div className="spinner" style={{ margin: "0 auto 16px" }} />
              <div style={{ color: "var(--text-muted)" }}>Scanning competitor listings via Keepa...</div>
            </div>
          )}

          {frankData && !frankLoading && (
            <>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
                {[
                  { label: "Total Keywords", value: frankData.totalKeywords, color: "var(--accent)" },
                  { label: "Products Analyzed", value: frankData.productsAnalyzed, color: "var(--success)" },
                  { label: "Title Keywords", value: frankData.keywords.filter(k => k.placement === "Title").length, color: "var(--blue)" },
                  { label: "Backend Terms", value: frankData.keywords.filter(k => k.placement === "Backend").length, color: "var(--purple)" },
                ].map(s => (
                  <div key={s.label} className="stat-card" style={{ padding: 16 }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Keyword table */}
              <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ overflowX: "auto", maxHeight: 500, overflowY: "auto" }}>
                  <table className="data-table">
                    <thead>
                      <tr><th style={{ width: 50 }}>#</th><th>KEYWORD</th><th>EST. VOLUME</th><th>FREQUENCY</th><th>PLACEMENT</th><th>CHARS</th></tr>
                    </thead>
                    <tbody>
                      {frankData.keywords.map(k => (
                        <tr key={k.keyword}>
                          <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{k.rank}</td>
                          <td style={{ fontWeight: 600 }}>{k.keyword}</td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 50, height: 5, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                                <div style={{ height: "100%", background: "var(--accent)", width: `${Math.min(100, (k.searchVol / 50000) * 100)}%` }} />
                              </div>
                              <span style={{ fontWeight: 700, fontSize: 13 }}>{k.searchVol.toLocaleString()}</span>
                            </div>
                          </td>
                          <td style={{ color: "var(--text-secondary)" }}>×{k.frequency}</td>
                          <td>
                            <span style={{ background: placementColors[k.placement].bg, color: placementColors[k.placement].color, borderRadius: 50, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>
                              {k.placement}
                            </span>
                          </td>
                          <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{k.charCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Scribbles Mode ── */}
      {activeTab === "scribbles" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
          {/* Editor */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Title */}
            <div className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <label style={{ fontWeight: 700, fontSize: 14 }}>Product Title</label>
                <span style={{ fontSize: 12, color: title.length > LIMITS.TITLE ? "var(--danger)" : title.length >= LIMITS.TITLE_OPTIMAL ? "var(--success)" : "var(--text-muted)" }}>
                  {title.length} / {LIMITS.TITLE} chars
                </span>
              </div>
              <input className="input-field" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Enter product title with high-volume keywords..." style={{ fontSize: 14, fontWeight: 500 }} />
              {title.length < 80 && title.length > 0 && (
                <p style={{ fontSize: 12, color: "var(--warning)", marginTop: 8 }}>⚠️ Too short. Aim for {LIMITS.TITLE_OPTIMAL}+ characters for max keyword density.</p>
              )}
            </div>

            {/* Bullets */}
            <div className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <label style={{ fontWeight: 700, fontSize: 14 }}>Bullet Points</label>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {bullets.split("\n").filter(b => b.trim().length > 2).length} / 5 bullets
                </span>
              </div>
              <textarea className="input-field" value={bullets} onChange={e => setBullets(e.target.value)}
                style={{ minHeight: 180, resize: "vertical", lineHeight: 1.8, fontFamily: "inherit" }} />
            </div>

            {/* Description */}
            <div className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <label style={{ fontWeight: 700, fontSize: 14 }}>Product Description</label>
                <span style={{ fontSize: 12, color: desc.length > LIMITS.DESC ? "var(--danger)" : "var(--text-muted)" }}>
                  {desc.length} / {LIMITS.DESC}
                </span>
              </div>
              <textarea className="input-field" value={desc} onChange={e => setDesc(e.target.value)}
                placeholder="Write a compelling description..." style={{ minHeight: 120, resize: "vertical" }} />
            </div>

            {/* Backend Search Terms */}
            <div className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <label style={{ fontWeight: 700, fontSize: 14 }}>Backend Search Terms</label>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Hidden keywords indexed by Amazon but not visible to customers</p>
                </div>
                <span style={{ fontSize: 12, color: backend.length > LIMITS.BACKEND ? "var(--danger)" : backend.length > LIMITS.BACKEND * 0.8 ? "var(--warning)" : "var(--success)", fontWeight: 600 }}>
                  {backend.length} / {LIMITS.BACKEND} bytes
                </span>
              </div>
              <textarea className="input-field" value={backend} onChange={e => setBackend(e.target.value)}
                placeholder="space-separated keywords not included in your listing..." style={{ minHeight: 80, resize: "vertical" }} />
              {backend.length > LIMITS.BACKEND && (
                <p style={{ fontSize: 12, color: "var(--danger)", marginTop: 6 }}>⚠️ Exceeds 249-byte limit — Amazon will truncate and may ignore all backend terms.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Score ring */}
            <div className="glass-card" style={{ padding: 24, textAlign: "center" }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Listing Health Score</h3>
              <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
                <svg width="110" height="110" viewBox="0 0 110 110">
                  <circle cx="55" cy="55" r="46" fill="none" stroke="var(--border)" strokeWidth="9" />
                  <circle cx="55" cy="55" r="46" fill="none" stroke={scoreColor} strokeWidth="9"
                    strokeDasharray={`${(score / 100) * 289} 289`} strokeLinecap="round"
                    transform="rotate(-90 55 55)" style={{ transition: "stroke-dasharray 0.5s ease" }} />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 26, fontWeight: 900, color: scoreColor }}>{score}</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>/100</span>
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: scoreColor }}>
                {score >= 80 ? "Excellent" : score >= 55 ? "Good" : "Needs Work"}
              </div>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
                {score < 55 ? "Add title & bullets with top keywords" : score < 80 ? "Include more keywords from the bank" : "Highly optimized listing!"}
              </p>
            </div>

            {/* Keyword Bank */}
            {kwBank.length > 0 && (
              <div className="glass-card" style={{ padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 14 }}>Keyword Bank</h3>
                  <span style={{ fontSize: 12, color: "var(--success)" }}>{usedKws.length}/{Math.min(kwBank.length, 30)} used</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 300, overflowY: "auto" }}>
                  {kwBank.slice(0, 30).map(kw => {
                    const used = allText.includes(kw.keyword);
                    return (
                      <div key={kw.keyword} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", borderRadius: 8, background: used ? "var(--success-muted)" : "var(--bg-secondary)", border: `1px solid ${used ? "rgba(52,199,89,0.3)" : "var(--border)"}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          {used ? <Check size={12} color="var(--success)" /> : <AlertTriangle size={12} color="var(--warning)" />}
                          <span style={{ fontSize: 12, color: used ? "var(--success)" : "var(--text-secondary)", fontWeight: used ? 600 : 400 }}>{kw.keyword}</span>
                        </div>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{(kw.searchVol / 1000).toFixed(0)}k</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No keywords yet */}
            {kwBank.length === 0 && (
              <div className="glass-card" style={{ padding: 20, textAlign: "center" }}>
                <Search size={28} color="var(--text-muted)" style={{ margin: "0 auto 10px" }} />
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Run Frankenstein first to populate the keyword bank</p>
                <button className="btn-ghost" style={{ marginTop: 12, fontSize: 13 }} onClick={() => setActiveTab("frankenstein")}>
                  → Go to Frankenstein
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
