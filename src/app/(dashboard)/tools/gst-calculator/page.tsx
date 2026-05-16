"use client";

import { useState } from "react";
import { Calculator, IndianRupee, Package, Globe, AlertTriangle, CheckCircle, Info, Download } from "lucide-react";

// ─── GST rate database (India) ───────────────────────────────────────────────
const GST_RATES: Record<string, { rate: number; hsn: string; category: string }> = {
  "Books & Printed Material":         { rate: 0,  hsn: "4901",  category: "Exempt" },
  "Fresh Vegetables":                 { rate: 0,  hsn: "0702",  category: "Exempt" },
  "Milk & Dairy":                     { rate: 0,  hsn: "0401",  category: "Exempt" },
  "Sugar & Jaggery":                  { rate: 5,  hsn: "1701",  category: "Food" },
  "Packaged Food & Snacks":           { rate: 5,  hsn: "2106",  category: "Food" },
  "Tea, Coffee & Spices":             { rate: 5,  hsn: "0902",  category: "Food" },
  "Footwear (under ₹1000)":           { rate: 5,  hsn: "6403",  category: "Apparel" },
  "Medicines & Pharma":               { rate: 5,  hsn: "3004",  category: "Health" },
  "Medical Devices (basic)":          { rate: 5,  hsn: "9018",  category: "Health" },
  "Clothing & Apparel (under ₹1000)": { rate: 5,  hsn: "6109",  category: "Apparel" },
  "Handloom & Khadi":                 { rate: 5,  hsn: "6301",  category: "Apparel" },
  "Solar Energy Equipment":           { rate: 5,  hsn: "8541",  category: "Electronics" },
  "Agri Tools & Equipment":           { rate: 5,  hsn: "8432",  category: "Tools" },
  "Ayurvedic Products":               { rate: 12, hsn: "3003",  category: "Health" },
  "Clothing & Apparel (over ₹1000)":  { rate: 12, hsn: "6109",  category: "Apparel" },
  "Footwear (over ₹1000)":            { rate: 12, hsn: "6403",  category: "Apparel" },
  "Mobile Phones":                    { rate: 12, hsn: "8517",  category: "Electronics" },
  "Computers & Laptops":              { rate: 12, hsn: "8471",  category: "Electronics" },
  "Processed Foods":                  { rate: 12, hsn: "2001",  category: "Food" },
  "Non-AC Hotels":                    { rate: 12, hsn: "9963",  category: "Services" },
  "Furniture":                        { rate: 18, hsn: "9403",  category: "Home" },
  "Kitchen Appliances":               { rate: 18, hsn: "8516",  category: "Home" },
  "Sports Equipment":                 { rate: 18, hsn: "9506",  category: "Sports" },
  "Stationery & Office":              { rate: 18, hsn: "4820",  category: "Office" },
  "Soaps & Detergents":               { rate: 18, hsn: "3401",  category: "Personal Care" },
  "Beauty & Personal Care":           { rate: 18, hsn: "3304",  category: "Personal Care" },
  "Electronics Accessories":          { rate: 18, hsn: "8544",  category: "Electronics" },
  "Toys & Games":                     { rate: 18, hsn: "9503",  category: "Toys" },
  "Cameras & Optical":                { rate: 18, hsn: "9006",  category: "Electronics" },
  "Power Tools":                      { rate: 18, hsn: "8467",  category: "Tools" },
  "Automobiles & Parts":              { rate: 28, hsn: "8703",  category: "Auto" },
  "Luxury Watches":                   { rate: 28, hsn: "9101",  category: "Luxury" },
  "Air Conditioners":                 { rate: 28, hsn: "8415",  category: "Electronics" },
  "Tobacco Products":                 { rate: 28, hsn: "2402",  category: "Tobacco" },
  "Aerated Drinks":                   { rate: 28, hsn: "2202",  category: "Food" },
  "Cement":                           { rate: 28, hsn: "2523",  category: "Construction" },
};

// ─── Import BCD rates by origin ─────────────────────────────────────────────
const BCD_RATES: Record<string, { china: number; usa: number; eu: number; asean: number }> = {
  "Electronics":     { china: 20, usa: 10, eu: 7.5, asean: 0 },
  "Clothing":        { china: 20, usa: 20, eu: 12,  asean: 5 },
  "Toys":            { china: 20, usa: 10, eu: 10,  asean: 0 },
  "Footwear":        { china: 25, usa: 20, eu: 10,  asean: 5 },
  "Furniture":       { china: 25, usa: 25, eu: 20,  asean: 0 },
  "Sporting Goods":  { china: 10, usa: 10, eu: 10,  asean: 0 },
  "Food Products":   { china: 30, usa: 30, eu: 25,  asean: 0 },
  "Auto Parts":      { china: 15, usa: 15, eu: 7.5, asean: 0 },
  "General":         { china: 10, usa: 7.5, eu: 7.5, asean: 0 },
};

