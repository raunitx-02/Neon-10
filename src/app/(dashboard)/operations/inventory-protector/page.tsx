"use client";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";

const initProducts = [
  { asin: "B08XYZ1234", name: "Premium Bamboo Cutting Board", maxQty: 2, enabled: true },
  { asin: "B09ABC5678", name: "Stainless Steel Water Bottle", maxQty: 3, enabled: true },
  { asin: "B07DEF9012", name: "Silicone Kitchen Utensil Set", maxQty: 1, enabled: false },
  { asin: "B0AGHI012", name: "Yoga Mat Non-Slip Extra Thick", maxQty: 2, enabled: true },
  { asin: "B0CJKL345", name: "LED Desk Lamp with USB Charging", maxQty: 5, enabled: false },
];

export default function InventoryProtectorPage() {
  const [products, setProducts] = useState(initProducts);

  const toggle = (asin: string) => setProducts(products.map(p => p.asin === asin ? { ...p, enabled: !p.enabled } : p));
  const updateQty = (asin: string, val: number) => setProducts(products.map(p => p.asin === asin ? { ...p, maxQty: val } : p));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory Protector</h1>
          <p className="page-subtitle">Set maximum order quantities to prevent coupon stacking and inventory attacks during promotions</p>
        </div>
        <button className="btn-accent" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ShieldCheck size={15} />Save All Settings
        </button>
      </div>

      <div className="glass-card" style={{ padding: 24, marginBottom: 24, background: "rgba(255,107,53,0.04)", border: "1px solid var(--accent-muted)" }}>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          🛡️ <strong style={{ color: "var(--accent)" }}>What is Inventory Protector?</strong> When you run a promotion (like a coupon or lightning deal), bad actors can buy out your entire stock at a heavy discount. By setting a max order quantity per customer, you prevent this. Amazon allows per-customer limits to be set without visibility to the buyer.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {products.map(p => (
          <div key={p.asin} className="glass-card" style={{ padding: 24, display: "flex", alignItems: "center", gap: 24, justifyContent: "space-between" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-muted)" }}>{p.asin}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Max qty per customer:</span>
              <input
                type="number"
                min={1}
                max={99}
                value={p.maxQty}
                onChange={e => updateQty(p.asin, parseInt(e.target.value) || 1)}
                className="input-field"
                style={{ width: 80, textAlign: "center", fontWeight: 700, fontSize: 16, opacity: p.enabled ? 1 : 0.4 }}
                disabled={!p.enabled}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span className={`badge ${p.enabled ? "badge-success" : "badge-danger"}`}>{p.enabled ? "Protected" : "Unprotected"}</span>
              <label className="toggle">
                <input type="checkbox" checked={p.enabled} onChange={() => toggle(p.asin)} />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
