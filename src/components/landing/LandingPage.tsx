"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Search, Cpu, FileText, TrendingUp, IndianRupee, Truck,
  Star, CheckCircle, ArrowRight, Menu, X, Zap, Globe,
  BarChart3, ShieldCheck, Sparkles, MessageCircle, Package
} from "lucide-react";

const FEATURES = [
  { icon: Package, title: "Black Box India", desc: "Real-time product discovery with BSR velocity, GST slab detection, and ₹ margin scoring for Amazon.in", badge: "M1" },
  { icon: Cpu, title: "Cerebro — Reverse ASIN", desc: "Paste competitor ASINs → get every keyword they rank for with Hinglish detection and CPR scoring", badge: "M1" },
  { icon: Search, title: "Magnet Keyword Aggregator", desc: "One seed keyword → 80+ related search terms with IQ score, CPC estimate, and competition level", badge: "M1" },
  { icon: Zap, title: "Xray Live Market", desc: "90-day price history, revenue landscape, competitor FBA fee and GST per product — all live", badge: "M1" },
  { icon: FileText, title: "Listing Optimizer", desc: "Frankenstein keyword extractor + Scribbles editor with real-time health score and keyword bank", badge: "M2" },
  { icon: IndianRupee, title: "GST & Customs Duty", desc: "True per-unit cost with BCD + Social Welfare Charge + IGST import chain + ITC calculation", badge: "M2" },
  { icon: Truck, title: "Logistics Estimator", desc: "Delhivery, BlueDart, Ecom Express comparison with zone mapping and COD surcharge modelling", badge: "M2" },
  { icon: ShieldCheck, title: "AI Seller Health Scanner", desc: "Paste storefront link → AI scans all listings, reviews, account health, competitor gaps", badge: "M3", soon: true },
  { icon: Globe, title: "Multi-Platform Intelligence", desc: "Amazon India, Flipkart, Meesho, ONDC — unified dashboard coming soon", badge: "M3", soon: true },
];

const PLANS = [
  {
    name: "Starter", price: "₹999", period: "/month", color: "var(--text-muted)",
    desc: "Perfect for new sellers starting their Amazon India journey",
    features: ["Black Box India", "Magnet Keywords (50 searches/mo)", "Listing Optimizer", "GST Calculator", "Logistics Estimator", "1 Marketplace (Amazon.in)"],
    cta: "Start Free Trial", highlight: false,
  },
  {
    name: "Growth", price: "₹2,499", period: "/month", color: "var(--accent)",
    desc: "For serious sellers scaling across Indian marketplaces",
    features: ["Everything in Starter", "Cerebro Reverse ASIN (unlimited)", "Xray Live Market", "Magnet (500 searches/mo)", "AI Seller Health Scanner", "Flipkart + Meesho Intelligence", "Keyword Tracker", "Priority Support"],
    cta: "Start Free Trial", highlight: true,
  },
  {
    name: "Diamond", price: "₹5,999", period: "/month", color: "var(--purple)",
    desc: "For agencies and power sellers dominating multiple categories",
    features: ["Everything in Growth", "Unlimited Searches", "ONDC Intelligence", "WhatsApp Commerce Analytics", "Multi-storefront AI Scanner", "AI Auto-Fix Listings (Hindi + English)", "Dedicated Account Manager", "API Access"],
    cta: "Contact Sales", highlight: false,
  },
];

