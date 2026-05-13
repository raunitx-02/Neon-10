"use client";
import { Bell, Search, HelpCircle } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export default function Topbar({ title }: { title?: string }) {
  return (
    <header style={{
      height: 64,
      borderBottom: "1px solid var(--border)",
      background: "var(--bg-card)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 28px",
      position: "sticky",
      top: 0,
      zIndex: 40,
      flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "8px 14px",
          width: 280,
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.02)",
        }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            placeholder="Search tools, keywords, ASINs..."
            style={{
              background: "none",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: 13,
              width: "100%",
              fontFamily: "Inter, sans-serif",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <ThemeToggle />
        
        {/* Notification bell */}
        <button className="btn-ghost" style={{
          position: "relative",
          padding: "8px",
          display: "flex",
        }}>
          <Bell size={18} />
          <span style={{
            position: "absolute",
            top: 6, right: 6,
            width: 8, height: 8,
            background: "var(--accent)",
            borderRadius: "50%",
            border: "2px solid var(--bg-card)",
          }} />
        </button>

        <button className="btn-ghost" style={{
          padding: "8px",
          display: "flex",
        }}>
          <HelpCircle size={18} />
        </button>

        {/* Plan badge */}
        <div style={{
          background: "var(--accent-muted)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "6px 14px",
          fontSize: 12,
          fontWeight: 700,
          color: "var(--accent)",
          letterSpacing: "0.05em",
        }}>
          💎 DIAMOND
        </div>
      </div>
    </header>
  );
}
