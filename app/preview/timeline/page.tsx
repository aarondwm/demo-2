"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/ui/mini-navbar";

const DAILY_DATA = [
  { day: "Day 1 · Feb 15", views: 15420, cumulative: 15420, topIndustry: "Construction", topCompany: "Alghanim International" },
  { day: "Day 2 · Feb 16", views: 23053, cumulative: 38473, topIndustry: "Engineering Services", topCompany: "Kharafi National" },
  { day: "Day 3 · Feb 17", views: 21840, cumulative: 60313, topIndustry: "Oil & Gas", topCompany: "HEISCO" },
  { day: "Day 4 · Feb 18", views: 18290, cumulative: 78603, topIndustry: "Real Estate", topCompany: "Combined Group Contracting" },
  { day: "Day 5 · Feb 19", views: 13782, cumulative: 92385, topIndustry: "Civil Engineering", topCompany: "NBTC Group" },
];

const EVENTS = [
  { time: "09:14", text: "Article published on Al Qabas", type: "milestone" },
  { time: "09:47", text: "First C-Suite reader identified", type: "alert" },
  { time: "10:22", text: "Alghanim International — 12 views", type: "company" },
  { time: "11:05", text: "Construction industry surges to #1", type: "alert" },
  { time: "12:30", text: "Kharafi National — 8 views", type: "company" },
  { time: "14:15", text: "500 senior-level viewers reached", type: "milestone" },
  { time: "15:42", text: "HEISCO — 6 views", type: "company" },
  { time: "17:00", text: "Day 1 close: 15,420 total views", type: "milestone" },
  { time: "09:02", text: "Day 2 opens — momentum building", type: "milestone" },
  { time: "10:18", text: "Kuwait Oil Company — 14 views", type: "company" },
  { time: "11:45", text: "Peak hour: 3,200 views in 60min", type: "alert" },
  { time: "13:30", text: "1,000 senior viewers milestone", type: "milestone" },
  { time: "16:00", text: "Day 2 close: 23,053 views (peak)", type: "milestone" },
  { time: "10:00", text: "Day 3 — 60,000 cumulative views", type: "milestone" },
  { time: "14:22", text: "32,937 senior-level viewers", type: "alert" },
  { time: "17:00", text: "Campaign concludes: 92,385 views", type: "milestone" },
];

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return <>{val.toLocaleString()}</>;
}