const MARQUEE_ITEMS = [
  "Amazon India", "Flipkart", "Meesho", "ONDC", "WhatsApp Commerce",
  "Hinglish Keywords", "GST Intelligence", "COD Analytics", "BSR Velocity",
  "AI Growth Advisor", "Delhivery", "BlueDart", "Ecom Express",
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", overflowX: "hidden" }}>

      {/* ── Nav ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, borderBottom: "1px solid var(--border)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", background: "rgba(var(--bg-primary-rgb), 0.8)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "var(--accent)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px var(--accent-glow)" }}>
              <span style={{ color: "white", fontWeight: 900, fontSize: 18 }}>N</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>Neon 10</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: -2 }}>India's Seller Intelligence</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <button className="btn-ghost" style={{ fontSize: 14 }}>Log In</button>
            </Link>
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <button className="btn-accent" style={{ fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                Start Free <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ paddingTop: 140, paddingBottom: 100, textAlign: "center", maxWidth: 900, margin: "0 auto", padding: "140px 24px 100px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--accent-muted)", border: "1px solid var(--border-hover)", borderRadius: 50, padding: "6px 16px", fontSize: 13, color: "var(--accent)", fontWeight: 600, marginBottom: 24 }}>
          <Sparkles size={13} /> India's First Complete Seller Intelligence Platform
        </div>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 24 }}>
          India ka apna
          <br />
          <span style={{ background: "linear-gradient(135deg, var(--accent), var(--purple))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Helium 10
          </span>
          {" "}— par better
        </h1>
        <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: "var(--text-muted)", maxWidth: 640, margin: "0 auto 40px", lineHeight: 1.6 }}>
          Amazon India, Flipkart, Meesho aur ONDC sellers ke liye AI-powered product research, keyword intelligence, GST compliance, and growth advisor — sab ek jagah.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/dashboard" style={{ textDecoration: "none" }}>
            <button className="btn-accent" style={{ fontSize: 16, padding: "14px 32px", display: "flex", alignItems: "center", gap: 8, borderRadius: 14 }}>
              <Zap size={18} /> Free Trial Shuru Karo
            </button>
          </Link>
          <Link href="/dashboard" style={{ textDecoration: "none" }}>
            <button className="btn-ghost" style={{ fontSize: 16, padding: "14px 28px", borderRadius: 14 }}>
              Live Demo Dekho →
            </button>
          </Link>
        </div>
        <div style={{ marginTop: 40, display: "flex", alignItems: "center", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
          {[
            { icon: <Star size={14} fill="var(--warning)" color="var(--warning)" />, text: "4.9/5 rating" },
            { icon: <CheckCircle size={14} color="var(--success)" />, text: "Zero setup needed" },
            { icon: <ShieldCheck size={14} color="var(--blue)" />, text: "14-day free trial" },
          ].map(item => (
            <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)" }}>
              {item.icon} {item.text}
            </div>
          ))}
        </div>
      </section>

      {/* ── Marquee ── */}
      <div style={{ overflow: "hidden", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "14px 0", background: "var(--bg-secondary)", marginBottom: 80 }}>
        <div style={{ display: "flex", gap: 40, animation: "marquee 20s linear infinite", whiteSpace: "nowrap", width: "max-content" }}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "var(--accent)" }}>✦</span> {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── India-first badges ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto 80px", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { emoji: "🇮🇳", title: "Amazon India", desc: "Real-time Keepa data for .in marketplace" },
            { emoji: "🛍️", title: "Flipkart", desc: "Multi-marketplace seller intelligence" },
            { emoji: "🏪", title: "Meesho", desc: "Social commerce seller tools" },
            { emoji: "🌐", title: "ONDC", desc: "Open Network for Digital Commerce" },
            { emoji: "💬", title: "WhatsApp Commerce", desc: "D2C seller analytics" },
          ].map(item => (
            <div key={item.title} className="glass-card" style={{ padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{item.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto 100px", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 14 }}>
            Sab kuch ek platform mein
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-muted)", maxWidth: 560, margin: "0 auto" }}>
            India ke liye build kiya, India ke sellers ke liye — global tools se zyada powerful
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {FEATURES.map(f => (
            <div key={f.title} className="glass-card" style={{ padding: 24, position: "relative", opacity: f.soon ? 0.75 : 1 }}>
              {f.soon && (
                <span style={{ position: "absolute", top: 14, right: 14, background: "var(--warning-muted)", color: "var(--warning)", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 50 }}>COMING SOON</span>
              )}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--accent-muted)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <f.icon size={22} color="var(--accent)" />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{f.title}</span>
                    <span style={{ background: "var(--success-muted)", color: "var(--success)", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 50 }}>{f.badge}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "60px 24px", marginBottom: 100 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, textAlign: "center" }}>
          {[
            { value: "18,000+", label: "Pincodes covered", sub: "Across Delhivery, BlueDart, Ecom Express" },
            { value: "35+", label: "GST categories", sub: "With HSN codes + import duty chain" },
            { value: "80+", label: "Keywords per seed", sub: "With Hinglish intelligence built-in" },
            { value: "20 tokens/min", label: "Real-time Keepa", sub: "Live Amazon.in product data" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "var(--accent)", letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto 100px", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 14 }}>
            Simple, transparent pricing
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-muted)" }}>14-din ka free trial — no credit card required</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, alignItems: "stretch" }}>
          {PLANS.map(plan => (
            <div key={plan.name} className="glass-card" style={{
              padding: 32, position: "relative", display: "flex", flexDirection: "column",
              border: plan.highlight ? "2px solid var(--accent)" : "1px solid var(--border)",
              transform: plan.highlight ? "scale(1.02)" : "none",
              boxShadow: plan.highlight ? "0 8px 40px var(--accent-glow)" : "none",
            }}>
              {plan.highlight && (
                <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: "var(--accent)", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 18px", borderRadius: "0 0 10px 10px", whiteSpace: "nowrap" }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 6 }}>{plan.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>{plan.desc}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 40, fontWeight: 900, color: plan.highlight ? "var(--accent)" : "var(--text-primary)" }}>{plan.price}</span>
                  <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{plan.period}</span>
                </div>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "24px 0", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14 }}>
                    <CheckCircle size={15} color="var(--success)" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ color: "var(--text-secondary)" }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" style={{ textDecoration: "none", display: "block" }}>
                <button
                  style={{ width: "100%", padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", border: "none", background: plan.highlight ? "var(--accent)" : "var(--bg-secondary)", color: plan.highlight ? "white" : "var(--text-primary)", boxShadow: plan.highlight ? "0 4px 16px var(--accent-glow)" : "none", transition: "all 0.2s" }}
                >
                  {plan.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI Scanner CTA ── */}
      <section style={{ maxWidth: 800, margin: "0 auto 100px", padding: "0 24px", textAlign: "center" }}>
        <div className="glass-card" style={{ padding: 56, background: "linear-gradient(135deg, var(--accent-muted), var(--purple-muted))", border: "1px solid var(--border-hover)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>AI Seller Health Scanner</h2>
          <p style={{ fontSize: 16, color: "var(--text-muted)", marginBottom: 32, maxWidth: 520, margin: "0 auto 32px" }}>
            Apne ya competitor ka storefront link paste karo → AI poore account ko analyze karke improvement suggestions + growth prediction dega
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {["Listing SEO Scanner", "Competitor Gap Analysis", "Account Health", "AI Review Analyzer", "Growth Prediction"].map(tag => (
              <span key={tag} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 50, padding: "6px 14px", fontSize: 13, fontWeight: 600 }}>{tag}</span>
            ))}
          </div>
          <div style={{ marginTop: 32 }}>
            <span style={{ background: "var(--warning-muted)", color: "var(--warning)", borderRadius: 50, padding: "8px 20px", fontSize: 14, fontWeight: 700 }}>
              🚀 Milestone 3 — Coming Next
            </span>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "40px 24px", textAlign: "center", background: "var(--bg-secondary)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, background: "var(--accent)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontWeight: 900, fontSize: 14 }}>N</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 16 }}>Neon 10</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
            India ke lakhs sellers ke liye — AI-powered growth platform
          </p>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", fontSize: 13, color: "var(--text-muted)" }}>
            <Link href="/dashboard" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Dashboard</Link>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact</span>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 20 }}>© 2026 Neon 10. Made with ❤️ for Indian sellers.</p>
        </div>
      </footer>

      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
      `}</style>
    </div>
  );
}
