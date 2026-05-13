"use client";
import { useState } from "react";
import { Check, X } from "lucide-react";

const kws = [
  "bamboo cutting board", "large cutting board", "cutting board set", "bamboo kitchen board",
  "chopping board bamboo", "eco friendly cutting board", "juice groove cutting board",
  "non slip cutting board", "reversible bamboo board", "sustainable cutting board",
  "bamboo kitchen utensils", "organic bamboo board",
];

export default function ScribblesPage() {
  const [listing, setListing] = useState("Premium Bamboo Cutting Board Set with Juice Groove - ");
  const [selected, setSelected] = useState<string[]>([]);

  const addKeyword = (kw: string) => {
    if (!selected.includes(kw)) {
      setSelected([...selected, kw]);
      setListing(prev => prev + (prev.endsWith(" ") ? "" : " ") + kw + " ");
    }
  };
  const remove = (kw: string) => {
    setSelected(selected.filter(s => s !== kw));
  };
  const usedInText = (kw: string) => listing.toLowerCase().includes(kw.toLowerCase());

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Scribbles</h1>
          <p className="page-subtitle">Visually track which keywords you've used and which ones you still need to include</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>Listing Text</h2>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{listing.length} characters</span>
          </div>
          <textarea
            className="input-field"
            value={listing}
            onChange={e => setListing(e.target.value)}
            style={{ minHeight: 340, resize: "vertical", lineHeight: 1.8, fontSize: 14 }}
          />
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 10 }}>Selected Keywords (click to add to text):</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {selected.map(kw => (
                <span key={kw} style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", borderRadius: 50,
                  background: usedInText(kw) ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                  border: `1px solid ${usedInText(kw) ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}`,
                  fontSize: 12, fontWeight: 600,
                  color: usedInText(kw) ? "var(--success)" : "var(--warning)",
                }}>
                  {usedInText(kw) ? <Check size={12} /> : null}
                  {kw}
                  <button onClick={() => remove(kw)} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", display: "flex", padding: 0 }}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 4 }}>Keyword Checklist</h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>{kws.filter(k => usedInText(k)).length}/{kws.length} used in text</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {kws.map(kw => {
              const used = usedInText(kw);
              return (
                <button
                  key={kw}
                  onClick={() => addKeyword(kw)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", borderRadius: 10, border: "none", cursor: "pointer",
                    background: used ? "rgba(16,185,129,0.08)" : "rgba(0,0,0,0.2)",
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: 6,
                    background: used ? "var(--success)" : "rgba(255,255,255,0.08)",
                    border: `1px solid ${used ? "var(--success)" : "rgba(255,255,255,0.15)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    {used && <Check size={12} color="white" strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: 13, color: used ? "var(--success)" : "var(--text-secondary)", fontWeight: used ? 600 : 400 }}>{kw}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
