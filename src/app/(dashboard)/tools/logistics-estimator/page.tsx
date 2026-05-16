"use client";

import { useState } from "react";
import { Truck, Package, MapPin, IndianRupee, Calculator, Info, AlertTriangle } from "lucide-react";

// ─── Courier rate tables (from proposal) ─────────────────────────────────────
const COURIERS = {
  Delhivery: {
    zones: {
      "A-B": { base: 40, per500g: 40 },
      "C-D": { base: 57, per500g: 57 },
      "E":   { base: 70, per500g: 70 },
    },
    codCharge: 0.0175,  // 1.75%
    codFixed: 25,
    minCOD: 25,
    coverage: "18,000+ pincodes",
    color: "#e74c3c",
    transitDays: { "A-B": "1-2", "C-D": "2-3", "E": "3-5" },
  },
  BlueDart: {
    zones: {
      "A-B": { base: 75, per500g: 75 },
      "C-D": { base: 110, per500g: 110 },
      "E":   { base: 140, per500g: 140 },
    },
    codCharge: 0.015,
    codFixed: 30,
    minCOD: 30,
    coverage: "35,000+ pincodes",
    color: "#1a5276",
    transitDays: { "A-B": "1-2", "C-D": "2-3", "E": "3-4" },
  },
  "Ecom Express": {
    zones: {
      "A-B": { base: 35, per500g: 35 },
      "C-D": { base: 52, per500g: 52 },
      "E":   { base: 70, per500g: 70 },
    },
    codCharge: 0.02,
    codFixed: 20,
    minCOD: 20,
    coverage: "27,000+ pincodes",
    color: "#8e44ad",
    transitDays: { "A-B": "1-3", "C-D": "2-4", "E": "4-6" },
  },
  "Amazon Shipping": {
    zones: {
      "A-B": { base: 32, per500g: 32 },
      "C-D": { base: 48, per500g: 48 },
      "E":   { base: 60, per500g: 60 },
    },
    codCharge: 0.015,
    codFixed: 20,
    minCOD: 20,
    coverage: "25,000+ pincodes",
    color: "#ff9500",
    transitDays: { "A-B": "1-2", "C-D": "2-3", "E": "3-5" },
  },
};

// ─── City → Zone mapping ──────────────────────────────────────────────────────
const CITY_ZONES: Record<string, "A-B" | "C-D" | "E"> = {
  // Metro (Zone A-B)
  "Delhi": "A-B", "Mumbai": "A-B", "Bangalore": "A-B", "Chennai": "A-B",
  "Kolkata": "A-B", "Hyderabad": "A-B", "Pune": "A-B", "Ahmedabad": "A-B",
  "Gurgaon": "A-B", "Noida": "A-B", "Navi Mumbai": "A-B", "Thane": "A-B",
  // Tier 2 (Zone C-D)
  "Jaipur": "C-D", "Lucknow": "C-D", "Chandigarh": "C-D", "Surat": "C-D",
  "Nagpur": "C-D", "Indore": "C-D", "Bhopal": "C-D", "Patna": "C-D",
  "Kochi": "C-D", "Vadodara": "C-D", "Coimbatore": "C-D", "Visakhapatnam": "C-D",
  "Amritsar": "C-D", "Agra": "C-D", "Nashik": "C-D", "Rajkot": "C-D",
  // Tier 3 / Remote (Zone E)
  "Shimla": "E", "Dehradun": "E", "Ranchi": "E", "Guwahati": "E",
  "Bhubaneswar": "E", "Thiruvananthapuram": "E", "Varanasi": "E",
  "Jodhpur": "E", "Udaipur": "E", "Siliguri": "E", "Raipur": "E",
};

const CITIES = Object.keys(CITY_ZONES).sort();

type Zone = "A-B" | "C-D" | "E";

interface CalcResult {
  courier: string;
  zone: Zone;
  shippingCost: number;
  codCost: number;
  totalCost: number;
  margin: number;
  marginPct: number;
  recommendedCourier: boolean;
  transitDays: string;
  coverage: string;
}

function calcShipping(
  courierName: string,
  zone: Zone,
  weightKg: number,
  sellingPrice: number,
  isCOD: boolean,
  cogs: number,
  amazonFeesPct: number,
): CalcResult {
  const courier = COURIERS[courierName as keyof typeof COURIERS];
  const zoneRates = courier.zones[zone];

  // Weight in 500g slabs
  const slabs = Math.ceil(weightKg / 0.5);
  const shippingCost = slabs * zoneRates.per500g;

  // COD charge
  const codCost = isCOD
    ? Math.max(courier.minCOD, sellingPrice * courier.codCharge + courier.codFixed)
    : 0;

  const amazonFees = sellingPrice * (amazonFeesPct / 100);
  const totalCost = shippingCost + codCost + cogs + amazonFees;
  const margin = sellingPrice - totalCost;
  const marginPct = (margin / sellingPrice) * 100;

  return {
    courier: courierName,
    zone,
    shippingCost,
    codCost,
    totalCost,
    margin,
    marginPct,
    recommendedCourier: false,
    transitDays: courier.transitDays[zone],
    coverage: courier.coverage,
  };
}

const fmt = (n: number) => `₹${Math.round(Math.abs(n)).toLocaleString("en-IN")}`;

