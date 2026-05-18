"use client";
import Link from "next/link";
import { Clock, ArrowRight, Lock } from "lucide-react";

interface Props {
  title: string;
  description: string;
  reason: string; // what API/integration is needed
  requiredPlan?: string;
  currentPlan?: string;
  eta?: string;
}

export default function ComingSoon({ title, description, reason, requiredPlan, currentPlan, eta }: Props) {
  const isLocked = requiredPlan && currentPlan &&
    ["Starter", "Growth", "Diamond"].indexOf(currentPlan) < ["Starter", "Growth", "Diamond"].indexOf(requiredPlan);

  return (
    <div style={{
      minHeight: 500, display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", textAlign: "center", padding: 40,
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: 20,
        background: isLocked ? "var(--warning-muted)" : "var(--accent-muted)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 24, border: `2px solid ${isLocked ? "var(--warning)" : "var(--border)"}`,
      }}>
        {isLocked ? <Lock size={36} color="var(--warning)" /> : <Clock size={36} color="var(--accent)" />}
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)", marginBottom: 12 }}>
        {isLocked ? `${requiredPlan} Plan Required` : "Coming in Next Phase"}
      </h2>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 16 }}>{title}</h3>
      <p style={{ fontSize: 15, color: "var(--text-muted)", maxWidth: 560, lineHeight: 1.7, marginBottom: 24 }}>
        {isLocked
          ? `This feature is available on ${requiredPlan} plan and above. Upgrade to unlock it.`
          : description
        }
      </p>

      <div style={{
        background: "var(--bg-secondary)", border: "1px solid var(--border)",
        borderRadius: 12, padding: "16px 24px", marginBottom: 28, maxWidth: 520,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase" }}>
          {isLocked ? "What You Need" : "Why This Is Pending"}
        </div>
        <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{reason}</div>
        {eta && <div style={{ marginTop: 8, fontSize: 12, color: "var(--accent)", fontWeight: 700 }}>Estimated: {eta}</div>}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        {isLocked ? (
          <Link href="/profile" style={{ textDecoration: "none" }}>
            <button className="btn-accent" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              Upgrade Plan <ArrowRight size={16} />
            </button>
          </Link>
        ) : (
          <Link href="/dashboard" style={{ textDecoration: "none" }}>
            <button className="btn-ghost">← Back to Dashboard</button>
          </Link>
        )}
      </div>
    </div>
  );
}
