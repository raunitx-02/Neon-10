"use client";

import { useSearchParams } from "next/navigation";
import { loginWithPlan } from "../actions";
import { Zap, Star, ShieldCheck } from "lucide-react";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 1000 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 48, height: 48, background: "var(--accent)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 8px 24px var(--accent-glow)" }}>
            <span style={{ color: "white", fontWeight: 900, fontSize: 24 }}>N</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Welcome to Neon 10</h1>
          <p style={{ fontSize: 16, color: "var(--text-muted)" }}>Choose a plan tier to demo the platform</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {/* Starter Plan */}
          <div className="glass-card" style={{ padding: 32, textAlign: "center" }}>
            <Zap size={32} color="var(--text-muted)" style={{ margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Starter</h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24, minHeight: 40 }}>Basic features: Black Box, Magnet, Listing Optimizer, Tools</p>
            <button 
              className="btn-ghost" 
              style={{ width: "100%", padding: 14, fontSize: 16 }}
              onClick={() => loginWithPlan("Starter", callbackUrl)}
            >
              Login as Starter
            </button>
          </div>

          {/* Growth Plan */}
          <div className="glass-card" style={{ padding: 32, textAlign: "center", border: "2px solid var(--accent)", boxShadow: "0 8px 32px var(--accent-glow)" }}>
            <Star size={32} color="var(--accent)" style={{ margin: "0 auto 16px" }} />
            <div style={{ background: "var(--accent)", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 50, display: "inline-block", marginBottom: 12 }}>MOST POPULAR</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Growth</h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24, minHeight: 40 }}>Includes Starter + Cerebro, Xray, AI Seller Scanner</p>
            <button 
              className="btn-accent" 
              style={{ width: "100%", padding: 14, fontSize: 16 }}
              onClick={() => loginWithPlan("Growth", callbackUrl)}
            >
              Login as Growth
            </button>
          </div>

          {/* Diamond Plan */}
          <div className="glass-card" style={{ padding: 32, textAlign: "center", border: "1px solid var(--purple)" }}>
            <ShieldCheck size={32} color="var(--purple)" style={{ margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Diamond</h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24, minHeight: 40 }}>All features unlocked. Full access to everything.</p>
            <button 
              style={{ width: "100%", padding: 14, fontSize: 16, background: "var(--purple-muted)", color: "var(--purple)", border: "1px solid var(--purple)", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}
              onClick={() => loginWithPlan("Diamond", callbackUrl)}
            >
              Login as Diamond
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="spinner" style={{ margin: "100px auto" }} />}>
      <LoginForm />
    </Suspense>
  );
}
