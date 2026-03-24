"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/ui/mini-navbar";

const DATASETS = [
  ["2,847", "1,392", "934", "611", "478"],
  ["1,204", "897", "743", "521", "389"],
  ["3,102", "1,847", "1,203", "872", "641"],
  ["891", "743", "612", "489", "334"],
  ["2,103", "1,648", "1,287", "934", "712"],
  ["1,847", "1,203", "987", "743", "521"],
  ["3,841", "2,910", "2,104", "1,763", "1,302"],
  ["2,847", "2,103", "1,847", "1,392", "987"],
];

const ORGS = ["**********", "********", "******", "*********", "************"];
const INDUSTRIES = ["Banking", "Investment", "Energy", "Telecom", "Logistics"];
const SENIORITIES = ["C-Suite", "Director", "VP", "Manager", "Analyst"];

function PulseCell({ value, pulse }: { value: string; pulse: boolean }) {
  return (
    <span
      style={{
        transition: "color 0.3s ease, text-shadow 0.3s ease",
        color: pulse ? "rgba(74,108,247,1)" : "rgba(255,255,255,0.80)",
        textShadow: pulse ? "0 0 12px rgba(74,108,247,0.6), 0 0 24px rgba(74,108,247,0.3)" : "none",
      }}
    >
      {value}
    </span>
  );
}

export default function PreviewPulse() {
  const [dataIdx, setDataIdx] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  const [rowsVisible, setRowsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  /* Cycle datasets every 5s with pulse */
  useEffect(() => {
    const timer = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => {
        setDataIdx((i) => (i + 1) % DATASETS.length);
        setTimeout(() => setIsPulsing(false), 400);
      }, 300);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  /* Row stagger on viewport entry */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRowsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const engagement = DATASETS[dataIdx];
  const rows = ORGS.map((org, i) => ({
    org,
    industry: INDUSTRIES[i],
    seniority: SENIORITIES[i],
    engagement: engagement[i],
  }));

  return (
    <main className="min-h-screen bg-[#04060c] text-white">
      <Navbar />
      <div className="pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-[1200px] mx-auto" ref={sectionRef}>
          <div className="flex items-center mb-5">
            <span className="sys-label" style={{ fontSize: "13px" }}>
              <img
                src="/Untitled design.png"
                alt=""
                style={{ width: "14px", height: "14px", marginRight: "8px", display: "inline-block", verticalAlign: "middle", mixBlendMode: "screen" }}
              />
              Sample Insights
            </span>
          </div>
          <h2
            className="font-display font-bold uppercase text-white text-center mb-10"
            style={{ fontSize: "clamp(28px,4vw,48px)", letterSpacing: "0.05em", lineHeight: "1" }}
          >
            Campaign Intelligence — Live
          </h2>
          <p className="text-center font-mono text-[11px] tracking-[0.2em] uppercase text-white/30 mb-4">
            ITERATION 2 — ROW STAGGER + LIVE DATA PULSE ON CYCLE
          </p>

          <div className="h-[420px] border border-white/[0.08]">
            <div className="relative w-full h-full flex flex-col overflow-hidden bg-black">
              {/* Grid overlay */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Scan line */}
              <div
                className="absolute left-0 right-0 h-[2px] pointer-events-none z-10"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(74,108,247,0.5) 20%, rgba(74,108,247,0.8) 50%, rgba(74,108,247,0.5) 80%, transparent)",
                  boxShadow: "0 0 12px rgba(74,108,247,0.4), 0 0 24px rgba(74,108,247,0.2)",
                  animation: "scanLine 4s ease-in-out infinite",
                }}
              />

              {/* Header */}
              <div className="relative flex items-center justify-between px-6 py-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: isPulsing ? "#4a6cf7" : "#4a6cf7",
                      boxShadow: isPulsing ? "0 0 8px #4a6cf7, 0 0 16px rgba(74,108,247,0.5)" : "0 0 4px rgba(74,108,247,0.4)",
                      animation: "pulse 2s ease infinite",
                      transition: "box-shadow 0.3s ease",
                    }}
                  />
                  <span className="font-mono font-bold tracking-[0.22em] uppercase" style={{ fontSize: "13px", color: "#e8e2d6" }}>
                    Campaign Intelligence — Live
                  </span>
                </div>
                <span className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
                  What we know, they don&apos;t
                </span>
              </div>
              {/* Table */}
              <div className="relative flex-1 overflow-x-auto">
                <table className="w-full" style={{ minWidth: "480px" }}>
                  <thead>
                    <tr className="border-b border-white/[0.10]">
                      {["Organization", "Industry", "Seniority", "Engagement"].map((h) => (
                        <th key={h} className="font-mono tracking-[0.2em] uppercase text-left font-normal px-4 py-2.5" style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-white/[0.04] hover:bg-white/[0.04] transition-all duration-300"
                        style={{
                          opacity: rowsVisible ? 1 : 0,
                          transform: rowsVisible ? "translateY(0)" : "translateY(12px)",
                          transition: `opacity 0.4s ease ${0.1 + i * 0.08}s, transform 0.4s ease ${0.1 + i * 0.08}s`,
                        }}
                      >
                        <td className="font-mono tracking-wider px-4 py-3" style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>{row.org}</td>
                        <td className="font-mono tracking-[0.1em] uppercase px-4 py-3" style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>{row.industry}</td>
                        <td className="font-mono tracking-[0.1em] uppercase px-4 py-3" style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)" }}>{row.seniority}</td>
                        <td className="font-mono px-4 py-3" style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.05em" }}>
                          <PulseCell value={row.engagement} pulse={isPulsing} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Footer */}
              <div className="relative flex items-center justify-between px-6 py-2.5 border-t border-white/[0.08]">
                <span className="font-mono tracking-[0.2em] uppercase" style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
                  Full data available after onboarding
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-[#4a6cf7]" />
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/50">RESTRICTED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0% { top: 52px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: calc(100% - 40px); opacity: 0; }
        }
      `}</style>
    </main>
  );
}
