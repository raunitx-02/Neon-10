"use client";
import { useState, useRef, useEffect } from "react";
import {
  User, Mail, Lock, Phone, Camera, ShieldCheck, CreditCard,
  Package, Zap, Crown, ChevronRight, ExternalLink, CheckCircle2,
  AlertCircle, Link2, Unlink, RefreshCw, Bell, Save, ArrowRight
} from "lucide-react";

const PLANS = [
  {
    id: "Starter",
    name: "Starter",
    price: 999,
    icon: "🚀",
    color: "var(--text-secondary)",
    bg: "var(--bg-secondary)",
    border: "var(--border)",
    features: ["Product Research (Black Box)", "BSR Intelligence", "Keyword Tracker (Basic)", "Listing Analyzer"],
  },
  {
    id: "Growth",
    name: "Growth",
    price: 2499,
    icon: "⭐",
    color: "var(--accent)",
    bg: "var(--accent-muted)",
    border: "var(--accent)",
    features: ["All Starter features", "Cerebro & Magnet", "AI Seller Copilot", "Market Tracker", "Adtomic (Ads)"],
  },
  {
    id: "Diamond",
    name: "Diamond",
    price: 4999,
    icon: "💎",
    color: "var(--purple)",
    bg: "var(--purple-muted)",
    border: "var(--purple)",
    features: ["All Growth features", "Inventory Protector", "Refund Genie", "Follow-Up Automation", "Priority Support"],
  },
];

