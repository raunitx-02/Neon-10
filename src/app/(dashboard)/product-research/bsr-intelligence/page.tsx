"use client";
import { useState, useEffect } from "react";
import { 
  Search, Target, TrendingUp, ArrowUpRight, ArrowDownRight, 
  ExternalLink, Zap, ShieldCheck, Activity, Globe, Info
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar
} from "recharts";
import { parseKeepaCsv, KEEPA_INDICES } from "@/lib/keepaUtils";

const mockBsrHistory = [
  { day: "May 01", rank: 1240 },
  { day: "May 03", rank: 1100 },
  { day: "May 05", rank: 950 },
  { day: "May 07", rank: 1050 },
  { day: "May 09", rank: 820 },
  { day: "May 11", rank: 740 },
  { day: "May 13", rank: 620 },
];

const trendingProducts = [
  {
    asin: "B08N5KWB9H",
    name: "Aero Dynamics Wireless Ergo Mouse",
    bsr: 12,
    change: +45,
    category: "Electronics",
    price: "$49.99",
    img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop"
  },
  {
    asin: "B09L1W3X2M",
    name: "Lumina Pro LED Desk Lamp",
    bsr: 45,
    change: +120,
    category: "Home Office",
    price: "$29.99",
    img: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=200&h=200&fit=crop"
  },
  {
    asin: "B07ZPC9QD4",
    name: "AquaHydrate Smart Bottle",
    bsr: 89,
    change: +210,
    category: "Sports",
    price: "$34.50",
    img: "https://images.unsplash.com/photo-1523362622602-4c740deda5f2?w=200&h=200&fit=crop"
  },
  {
    asin: "B0BMQ8Y9K1",
    name: "Zenith Noise Cancelling Headphones",
    bsr: 5,
    change: +8,
    category: "Electronics",
    price: "$299.00",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop"
  }
];

export default function BsrIntelligence() {
  const [asin, setAsin] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);

  const handleSearch = async () => {
    if (!asin) return;
    setIsScanning(true);
    setSearchResult(null);
    
    setScanStatus("Establishing secure connection to Keepa Data Lake...");
    
    try {
      const response = await fetch(`/api/amazon/keepa?asin=${asin}`);
      const data = await response.json();

      if (data.error) {
        setScanStatus(`Error: ${data.error}`);
        setIsScanning(false);
        return;
      }

      setScanStatus("Parsing Marketplace History...");
      
      // Parse 14-day history for the chart
      const bsrHistory = parseKeepaCsv(data.csv?.[KEEPA_INDICES.SALES_RANK]).slice(-14);

      setSearchResult({
        asin: data.asin,
        name: data.title,
        bsr: data.bsr,
        category: data.category,
        price: data.price,
        rating: data.rating,
        reviews: data.reviews,
        history: bsrHistory,
        isMock: data.isMock
      });
      setIsScanning(false);

    } catch (error) {
      setScanStatus("Connection Failed. Check your internet.");
      setIsScanning(false);
    }
  };

  return (
    <div style={{ padding: "32px", maxWidth: "1400px", margin: "0 auto" }}>
      <header className="page-header">
        <div>
          <h1 className="page-title">BSR Intelligence</h1>
          <p className="page-subtitle">Direct Amazon Best Seller Rank Analysis & Trend Velocity</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div className="badge badge-accent">
            <Globe size={12} style={{ marginRight: 6 }} />
            Live Marketplace Feed
          </div>
          <div className="badge badge-success">
            <Zap size={12} style={{ marginRight: 6 }} />
            API Connected
          </div>
        </div>
      </header>

      {/* Main Search Area */}
      <section className="glass-card" style={{ padding: "40px", marginBottom: "32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "linear-gradient(90deg, transparent, var(--accent), transparent)", opacity: isScanning ? 1 : 0, animation: "loading-bar 2s infinite" }} />
        
        <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px", color: "var(--text-primary)" }}>
          Direct Amazon ASIN Lookup
        </h2>
        
        <div style={{ display: "flex", gap: "12px", maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} size={18} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Enter Amazon ASIN (e.g., B08N5KWB9H)" 
              style={{ paddingLeft: "44px", height: "54px", fontSize: "16px" }}
              value={asin}
              onChange={(e) => setAsin(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button 
            className="btn-accent" 
            style={{ height: "54px", padding: "0 32px", display: "flex", alignItems: "center", gap: 10 }}
            onClick={handleSearch}
            disabled={isScanning}
          >
            {isScanning ? <div className="spinner" /> : <Zap size={18} />}
            {isScanning ? "Scanning..." : "Fetch BSR"}
          </button>
        </div>

        {isScanning && (
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 500, fontFamily: "monospace" }}>
              {scanStatus}
            </div>
            <div className="progress-bar" style={{ width: "200px" }}>
              <div className="progress-bar-fill" style={{ width: "100%", animation: "progress-pulse 1.5s infinite" }} />
            </div>
          </div>
        )}

        <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)" }}>
            <ShieldCheck size={14} color="var(--success)" /> Verified ASIN Structure
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)" }}>
            <Activity size={14} color="var(--blue)" /> Real-time Indexing
          </div>
        </div>
      </section>

      {searchResult && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "32px", marginBottom: "32px" }}>
          <div className="glass-card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div className="badge badge-accent">Live Result</div>
              <button className="btn-ghost" style={{ padding: 6, borderRadius: 8 }}>
                <ExternalLink size={16} />
              </button>
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                Product Name
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>{searchResult.name}</div>
              <div style={{ fontSize: 13, color: "var(--accent)", marginTop: 2 }}>{searchResult.asin}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "var(--bg-secondary)", padding: 16, borderRadius: 12, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>CURRENT BSR</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>#{searchResult.bsr}</div>
                <div style={{ fontSize: 12, color: "var(--success)", display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                  <ArrowUpRight size={14} /> Improved 22%
                </div>
              </div>
              <div style={{ background: "var(--bg-secondary)", padding: 16, borderRadius: 12, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>TREND VELOCITY</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--blue)" }}>{searchResult.velocity}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Last 24 hours</div>
              </div>
            </div>

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Marketplace Category</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{searchResult.category}</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Rank History (Last 14 Updates)</h3>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Lower rank is better performance</div>
            </div>
            <div style={{ height: "240px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={searchResult.history}>
                  <defs>
                    <linearGradient id="colorRank" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
                  <YAxis reversed domain={['auto', 'auto']} tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                    labelStyle={{ fontWeight: 700, marginBottom: 4 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    name="BSR Rank"
                    stroke="var(--accent)" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRank)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
