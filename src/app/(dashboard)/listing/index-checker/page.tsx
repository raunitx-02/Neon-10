"use client";
import { useState } from "react";
import { ShieldCheck, Plus, X } from "lucide-react";

type Result = { keyword: string; indexed: boolean };

export default function IndexCheckerPage() {
  const [asin, setAsin] = useState("B08XYZ1234");
  const [kwInput, setKwInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>(["bamboo cutting board", "large cutting board", "cutting board set", "bamboo kitchen board"]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  const addKeyword = () => {
    const val = kwInput.trim();
    if (val && !keywords.includes(val)) {
      setKeywords([...keywords, val]);
      setKwInput("");
    }
  };

  const removeKeyword = (kw: string) => setKeywords(keywords.filter(k => k !== kw));

  const runCheck = () => {
    setLoading(true);
    setTimeout(() => {
      setResults(keywords.map(kw => ({
        keyword: kw,
        indexed: Math.random() > 0.3,
      })));
      setLoading(false);
    }, 1600);
  };

  const indexed = results.filter(r => r.indexed).length;
  const notIndexed = results.filter(r => !r.indexed).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Index Checker</h1>
          <p className="page-subtitle">Verify whether your product is indexed by Amazon for specific keywords</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>ASIN</label>
            <input className="input-field" placeholder="e.g. B08XYZ1234" value={asin} onChange={e => setAsin(e.target.value)} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Add Keywords</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input className="input-field" placeholder="Type keyword and press Enter..." value={kwInput} onChange={e => setKwInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addKeyword()} style={{ flex: 1 }} />
              <button className="btn-ghost" onClick={addKeyword} style={{ padding: "10px 12px", display: "flex" }}><Plus size={16} /></button>
            </div>
          </div>
        </div>

        {/* Keyword chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {keywords.map(kw => (
            <span key={kw} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "6px 12px", borderRadius: 50,
              background: "var(--accent-muted)", border: "1px solid rgba(255,107,53,0.25)",
              fontSize: 13, color: "var(--accent)", fontWeight: 500,
            }}>
              {kw}
              <button onClick={() => removeKeyword(kw)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)", display: "flex" }}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>

        <button className="btn-accent" onClick={runCheck} disabled={loading || keywords.length === 0} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} />Checking...</> : <><ShieldCheck size={15} />Check Indexing</>}
        </button>
      </div>

      {results.length > 0 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
            <div className="stat-card"><p style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Checked</p><p style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)" }}>{results.length}</p></div>
            <div className="stat-card"><p style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Indexed ✅</p><p style={{ fontSize: 32, fontWeight: 800, color: "var(--success)" }}>{indexed}</p></div>
            <div className="stat-card"><p style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Not Indexed ❌</p><p style={{ fontSize: 32, fontWeight: 800, color: "var(--danger)" }}>{notIndexed}</p></div>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 20 }}>Index Check Results</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {results.map(r => (
                <div key={r.keyword} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "16px 20px", borderRadius: 12,
                  background: r.indexed ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
                  border: `1px solid ${r.indexed ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: r.indexed ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {r.indexed ? <ShieldCheck size={18} color="var(--success)" /> : <X size={18} color="var(--danger)" />}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary)" }}>{r.keyword}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span className={`badge ${r.indexed ? "badge-success" : "badge-danger"}`} style={{ fontSize: 13, padding: "5px 14px" }}>
                      {r.indexed ? "✓ Indexed" : "✗ Not Indexed"}
                    </span>
                    {!r.indexed && <button className="btn-ghost" style={{ fontSize: 12, padding: "6px 12px" }}>Fix →</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
