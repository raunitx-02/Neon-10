"use client";
import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Upload, FileSpreadsheet, Loader2, Target, Star, ExternalLink, RefreshCcw } from "lucide-react";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";

interface AnalyzedProduct {
  asin: string;
  title: string;
  brand: string;
  image: string;
  price: number | null;
  bsr: number | null;
  rating: number | null;
  reviews: number | null;
  category: string;
}

export default function BulkAnalyzer() {
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<AnalyzedProduct[]>([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractAsins = (file: File) => {
    setError("");
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        
        let allText = "";
        workbook.SheetNames.forEach(sheetName => {
          const sheet = workbook.Sheets[sheetName];
          const csv = XLSX.utils.sheet_to_csv(sheet);
          allText += csv + " ";
        });

        // Regex to find ASINs (B0 followed by 8 alphanumeric chars)
        const asinRegex = /\bB0[A-Z0-9]{8}\b/g;
        const matches = allText.match(asinRegex) || [];
        const uniqueAsins = [...new Set(matches)];

        if (uniqueAsins.length === 0) {
          setError("No ASINs found in the uploaded file. Ensure ASINs start with 'B0'.");
          return;
        }

        analyzeAsins(uniqueAsins);
      } catch (err) {
        setError("Failed to parse the file. Please upload a valid Excel or CSV file.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const analyzeAsins = async (asins: string[]) => {
    setAnalyzing(true);
    setProgress(10);
    setResults([]);
    try {
      const res = await fetch("/api/bulk-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asins }),
      });
      
      setProgress(70);
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze");
      
      setProgress(90);

      const products: AnalyzedProduct[] = data.products || [];
      
      // Sort by BSR (lowest to highest, nulls at the end)
      products.sort((a, b) => {
        if (a.bsr === null && b.bsr === null) return 0;
        if (a.bsr === null) return 1;
        if (b.bsr === null) return -1;
        return a.bsr - b.bsr;
      });

      setResults(products);
      setProgress(100);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setTimeout(() => setAnalyzing(false), 500);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="Bulk ASIN Analyzer" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                <FileSpreadsheet className="text-indigo-500" /> Bulk ASIN Analyzer
              </h1>
              <p className="text-slate-400 mt-1">Upload an Excel file containing Amazon India ASINs. We'll automatically extract them and fetch their latest analytics, sorted by Best Seller Rank.</p>
            </div>

            {/* Upload Zone */}
            {!analyzing && results.length === 0 && (
              <div 
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer
                  ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900/50 hover:bg-slate-900'}
                `}
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    extractAsins(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-200 mb-1">Click or drag & drop an Excel file</h3>
                <p className="text-sm text-slate-500">Supports .xlsx, .xls, .csv</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".xlsx, .xls, .csv" 
                  onChange={e => e.target.files && extractAsins(e.target.files[0])}
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
                {error}
              </div>
            )}

            {/* Loading State */}
            {analyzing && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-200 mb-2">Analyzing ASINs...</h3>
                <div className="w-full max-w-md mx-auto bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
                  <div className="bg-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-sm text-slate-500">Extracting data from Keepa (India)...</p>
              </div>
            )}

            {/* Results Grid */}
            {!analyzing && results.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-200">Analyzed {results.length} Products</h2>
                  <button 
                    onClick={() => { setResults([]); setProgress(0); }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    <RefreshCcw size={16} /> Analyze Another File
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {results.map((p, i) => (
                    <div key={p.asin} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-colors flex flex-col relative">
                      {/* BSR Badge */}
                      <div className="absolute top-3 left-3 px-2 py-1 bg-indigo-500 text-white text-xs font-bold rounded shadow-lg flex items-center gap-1 z-10">
                        <Target size={12} /> BSR: {p.bsr ? `#${p.bsr.toLocaleString()}` : 'N/A'}
                      </div>
                      
                      {/* Image */}
                      <div className="h-48 bg-white flex items-center justify-center p-4 relative">
                        {p.image ? (
                          <img src={p.image} alt={p.title} className="max-h-full max-w-full object-contain" />
                        ) : (
                          <div className="text-slate-300">No Image</div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">{p.brand}</div>
                        <h3 className="text-sm font-medium text-slate-200 line-clamp-2 mb-3 flex-1" title={p.title}>{p.title}</h3>
                        
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="bg-slate-950 rounded p-2 border border-slate-800/50">
                            <div className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Price</div>
                            <div className="text-sm font-bold text-emerald-400 flex items-center">
                              {p.price ? `₹${p.price.toLocaleString()}` : 'N/A'}
                            </div>
                          </div>
                          <div className="bg-slate-950 rounded p-2 border border-slate-800/50">
                            <div className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Rating</div>
                            <div className="text-sm font-bold text-amber-400 flex items-center gap-1">
                              {p.rating ? <><Star size={12} fill="currentColor" /> {p.rating.toFixed(1)}</> : 'N/A'}
                            </div>
                          </div>
                        </div>

                        <a 
                          href={`https://www.amazon.in/dp/${p.asin}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
                        >
                          View on Amazon.in <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
