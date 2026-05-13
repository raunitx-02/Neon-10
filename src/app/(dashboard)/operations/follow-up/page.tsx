"use client";
import { useState } from "react";
import { Mail, Plus, Play, Pause, Eye, Trash2 } from "lucide-react";

const campaigns = [
  { id: 1, name: "Post-Purchase Thank You", trigger: "3 days after delivery", sent: 4821, opened: 2891, reviews: 312, status: "Active" },
  { id: 2, name: "Review Request — Happy Path", trigger: "5 days after delivery", sent: 3204, opened: 1923, reviews: 287, status: "Active" },
  { id: 3, name: "Re-engagement Sequence", trigger: "30 days after purchase", sent: 1842, opened: 891, reviews: 74, status: "Paused" },
  { id: 4, name: "Product Feedback Loop", trigger: "7 days after delivery", sent: 2341, opened: 1432, reviews: 198, status: "Active" },
  { id: 5, name: "Holiday Special Campaign", trigger: "Manually triggered", sent: 892, opened: 634, reviews: 41, status: "Paused" },
];

const templates = [
  { name: "Classic Thank You", type: "Thank You", opens: "47%" },
  { name: "Friendly Review Ask", type: "Review Request", opens: "39%" },
  { name: "Problem Solver", type: "Issue Resolution", opens: "52%" },
];

export default function FollowUpPage() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "templates" | "stats">("campaigns");
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Follow-Up Email Automation</h1>
          <p className="page-subtitle">Automate customer communication, review requests, and support at scale</p>
        </div>
        <button className="btn-accent" onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Plus size={15} />Create Campaign
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Emails Sent (30d)", value: "13,100", color: "var(--blue)" },
          { label: "Open Rate", value: "44.2%", color: "var(--success)" },
          { label: "Reviews Generated", value: "912", color: "var(--accent)" },
          { label: "Unsubscribes", value: "0.8%", color: "var(--danger)" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <p style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 20, maxWidth: 360 }}>
        {(["campaigns", "templates", "stats"] as const).map(t => (
          <button key={t} className={`tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)} style={{ textTransform: "capitalize" }}>{t}</button>
        ))}
      </div>

      {activeTab === "campaigns" && (
        <div className="glass-card" style={{ padding: 24 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>CAMPAIGN</th><th>TRIGGER</th><th>SENT</th><th>OPEN RATE</th><th>REVIEWS</th><th>STATUS</th><th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{c.name}</td>
                  <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{c.trigger}</td>
                  <td style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{c.sent.toLocaleString()}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="progress-bar" style={{ width: 60 }}>
                        <div className="progress-bar-fill" style={{ width: `${Math.round((c.opened / c.sent) * 100)}%`, background: "var(--blue)" }} />
                      </div>
                      <span style={{ fontSize: 13, color: "var(--blue)", fontWeight: 600 }}>{Math.round((c.opened / c.sent) * 100)}%</span>
                    </div>
                  </td>
                  <td style={{ color: "var(--accent)", fontWeight: 700 }}>{c.reviews}</td>
                  <td><span className={`badge ${c.status === "Active" ? "badge-success" : "badge-warning"}`}>{c.status}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 4 }}><Eye size={14} /></button>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 4 }}>
                        {c.status === "Active" ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)", display: "flex", padding: 4 }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "templates" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {templates.map(t => (
            <div key={t.name} className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span className="badge badge-blue">{t.type}</span>
                <span style={{ fontSize: 12, color: "var(--success)", fontWeight: 700 }}>Avg Open: {t.opens}</span>
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 12 }}>{t.name}</h3>
              <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: 16, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 16 }}>
                <strong style={{ color: "var(--text-secondary)" }}>Subject:</strong> Thank you for your order! 🎉<br />
                <strong style={{ color: "var(--text-secondary)" }}>Preview:</strong> Hi [First Name], we noticed you received your order recently...
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-accent" style={{ flex: 1, fontSize: 13 }}>Use Template</button>
                <button className="btn-ghost" style={{ fontSize: 13 }}>Preview</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "stats" && (
        <div className="glass-card" style={{ padding: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 20 }}>Email Performance Overview</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Detailed analytics chart would be rendered here with Recharts — showing daily sends, opens, and clicks over time.</p>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(8px)" }}>
          <div className="glass-card" style={{ padding: 32, width: 480, maxWidth: "90vw" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontWeight: 800, fontSize: 20, color: "var(--text-primary)" }}>Create Campaign</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><Eye size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>Campaign Name</label><input className="input-field" placeholder="e.g. Post-Purchase Thank You" /></div>
              <div><label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>Trigger</label><select className="input-field"><option>3 days after delivery</option><option>5 days after delivery</option><option>7 days after delivery</option><option>Immediately after order</option></select></div>
              <div><label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>Product</label><select className="input-field"><option>All Products</option><option>Premium Bamboo Cutting Board</option><option>Stainless Steel Water Bottle</option></select></div>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button className="btn-accent" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Create Campaign</button>
                <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
