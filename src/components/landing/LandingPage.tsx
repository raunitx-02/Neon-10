"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Search, Cpu, FileText, TrendingUp, IndianRupee, Truck,
  Star, CheckCircle, ArrowRight, Menu, X, Zap, Globe,
  BarChart3, ShieldCheck, Sparkles, MessageCircle, Package, MonitorSmartphone, Target, LineChart, BrainCircuit, Box, Boxes
} from "lucide-react";

const MARQUEE_ITEMS = [
  { text: "Amazon India", icon: <Package size={16} color="var(--accent)" /> },
  { text: "Flipkart", icon: <Target size={16} color="var(--accent)" /> },
  { text: "Meesho", icon: <TrendingUp size={16} color="var(--accent)" /> },
  { text: "ONDC", icon: <Globe size={16} color="var(--accent)" /> },
  { text: "WhatsApp Commerce", icon: <MessageCircle size={16} color="var(--accent)" /> },
  { text: "Hinglish Keywords", icon: <Search size={16} color="var(--accent)" /> },
  { text: "GST Intelligence", icon: <IndianRupee size={16} color="var(--accent)" /> },
  { text: "BSR Velocity", icon: <LineChart size={16} color="var(--accent)" /> },
  { text: "AI Growth Advisor", icon: <BrainCircuit size={16} color="var(--accent)" /> },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", overflowX: "hidden" }}>

      {/* ── Nav ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, borderBottom: "1px solid var(--border)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", background: "rgba(var(--bg-primary-rgb), 0.85)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", height: 80 }}>
          
          {/* Left: Logo */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link href="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 42, height: 42, background: "var(--accent)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px var(--accent-glow)" }}>
                <span style={{ color: "white", fontWeight: 900, fontSize: 20 }}>N</span>
              </div>
              <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: "-0.03em" }}>Neon 10</div>
            </Link>
          </div>

          {/* Center: Nav Links */}
          <div className="desktop-nav" style={{ display: "flex", gap: 40, fontSize: 15, fontWeight: 600, color: "var(--text-secondary)", justifyContent: "center" }}>
            <Link href="#features" style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}>Tools</Link>
            <Link href="/resources" style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}>Resources</Link>
            <Link href="/pricing" style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}>Pricing</Link>
            <Link href="/enterprise" style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}>Enterprise</Link>
          </div>

          {/* Right: Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "flex-end" }}>
            <Link href="/login" style={{ textDecoration: "none" }}>
              <button className="btn-ghost" style={{ fontSize: 15, fontWeight: 700, padding: "10px 20px" }}>Log In</button>
            </Link>
            <Link href="/login?mode=signup" style={{ textDecoration: "none" }}>
              <button className="btn-accent" style={{ fontSize: 15, padding: "12px 28px", display: "flex", alignItems: "center", gap: 8, borderRadius: 12, fontWeight: 700 }}>
                Sign Up For Free <ArrowRight size={16} />
              </button>
            </Link>
          </div>
          
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ paddingTop: 160, paddingBottom: 120, textAlign: "center", maxWidth: 1000, margin: "0 auto", padding: "180px 24px 120px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 50, padding: "8px 24px", fontSize: 13, color: "var(--text-secondary)", fontWeight: 700, marginBottom: 32, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          The Ultimate E-commerce Intelligence Platform for India
        </div>
        <h1 style={{ fontSize: "clamp(48px, 8vw, 84px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 32 }}>
          Dominate Indian
          <br />
          E-commerce with
          <br />
          <span style={{ color: "var(--accent)" }}>
            Neon 10 Intelligence
          </span>
        </h1>
        <p style={{ fontSize: "clamp(18px, 3vw, 24px)", color: "var(--text-muted)", maxWidth: 800, margin: "0 auto 48px", lineHeight: 1.5 }}>
          The all-in-one suite designed exclusively for Amazon India, Flipkart, Meesho, and ONDC sellers. From product research to AI-driven listing optimization and logistics.
        </p>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/pricing" style={{ textDecoration: "none" }}>
            <button className="btn-accent" style={{ fontSize: 18, padding: "18px 40px", display: "flex", alignItems: "center", gap: 10, borderRadius: 12, fontWeight: 700 }}>
              Get Started Today <ArrowRight size={20} />
            </button>
          </Link>
        </div>
        <div style={{ marginTop: 56, display: "flex", alignItems: "center", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
          {[
            { icon: <Star size={18} fill="var(--warning)" color="var(--warning)" />, text: "Trusted by 10,000+ Sellers" },
            { icon: <CheckCircle size={18} color="var(--success)" />, text: "Accurate Indian Data" },
            { icon: <ShieldCheck size={18} color="var(--blue)" />, text: "Enterprise-Grade Security" },
          ].map(item => (
            <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, color: "var(--text-secondary)" }}>
              {item.icon} {item.text}
            </div>
          ))}
        </div>
      </section>

      {/* ── Video / Dashboard Preview ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto 120px", padding: "0 24px" }}>
        <div style={{
          width: "100%", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 16, padding: 16,
          boxShadow: "0 24px 64px rgba(0,0,0,0.08)", overflow: "hidden"
        }}>
          {/* Mock SaaS Dashboard Frame */}
          <div style={{ width: "100%", background: "var(--bg-primary)", borderRadius: 8, border: "1px solid var(--border)", display: "flex", flexDirection: "column", height: 600, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ height: 60, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 24px", justifyContent: "space-between", background: "var(--bg-secondary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 28, height: 28, background: "var(--accent)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: 14 }}>N</div>
                <div style={{ width: 200, height: 12, background: "var(--border)", borderRadius: 6 }} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--border)" }} />
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--border)" }} />
              </div>
            </div>
            {/* Body */}
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
              {/* Sidebar */}
              <div style={{ width: 240, borderRight: "1px solid var(--border)", background: "var(--bg-secondary)", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} style={{ height: 24, borderRadius: 6, background: i === 1 ? "var(--accent-muted)" : "var(--border)", width: i === 1 ? "100%" : "80%" }} />
                ))}
              </div>
              {/* Content */}
              <div style={{ flex: 1, padding: 40, overflowY: "auto", background: "var(--bg-primary)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32 }}>
                  <div>
                    <div style={{ height: 32, width: 200, background: "var(--text-primary)", borderRadius: 6, marginBottom: 12, opacity: 0.8 }} />
                    <div style={{ height: 16, width: 300, background: "var(--border)", borderRadius: 6 }} />
                  </div>
                  <div style={{ height: 40, width: 120, background: "var(--accent)", borderRadius: 8 }} />
                </div>
                {/* Stats Row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginBottom: 32 }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ background: "var(--bg-secondary)", padding: 24, borderRadius: 12, border: "1px solid var(--border)" }}>
                      <div style={{ height: 14, width: 100, background: "var(--border)", borderRadius: 4, marginBottom: 16 }} />
                      <div style={{ height: 36, width: 140, background: "var(--text-primary)", borderRadius: 6, opacity: 0.9 }} />
                    </div>
                  ))}
                </div>
                {/* Main Graph Area */}
                <div style={{ background: "var(--bg-secondary)", padding: 32, borderRadius: 12, border: "1px solid var(--border)", height: 300, display: "flex", alignItems: "flex-end", gap: 12 }}>
                  {[10, 40, 20, 60, 40, 80, 50, 90, 70, 100, 85, 110].map((h, i) => (
                    <div key={i} style={{ flex: 1, background: "var(--accent)", height: `${h}%`, borderRadius: "4px 4px 0 0", opacity: 0.8 }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div style={{ overflow: "hidden", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "20px 0", background: "var(--bg-secondary)", marginBottom: 120 }}>
        <div style={{ display: "flex", gap: 60, animation: "marquee 25s linear infinite", whiteSpace: "nowrap", width: "max-content" }}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} style={{ fontSize: 16, fontWeight: 700, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 12 }}>
              {item.icon} <span style={{ color: "var(--text-primary)" }}>{item.text}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Massive Features Grid ── */}
      <section id="features" style={{ maxWidth: 1400, margin: "0 auto 100px", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 24 }}>
            Everything you need to <br/>scale your business
          </h2>
          <p style={{ fontSize: 20, color: "var(--text-muted)", maxWidth: 700, margin: "0 auto" }}>
            Neon 10 provides industry-leading tools covering every aspect of selling online in India.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          
          <div className="glass-card" style={{ padding: 40 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--accent-muted)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
              <Search size={32} color="var(--accent)" />
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Product Research</h3>
            <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 24 }}>Discover winning products with Black Box India. Analyze BSR velocity, calculate GST slabs, and instantly score margins across multiple marketplaces.</p>
          </div>

          <div className="glass-card" style={{ padding: 40 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--purple-muted)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
              <Target size={32} color="var(--purple)" />
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Keyword Intelligence</h3>
            <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 24 }}>Reverse engineer competitor listings with Cerebro and Magnet. Extract Hinglish keywords, search volumes, and CPC estimates effortlessly.</p>
          </div>

          <div className="glass-card" style={{ padding: 40 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--success-muted)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
              <LineChart size={32} color="var(--success)" />
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Listing Optimization</h3>
            <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 24 }}>Craft highly converting, SEO-optimized listings. Use Scribbles to ensure your listings are packed with the right keywords and structured for max indexing.</p>
          </div>

          <div className="glass-card" style={{ padding: 40 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--blue-muted)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
              <BrainCircuit size={32} color="var(--blue)" />
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>AI Seller Scanner</h3>
            <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 24 }}>Instantly scan any competitor's storefront using advanced AI. Get health scores, identify SEO gaps, and predict their growth strategy automatically.</p>
          </div>

          <div className="glass-card" style={{ padding: 40 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--warning-muted)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
              <Box size={32} color="var(--warning)" />
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Inventory Management</h3>
            <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 24 }}>Track FBA and FBM inventory in real-time. Forecast demand based on Indian festival seasons and avoid stockouts or high storage fees.</p>
          </div>

          <div className="glass-card" style={{ padding: 40 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--danger-muted)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
              <TrendingUp size={32} color="var(--danger)" />
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Advertising Analytics</h3>
            <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 24 }}>Optimize Amazon Ads and Flipkart PLA. Monitor ACoS and RoAS at the keyword level and automate bids to maximize your ad spend efficiency.</p>
          </div>

          <div className="glass-card" style={{ padding: 40 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(0, 200, 150, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
              <IndianRupee size={32} color="#00C896" />
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Financial Dashboard</h3>
            <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 24 }}>See your true net profit. Automatically deduct Amazon fees, shipping costs, and advertising spend to know exactly what you earn daily.</p>
          </div>

          <div className="glass-card" style={{ padding: 40 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(255, 100, 200, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
              <MessageCircle size={32} color="#FF64C8" />
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Review Automation</h3>
            <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 24 }}>Automatically send post-purchase WhatsApp and Email requests to Indian buyers to significantly increase your positive review velocity.</p>
          </div>

          <div className="glass-card" style={{ padding: 40 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(0, 150, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
              <Globe size={32} color="#0096FF" />
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Marketplace Multi-Sync</h3>
            <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 24 }}>Manage orders, inventory, and analytics across Amazon India, Flipkart, and Meesho from a single, unified command center.</p>
          </div>

        </div>
      </section>

      {/* ── Alternating Deep Dives ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto 120px", padding: "0 24px", display: "flex", flexDirection: "column", gap: 120 }}>
        
        {/* Block 1 */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 60 }}>
          <div style={{ flex: "1 1 400px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--accent-muted)", color: "var(--accent)", padding: "6px 12px", borderRadius: 50, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
              <Search size={14} /> PRODUCT DISCOVERY
            </div>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 24, lineHeight: 1.1 }}>
              Find products that actually make money.
            </h2>
            <p style={{ fontSize: 18, color: "var(--text-muted)", marginBottom: 32, lineHeight: 1.6 }}>
              Stop guessing. Use Black Box India to filter millions of products on Amazon.in by revenue, price, review count, and search volume. Our algorithm automatically factors in Indian logistics costs and GST slabs to show you true profitability.
            </p>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              <li style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, color: "var(--text-secondary)" }}><CheckCircle size={18} color="var(--accent)" /> Over 50 Million Indian ASINs</li>
              <li style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, color: "var(--text-secondary)" }}><CheckCircle size={18} color="var(--accent)" /> Real-time BSR tracking</li>
              <li style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, color: "var(--text-secondary)" }}><CheckCircle size={18} color="var(--accent)" /> Automated ROI calculator</li>
            </ul>
            <Link href="/pricing" style={{ textDecoration: "none", fontWeight: 700, color: "var(--accent)", display: "flex", alignItems: "center", gap: 6 }}>
              Explore Product Discovery <ArrowRight size={16} />
            </Link>
          </div>
          <div className="glass-card" style={{ flex: "1 1 400px", height: 400, background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
             <Package size={100} color="var(--text-muted)" style={{ opacity: 0.2 }} />
             <div style={{ position: "absolute", bottom: 24, left: 24, right: 24, background: "var(--bg-primary)", padding: 20, borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
               <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                 <div style={{ width: "40%", height: 8, background: "var(--accent)", borderRadius: 4 }} />
                 <div style={{ width: "20%", height: 8, background: "var(--success)", borderRadius: 4 }} />
               </div>
               <div style={{ width: "100%", height: 8, background: "var(--border)", borderRadius: 4, marginBottom: 12 }} />
               <div style={{ width: "80%", height: 8, background: "var(--border)", borderRadius: 4 }} />
             </div>
          </div>
        </div>

        {/* Block 2 */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 60, flexDirection: "row-reverse" }}>
          <div style={{ flex: "1 1 400px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--purple-muted)", color: "var(--purple)", padding: "6px 12px", borderRadius: 50, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
              <Cpu size={14} /> KEYWORD INTELLIGENCE
            </div>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 24, lineHeight: 1.1 }}>
              Steal your competitor's traffic.
            </h2>
            <p style={{ fontSize: 18, color: "var(--text-muted)", marginBottom: 32, lineHeight: 1.6 }}>
              With Cerebro, simply paste your competitor's ASIN and instantly see exactly which keywords are driving their sales. Magnet helps you expand a single seed keyword into hundreds of high-converting, low-competition Hindi and English search terms.
            </p>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              <li style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, color: "var(--text-secondary)" }}><CheckCircle size={18} color="var(--purple)" /> Reverse-engineer ASINs</li>
              <li style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, color: "var(--text-secondary)" }}><CheckCircle size={18} color="var(--purple)" /> Hinglish search volume metrics</li>
              <li style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, color: "var(--text-secondary)" }}><CheckCircle size={18} color="var(--purple)" /> Identify ranking opportunities</li>
            </ul>
            <Link href="/pricing" style={{ textDecoration: "none", fontWeight: 700, color: "var(--purple)", display: "flex", alignItems: "center", gap: 6 }}>
              Explore Keyword Tools <ArrowRight size={16} />
            </Link>
          </div>
          <div className="glass-card" style={{ flex: "1 1 400px", height: 400, background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
             <Target size={100} color="var(--text-muted)" style={{ opacity: 0.2 }} />
             <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 200, height: 200, borderRadius: "50%", border: "2px dashed var(--purple)", animation: "spin 10s linear infinite", opacity: 0.5 }} />
             <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 100, height: 100, borderRadius: "50%", background: "var(--purple-muted)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px var(--purple)" }}>
               <Search size={32} color="var(--purple)" />
             </div>
          </div>
        </div>

        {/* Block 3 */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 60 }}>
          <div style={{ flex: "1 1 400px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--success-muted)", color: "var(--success)", padding: "6px 12px", borderRadius: 50, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
              <FileText size={14} /> LISTING OPTIMIZATION
            </div>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 24, lineHeight: 1.1 }}>
              Write listings that rank and convert.
            </h2>
            <p style={{ fontSize: 18, color: "var(--text-muted)", marginBottom: 32, lineHeight: 1.6 }}>
              Organize your massive keyword lists with Frankenstein, then use Scribbles to seamlessly write your titles, bullet points, and descriptions. Never miss a crucial keyword again.
            </p>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              <li style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, color: "var(--text-secondary)" }}><CheckCircle size={18} color="var(--success)" /> Live keyword tracking while writing</li>
              <li style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, color: "var(--text-secondary)" }}><CheckCircle size={18} color="var(--success)" /> Amazon A9 Algorithm compliant</li>
              <li style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, color: "var(--text-secondary)" }}><CheckCircle size={18} color="var(--success)" /> Sync directly to Amazon Seller Central</li>
            </ul>
            <Link href="/pricing" style={{ textDecoration: "none", fontWeight: 700, color: "var(--success)", display: "flex", alignItems: "center", gap: 6 }}>
              Explore Listing Tools <ArrowRight size={16} />
            </Link>
          </div>
          <div className="glass-card" style={{ flex: "1 1 400px", height: 400, background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
             <FileText size={100} color="var(--text-muted)" style={{ opacity: 0.2 }} />
             <div style={{ position: "absolute", top: 40, left: 40, right: 40, bottom: 40, background: "var(--bg-primary)", padding: 24, borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
               <div style={{ width: "60%", height: 16, background: "var(--text-primary)", borderRadius: 4, marginBottom: 24 }} />
               <div style={{ width: "100%", height: 8, background: "var(--border)", borderRadius: 4, marginBottom: 12 }} />
               <div style={{ width: "100%", height: 8, background: "var(--border)", borderRadius: 4, marginBottom: 12 }} />
               <div style={{ width: "80%", height: 8, background: "var(--border)", borderRadius: 4, marginBottom: 32 }} />
               
               <div style={{ display: "flex", gap: 8 }}>
                 <div style={{ padding: "4px 12px", background: "var(--success-muted)", color: "var(--success)", borderRadius: 50, fontSize: 10, fontWeight: 800 }}>KEYWORD 1</div>
                 <div style={{ padding: "4px 12px", background: "var(--success-muted)", color: "var(--success)", borderRadius: 50, fontSize: 10, fontWeight: 800 }}>KEYWORD 2</div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* ── User Personas ── */}
      <section style={{ padding: "100px 24px", background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", marginBottom: 120 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 60 }}>Built for every stage of your journey</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
            <div style={{ textAlign: "left" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, marginBottom: 20 }}>1</div>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>New Sellers</h3>
              <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.6 }}>Find your first winning product with low competition and high margins. Validate your ideas before investing capital.</p>
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--purple)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, marginBottom: 20 }}>2</div>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Growing Brands</h3>
              <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.6 }}>Optimize your existing listings, steal traffic from top competitors, and track your keyword rankings daily to ensure consistent growth.</p>
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--warning)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, marginBottom: 20 }}>3</div>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Agencies & Enterprises</h3>
              <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.6 }}>Manage hundreds of client storefronts. Use AI to bulk-scan account health and generate automated growth reports.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto 120px", padding: "0 24px" }}>
        <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 60, textAlign: "center" }}>Trusted by India's top sellers</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
          {[
            { name: "Rahul S.", revenue: "₹2Cr/month", text: "Neon 10's Black Box helped us find a niche in home decor that was completely untapped on Flipkart. The GST calculator alone saved us from pricing mistakes." },
            { name: "Priya M.", revenue: "₹50L/month", text: "Before Neon 10, we were guessing keywords. Cerebro showed us exactly what our competitors were doing. Our organic sales doubled in 45 days." },
            { name: "Vikram K.", revenue: "Agency Owner", text: "The AI Storefront Scanner is a game changer for our agency audits. We plug in a prospective client's link and instantly have a 10-page optimization report." }
          ].map((t, i) => (
            <div key={i} className="glass-card" style={{ padding: 40, borderTop: "4px solid var(--accent)" }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                {[1,2,3,4,5].map(star => <Star key={star} size={16} fill="var(--warning)" color="var(--warning)" />)}
              </div>
              <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 24, fontStyle: "italic" }}>"{t.text}"</p>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{t.name}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{t.revenue} Seller</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Deep Dive Callout / Final CTA ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto 140px", padding: "0 24px" }}>
        <div className="glass-card" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", padding: 0, overflow: "hidden", background: "linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(179, 136, 255, 0.1))", border: "1px solid var(--accent-muted)" }}>
          <div style={{ flex: "1 1 500px", padding: "80px" }}>
            <h2 style={{ fontSize: 48, fontWeight: 900, marginBottom: 24, letterSpacing: "-0.02em", lineHeight: 1.1 }}>Ready to dominate your category?</h2>
            <p style={{ fontSize: 20, color: "var(--text-muted)", marginBottom: 40, lineHeight: 1.6 }}>
              Join over 10,000 Indian sellers who use Neon 10 to uncover hidden opportunities, rank higher, and maximize profits.
            </p>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <Link href="/login?mode=signup" style={{ textDecoration: "none" }}>
                <button className="btn-accent" style={{ fontSize: 18, padding: "18px 40px", borderRadius: 50, fontWeight: 700, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 10px 40px var(--accent-glow)" }}>
                  Sign Up Now <ArrowRight size={20} />
                </button>
              </Link>
            </div>
          </div>
          <div style={{ flex: "1 1 400px", background: "var(--bg-primary)", minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center", borderLeft: "1px solid var(--border)" }}>
            <Boxes size={160} color="var(--accent)" style={{ opacity: 0.5 }} />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "80px 24px 40px", background: "var(--bg-secondary)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 60, marginBottom: 60 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 36, height: 36, background: "var(--accent)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "white", fontWeight: 900, fontSize: 18 }}>N</span>
              </div>
              <span style={{ fontWeight: 900, fontSize: 20 }}>Neon 10</span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.6 }}>
              The industry-standard software suite for Indian e-commerce entrepreneurs and enterprises.
            </p>
          </div>
          
          <div>
            <h4 style={{ fontWeight: 800, fontSize: 16, marginBottom: 24 }}>Products</h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 16, color: "var(--text-secondary)", fontSize: 15 }}>
              <Link href="#features" style={{ textDecoration: "none", color: "inherit" }}><li>Product Research</li></Link>
              <Link href="#features" style={{ textDecoration: "none", color: "inherit" }}><li>Keyword Research</li></Link>
              <Link href="#features" style={{ textDecoration: "none", color: "inherit" }}><li>Listing Optimization</li></Link>
              <Link href="#features" style={{ textDecoration: "none", color: "inherit" }}><li>Operations & Analytics</li></Link>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: 800, fontSize: 16, marginBottom: 24 }}>Company</h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 16, color: "var(--text-secondary)", fontSize: 15 }}>
              <Link href="/about" style={{ textDecoration: "none", color: "inherit" }}><li>About Us</li></Link>
              <Link href="/careers" style={{ textDecoration: "none", color: "inherit" }}><li>Careers</li></Link>
              <Link href="/pricing" style={{ textDecoration: "none", color: "inherit" }}><li>Pricing</li></Link>
              <Link href="/contact" style={{ textDecoration: "none", color: "inherit" }}><li>Contact Support</li></Link>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 32, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
          © 2026 Neon 10 Inc. All rights reserved. Made with ❤️ in India.
        </div>
      </footer>

      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @media (max-width: 800px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </div>
  );
}
