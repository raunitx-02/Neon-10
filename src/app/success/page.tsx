"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { CheckCircle, ArrowRight, Package, TrendingUp, Zap } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "Growth";
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#00E5FF", "#B388FF", "#FFFFFF"] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#00E5FF", "#B388FF", "#FFFFFF"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, overflowX: "hidden" }}>
      <div className="glass-card" style={{ maxWidth: 600, width: "100%", padding: 48, textAlign: "center", position: "relative", zIndex: 10, animation: "slideUp 0.5s ease-out" }}>
        
        <div style={{ width: 80, height: 80, background: "var(--success-muted)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 0 40px rgba(0, 230, 118, 0.4)" }}>
          <CheckCircle size={40} color="var(--success)" />
        </div>
        
        <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 12, letterSpacing: "-0.02em" }}>Payment Successful!</h1>
        <p style={{ fontSize: 18, color: "var(--text-muted)", marginBottom: 40 }}>
          Welcome to the <strong style={{ color: "var(--accent)" }}>{plan} Plan</strong>. Your account has been upgraded instantly.
        </p>

        <div style={{ background: "var(--bg-secondary)", borderRadius: 16, padding: 24, textAlign: "left", marginBottom: 40 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 16 }}>NEW FEATURES UNLOCKED:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}><Package size={16} color="var(--accent)" /></div>
              <span style={{ fontWeight: 600, fontSize: 15 }}>Unlimited Product Research</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--purple-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}><TrendingUp size={16} color="var(--purple)" /></div>
              <span style={{ fontWeight: 600, fontSize: 15 }}>AI Storefront Scanner Access</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--warning-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}><Zap size={16} color="var(--warning)" /></div>
              <span style={{ fontWeight: 600, fontSize: 15 }}>Real-time Xray Intelligence</span>
            </div>
          </div>
        </div>

        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <button className="btn-accent" style={{ width: "100%", fontSize: 16, padding: "16px", borderRadius: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 8px 30px var(--accent-glow)" }}>
            Go To Dashboard <ArrowRight size={18} />
          </button>
        </Link>
      </div>

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
