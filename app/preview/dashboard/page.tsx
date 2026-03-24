"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/ui/mini-navbar";

const INDUSTRIES = [
  { name: "Financial Services", views: 42180 },
  { name: "Oil & Gas", views: 31420 },
  { name: "Real Estate", views: 24890 },
  { name: "Construction", views: 19740 },
  { name: "Technology", views: 16350 },
  { name: "Healthcare", views: 12870 },
];

const COMPANIES = [
  { rank: "01", name: "Saudi Aramco", views: 3420 },
  { rank: "02", name: "Emirates NBD", views: 2810 },
  { rank: "03", name: "SABIC Industries", views: 2340, blur: true },
  { rank: "04", name: "Qatar Energy Corp", views: 1980, blur: true },
  { rank: "05", name: "Etisalat Group", views: 1640 },
  { rank: "06", name: "Emaar Properties", views: 1290, blur: true },
];

const SENIORITY = [
  { level: "Managers", count: 48200 },
  { level: "Senior Professionals", count: 36800 },
  { level: "Directors", count: 12400 },
  { level: "C-Suite (CXO)", count: 4180 },
];

const TABS = ["Overview", "Industries", "Companies"];

function AnimatedNumber({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, duration]);
  return <>{display.toLocaleString()}</>;
}

export default function PreviewDashboard() {
  const [tab, setTab] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 300);
  }, []);

  return (
    <main className="min-h-screen bg-[#04060c] text-white">
      <Navbar />
      <div className="pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center mb-5">
            <span className="sys-label" style={{ fontSize: "12px", letterSpacing: "0.3em" }}>
              <img src="/Untitled design.png" alt="" style={{ width: "14px", height: "14px", marginRight: "8px", display: "inline-block", verticalAlign: "middle", mixBlendMode: "screen" }} />
              Sample Insights
            </span>
          </div>
          <h2
            className="font-bold uppercase text-center mb-6"
            style={{ fontFamily: "'Neue Montreal', var(--font-display), sans-serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.05 }}
          >
            What We Know, <span style={{ color: "#4a6cf7" }}>They Don&apos;t.</span>
          </h2>
          <p className="text-center font-mono text-[11px] tracking-[0.2em] uppercase text-white/30 mb-8">
            ITERATION 1 — INTERACTIVE CAMPAIGN DASHBOARD
          </p>

          {/* Dashboard */}
          <div className="border border-white/[0.08] bg-black rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#4a6cf7", boxShadow: "0 0 6px #4a6cf7, 0 0 12px rgba(74,108,247,0.5)" }} />
                <span className="font-mono font-bold tracking-[0.22em] uppercase" style={{ fontSize: "11px", color: "#e8e2d6" }}>Campaign Report</span>
              </div>
              <span className="font-mono text-[9px] tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>SAMPLE</span>
            </div>

            {/* Hero Stat */}
            <div className="bg-black px-6 py-6 flex flex-col items-center gap-1 border-b border-white/[0.06]">
              <span style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: "clamp(40px, 8vw, 64px)", fontWeight: 800, color: "#4a6cf7", letterSpacing: "-0.03em" }}>
                {visible ? <AnimatedNumber value={247610} /> : "0"}
              </span>
              <span className="font-mono uppercase" style={{ fontSize: "9px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.35)" }}>Total Article Views</span>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/[0.06]">
              {TABS.map((t, i) => (
                <button
                  key={t}
                  onClick={() => setTab(i)}
                  className="flex-1 py-3 font-mono text-[10px] tracking-[0.2em] uppercase text-center transition-colors duration-200"
                  style={{
                    color: tab === i ? "#4a6cf7" : "rgba(255,255,255,0.3)",
                    borderBottom: tab === i ? "2px solid #4a6cf7" : "2px solid transparent",
                    background: tab === i ? "rgba(74,108,247,0.04)" : "transparent",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6" style={{ minHeight: "300px" }}>
              {/* Overview */}
              {tab === 0 && (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/30">Seniority Breakdown</span>
                    <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-white/20">Viewership</span>
                  </div>
                  {SENIORITY.map((s, i) => (
                    <div key={s.level} className="flex items-center gap-3">
                      <span className="font-mono w-[140px] flex-shrink-0" style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>{s.level}</span>
                      <div className="flex-1 h-[6px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: visible ? `${(s.count / 48200) * 100}%` : "0%",
                            background: i === 0 ? "#4a6cf7" : `rgba(74,108,247,${0.8 - i * 0.1})`,
                            transition: `width 0.8s ease ${i * 0.1}s`,
                          }}
                        />
                      </div>
                      <span className="font-mono font-bold flex-shrink-0 w-[60px] text-right" style={{ fontSize: "11px", color: "#4a6cf7" }}>
                        {s.count.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Industries */}
              {tab === 1 && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/30">Top Industries</span>
                    <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-white/20">Viewership</span>
                  </div>
                  {INDUSTRIES.map((ind, i) => (
                    <div key={ind.name} className="flex items-center gap-3">
                      <span className="font-mono w-[160px] flex-shrink-0 truncate" style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>{ind.name}</span>
                      <div className="flex-1 h-[6px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(ind.views / 42180) * 100}%`,
                            background: `rgba(74,108,247,${1 - i * 0.07})`,
                            transition: `width 0.8s ease ${i * 0.06}s`,
                          }}
                        />
                      </div>
                      <span className="font-mono font-bold flex-shrink-0 w-[50px] text-right" style={{ fontSize: "11px", color: "#4a6cf7", filter: i % 2 === 1 ? "blur(4px)" : "none", userSelect: i % 2 === 1 ? "none" : "auto" }}>
                        {ind.views.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Companies */}
              {tab === 2 && (
                <div className="flex flex-col gap-0">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/30">Top Companies</span>
                    <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-white/20">Viewership</span>
                  </div>
                  {COMPANIES.map((c, i) => (
                    <div
                      key={c.rank}
                      className="flex items-center gap-3 py-2.5 border-b border-white/[0.03]"
                      style={{ opacity: i < 5 ? 1 : 0.6 }}
                    >
                      <span className="font-mono flex-shrink-0 w-[20px]" style={{ fontSize: "10px", color: i === 0 ? "#4a6cf7" : "rgba(74,108,247,0.4)", letterSpacing: "0.1em" }}>
                        {c.rank}
                      </span>
                      <span className="font-mono flex-1 truncate" style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", filter: (c as any).blur ? "blur(5px)" : "none", userSelect: (c as any).blur ? "none" : "auto" }}>
                        {c.name}
                      </span>
                      <div className="w-[60px] h-[4px] rounded-full overflow-hidden flex-shrink-0" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <div className="h-full rounded-full" style={{ width: `${(c.views / 3420) * 100}%`, background: "#4a6cf7", transition: `width 0.6s ease ${i * 0.05}s` }} />
                      </div>
                      <span className="font-mono font-bold flex-shrink-0 w-[50px] text-right" style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>
                        {c.views}
                      </span>
                    </div>
                  ))}
                  <div className="mt-3 font-mono text-[9px] text-white/20 text-center">40+ companies with 500+ views each</div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-2.5 border-t border-white/[0.08]">
              <span className="font-mono tracking-[0.2em] uppercase" style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)" }}>
                Full data available after onboarding
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-[#4a6cf7]" />
                <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/50">SAMPLE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
