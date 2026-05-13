"use client";
import { useState } from "react";
import { BookOpen, Check, AlertTriangle, Sparkles } from "lucide-react";

const keywordBank = [
  { kw: "bamboo cutting board", vol: 48200 },
  { kw: "cutting board set", vol: 38900 },
  { kw: "large cutting board", vol: 29400 },
  { kw: "bamboo kitchen board", vol: 18700 },
  { kw: "chopping board bamboo", vol: 14200 },
  { kw: "eco friendly cutting board", vol: 11800 },
  { kw: "juice groove cutting board", vol: 9200 },
  { kw: "non slip cutting board", vol: 7800 },
  { kw: "reversible bamboo board", vol: 6800 },
  { kw: "sustainable cutting board", vol: 4200 },
  { kw: "bamboo kitchen utensils", vol: 3900 },
  { kw: "organic bamboo board", vol: 2100 },
];

const calcScore = (title: string, bullets: string, desc: string) => {
  const allText = (title + " " + bullets + " " + desc).toLowerCase();
  let score = 0;
  keywordBank.forEach(k => {
    if (allText.includes(k.kw)) score += Math.min((k.vol / 48200) * 25, 25);
  });
  if (title.length > 100) score += 10;
  if (title.length > 150) score -= 5;
  if (bullets.split("\n").filter(Boolean).length >= 3) score += 10;
  if (desc.length > 200) score += 5;
  return Math.min(Math.round(score), 100);
};

export default function ListingBuilderPage() {
  const [title, setTitle] = useState("Premium Bamboo Cutting Board Set - ");
  const [bullets, setBullets] = useState("• \n• \n• \n• \n• ");
  const [desc, setDesc] = useState("");
  const [searchTerms, setSearchTerms] = useState("");

  const score = calcScore(title, bullets, desc);
  const allText = (title + " " + bullets + " " + desc + " " + searchTerms).toLowerCase();
  const usedKeywords = keywordBank.filter(k => allText.includes(k.kw));
  const missingKeywords = keywordBank.filter(k => !allText.includes(k.kw));

  const scoreColor = score >= 80 ? "var(--success)" : score >= 60 ? "var(--warning)" : "var(--danger)";
  const scoreLabel = score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Work";

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Listing Builder</h1>
          <p className="page-subtitle">AI-powered listing editor with real-time keyword optimization scoring</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-ghost">Save Draft</button>
          <button className="btn-accent" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={15} /> Publish Listing
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
        {/* Editor Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Title */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <label style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>Product Title</label>
              <span style={{ fontSize: 12, color: title.length > 150 ? "var(--danger)" : "var(--text-muted)" }}>
                {title.length} / 200 characters
              </span>
            </div>
            <input className="input-field" value={title} onChange={e => setTitle(e.target.value)} style={{ fontSize: 15, fontWeight: 500 }} />
            {title.length < 80 && <p style={{ fontSize: 12, color: "var(--warning)", marginTop: 8 }}>⚠️ Title too short. Aim for 150+ characters to maximize keyword density.</p>}
          </div>

          {/* Bullet Points */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <label style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>Bullet Points</label>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{bullets.split("\n").filter(Boolean).length} / 5 bullets</span>
            </div>
            <textarea className="input-field" value={bullets} onChange={e => setBullets(e.target.value)} style={{ minHeight: 160, resize: "vertical", lineHeight: 2 }} />
          </div>

          {/* Description */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <label style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>Product Description</label>
              <span style={{ fontSize: 12, color: desc.length > 2000 ? "var(--danger)" : "var(--text-muted)" }}>{desc.length} / 2000</span>
            </div>
            <textarea className="input-field" placeholder="Write a compelling product description..." value={desc} onChange={e => setDesc(e.target.value)} style={{ minHeight: 140, resize: "vertical" }} />
          </div>

          {/* Search Terms */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <label style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>Backend Search Terms</label>
              <span style={{ fontSize: 12, color: searchTerms.length > 249 ? "var(--danger)" : "var(--text-muted)" }}>{searchTerms.length} / 249 bytes</span>
            </div>
            <textarea className="input-field" placeholder="Hidden keywords not in your listing (separated by spaces)..." value={searchTerms} onChange={e => setSearchTerms(e.target.value)} style={{ minHeight: 80, resize: "vertical" }} />
          </div>
        </div>

        {/* Sidebar: Score + Keywords */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Score Card */}
          <div className="glass-card" style={{ padding: 24, textAlign: "center" }}>
            <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 16 }}>Listing Score</h3>
            <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke={scoreColor} strokeWidth="10"
                  strokeDasharray={`${(score / 100) * 314} 314`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  style={{ transition: "stroke-dasharray 0.6s ease" }}
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: scoreColor }}>{score}</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>/100</span>
              </div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: scoreColor }}>{scoreLabel}</div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
              {score < 60 ? "Add more keywords from the bank" : score < 80 ? "Good! Add a few more keywords" : "Your listing is highly optimized!"}
            </p>
          </div>

          {/* Keyword Bank */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 4 }}>Keyword Bank</h3>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14 }}>{usedKeywords.length}/{keywordBank.length} keywords used</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 280, overflowY: "auto" }}>
              {keywordBank.map(kw => {
                const used = allText.includes(kw.kw);
                return (
                  <div key={kw.kw} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: used ? "rgba(16,185,129,0.08)" : "rgba(0,0,0,0.2)",
                    border: `1px solid ${used ? "rgba(16,185,129,0.25)" : "var(--border)"}`,
                    gap: 8,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {used
                        ? <Check size={13} color="var(--success)" />
                        : <AlertTriangle size={13} color="var(--warning)" />}
                      <span style={{ fontSize: 12, color: used ? "var(--success)" : "var(--text-secondary)", fontWeight: used ? 600 : 400 }}>{kw.kw}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>{(kw.vol / 1000).toFixed(0)}k</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
