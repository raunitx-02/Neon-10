"use client";
const products = [
  { asin: "B08XYZ1234", name: "Premium Bamboo Cutting Board", sku: "BBTB-001", stock: 384, velocity: 62, daysLeft: 6, reorderQty: 500, leadTime: 21, status: "Healthy" },
  { asin: "B09ABC5678", name: "Stainless Steel Water Bottle", sku: "SSWB-032", stock: 91, velocity: 78, daysLeft: 1, reorderQty: 800, leadTime: 28, status: "Critical" },
  { asin: "B07DEF9012", name: "Silicone Kitchen Utensil Set", sku: "SKUS-007", stock: 214, velocity: 37, daysLeft: 6, reorderQty: 400, leadTime: 18, status: "Low" },
  { asin: "B0AGHI012", name: "Yoga Mat Non-Slip Extra Thick", sku: "YMNST-12", stock: 512, velocity: 33, daysLeft: 15, reorderQty: 300, leadTime: 35, status: "Healthy" },
  { asin: "B0CJKL345", name: "LED Desk Lamp with USB Charging", sku: "LDLU-045", stock: 23, velocity: 41, daysLeft: 1, reorderQty: 600, leadTime: 30, status: "Critical" },
  { asin: "B08MNO678", name: "Organic Shea Butter Body Lotion", sku: "OSBL-008", stock: 189, velocity: 28, daysLeft: 7, reorderQty: 350, leadTime: 14, status: "Low" },
  { asin: "B0DPQR901", name: "Ceramic Succulent Planter Set", sku: "CSPS-099", stock: 67, velocity: 19, daysLeft: 4, reorderQty: 200, leadTime: 45, status: "Low" },
];

const statusStyle: Record<string, { badge: string; barColor: string }> = {
  Healthy: { badge: "badge-success", barColor: "var(--success)" },
  Low: { badge: "badge-warning", barColor: "var(--warning)" },
  Critical: { badge: "badge-danger", barColor: "var(--danger)" },
};

export default function InventoryPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory Management</h1>
          <p className="page-subtitle">Track stock levels, forecast reorder points, and prevent costly stockouts</p>
        </div>
        <button className="btn-accent">+ Reorder All Critical</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total SKUs", value: products.length, color: "var(--text-secondary)" },
          { label: "Healthy Stock", value: products.filter(p => p.status === "Healthy").length, color: "var(--success)" },
          { label: "Low Stock", value: products.filter(p => p.status === "Low").length, color: "var(--warning)" },
          { label: "Critical (< 2 days)", value: products.filter(p => p.status === "Critical").length, color: "var(--danger)" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <p style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{s.label}</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>PRODUCT</th><th>SKU</th><th>IN STOCK</th><th>DAILY VELOCITY</th>
                <th>DAYS REMAINING</th><th>REORDER QTY</th><th>LEAD TIME</th><th>STATUS</th><th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.asin}>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>{p.asin}</div>
                    </div>
                  </td>
                  <td style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-muted)" }}>{p.sku}</td>
                  <td style={{ fontWeight: 700, color: "var(--text-primary)" }}>{p.stock.toLocaleString()}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{p.velocity} units/day</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="progress-bar" style={{ width: 60 }}>
                        <div className="progress-bar-fill" style={{
                          width: `${Math.min((p.daysLeft / 30) * 100, 100)}%`,
                          background: statusStyle[p.status].barColor,
                        }} />
                      </div>
                      <span style={{ fontWeight: 700, color: statusStyle[p.status].barColor }}>{p.daysLeft}d</span>
                    </div>
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>{p.reorderQty.toLocaleString()} units</td>
                  <td style={{ color: "var(--text-secondary)" }}>{p.leadTime} days</td>
                  <td><span className={`badge ${statusStyle[p.status].badge}`}>{p.status}</span></td>
                  <td>
                    <button className="btn-ghost" style={{ fontSize: 12, padding: "6px 12px" }}>Reorder</button>
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
