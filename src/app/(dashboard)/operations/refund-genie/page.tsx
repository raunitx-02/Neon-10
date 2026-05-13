"use client";
import { RefreshCcw } from "lucide-react";

const cases = [
  { id: "FBA-2024-10841", type: "Lost Inventory", asin: "B08XYZ1234", units: 12, amtOwed: "$287.88", status: "Open", date: "May 1, 2025" },
  { id: "FBA-2024-10792", type: "Damaged Inventory", asin: "B09ABC5678", units: 6, amtOwed: "$149.94", status: "Submitted", date: "Apr 28, 2025" },
  { id: "FBA-2024-10654", type: "Lost Inbound Shipment", asin: "B07DEF9012", units: 24, amtOwed: "$719.76", status: "Reimbursed", date: "Apr 21, 2025" },
  { id: "FBA-2024-10512", type: "Customer Return Destroyed", asin: "B0AGHI012", units: 8, amtOwed: "$319.92", status: "Reimbursed", date: "Apr 15, 2025" },
  { id: "FBA-2024-10489", type: "Warehouse Damage", asin: "B0CJKL345", units: 15, amtOwed: "$689.85", status: "Submitted", date: "Apr 12, 2025" },
  { id: "FBA-2024-10341", type: "Lost Inventory", asin: "B08MNO678", units: 9, amtOwed: "$170.91", status: "Reimbursed", date: "Apr 5, 2025" },
  { id: "FBA-2024-10208", type: "Damaged Inventory", asin: "B0DPQR901", units: 3, amtOwed: "$83.97", status: "Open", date: "Mar 28, 2025" },
];

const statusStyle: Record<string, string> = {
  "Open": "badge-accent",
  "Submitted": "badge-blue",
  "Reimbursed": "badge-success",
};

export default function RefundGeniePage() {
  const total = cases.reduce((sum, c) => sum + parseFloat(c.amtOwed.replace("$", "").replace(",", "")), 0);
  const reimbursed = cases.filter(c => c.status === "Reimbursed").reduce((sum, c) => sum + parseFloat(c.amtOwed.replace("$", "").replace(",", "")), 0);
  const pending = cases.filter(c => c.status !== "Reimbursed").reduce((sum, c) => sum + parseFloat(c.amtOwed.replace("$", "").replace(",", "")), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Refund Genie</h1>
          <p className="page-subtitle">Automatically identify discrepancies and recover money Amazon owes you for lost or damaged inventory</p>
        </div>
        <button className="btn-accent" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <RefreshCcw size={15} />Run New Scan
        </button>
      </div>

      <div className="glass-card" style={{ padding: 24, marginBottom: 24, background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.15)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: "var(--text-primary)" }}>${total.toFixed(2)}</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Total Amazon Owes You</div>
          </div>
          <div style={{ textAlign: "center", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: "var(--success)" }}>${reimbursed.toFixed(2)}</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Reimbursed</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: "var(--warning)" }}>${pending.toFixed(2)}</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Pending Recovery</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Cases Found", value: cases.length, color: "var(--text-secondary)" },
          { label: "Open Cases", value: cases.filter(c => c.status === "Open").length, color: "var(--accent)" },
          { label: "Cases Submitted", value: cases.filter(c => c.status === "Submitted").length, color: "var(--blue)" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <p style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{s.label}</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 20 }}>Reimbursement Cases</h2>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>CASE ID</th><th>TYPE</th><th>ASIN</th><th>UNITS</th><th>AMOUNT OWED</th><th>DATE FOUND</th><th>STATUS</th><th></th>
              </tr>
            </thead>
            <tbody>
              {cases.map(c => (
                <tr key={c.id}>
                  <td style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-muted)" }}>{c.id}</td>
                  <td style={{ fontWeight: 500, color: "var(--text-secondary)" }}>{c.type}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-muted)" }}>{c.asin}</td>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{c.units}</td>
                  <td style={{ fontWeight: 800, color: "var(--success)" }}>{c.amtOwed}</td>
                  <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{c.date}</td>
                  <td><span className={`badge ${statusStyle[c.status]}`}>{c.status}</span></td>
                  <td>
                    {c.status === "Open" && <button className="btn-accent" style={{ fontSize: 12, padding: "6px 12px" }}>Submit Claim</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
