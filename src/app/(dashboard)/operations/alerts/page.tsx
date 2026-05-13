"use client";
import { useState } from "react";
import { Bell, AlertTriangle, ShieldAlert, CheckCircle, X } from "lucide-react";

type Alert = { id: number; type: string; asin: string; product: string; message: string; time: string; status: "Critical" | "Warning" | "Resolved"; read: boolean };

const initialAlerts: Alert[] = [
  { id: 1, type: "Hijacker", asin: "B08XYZ1234", product: "Premium Bamboo Cutting Board", message: "A new seller 'FastShip_Store' has listed on your product. Check the buy box immediately.", time: "2 min ago", status: "Critical", read: false },
  { id: 2, type: "Title Change", asin: "B09ABC5678", product: "Stainless Steel Water Bottle", message: "Your listing title was modified by Amazon. Original title has been restored from your template.", time: "47 min ago", status: "Warning", read: false },
  { id: 3, type: "Buy Box Lost", asin: "B08XYZ1234", product: "Premium Bamboo Cutting Board", message: "You have lost the Buy Box to seller 'GreenDeals_UK'. Current win rate: 62%.", time: "1 hr ago", status: "Critical", read: false },
  { id: 4, type: "Listing Suppressed", asin: "B07DEF9012", product: "Silicone Kitchen Utensil Set", message: "Your listing has been suppressed due to a missing main image. Upload a compliant image.", time: "3 hrs ago", status: "Critical", read: false },
  { id: 5, type: "Review Alert", asin: "B09ABC5678", product: "Stainless Steel Water Bottle", message: "New 1-star review received. Review: 'Product was damaged on arrival.'", time: "5 hrs ago", status: "Warning", read: false },
  { id: 6, type: "Price Drop", asin: "B0AGHI012", product: "Yoga Mat Non-Slip", message: "A competitor dropped their price by 22% to $28.99. You may be losing traffic.", time: "8 hrs ago", status: "Warning", read: true },
  { id: 7, type: "Buy Box Won", asin: "B07DEF9012", product: "Silicone Kitchen Utensil Set", message: "Congratulations! You've regained the Buy Box. Current win rate: 98%.", time: "12 hrs ago", status: "Resolved", read: true },
  { id: 8, type: "Image Change", asin: "B0CJKL345", product: "LED Desk Lamp with USB", message: "Your main product image was changed to a non-compliant version. Reverting now.", time: "1 day ago", status: "Warning", read: true },
  { id: 9, type: "Keyword Rank Drop", asin: "B08XYZ1234", product: "Premium Bamboo Cutting Board", message: "Ranking dropped from #4 to #18 for keyword 'bamboo cutting board'. Review PPC.", time: "1 day ago", status: "Warning", read: true },
  { id: 10, type: "Inventory Low", asin: "B0CJKL345", product: "LED Desk Lamp with USB", message: "Only 23 units remaining. At current sales velocity, you will run out in 6 days.", time: "2 days ago", status: "Warning", read: true },
  { id: 11, type: "Category Change", asin: "B09ABC5678", product: "Stainless Steel Water Bottle", message: "Your product category was changed from 'Sports' to 'Kitchen'. This may affect BSR.", time: "2 days ago", status: "Resolved", read: true },
];

const statusColors: Record<string, string> = { Critical: "badge-danger", Warning: "badge-warning", Resolved: "badge-success" };
const typeIcons: Record<string, React.ReactNode> = {
  "Hijacker": <ShieldAlert size={16} color="var(--danger)" />,
  "Title Change": <AlertTriangle size={16} color="var(--warning)" />,
  "Buy Box Lost": <ShieldAlert size={16} color="var(--danger)" />,
  "Listing Suppressed": <X size={16} color="var(--danger)" />,
  "Review Alert": <Bell size={16} color="var(--warning)" />,
  "Price Drop": <AlertTriangle size={16} color="var(--warning)" />,
  "Buy Box Won": <CheckCircle size={16} color="var(--success)" />,
  "Image Change": <AlertTriangle size={16} color="var(--warning)" />,
  "Keyword Rank Drop": <AlertTriangle size={16} color="var(--warning)" />,
  "Inventory Low": <AlertTriangle size={16} color="var(--warning)" />,
  "Category Change": <CheckCircle size={16} color="var(--success)" />,
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState<"All" | "Critical" | "Warning" | "Resolved">("All");

  const markAllRead = () => setAlerts(alerts.map(a => ({ ...a, read: true })));
  const dismiss = (id: number) => setAlerts(alerts.filter(a => a.id !== id));

  const filtered = filter === "All" ? alerts : alerts.filter(a => a.status === filter);
  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Alerts</h1>
          <p className="page-subtitle">Real-time monitoring for listing hijackers, suppressed listings, and buy box changes</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {unreadCount > 0 && <button className="btn-ghost" onClick={markAllRead}>Mark All Read ({unreadCount})</button>}
          <button className="btn-accent" style={{ display: "flex", alignItems: "center", gap: 8 }}><Bell size={15} />Configure Alerts</button>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Alerts", value: alerts.length, color: "var(--text-secondary)" },
          { label: "Critical", value: alerts.filter(a => a.status === "Critical").length, color: "var(--danger)" },
          { label: "Warnings", value: alerts.filter(a => a.status === "Warning").length, color: "var(--warning)" },
          { label: "Resolved", value: alerts.filter(a => a.status === "Resolved").length, color: "var(--success)" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <p style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{s.label}</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="tabs" style={{ marginBottom: 20, maxWidth: 400 }}>
        {(["All", "Critical", "Warning", "Resolved"] as const).map(f => (
          <button key={f} className={`tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(alert => (
            <div key={alert.id} style={{
              display: "flex", alignItems: "flex-start", gap: 16,
              padding: "16px 20px", borderRadius: 12,
              background: !alert.read ? "rgba(255,107,53,0.04)" : "rgba(0,0,0,0.15)",
              border: `1px solid ${!alert.read ? "var(--accent-muted)" : "var(--border)"}`,
              transition: "all 0.2s",
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {typeIcons[alert.type] || <Bell size={16} color="var(--text-secondary)" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>{alert.type}</span>
                  <span className={`badge ${statusColors[alert.status]}`} style={{ fontSize: 11 }}>{alert.status}</span>
                  {!alert.read && <span className="badge badge-accent" style={{ fontSize: 10 }}>NEW</span>}
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 6, lineHeight: 1.5 }}>{alert.message}</p>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-muted)" }}>{alert.asin}</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>·</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{alert.product}</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>·</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{alert.time}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                {alert.status !== "Resolved" && <button className="btn-ghost" style={{ fontSize: 12, padding: "6px 12px" }}>View</button>}
                <button onClick={() => dismiss(alert.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 6, borderRadius: 6 }}><X size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