export default function PreviewTimeline() {
  const [activeDay, setActiveDay] = useState(0);
  const [feedItems, setFeedItems] = useState<typeof EVENTS>([]);
  const [feedIdx, setFeedIdx] = useState(0);
  const [playing, setPlaying] = useState(true);

  // Auto-advance days
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setActiveDay(d => {
        const next = (d + 1) % 5;
        return next;
      });
    }, 6000);
    return () => clearInterval(timer);
  }, [playing]);

  // Feed ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setFeedIdx(prev => {
        const idx = prev % EVENTS.length;
        setFeedItems(current => [EVENTS[idx], ...current].slice(0, 6));
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const day = DAILY_DATA[activeDay];
  const maxViews = 23053;

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
            ITERATION 2 — ANIMATED CAMPAIGN TIMELINE
          </p>

          <div className="border border-white/[0.08] bg-black rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div>
                <div className="font-mono text-[8px] tracking-[0.2em] uppercase text-white/30 mb-1">LIVE CAMPAIGN REPLAY</div>
                <div className="font-mono text-[13px] text-white/80">Al Qabas — Kuwait Real Estate Market Analysis</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#4a6cf7", boxShadow: "0 0 6px #4a6cf7" }} />
                <span className="font-mono text-[9px] tracking-[0.15em] uppercase" style={{ color: "#4a6cf7" }}>REPLAYING</span>
              </div>
            </div>

            {/* Timeline bar */}
            <div className="flex border-b border-white/[0.06]">
              {DAILY_DATA.map((d, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveDay(i); setPlaying(false); }}
                  className="flex-1 relative py-3 text-center transition-colors"
                  style={{ background: i === activeDay ? "rgba(74,108,247,0.06)" : "transparent" }}
                >
                  <div className="font-mono text-[9px] tracking-[0.1em] uppercase" style={{ color: i === activeDay ? "#4a6cf7" : "rgba(255,255,255,0.25)" }}>
                    Day {i + 1}
                  </div>
                  <div className="font-mono font-bold" style={{ fontSize: "14px", color: i === activeDay ? "#4a6cf7" : "rgba(255,255,255,0.4)" }}>
                    {d.views.toLocaleString()}
                  </div>
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div
                      className="h-full"
                      style={{
                        width: `${(d.views / maxViews) * 100}%`,
                        background: i === activeDay ? "#4a6cf7" : "rgba(74,108,247,0.3)",
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Main content — 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Left: Day stats */}
              <div className="p-6 border-b md:border-b-0 md:border-r border-white/[0.06]">
                <div className="font-mono text-[8px] tracking-[0.18em] uppercase text-white/25 mb-4">{day.day}</div>

                {/* Cumulative counter */}
                <div className="mb-6">
                  <div style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: "clamp(36px, 6vw, 52px)", fontWeight: 800, color: "#4a6cf7", letterSpacing: "-0.03em", lineHeight: 1 }}>
                    <AnimatedCounter target={day.cumulative} key={activeDay} duration={1200} />
                  </div>
                  <div className="font-mono text-[8px] tracking-[0.18em] uppercase text-white/30 mt-1">CUMULATIVE VIEWS</div>
                </div>

                {/* Day bar chart */}
                <div className="flex flex-col gap-3 mb-6">
                  {DAILY_DATA.map((dd, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="font-mono w-[32px] flex-shrink-0" style={{ fontSize: "9px", color: i === activeDay ? "#4a6cf7" : "rgba(255,255,255,0.25)" }}>D{i + 1}</span>
                      <div className="flex-1 h-[8px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${(dd.views / maxViews) * 100}%`,
                            background: i === activeDay ? "#4a6cf7" : i < activeDay ? "rgba(74,108,247,0.5)" : "rgba(74,108,247,0.15)",
                          }}
                        />
                      </div>
                      <span className="font-mono flex-shrink-0 w-[50px] text-right" style={{ fontSize: "10px", color: i === activeDay ? "#4a6cf7" : "rgba(255,255,255,0.3)" }}>
                        {dd.views.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Day highlights */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg" style={{ background: "rgba(74,108,247,0.04)", border: "1px solid rgba(74,108,247,0.1)" }}>
                    <div className="font-mono text-[7px] tracking-[0.18em] uppercase text-white/25 mb-1">TOP INDUSTRY</div>
                    <div className="font-mono text-[11px] text-white/70">{day.topIndustry}</div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: "rgba(74,108,247,0.04)", border: "1px solid rgba(74,108,247,0.1)" }}>
                    <div className="font-mono text-[7px] tracking-[0.18em] uppercase text-white/25 mb-1">TOP COMPANY</div>
                    <div className="font-mono text-[11px] text-white/70">{day.topCompany}</div>
                  </div>
                </div>
              </div>

              {/* Right: Live activity feed */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#4a6cf7", boxShadow: "0 0 4px #4a6cf7" }} />
                  <span className="font-mono text-[8px] tracking-[0.18em] uppercase text-white/30">ACTIVITY LOG</span>
                </div>
                <div className="flex flex-col" style={{ minHeight: "280px" }}>
                  {feedItems.map((item, i) => (
                    <div
                      key={`${item.time}-${item.text}-${i}`}
                      className="flex items-start gap-3 py-2 border-b border-white/[0.03]"
                      style={{
                        opacity: i === 0 ? 1 : Math.max(0.2, 1 - i * 0.18),
                        animation: i === 0 ? "feedIn 0.4s ease" : "none",
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                        style={{
                          background: item.type === "milestone" ? "#4a6cf7" : item.type === "alert" ? "#f59e0b" : "rgba(255,255,255,0.3)",
                          boxShadow: i === 0 && item.type === "milestone" ? "0 0 6px rgba(74,108,247,0.5)" : i === 0 && item.type === "alert" ? "0 0 6px rgba(245,158,11,0.5)" : "none",
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-mono" style={{ fontSize: "11px", color: i === 0 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)" }}>
                          {item.text}
                        </span>
                      </div>
                      <span className="font-mono flex-shrink-0" style={{ fontSize: "9px", color: "rgba(255,255,255,0.15)" }}>
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
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