interface CalcInputs {
  productCategory: string;
  sellingPrice: number;
  cogs: number;
  fobValue: number;
  freightCIF: number;
  originCountry: "china" | "usa" | "eu" | "asean" | "domestic";
  isDomestic: boolean;
  supplierGSTIN: boolean;
  referralFeeRate: number;
  adSpend: number;
  fbaFee: number;
}

interface CalcResult {
  gstRate: number;
  gstOutput: number;
  gstInput: number;
  netGSTPay: number;
  bcdRate: number;
  bcdAmount: number;
  igstOnImport: number;
  landedCost: number;
  referralFee: number;
  effectiveMargin: number;
  netProfit: number;
  unitEconomics: {
    revenue: number;
    gstCollected: number;
    cogs: number;
    landedCost: number;
    fbaFee: number;
    referralFee: number;
    adSpend: number;
    gstPayable: number;
    netProfit: number;
  };
}

function calculate(inp: CalcInputs): CalcResult {
  const gstInfo = GST_RATES[inp.productCategory];
  const gstRate = gstInfo?.rate || 18;
  
  // GST Output (collected from customer)
  const gstOutput = inp.sellingPrice * (gstRate / (100 + gstRate)); // GST inclusive
  const taxableValue = inp.sellingPrice - gstOutput;

  // GST Input credit (if supplier has GSTIN)
  const gstInput = inp.supplierGSTIN ? inp.cogs * (gstRate / 100) * 0.9 : 0;
  const netGSTPay = Math.max(0, gstOutput - gstInput);

  // Import duties (if not domestic)
  let bcdRate = 0, bcdAmount = 0, igstOnImport = 0, landedCost = inp.cogs;
  
  if (!inp.isDomestic && inp.fobValue > 0) {
    const cifValue = inp.fobValue + inp.freightCIF;
    const categoryForBCD = Object.keys(BCD_RATES).find(k => inp.productCategory.toLowerCase().includes(k.toLowerCase())) || "General";
    const bcdRates = BCD_RATES[categoryForBCD] || BCD_RATES["General"];
    bcdRate = bcdRates[inp.originCountry as keyof typeof bcdRates] || 10;
    bcdAmount = cifValue * (bcdRate / 100);
    const socialWelfareCharge = bcdAmount * 0.10; // 10% SWS on BCD
    const igstBase = cifValue + bcdAmount + socialWelfareCharge;
    igstOnImport = igstBase * (gstRate / 100);
    landedCost = cifValue + bcdAmount + socialWelfareCharge + igstOnImport;
  }

  const referralFee = inp.sellingPrice * (inp.referralFeeRate / 100);
  const totalCost = landedCost + inp.fbaFee + referralFee + inp.adSpend + netGSTPay;
  const netProfit = inp.sellingPrice - totalCost;
  const effectiveMargin = (netProfit / inp.sellingPrice) * 100;

  return {
    gstRate, gstOutput, gstInput, netGSTPay, bcdRate, bcdAmount,
    igstOnImport, landedCost, referralFee, effectiveMargin, netProfit,
    unitEconomics: {
      revenue: inp.sellingPrice,
      gstCollected: gstOutput,
      cogs: inp.cogs,
      landedCost,
      fbaFee: inp.fbaFee,
      referralFee,
      adSpend: inp.adSpend,
      gstPayable: netGSTPay,
      netProfit,
    },
  };
}

