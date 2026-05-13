"use client";
import { useState } from "react";
import { FlaskConical, Copy, Download } from "lucide-react";

const sampleInput = `bamboo cutting board
cutting board bamboo
bamboo board for cutting
bamboo cutting boards
bamboo kitchen cutting board
large bamboo cutting board
bamboo board kitchen
bamboo chopping board
chopping board bamboo
bamboo kitchen board
kitchen bamboo board
bamboo wood cutting board
bamboo cutting board large
cutting boards bamboo
bamboo boards cutting
eco cutting board
eco-friendly cutting board
eco friendly cutting board
sustainable cutting board
green cutting board`;

export default function FrankensteinPage() {
  const [input, setInput] = useState(sampleInput);
  const [output, setOutput] = useState<string[]>([]);
  const [processed, setProcessed] = useState(false);
  const [options, setOptions] = useState({ lowercase: true, removeDups: true, sortByFreq: true, removeStopWords: false, oneWordPerLine: false });

  const processKeywords = () => {
    let keywords = input.split("\n").map(k => k.trim()).filter(Boolean);
    if (options.lowercase) keywords = keywords.map(k => k.toLowerCase());
    if (options.removeDups) {
      const wordFreq: Record<string, number> = {};
      keywords.forEach(phrase => {
        phrase.split(" ").forEach(word => { wordFreq[word] = (wordFreq[word] || 0) + 1; });
      });
      const unique = Array.from(new Set(keywords));
      if (options.sortByFreq) {
        unique.sort((a, b) => {
          const freqA = a.split(" ").reduce((sum, w) => sum + (wordFreq[w] || 0), 0);
          const freqB = b.split(" ").reduce((sum, w) => sum + (wordFreq[w] || 0), 0);
          return freqB - freqA;
        });
      }
      keywords = unique;
    }
    if (options.oneWordPerLine) {
      const allWords = keywords.flatMap(k => k.split(" "));
      keywords = Array.from(new Set(allWords));
    }
    setOutput(keywords);
    setProcessed(true);
  };

  const wordFreq: Record<string, number> = {};
  input.split("\n").forEach(phrase => {
    phrase.trim().split(" ").forEach(word => {
      if (word) wordFreq[word.toLowerCase()] = (wordFreq[word.toLowerCase()] || 0) + 1;
    });
  });
  const topWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Frankenstein</h1>
          <p className="page-subtitle">Keyword processor — clean, deduplicate, and organize large keyword lists</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        {/* Input */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>Keyword Input</h2>
              <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 2 }}>{input.split("\n").filter(Boolean).length} phrases entered</p>
            </div>
            <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setInput("")}>Clear</button>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="input-field"
            placeholder="Paste your keywords here (one per line)..."
            style={{ minHeight: 300, resize: "vertical", fontFamily: "monospace", fontSize: 13, lineHeight: 1.7 }}
          />
        </div>

        {/* Output */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>Processed Output</h2>
              <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 2 }}>{processed ? `${output.length} unique phrases` : "Run to see results"}</p>
            </div>
            {processed && (
              <button className="btn-ghost" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <Copy size={13} /> Copy All
              </button>
            )}
          </div>
          <div style={{
            minHeight: 300,
            background: "rgba(0,0,0,0.2)",
            borderRadius: 10,
            border: "1px solid var(--border)",
            padding: 16,
            fontFamily: "monospace",
            fontSize: 13,
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            overflowY: "auto",
            maxHeight: 340,
          }}>
            {processed ? output.map((kw, i) => (
              <div key={i} style={{ padding: "2px 0", color: i < 5 ? "var(--accent)" : "var(--text-secondary)" }}>{kw}</div>
            )) : <span style={{ color: "var(--text-muted)" }}>Processed keywords will appear here...</span>}
          </div>
        </div>
      </div>

      {/* Options + Run */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 16 }}>Processing Options</h2>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 20 }}>
          {[
            { key: "lowercase", label: "Convert to Lowercase" },
            { key: "removeDups", label: "Remove Duplicates" },
            { key: "sortByFreq", label: "Sort by Word Frequency" },
            { key: "removeStopWords", label: "Remove Stop Words" },
            { key: "oneWordPerLine", label: "One Word Per Line" },
          ].map(opt => (
            <label key={opt.key} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <label className="toggle">
                <input type="checkbox" checked={options[opt.key as keyof typeof options]} onChange={e => setOptions({ ...options, [opt.key]: e.target.checked })} />
                <span className="toggle-slider" />
              </label>
              <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{opt.label}</span>
            </label>
          ))}
        </div>
        <button className="btn-accent" onClick={processKeywords} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FlaskConical size={15} /> Process Keywords
        </button>
      </div>

      {/* Word frequency analysis */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 16 }}>Top Word Frequency</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
          {topWords.map(([word, count]) => (
            <div key={word} style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "12px 16px", textAlign: "center", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "var(--accent)" }}>{count}×</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{word}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
