"use client";
import { useState } from "react";
import { BarChart3, Star, Image, FileText, Award } from "lucide-react";

const mockAnalysis = {
  overallScore: 76,
  title: { score: 88, text: "Premium Bamboo Cutting Board Set - Large Wooden Board with Juice Groove, Non-Slip Feet & Free Cleaning Brush", issues: ["Consider adding more high-volume keywords in first 50 chars"] },
  bullets: { score: 71, issues: ["Bullet 3 is too short (under 100 chars)", "Missing keyword: 'eco friendly'"] },
  images: { score: 80, issues: ["No lifestyle image detected", "Add infographic showing dimensions"] },
  description: { score: 62, issues: ["Too short — only 148 words", "Missing A+ Content — huge opportunity!"] },
  keywords: { score: 79, issues: ["3 high-volume keywords not in backend search terms"] },
};

const sections = [
  { key: "title", label: "Title", icon: FileText, score: mockAnalysis.title.score },
  { key: "bullets", label: "Bullet Points", icon: BarChart3, score: mockAnalysis.bullets.score },
  { key: "images", label: "Images", icon: Image, score: mockAnalysis.images.score },
  { key: "description", label: "Description", icon: FileText, score: mockAnalysis.description.score },
  { key: "keywords", label: "Keywords", icon: Award, score: mockAnalysis.keywords.score },
];

const scoreColor = (s: number) => s >= 80 ? "var(--success)" : s >= 65 ? "var(--warning)" : "var(--danger)";
const scoreLabel = (s: number) => s >= 80 ? "Good" : s >= 65 ? "Fair" : "Needs Work";

export default function ListingAnalyzerPage() {
  const [asin, setAsin] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const run = () => {
    if (!asin.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setAnalyzed(true); }, 1800);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Listing Analyzer</h1>
          <p className="page-subtitle">Get a comprehensive health report for any Amazon product listing</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <input className="input-field" placeholder="Enter ASIN to analyze..." value={asin} onChange={e => setAsin(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ flex: 1 }} />
          <button className="btn-accent" onClick={run} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 160 }}>
            {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} />Analyzing...</> : <><BarChart3 size={15} />Analyze Listing</>}
          </button>
        </div>
      </div>

      {analyzed && (
        <>
          {/* Overall Score */}
          <div className="glass-card" style={{ padding: 32, marginBottom: 24, display: "flex", alignItems: "center", gap: 40 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="60" fill="none" stroke="var(--border)" strokeWidth="12" />
                <circle cx="70" cy="70" r="60" fill="none" stroke={scoreColor(mockAnalysis.overallScore)} strokeWidth="12"
                  strokeDasharray={`${(mockAnalysis.overallScore / 100) * 376} 376`} strokeLinecap="round" transform="rotate(-90 70 70)"
                  style={{ transition: "stroke-dasharray 0.8s ease" }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 36, fontWeight: 900, color: scoreColor(mockAnalysis.overallScore) }}>{mockAnalysis.overallScore}</span>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>/100</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontWeight: 800, fontSize: 22, color: "var(--text-primary)", marginBottom: 8 }}>Overall Listing Health: <span style={{ color: scoreColor(mockAnalysis.overallScore) }}>{scoreLabel(mockAnalysis.overallScore)}</span></h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                Your listing has room for improvement. The biggest opportunities are in your Description and Bullet Points. Addressing these could increase your conversion rate by an estimated 15–25%.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-accent">Optimize Now with Listing Builder</button>
                <button className="btn-ghost">Download Report PDF</button>
              </div>
            </div>
          </div>

          {/* Section Scores */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16, marginBottom: 24 }}>
            {sections.map(s => (
              <div key={s.key} className="stat-card" style={{ textAlign: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${scoreColor(s.score)}18`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <s.icon size={20} color={scoreColor(s.score)} />
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: scoreColor(s.score) }}>{s.score}</div>
                <div style={{ fontSize: 12, color: scoreColor(s.score), marginTop: 4 }}>{scoreLabel(s.score)}</div>
              </div>
            ))}
          </div>

          {/* Detailed Issues */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 20 }}>Detailed Recommendations</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {sections.map(s => {
                const data = mockAnalysis[s.key as keyof typeof mockAnalysis] as { score: number; issues: string[] };
                return (
                  <div key={s.key} style={{ padding: "16px 20px", borderRadius: 12, background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <s.icon size={16} color={scoreColor(data.score)} />
                        <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>{s.label}</span>
                      </div>
                      <span className={`badge ${data.score >= 80 ? "badge-success" : data.score >= 65 ? "badge-warning" : "badge-danger"}`}>{data.score}/100</span>
                    </div>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                      {data.issues.map((issue, i) => (
                        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                          <span style={{ color: "var(--warning)", flexShrink: 0, marginTop: 1 }}>⚠</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