export default function LogisticsEstimatorPage() {
  const [sellingPrice, setSellingPrice] = useState(599);
  const [cogs, setCogs] = useState(150);
  const [weightKg, setWeightKg] = useState(0.5);
  const [isCOD, setIsCOD] = useState(true);
  const [originCity, setOriginCity] = useState("Delhi");
  const [destCity, setDestCity] = useState("Jaipur");
  const [amazonFeesPct, setAmazonFeesPct] = useState(10);

  const destZone: Zone = CITY_ZONES[destCity] || "C-D";

  const results: CalcResult[] = Object.keys(COURIERS).map(name => {
    const r = calcShipping(name, destZone, weightKg, sellingPrice, isCOD, cogs, amazonFeesPct);
    return r;
  }).sort((a, b) => b.marginPct - a.marginPct);

  // Mark best
  if (results.length > 0) results[0].recommendedCourier = true;

  const cod65Pct = isCOD;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Hyper-Local Logistics Estimator</h1>
          <p className="page-subtitle">
            Zone-wise shipping cost comparison across India's top couriers — Delhivery, BlueDart, Ecom Express, Amazon Shipping
          </p>
        </div>
        <div style={{ background: "var(--purple-muted)", color: "var(--purple)", borderRadius: 50, padding: "6px 16px", fontSize: 13, fontWeight: 700 }}>
          India-Exclusive Module
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 24, alignItems: "start" }}>
        {/* ── Inputs ── */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <Package size={16} color="var(--accent)" /> Shipment Details
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Inp label="Selling Price (₹)" type="number" value={sellingPrice} onChange={v => setSellingPrice(Number(v))} />
            <Inp label="COGS / Unit (₹)" type="number" value={cogs} onChange={v => setCogs(Number(v))} />
            <Inp label="Weight (kg)" type="number" step="0.1" value={weightKg} onChange={v => setWeightKg(Number(v))} />
            <Inp label="Amazon Referral + Fees %" type="number" step="0.5" value={amazonFeesPct} onChange={v => setAmazonFeesPct(Number(v))} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Origin City
                </label>
                <select className="input-field" value={originCity} onChange={e => setOriginCity(e.target.value)}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Destination City
                </label>
                <select className="input-field" value={destCity} onChange={e => setDestCity(e.target.value)}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Zone badge */}
            <div style={{ background: "var(--accent-muted)", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <MapPin size={14} color="var(--accent)" />
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>
                  Zone {destZone} Route
                </span>
                <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 8 }}>
                  {originCity} → {destCity}
                </span>
              </div>
            </div>

            {/* COD toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "var(--bg-secondary)", borderRadius: 10, border: "1px solid var(--border)" }}>
              <label className="toggle">
                <input type="checkbox" checked={isCOD} onChange={e => setIsCOD(e.target.checked)} />
                <span className="toggle-slider" />
              </label>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Cash on Delivery (COD)</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>65%+ of Indian orders are COD</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Summary stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
            {[
              { label: "Best Margin", value: `${results[0]?.marginPct.toFixed(1)}%`, color: results[0]?.marginPct > 0 ? "var(--success)" : "var(--danger)" },
              { label: "Lowest Shipping", value: fmt(Math.min(...results.map(r => r.shippingCost))), color: "var(--accent)" },
              { label: "Zone", value: `Zone ${destZone}`, color: "var(--blue)" },
              { label: "Payment Mode", value: isCOD ? "COD" : "Prepaid", color: isCOD ? "var(--warning)" : "var(--success)" },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ padding: 16 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Courier comparison cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {results.map((r, i) => (
              <div key={r.courier} className="glass-card" style={{ padding: 20, border: r.recommendedCourier ? "2px solid var(--success)" : "1px solid var(--border)", position: "relative" }}>
                {r.recommendedCourier && (
                  <div style={{ position: "absolute", top: -1, right: 16, background: "var(--success)", color: "white", fontSize: 11, fontWeight: 700, padding: "2px 12px", borderRadius: "0 0 8px 8px" }}>
                    ✓ BEST MARGIN
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: "var(--text-primary)" }}>{r.courier}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{r.coverage} · {r.transitDays} days transit</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: r.marginPct > 0 ? "var(--success)" : "var(--danger)" }}>
                      {r.marginPct.toFixed(1)}%
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>net margin</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                  {[
                    { label: "Shipping", value: fmt(r.shippingCost) },
                    { label: "COD Fee", value: isCOD ? fmt(r.codCost) : "N/A (Prepaid)" },
                    { label: "Net Profit/Unit", value: r.margin > 0 ? `+${fmt(r.margin)}` : `-${fmt(r.margin)}` },
                    { label: "Total Cost", value: fmt(r.totalCost) },
                  ].map(item => (
                    <div key={item.label} style={{ background: "var(--bg-secondary)", borderRadius: 8, padding: "8px 12px" }}>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 3 }}>{item.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {isCOD && (
            <div style={{ background: "var(--warning-muted)", border: "1px solid var(--warning)", borderRadius: 12, padding: "12px 16px", display: "flex", gap: 10 }}>
              <Info size={15} color="var(--warning)" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 13, color: "var(--warning)" }}>
                <strong>COD Modelling Active:</strong> Over 65% of Amazon India orders are Cash on Delivery. COD surcharges significantly impact effective margin — a key factor absent from global tools like Helium 10.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Inp({ label, type = "text", value, onChange, step }: { label: string; type?: string; value: any; onChange: (v: string) => void; step?: string }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
      <input className="input-field" type={type} step={step} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}
