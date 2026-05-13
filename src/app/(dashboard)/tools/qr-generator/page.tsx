"use client";
import { useState, useRef } from "react";
import { QrCode, Download, Copy, Check } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

const presets = [
  { label: "Product Page", url: "https://www.amazon.com/dp/B08XYZ1234" },
  { label: "Search URL", url: "https://www.amazon.com/s?k=bamboo+cutting+board" },
  { label: "Brand Store", url: "https://www.amazon.com/stores/EcoHome" },
  { label: "Coupon Page", url: "https://www.amazon.com/dp/B08XYZ1234?th=1&psc=1" },
];

const fgColors = ["#FFFFFF", "var(--accent)", "var(--success)", "var(--blue)", "var(--purple)", "var(--warning)", "#000000"];
const bgColors = ["#000000", "#0b0e1a", "#1e293b", "#FFFFFF", "var(--text-primary)"];

export default function QRGeneratorPage() {
  const [url, setUrl] = useState("https://www.amazon.com/dp/B08XYZ1234");
  const [fgColor, setFgColor] = useState("#FFFFFF");
  const [bgColor, setBgColor] = useState("#000000");
  const [size, setSize] = useState(220);
  const [includeMargin, setIncludeMargin] = useState(true);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "neon10-qrcode.png";
    link.href = (canvas as HTMLCanvasElement).toDataURL("image/png");
    link.click();
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">QR Code Generator</h1>
          <p className="page-subtitle">Create branded QR codes for product packaging, inserts, and marketing materials</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
        {/* Settings Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* URL Input */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 16 }}>Target URL</h2>
            <input
              className="input-field"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://www.amazon.com/dp/YOUR_ASIN"
              style={{ marginBottom: 14 }}
            />
            <div>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>Quick Presets:</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {presets.map(p => (
                  <button
                    key={p.label}
                    className="btn-ghost"
                    style={{ fontSize: 12, padding: "6px 14px" }}
                    onClick={() => setUrl(p.url)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Styling */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 20 }}>Styling Options</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* FG Color */}
              <div>
                <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  QR Color
                </label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {fgColors.map(c => (
                    <button
                      key={c}
                      onClick={() => setFgColor(c)}
                      style={{
                        width: 32, height: 32, borderRadius: 8, background: c,
                        border: fgColor === c ? "3px solid var(--accent)" : "2px solid rgba(255,255,255,0.15)",
                        cursor: "pointer", transition: "all 0.2s",
                        boxShadow: fgColor === c ? "0 0 12px rgba(255,107,53,0.5)" : "none",
                      }}
                    />
                  ))}
                  <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)}
                    style={{ width: 32, height: 32, borderRadius: 8, border: "2px solid rgba(255,255,255,0.15)", cursor: "pointer", padding: 2, background: "transparent" }} />
                </div>
              </div>

              {/* BG Color */}
              <div>
                <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Background Color
                </label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {bgColors.map(c => (
                    <button
                      key={c}
                      onClick={() => setBgColor(c)}
                      style={{
                        width: 32, height: 32, borderRadius: 8, background: c,
                        border: bgColor === c ? "3px solid var(--accent)" : "2px solid rgba(255,255,255,0.15)",
                        cursor: "pointer", transition: "all 0.2s",
                        boxShadow: bgColor === c ? "0 0 12px rgba(255,107,53,0.5)" : "none",
                      }}
                    />
                  ))}
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                    style={{ width: 32, height: 32, borderRadius: 8, border: "2px solid rgba(255,255,255,0.15)", cursor: "pointer", padding: 2, background: "transparent" }} />
                </div>
              </div>

              {/* Size */}
              <div>
                <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Size — {size}px × {size}px
                </label>
                <input type="range" min={150} max={400} step={10} value={size} onChange={e => setSize(Number(e.target.value))} />
              </div>

              {/* Margin toggle */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>Include Quiet Zone (Margin)</span>
                <label className="toggle">
                  <input type="checkbox" checked={includeMargin} onChange={e => setIncludeMargin(e.target.checked)} />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>
          </div>

          {/* Use cases */}
          <div className="glass-card" style={{ padding: 24, background: "rgba(255,107,53,0.04)", border: "1px solid var(--accent-muted)" }}>
            <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--accent)", marginBottom: 12 }}>💡 Pro Use Cases</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "Product packaging insert → review request page",
                "Business card → Amazon Brand Store",
                "Email newsletter → lightning deal URL",
                "In-store display → product listing page",
              ].map((tip, i) => (
                <li key={i} style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ color: "var(--accent)", flexShrink: 0 }}>→</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* QR Preview Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="glass-card" style={{ padding: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", alignSelf: "flex-start" }}>Live Preview</h2>

            {/* QR Code Display */}
            <div
              ref={qrRef}
              style={{
                padding: 20,
                background: bgColor,
                borderRadius: 16,
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <QRCodeCanvas
                value={url || "https://neon10.com"}
                size={size}
                fgColor={fgColor}
                bgColor={bgColor}
                includeMargin={includeMargin}
              />
            </div>

            {/* URL Preview */}
            <div style={{
              width: "100%",
              background: "rgba(0,0,0,0.2)",
              borderRadius: 10,
              padding: "10px 14px",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              <QrCode size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              <span style={{
                fontSize: 11,
                color: "var(--text-muted)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
                fontFamily: "monospace",
              }}>
                {url || "https://neon10.com"}
              </span>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10, width: "100%" }}>
              <button
                className="btn-accent"
                onClick={downloadQR}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                <Download size={15} /> Download PNG
              </button>
              <button
                className="btn-ghost"
                onClick={copyUrl}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                {copied ? <Check size={15} color="var(--success)" /> : <Copy size={15} />}
                {copied ? "Copied!" : "Copy URL"}
              </button>
            </div>

            {/* Size info */}
            <div style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
            }}>
              {[
                { label: "Size", value: `${size}×${size}px` },
                { label: "Format", value: "PNG / Canvas" },
                { label: "Error Correction", value: "Level M" },
              ].map(info => (
                <div key={info.label} style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "10px 12px", textAlign: "center", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{info.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)" }}>{info.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
