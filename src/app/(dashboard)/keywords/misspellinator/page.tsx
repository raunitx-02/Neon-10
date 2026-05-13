"use client";
import { useState } from "react";
import { Sparkles, Copy } from "lucide-react";

const generateMisspellings = (kw: string) => {
  const base = [
    { misspelling: kw.replace("a", "e"), volume: Math.floor(Math.random() * 800) + 100 },
    { misspelling: kw.replace("board", "borad"), volume: Math.floor(Math.random() * 600) + 50 },
    { misspelling: kw.replace("cutting", "cuting"), volume: Math.floor(Math.random() * 400) + 80 },
    { misspelling: kw.replace("bamboo", "bambo"), volume: Math.floor(Math.random() * 900) + 200 },
    { misspelling: kw.replace("bamboo", "banbo"), volume: Math.floor(Math.random() * 300) + 30 },
    { misspelling: kw.replace("bamboo", "banboo"), volume: Math.floor(Math.random() * 500) + 100 },
    { misspelling: kw + "s", volume: Math.floor(Math.random() * 1200) + 300 },
    { misspelling: kw.replace(" ", "-"), volume: Math.floor(Math.random() * 700) + 150 },
    { misspelling: kw.replace("cutting", "cuttting"), volume: Math.floor(Math.random() * 200) + 40 },
    { misspelling: kw.replace("board", "bord"), volume: Math.floor(Math.random() * 350) + 60 },
    { misspelling: kw.replace("bamboo", "bambooo"), volume: Math.floor(Math.random() * 150) + 20 },
    { misspelling: kw.replace("cutting", "cutiing"), volume: Math.floor(Math.random() * 180) + 35 },
  ];
  return base.filter(b => b.misspelling !== kw).sort((a, b) => b.volume - a.volume);
};

const DEMO_RESULTS = generateMisspellings("bamboo cutting board");

export default function MisspellinatorPage() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<typeof DEMO_RESULTS>([]);

  const handleRun = () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResults(generateMisspellings(keyword));
      setLoading(false);
    }, 1100);
  };

  const totalVolume = results.reduce((sum, r) => sum + r.volume, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Misspellinator</h1>
          <p className="page-subtitle">Capture hidden traffic from common keyword misspellings your competitors miss</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <input className="input-field" placeholder="Enter keyword (e.g. bamboo cutting board)..." value={keyword} onChange={e => setKeyword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleRun()} style={{ flex: 1 }} />
          <button className="btn-accent" onClick={handleRun} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 160 }}>
            {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} />Generating...</> : <><Sparkles size={15} />Find Misspellings</>}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
            <div className="stat-card">
              <p style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Misspellings Found</p>
              <p style={{ fontSize: 32, fontWeight: 800, color: "var(--accent)" }}>{results.length}</p>
            </div>
            <div className="stat-card">
              <p style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Total Monthly Searches</p>
              <p style={{ fontSize: 32, fontWeight: 800, color: "var(--success)" }}>{totalVolume.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <p style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Avg Competition</p>
              <p style={{ fontSize: 32, fontWeight: 800, color: "var(--blue)" }}>Very Low</p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>Misspelling Results</h2>
              <button className="btn-ghost" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <Copy size={13} /> Copy All Misspellings
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
              {results.map((r, i) => (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 18px",
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                }}>
                  <div>
                    <span style={{ fontFamily: "monospace", fontSize: 14, color: "var(--text-primary)", fontWeight: 600 }}>{r.misspelling}</span>
                    <span className="badge badge-success" style={{ marginLeft: 10, fontSize: 11 }}>Low Comp.</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: r.volume > 500 ? "var(--accent)" : "var(--text-secondary)" }}>{r.volume.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>searches/mo</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, padding: "16px", background: "rgba(255,107,53,0.06)", borderRadius: 10, border: "1px solid var(--accent-muted)" }}>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                💡 <strong style={{ color: "var(--accent)" }}>Pro Tip:</strong> Add these misspellings to your backend Amazon Search Terms field (not your listing title). Amazon allows up to 249 bytes in the search terms field. These long-tail misspellings often have zero competition and can drive free, targeted traffic.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