const fmt = (n: number) => `₹${Math.abs(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function GSTCalculatorPage() {
  const [inputs, setInputs] = useState<CalcInputs>({
    productCategory: "Beauty & Personal Care",
    sellingPrice: 999,
    cogs: 280,
    fobValue: 0,
    freightCIF: 0,
    originCountry: "domestic",
    isDomestic: true,
    supplierGSTIN: true,
    referralFeeRate: 10,
    adSpend: 80,
    fbaFee: 85,
  });

  const setInp = (key: keyof CalcInputs, val: any) => setInputs(p => ({ ...p, [key]: val }));

  const result = calculate(inputs);
  const gstInfo = GST_RATES[inputs.productCategory];

  const breakdown = [
    { label: "Selling Price (MRP)", value: inputs.sellingPrice, color: "var(--accent)", positive: true },
    { label: `GST Collected (${result.gstRate}%)`, value: -result.gstOutput, color: "var(--warning)", positive: false },
    { label: "Net Revenue", value: inputs.sellingPrice - result.gstOutput, color: "var(--text-primary)", positive: true },
    { label: inputs.isDomestic ? "COGS" : "Landed Cost (after BCD+IGST)", value: -(inputs.isDomestic ? inputs.cogs : result.landedCost), color: "var(--danger)", positive: false },
    { label: "FBA Fee", value: -inputs.fbaFee, color: "var(--danger)", positive: false },
    { label: `Amazon Referral (${inputs.referralFeeRate}%)`, value: -result.referralFee, color: "var(--danger)", positive: false },
    { label: "Ad Spend / Unit", value: -inputs.adSpend, color: "var(--warning)", positive: false },
    { label: "Net GST Payable", value: -result.netGSTPay, color: "var(--warning)", positive: false },
    { label: "Net Profit / Unit", value: result.netProfit, color: result.netProfit > 0 ? "var(--success)" : "var(--danger)", positive: result.netProfit > 0, bold: true },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">GST & Customs Duty Intelligence</h1>
          <p className="page-subtitle">True per-unit cost calculator with GST ITC, import BCD, IGST, and effective margin — India-exclusive</p>
        </div>
        <span style={{ background: "var(--success-muted)", color: "var(--success)", borderRadius: 50, padding: "6px 16px", fontSize: 13, fontWeight: 700 }}>
          India-Exclusive Module
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "start" }}>
        {/* ── Inputs ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Product & Pricing */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <Package size={16} color="var(--accent)" /> Product & Pricing
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <InputLabel>Product Category</InputLabel>
                <select className="input-field" value={inputs.productCategory} onChange={e => setInp("productCategory", e.target.value)}>
                  {Object.keys(GST_RATES).map(cat => (
                    <option key={cat} value={cat}>{cat} — {GST_RATES[cat].rate}% GST (HSN {GST_RATES[cat].hsn})</option>
                  ))}
                </select>
                {gstInfo && (
                  <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ background: gstInfo.rate === 0 ? "var(--success-muted)" : gstInfo.rate <= 12 ? "var(--blue-muted)" : gstInfo.rate === 18 ? "var(--warning-muted)" : "var(--danger-muted)", color: gstInfo.rate === 0 ? "var(--success)" : gstInfo.rate <= 12 ? "var(--blue)" : gstInfo.rate === 18 ? "var(--warning)" : "var(--danger)", borderRadius: 50, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>
                      GST: {gstInfo.rate}%
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>HSN: {gstInfo.hsn} · {gstInfo.category}</span>
                  </div>
                )}
              </div>
              <NumInput label="Selling Price (₹ MRP)" value={inputs.sellingPrice} onChange={v => setInp("sellingPrice", v)} />
              <NumInput label="COGS / Unit (₹)" value={inputs.cogs} onChange={v => setInp("cogs", v)} />
              <NumInput label="FBA Fee (₹)" value={inputs.fbaFee} onChange={v => setInp("fbaFee", v)} />
              <NumInput label="Amazon Referral Fee %" value={inputs.referralFeeRate} onChange={v => setInp("referralFeeRate", v)} step={0.5} />
              <NumInput label="Ad Spend per Unit (₹)" value={inputs.adSpend} onChange={v => setInp("adSpend", v)} />
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <label className="toggle">
                  <input type="checkbox" checked={inputs.supplierGSTIN} onChange={e => setInp("supplierGSTIN", e.target.checked)} />
                  <span className="toggle-slider" />
                </label>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Supplier has GSTIN</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Enables GST Input Tax Credit</div>
                </div>
              </div>
            </div>
          </div>

          {/* Import Duties */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
                <Globe size={16} color="var(--purple)" /> Import Duties (China/US/EU)
              </h3>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label className="toggle">
                  <input type="checkbox" checked={!inputs.isDomestic} onChange={e => setInp("isDomestic", !e.target.checked)} />
                  <span className="toggle-slider" />
                </label>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Imported Product</span>
              </label>
            </div>

            {!inputs.isDomestic && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <InputLabel>Origin Country</InputLabel>
                  <select className="input-field" value={inputs.originCountry} onChange={e => setInp("originCountry", e.target.value)}>
                    <option value="china">China 🇨🇳</option>
                    <option value="usa">USA 🇺🇸</option>
                    <option value="eu">EU 🇪🇺</option>
                    <option value="asean">ASEAN (Free Trade) 🌏</option>
                  </select>
                </div>
                <NumInput label="FOB Value (₹ / unit)" value={inputs.fobValue} onChange={v => setInp("fobValue", v)} />
                <NumInput label="Freight + Insurance + CIF (₹)" value={inputs.freightCIF} onChange={v => setInp("freightCIF", v)} />
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  <div style={{ background: "var(--warning-muted)", border: "1px solid var(--warning)", borderRadius: 10, padding: "10px 14px" }}>
                    <div style={{ fontSize: 12, color: "var(--warning)", fontWeight: 600 }}>BCD Rate: {result.bcdRate}%</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>+ 10% Social Welfare Charge on BCD</div>
                  </div>
                </div>
              </div>
            )}

            {inputs.isDomestic && (
              <div style={{ padding: "20px", background: "var(--success-muted)", borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle size={16} color="var(--success)" />
                <span style={{ fontSize: 13, color: "var(--success)", fontWeight: 600 }}>Domestic product — no import duties applicable</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Results ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Margin gauge */}
          <div className="glass-card" style={{ padding: 24, textAlign: "center" }}>
            <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Effective Net Margin</h3>
            <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
              <svg width="130" height="130" viewBox="0 0 130 130">
                <circle cx="65" cy="65" r="54" fill="none" stroke="var(--border)" strokeWidth="10" />
                <circle cx="65" cy="65" r="54" fill="none"
                  stroke={result.effectiveMargin > 20 ? "var(--success)" : result.effectiveMargin > 10 ? "var(--warning)" : "var(--danger)"}
                  strokeWidth="10"
                  strokeDasharray={`${Math.max(0, (result.effectiveMargin / 100) * 339)} 339`}
                  strokeLinecap="round" transform="rotate(-90 65 65)"
                  style={{ transition: "all 0.5s ease" }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 26, fontWeight: 900, color: result.effectiveMargin > 20 ? "var(--success)" : result.effectiveMargin > 10 ? "var(--warning)" : "var(--danger)" }}>
                  {result.effectiveMargin.toFixed(1)}%
                </span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>net margin</span>
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: result.netProfit > 0 ? "var(--success)" : "var(--danger)" }}>
              {result.netProfit > 0 ? `Profit: ${fmt(result.netProfit)}` : `Loss: ${fmt(result.netProfit)}`} / unit
            </div>
            {result.effectiveMargin < 15 && (
              <div style={{ marginTop: 12, background: "var(--warning-muted)", border: "1px solid var(--warning)", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "var(--warning)" }}>
                ⚠️ Margin below 15% — consider reducing ad spend or COGS
              </div>
            )}
          </div>

          {/* P&L Breakdown */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Calculator size={15} color="var(--accent)" /> Unit P&amp;L Breakdown
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {breakdown.map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: row.bold ? "10px 12px" : "7px 12px", borderRadius: 8, background: row.bold ? (result.netProfit > 0 ? "var(--success-muted)" : "var(--danger-muted)") : "transparent", border: row.bold ? `1px solid ${result.netProfit > 0 ? "rgba(52,199,89,0.3)" : "rgba(255,69,58,0.3)"}` : "none" }}>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: row.bold ? 700 : 400 }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: row.bold ? 800 : 600, color: row.color }}>
                    {row.value >= 0 ? "+" : "−"}{fmt(Math.abs(row.value))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* GST Summary */}
          {!inputs.isDomestic && (
            <div className="glass-card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, color: "var(--purple)" }}>Import Duty Breakdown</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { label: "BCD Rate", value: `${result.bcdRate}%` },
                  { label: "BCD Amount", value: fmt(result.bcdAmount) },
                  { label: "Social Welfare Charge (10% of BCD)", value: fmt(result.bcdAmount * 0.10) },
                  { label: "IGST on Import", value: fmt(result.igstOnImport) },
                  { label: "Total Landed Cost", value: fmt(result.landedCost), bold: true },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "5px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ color: "var(--text-muted)" }}>{r.label}</span>
                    <span style={{ fontWeight: r.bold ? 700 : 600, color: r.bold ? "var(--danger)" : "var(--text-primary)" }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Helper components ────────────────────────────────────────────────────────
function InputLabel({ children }: { children: React.ReactNode }) {
  return <label style={{ display: "block", fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{children}</label>;
}

function NumInput({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <div>
      <InputLabel>{label}</InputLabel>
      <input className="input-field" type="number" step={step} value={value} onChange={e => onChange(Number(e.target.value))} />
    </div>
  );
}
