"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Search, KeyRound, FileText, Settings, BarChart3,
  Wrench, ChevronRight, ChevronLeft, Bell, Package, TrendingUp,
  ShieldCheck, RefreshCcw, Mail, Boxes, Zap, Cpu, QrCode, Link2,
  Sparkles, Target, BookOpen, FlaskConical
} from "lucide-react";
import clsx from "clsx";

const nav = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Product Research",
    icon: Search,
    children: [
      { label: "Black Box", href: "/product-research/black-box", icon: Package },
      { label: "Xray", href: "/product-research/xray", icon: Zap },
      { label: "Trendster", href: "/product-research/trendster", icon: TrendingUp },
      { label: "BSR Intelligence", href: "/product-research/bsr-intelligence", icon: Target },
    ],
  },
  {
    label: "Keywords",
    icon: KeyRound,
    children: [
      { label: "Cerebro", href: "/keywords/cerebro", icon: Cpu },
      { label: "Magnet", href: "/keywords/magnet", icon: Target },
      { label: "Frankenstein", href: "/keywords/frankenstein", icon: FlaskConical },
      { label: "Misspellinator", href: "/keywords/misspellinator", icon: Sparkles },
    ],
  },
  {
    label: "Listing Optimization",
    icon: FileText,
    children: [
      { label: "Listing Builder", href: "/listing/builder", icon: BookOpen },
      { label: "Scribbles", href: "/listing/scribbles", icon: FileText },
      { label: "Index Checker", href: "/listing/index-checker", icon: ShieldCheck },
      { label: "Listing Analyzer", href: "/listing/analyzer", icon: BarChart3 },
    ],
  },
  {
    label: "Operations",
    icon: Settings,
    children: [
      { label: "Alerts", href: "/operations/alerts", icon: Bell },
      { label: "Follow-Up", href: "/operations/follow-up", icon: Mail },
      { label: "Inventory", href: "/operations/inventory", icon: Boxes },
      { label: "Inventory Protector", href: "/operations/inventory-protector", icon: ShieldCheck },
      { label: "Refund Genie", href: "/operations/refund-genie", icon: RefreshCcw },
    ],
  },
  {
    label: "Analytics & Ads",
    icon: BarChart3,
    children: [
      { label: "Keyword Tracker", href: "/analytics/keyword-tracker", icon: TrendingUp },
      { label: "Market Tracker", href: "/analytics/market-tracker", icon: BarChart3 },
      { label: "Ads (Adtomic)", href: "/analytics/ads", icon: Zap },
    ],
  },
  {
    label: "Tools",
    icon: Wrench,
    children: [
      { label: "URL Builder", href: "/tools/url-builder", icon: Link2 },
      { label: "QR Generator", href: "/tools/qr-generator", icon: QrCode },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>(["Product Research", "Keywords", "Listing Optimization", "Operations", "Analytics & Ads", "Tools"]);

  const toggleGroup = (label: string) => {
    setOpenGroups(prev =>
      prev.includes(label) ? prev.filter(g => g !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => pathname === href;

  return (
    <aside
      style={{
        width: collapsed ? "72px" : "260px",
        minWidth: collapsed ? "72px" : "260px",
        background: "var(--bg-card)",
        borderRight: "1px solid var(--border)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1), min-width 0.3s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{
        padding: "20px 16px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        gap: 12,
        minHeight: 70,
      }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36,
              background: "var(--accent)",
              borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px var(--accent-glow)",
            }}>
              <span style={{ color: "white", fontWeight: 900, fontSize: 16 }}>N</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Neon 10</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>Seller Platform</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div style={{
            width: 36, height: 36,
            background: "var(--accent)",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px var(--accent-glow)",
          }}>
            <span style={{ color: "white", fontWeight: 900, fontSize: 16 }}>N</span>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4, borderRadius: 6, display: "flex" }}
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          style={{
            margin: "12px auto",
            background: "var(--accent-muted)",
            border: "1px solid var(--border)",
            cursor: "pointer",
            color: "var(--accent)",
            padding: "6px",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "12px 10px" }}>
        {nav.map((item) => {
          if (!item.children) {
            return (
              <Link key={item.href} href={item.href!} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: collapsed ? "10px 14px" : "10px 12px",
                  borderRadius: 10,
                  marginBottom: 2,
                  cursor: "pointer",
                  justifyContent: collapsed ? "center" : "flex-start",
                  background: isActive(item.href!) ? "var(--accent-muted)" : "transparent",
                  border: isActive(item.href!) ? "1px solid var(--border-hover)" : "1px solid transparent",
                  color: isActive(item.href!) ? "var(--accent)" : "var(--text-secondary)",
                  transition: "all 0.2s",
                }}>
                  <item.icon size={18} style={{ flexShrink: 0 }} />
                  {!collapsed && <span style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</span>}
                </div>
              </Link>
            );
          }

          const groupOpen = openGroups.includes(item.label);
          const groupActive = item.children.some(c => isActive(c.href));

          return (
            <div key={item.label} style={{ marginBottom: 4 }}>
              <button
                onClick={() => !collapsed && toggleGroup(item.label)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: collapsed ? "10px 14px" : "10px 12px",
                  borderRadius: 10,
                  cursor: "pointer",
                  justifyContent: collapsed ? "center" : "space-between",
                  background: groupActive ? "var(--accent-muted)" : "transparent",
                  border: "1px solid transparent",
                  color: groupActive ? "var(--accent)" : "var(--text-secondary)",
                  width: "100%",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { if (!groupActive) (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)"; }}
                onMouseLeave={e => { if (!groupActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <item.icon size={18} style={{ flexShrink: 0 }} />
                  {!collapsed && <span style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</span>}
                </div>
                {!collapsed && (
                  <ChevronRight
                    size={14}
                    style={{
                      transition: "transform 0.2s",
                      transform: groupOpen ? "rotate(90deg)" : "rotate(0deg)",
                      flexShrink: 0,
                    }}
                  />
                )}
              </button>

              {!collapsed && groupOpen && (
                <div style={{ paddingLeft: 14, marginTop: 2 }}>
                  {item.children.map((child) => (
                    <Link key={child.href} href={child.href} style={{ textDecoration: "none" }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 12px",
                        borderRadius: 8,
                        marginBottom: 2,
                        cursor: "pointer",
                        background: isActive(child.href) ? "var(--accent-muted)" : "transparent",
                        border: isActive(child.href) ? "1px solid var(--border-hover)" : "1px solid transparent",
                        color: isActive(child.href) ? "var(--accent)" : "var(--text-muted)",
                        transition: "all 0.15s",
                        fontSize: 13,
                        fontWeight: isActive(child.href) ? 600 : 400,
                      }}
                        onMouseEnter={e => { if (!isActive(child.href)) { (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}}
                        onMouseLeave={e => { if (!isActive(child.href)) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}}
                      >
                        <child.icon size={14} style={{ flexShrink: 0 }} />
                        {child.label}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User profile at bottom */}
      {!collapsed && (
        <div style={{
          padding: "16px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--purple), var(--blue))",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, fontWeight: 700, fontSize: 14, color: "white",
          }}>R</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Raunit Jha</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Diamond Plan</div>
          </div>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)", flexShrink: 0 }} />
        </div>
      )}
    </aside>
  );
}