const INTEGRATIONS = [
  { id: "amazon", name: "Amazon India (SP-API)", icon: "🛒", color: "#FF9900", desc: "Connect your Amazon Seller Central account to analyze real inventory, orders, and PPC data.", status: "not_connected", requiredPlan: "Starter" },
  { id: "flipkart", name: "Flipkart Seller Hub", icon: "🛍️", color: "#047BD5", desc: "Link your Flipkart seller account for cross-marketplace inventory analysis.", status: "not_connected", requiredPlan: "Growth" },
  { id: "meesho", name: "Meesho Supplier", icon: "🏪", color: "#9B30FF", desc: "Connect Meesho supplier account for catalog sync and order intelligence.", status: "not_connected", requiredPlan: "Growth" },
  { id: "ondc", name: "ONDC Network", icon: "🌐", color: "#10b981", desc: "Integrate with the Open Network for Digital Commerce.", status: "not_connected", requiredPlan: "Diamond" },
  { id: "gst", name: "GST Portal", icon: "📋", color: "#1e40af", desc: "Auto-fetch GST returns for financial dashboard accuracy.", status: "not_connected", requiredPlan: "Growth" },
];

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="glass-card" style={{ padding: 32, marginBottom: 24 }}>
      <div style={{ marginBottom: 24, borderBottom: "1px solid var(--border)", paddingBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: type === "success" ? "var(--success)" : "var(--danger)",
      color: "white", padding: "14px 20px", borderRadius: 12,
      display: "flex", alignItems: "center", gap: 10,
      fontWeight: 600, fontSize: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      animation: "slideUp 0.3s ease",
    }}>
      {type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      {message}
    </div>
  );
}

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Profile fields
  const [firstName, setFirstName] = useState("Raunit");
  const [lastName, setLastName] = useState("Jha");
  const [mobile, setMobile] = useState("+91 7292858748");
  const [editEmail, setEditEmail] = useState("");
  const [editOtp, setEditOtp] = useState("");
  const [otpSentFor, setOtpSentFor] = useState<"email" | "password" | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Plan
  const [currentPlan, setCurrentPlan] = useState("Growth");
  const [selectedPlan, setSelectedPlan] = useState("Growth");
  const [planLoading, setPlanLoading] = useState(false);

  // Integrations
  const [integrations, setIntegrations] = useState<Record<string, boolean>>({});
  const [intLoading, setIntLoading] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => setToast({ message, type });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target?.result as string);
      reader.readAsDataURL(file);
      showToast("Profile picture updated!");
    }
  };

  const handleSaveProfile = () => {
    showToast("Profile saved successfully!");
  };

  const handleSendOtp = (type: "email" | "password") => {
    setOtpSentFor(type);
    showToast(`OTP sent to your registered email for ${type} change`);
  };

  const handleVerifyOtp = (type: "email" | "password") => {
    if (editOtp !== "123456") {
      showToast("Invalid OTP. Please try again.", "error");
      return;
    }
    if (type === "email") showToast("Email updated successfully!");
    if (type === "password") {
      if (newPassword !== confirmNewPassword) { showToast("Passwords do not match!", "error"); return; }
      showToast("Password changed successfully!");
    }
    setOtpSentFor(null);
    setEditOtp("");
  };

  const handlePlanChange = async () => {
    if (selectedPlan === currentPlan) return;
    setPlanLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setCurrentPlan(selectedPlan);
    setPlanLoading(false);
    showToast(`Plan changed to ${selectedPlan}! Billing starts from 1st of next month.`);
  };

  const getProration = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const daysLeft = Math.ceil((nextMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const newPlan = PLANS.find(p => p.id === selectedPlan);
    const oldPlan = PLANS.find(p => p.id === currentPlan);
    if (!newPlan || !oldPlan || selectedPlan === currentPlan) return null;
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const credit = (oldPlan.price / daysInMonth) * daysLeft;
    const charge = (newPlan.price / daysInMonth) * daysLeft;
    return { daysLeft, credit: Math.round(credit), charge: Math.round(charge), net: Math.round(charge - credit) };
  };

  const proration = getProration();

  const handleIntegration = (id: string, connect: boolean) => {
    setIntLoading(id);
    setTimeout(() => {
      setIntegrations(prev => ({ ...prev, [id]: connect }));
      setIntLoading(null);
      showToast(connect ? `${id} connected successfully!` : `${id} disconnected.`);
    }, 1500);
  };

  const nextMonthName = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
    .toLocaleString("en-IN", { month: "long", year: "numeric" });

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your account, plan, and integrations</p>
        </div>
      </div>

      {/* Profile Picture & Basic Info */}
      <Section title="Personal Information" subtitle="Update your personal details and profile picture">
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Avatar */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: 100, height: 100, borderRadius: "50%",
                background: avatar ? "transparent" : "var(--accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", position: "relative", overflow: "hidden",
                border: "3px solid var(--accent)", boxShadow: "0 0 0 4px var(--accent-muted)",
                transition: "all 0.2s",
              }}
            >
              {avatar
                ? <img src={avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ color: "white", fontWeight: 900, fontSize: 36 }}>R</span>
              }
              <div style={{
                position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: 0, transition: "opacity 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
              >
                <Camera size={24} color="white" />
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
            <button onClick={() => fileInputRef.current?.click()} className="btn-ghost" style={{ fontSize: 12, padding: "6px 12px" }}>
              Change Photo
            </button>
          </div>

          {/* Fields */}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, minWidth: 300 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 8 }}>FIRST NAME</label>
              <div style={{ position: "relative" }}>
                <User size={16} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input className="input-field" value={firstName} onChange={e => setFirstName(e.target.value)} style={{ paddingLeft: 36 }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 8 }}>LAST NAME</label>
              <div style={{ position: "relative" }}>
                <User size={16} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input className="input-field" value={lastName} onChange={e => setLastName(e.target.value)} style={{ paddingLeft: 36 }} />
              </div>
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 8 }}>MOBILE NUMBER</label>
              <div style={{ position: "relative" }}>
                <Phone size={16} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input className="input-field" value={mobile} onChange={e => setMobile(e.target.value)} style={{ paddingLeft: 36 }} />
              </div>
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <button onClick={handleSaveProfile} className="btn-accent" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* Email Change */}
      <Section title="Change Email Address" subtitle="Email change requires OTP verification on your current email">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 8 }}>NEW EMAIL ADDRESS</label>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input className="input-field" type="email" placeholder="new@email.com" value={editEmail} onChange={e => setEditEmail(e.target.value)} style={{ paddingLeft: 36 }} />
              </div>
              <button onClick={() => handleSendOtp("email")} className="btn-ghost" style={{ whiteSpace: "nowrap" }}>
                Send OTP
              </button>
            </div>
          </div>
          {otpSentFor === "email" && (
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <ShieldCheck size={16} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input className="input-field" placeholder="Enter 6-digit OTP" value={editOtp} onChange={e => setEditOtp(e.target.value)} style={{ paddingLeft: 36 }} maxLength={6} />
              </div>
              <button onClick={() => handleVerifyOtp("email")} className="btn-accent">Verify & Update</button>
            </div>
          )}
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Current: raunit@neon10.com · OTP will be sent to this address</p>
        </div>
      </Section>

      {/* Password Change */}
      <Section title="Change Password" subtitle="Requires OTP verification to confirm your identity">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 8 }}>NEW PASSWORD</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input className="input-field" type="password" placeholder="Min 8 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ paddingLeft: 36 }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 8 }}>CONFIRM PASSWORD</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input className="input-field" type="password" placeholder="Repeat new password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} style={{ paddingLeft: 36 }} />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => handleSendOtp("password")} className="btn-ghost">Send OTP to Email</button>
            {otpSentFor === "password" && (
              <>
                <div style={{ position: "relative" }}>
                  <ShieldCheck size={16} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                  <input className="input-field" placeholder="Enter OTP" value={editOtp} onChange={e => setEditOtp(e.target.value)} style={{ paddingLeft: 36, width: 160 }} maxLength={6} />
                </div>
                <button onClick={() => handleVerifyOtp("password")} className="btn-accent">Verify & Change</button>
              </>
            )}
          </div>
        </div>
      </Section>

      {/* Plan Management */}
      <Section title="Subscription Plan" subtitle={`Current plan: ${currentPlan} · Next billing cycle starts ${nextMonthName}`}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {PLANS.map(plan => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              style={{
                padding: 20, borderRadius: 12, cursor: "pointer",
                border: `2px solid ${selectedPlan === plan.id ? plan.border : "var(--border)"}`,
                background: selectedPlan === plan.id ? plan.bg : "var(--bg-secondary)",
                transition: "all 0.2s", position: "relative",
              }}
            >
              {currentPlan === plan.id && (
                <div style={{ position: "absolute", top: -10, right: 12, background: "var(--success)", color: "white", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 20 }}>
                  ACTIVE
                </div>
              )}
              <div style={{ fontSize: 28, marginBottom: 8 }}>{plan.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "var(--text-primary)", marginBottom: 4 }}>{plan.name}</div>
              <div style={{ fontWeight: 800, fontSize: 20, color: plan.color, marginBottom: 12 }}>₹{plan.price.toLocaleString()}<span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)" }}>/mo</span></div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {plan.features.slice(0, 3).map(f => (
                  <li key={f} style={{ fontSize: 12, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                    <CheckCircle2 size={12} color="var(--success)" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {proration && selectedPlan !== currentPlan && (
          <div style={{ background: "var(--accent-muted)", border: "1px solid var(--accent)", borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 13 }}>
            <div style={{ fontWeight: 700, color: "var(--accent)", marginBottom: 8 }}>📊 Billing Proration — {proration.daysLeft} days remaining in current cycle</div>
            <div style={{ display: "flex", gap: 24, color: "var(--text-secondary)" }}>
              <span>Credit for unused days: <b style={{ color: "var(--success)" }}>₹{proration.credit}</b></span>
              <span>New plan charge: <b style={{ color: "var(--accent)" }}>₹{proration.charge}</b></span>
              <span>Net charge now: <b style={{ color: proration.net > 0 ? "var(--warning)" : "var(--success)" }}>₹{Math.abs(proration.net)}</b></span>
            </div>
            <div style={{ marginTop: 8, color: "var(--text-muted)", fontSize: 12 }}>
              Full {selectedPlan} billing of ₹{PLANS.find(p => p.id === selectedPlan)?.price.toLocaleString()} starts from 1st {nextMonthName}
            </div>
          </div>
        )}

        <button
          onClick={handlePlanChange}
          disabled={selectedPlan === currentPlan || planLoading}
          className="btn-accent"
          style={{ display: "flex", alignItems: "center", gap: 8, opacity: selectedPlan === currentPlan ? 0.5 : 1 }}
        >
          {planLoading ? <RefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} /> : <CreditCard size={16} />}
          {planLoading ? "Processing..." : selectedPlan === currentPlan ? "This is your current plan" : `Switch to ${selectedPlan}`}
        </button>
      </Section>

      {/* Marketplace Integrations */}
      <Section title="Marketplace Integrations" subtitle="Connect your seller accounts for real inventory and order analysis">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {INTEGRATIONS.map(int => {
            const connected = integrations[int.id] || false;
            const loading = intLoading === int.id;
            const planLevel = PLANS.findIndex(p => p.id === currentPlan);
            const requiredLevel = PLANS.findIndex(p => p.id === int.requiredPlan);
            const canUse = planLevel >= requiredLevel;

            return (
              <div key={int.id} style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: 20, borderRadius: 12,
                border: `1px solid ${connected ? "var(--success)" : "var(--border)"}`,
                background: connected ? "var(--success-muted)" : "var(--bg-secondary)",
                opacity: canUse ? 1 : 0.6,
                transition: "all 0.2s",
              }}>
                <div style={{ fontSize: 32, flexShrink: 0 }}>{int.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{int.name}</span>
                    {connected && <span style={{ fontSize: 11, background: "var(--success)", color: "white", padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>CONNECTED</span>}
                    {!canUse && <span style={{ fontSize: 11, background: "var(--warning-muted)", color: "var(--warning)", padding: "2px 8px", borderRadius: 20, fontWeight: 700, border: "1px solid var(--warning)" }}>Requires {int.requiredPlan}+</span>}
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{int.desc}</p>
                </div>
                <div style={{ flexShrink: 0 }}>
                  {canUse ? (
                    <button
                      onClick={() => handleIntegration(int.id, !connected)}
                      disabled={loading}
                      className={connected ? "btn-ghost" : "btn-accent"}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", fontSize: 13, borderColor: connected ? "var(--danger)" : undefined, color: connected ? "var(--danger)" : undefined }}
                    >
                      {loading ? <RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} /> : connected ? <Unlink size={14} /> : <Link2 size={14} />}
                      {loading ? "..." : connected ? "Disconnect" : "Connect"}
                    </button>
                  ) : (
                    <button className="btn-ghost" style={{ fontSize: 12, padding: "8px 14px" }} onClick={() => setSelectedPlan(int.requiredPlan)}>
                      Upgrade <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
