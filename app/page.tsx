"use client";

import { Navbar }          from "@/components/ui/mini-navbar";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Spotlight }        from "@/components/ui/spotlight";
import { Feature108 }       from "@/components/ui/feature108";
import { LogoCloud }        from "@/components/ui/logo-cloud-2";
import { WorldMap }         from "@/components/ui/map";
import { TestimonialsColumn, type Testimonial } from "@/components/ui/testimonials-columns-1";

/* ── Testimonials ────────────────────────────────────────────────────────── */
const testimonials: Testimonial[] = [
  {
    text: "DWM gave us visibility we simply could not achieve through traditional media buying. Within weeks, we were seeing engagement from exactly the senior profiles we needed to reach. The reporting alone justified the investment.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "CEO",
    role: "Kuwait Real Estate Development",
  },
  {
    text: "What sets DWM apart is the intelligence layer. We don't just know our content was seen — we know who saw it, at what level, and in which industry. That changes how we plan every campaign going forward.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "CFO",
    role: "GCC Telecommunications Company",
  },
  {
    text: "We had tried LinkedIn campaigns in-house for months with minimal traction. DWM's distribution system reached decision-makers we couldn't access on our own, and the cost efficiency was remarkable.",
    image: "https://randomuser.me/api/portraits/men/58.jpg",
    name: "Head of Marketing",
    role: "Kuwait Investment Management",
  },
  {
    text: "The audience breakdown reports were eye-opening. We presented them directly to our board and it shifted how leadership thinks about our market positioning in the Gulf entirely.",
    image: "https://randomuser.me/api/portraits/women/61.jpg",
    name: "Managing Director",
    role: "Regional Energy & Infrastructure",
  },
];

const firstColumn  = testimonials.slice(0, 2);
const secondColumn = testimonials.slice(1, 3);
const thirdColumn  = testimonials.slice(2, 4);

/* ── Map — Kuwait hub → GCC spokes only ─────────────────────────────────── */
// Coordinate math (full-world SVG projection: 800×400):
//   x = (lng + 180) * (800/360)   y = (90 - lat) * (400/180)
// Kuwait City ≈ x 506.6, y 134.7  |  Muscat ≈ x 529.7, y 147.6
// GCC viewBox "486 119 66 33" = exactly 2:1, covers all 5 destinations + arc headroom
const GCC_VIEWBOX   = "486 119 66 33";
const GCC_CURVE_H   = 8;             // arc height in SVG units (full-world default = 50)

const mapDots = [
  { start: { lat: 29.3759, lng: 47.9774, label: "Kuwait City" }, end: { lat: 24.7136, lng: 46.6753, label: "Riyadh"  } },
  { start: { lat: 29.3759, lng: 47.9774, label: "Kuwait City" }, end: { lat: 25.2048, lng: 55.2708, label: "Dubai"   } },
  { start: { lat: 29.3759, lng: 47.9774, label: "Kuwait City" }, end: { lat: 25.2854, lng: 51.5310, label: "Doha"    } },
  { start: { lat: 29.3759, lng: 47.9774, label: "Kuwait City" }, end: { lat: 26.2235, lng: 50.5876, label: "Manama"  } },
  { start: { lat: 29.3759, lng: 47.9774, label: "Kuwait City" }, end: { lat: 23.5880, lng: 58.3829, label: "Muscat"  } },
];

/* ── Dashboard card interior ─────────────────────────────────────────────── */
function DashboardCard() {
  const rows = [
    { org: "████████████",    industry: "Banking",    seniority: "C-Suite",  engagement: "High" },
    { org: "██████████",      industry: "Investment", seniority: "Director", engagement: "High" },
    { org: "████████",        industry: "Energy",     seniority: "VP",       engagement: "Med"  },
    { org: "███████████",     industry: "Telecom",    seniority: "Manager",  engagement: "Med"  },
    { org: "██████████████",  industry: "Logistics",  seniority: "Analyst",  engagement: "—"    },
  ];

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#04060c]">
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#1c1f30 1px, transparent 1px), linear-gradient(90deg, #1c1f30 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Card header */}
      <div className="relative flex items-center justify-between px-6 py-3 border-b border-[#1c1f30]">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 bg-[#4a6cf7] animate-pulse" />
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#4a6cf7]">
            Campaign Intelligence — Live
          </span>
        </div>
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#363c52]">
          AXM.DWM.FEED
        </span>
      </div>

      {/* Table */}
      <div className="relative flex-1 overflow-hidden px-2">
        {/* Column headers */}
        <div className="grid grid-cols-4 gap-0 px-4 py-2.5 border-b border-[#141726]">
          {["Organisation", "Industry", "Seniority", "Engagement"].map((h) => (
            <span key={h} className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#363c52]">
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {rows.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-4 gap-0 px-4 py-3 border-b border-[#0d1020]
              hover:bg-[#0a0c16] transition-colors duration-150 group"
          >
            <span className="font-mono text-[11px] text-[#363c52] tracking-wider">
              {row.org}
            </span>
            <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-[#636b84]">
              {row.industry}
            </span>
            <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-[#636b84]">
              {row.seniority}
            </span>
            <span
              className={`font-mono text-[11px] tracking-[0.1em] uppercase ${
                row.engagement === "High"
                  ? "text-[#4a6cf7]"
                  : row.engagement === "Med"
                  ? "text-[#636b84]"
                  : "text-[#363c52]"
              }`}
            >
              {row.engagement}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="relative flex items-center justify-between px-6 py-2.5 border-t border-[#1c1f30]">
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#363c52]">
          Full data available after onboarding
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 bg-[#4a6cf7]" />
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#363c52]">
            RESTRICTED
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#04060c] grain">

      {/* ── 1. NAVBAR ────────────────────────────────────────────────────── */}
      <Navbar />

      {/* ── 2. HERO SCROLL ───────────────────────────────────────────────── */}
      <section id="home" className="relative pt-[72px]">
        <ContainerScroll
          titleComponent={
            <div className="flex flex-col items-center gap-7 pb-6">

              {/* Label */}
              <div
                className="opacity-0"
                style={{ animation: "reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s forwards" }}
              >
                <div className="rule-accent">
                  <span className="sys-label">Precision Advertising & Media Intelligence</span>
                </div>
              </div>

              {/* Headline */}
              <div
                className="opacity-0"
                style={{ animation: "reveal-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s forwards" }}
              >
                <h1
                  className="font-display font-bold uppercase text-center text-[#e8eaf2] leading-[0.90]"
                  style={{ fontSize: "clamp(52px,9vw,110px)", letterSpacing: "0.03em" }}
                >
                  Reach the<br />
                  <span style={{ color: "var(--gold)" }}>Decision-Makers</span><br />
                  That Matter
                </h1>
              </div>

              {/* Subtext */}
              <div
                className="opacity-0 max-w-xl text-center"
                style={{ animation: "reveal-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s forwards" }}
              >
                <p className="sys-body">
                  Precision advertising and audience intelligence for the enterprises and institutions
                  that shape the Gulf. We don&apos;t do impressions — we deliver insight.
                </p>
              </div>

              {/* CTAs */}
              <div
                className="flex flex-wrap items-center justify-center gap-3 opacity-0"
                style={{ animation: "reveal-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.7s forwards" }}
              >
                <a href="#get-started" className="sys-btn-primary">
                  Request a Briefing
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
                <a href="#methodology" className="sys-btn-outline">
                  See How It Works ↓
                </a>
              </div>
            </div>
          }
        >
          <DashboardCard />
        </ContainerScroll>
      </section>

      {/* ── 3. INTERACTIVE 3D ────────────────────────────────────────────── */}
      <section id="intelligence" className="sys-section">
        <div className="max-w-6xl mx-auto px-6 md:px-10">

          {/* Section header */}
          <div className="grid lg:grid-cols-2 gap-10 mb-12 items-end">
            <div>
              <div className="rule-accent mb-5">
                <span className="sys-label">Intelligence, Visualized</span>
              </div>
              <h2
                className="font-display font-bold uppercase text-[#e8eaf2]"
                style={{ fontSize: "clamp(36px,5vw,60px)", letterSpacing: "0.05em", lineHeight: "0.93" }}
              >
                The Data Is<br />the Product
              </h2>
            </div>
            <p className="sys-body lg:max-w-sm lg:ml-auto">
              Most agencies deliver impressions. We deliver who engaged, what industry they operate
              in, and how senior they are — segmented by company, role, and frequency.
              Exportable. Presentable. Boardroom-ready.
            </p>
          </div>

          {/* Intelligence panel — full width, no 3D scene */}
          <div className="relative w-full bg-[#070910] border border-[#1c1f30] overflow-hidden">
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#4a6cf7" />

            <div className="p-10 md:p-14 grid md:grid-cols-2 gap-12 items-center">
              {/* Left: heading */}
              <div className="flex flex-col gap-6">
                <span className="sys-label block">Audience Intelligence</span>
                <h3
                  className="font-display font-bold uppercase text-[#e8eaf2]"
                  style={{ fontSize: "clamp(28px,3vw,48px)", letterSpacing: "0.05em", lineHeight: "0.95" }}
                >
                  See Exactly<br />Who Engaged
                </h3>
                <p className="sys-body max-w-md">
                  Most agencies deliver impressions. We deliver who engaged, what industry they operate in,
                  and how senior they are — segmented by company, role, and frequency.
                  Exportable. Presentable. Boardroom-ready.
                </p>
                <a href="#get-started" className="sys-btn-primary self-start mt-2">
                  Request a Briefing
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              {/* Right: feature grid */}
              <ul className="grid grid-cols-2 gap-px bg-[#1c1f30] border border-[#1c1f30]">
                {[
                  { n: "01", label: "Company-Level Engagement" },
                  { n: "02", label: "Seniority Breakdown (Analyst → C-Suite)" },
                  { n: "03", label: "Industry Segmentation" },
                  { n: "04", label: "DWM-Branded Exportable Reports" },
                ].map(({ n, label }) => (
                  <li key={n} className="bg-[#070910] p-6 flex flex-col gap-3">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-[#4a6cf7]">{n}</span>
                    <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#8890a0] leading-relaxed">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Corner marks */}
            <span className="absolute top-2 left-2   w-3 h-3 border-t border-l border-[#4a6cf7] pointer-events-none" />
            <span className="absolute top-2 right-2  w-3 h-3 border-t border-r border-[#4a6cf7] pointer-events-none" />
            <span className="absolute bottom-2 left-2  w-3 h-3 border-b border-l border-[#363c52] pointer-events-none" />
            <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#363c52] pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ── 4. FEATURE TABS ──────────────────────────────────────────────── */}
      <section id="services">
        <Feature108 />
      </section>

      {/* ── 5. LOGO CLOUD ────────────────────────────────────────────────── */}
      <section id="capabilities" className="sys-section">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
            <div>
              <div className="rule-accent mb-5">
                <span className="sys-label">Ecosystem</span>
              </div>
              <h2
                className="font-display font-bold uppercase text-[#e8eaf2] mb-5"
                style={{ fontSize: "clamp(28px,3.5vw,44px)", letterSpacing: "0.05em", lineHeight: "0.93" }}
              >
                Powered by Platforms Trusted Worldwide
              </h2>
              <p className="sys-body max-w-sm">
                Built on the world&apos;s leading advertising, AI, and data infrastructure.
                Enterprise-grade from day one.
              </p>
            </div>
            <LogoCloud />
          </div>
        </div>
      </section>

      {/* ── 6. WORLD MAP ─────────────────────────────────────────────────── */}
      <section className="sys-section">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="rule-accent mb-5">
                <span className="sys-label">Regional Coverage</span>
              </div>
              <h2
                className="font-display font-bold uppercase text-[#e8eaf2]"
                style={{ fontSize: "clamp(36px,5vw,60px)", letterSpacing: "0.05em", lineHeight: "0.93" }}
              >
                Kuwait &amp; GCC
              </h2>
            </div>
            <p className="sys-body md:max-w-xs md:text-right">
              Precision distribution across the Gulf&apos;s key commercial centres.
              Kuwait City is the hub — every connection intentional.
            </p>
          </div>
          <WorldMap
            dots={mapDots}
            lineColor="#4a6cf7"
            svgViewBox={GCC_VIEWBOX}
            curveHeight={GCC_CURVE_H}
          />
        </div>
      </section>

      {/* ── 7. TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="sys-section">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="mb-14 text-center">
            <div className="rule-accent-center mb-5">
              <span className="sys-label">Field Reports</span>
            </div>
            <h2
              className="font-display font-bold uppercase text-[#e8eaf2]"
              style={{ fontSize: "clamp(36px,5vw,60px)", letterSpacing: "0.05em", lineHeight: "0.93" }}
            >
              Trusted by<br />Decision Makers
            </h2>
          </div>

          <div
            className="flex justify-center gap-4 overflow-hidden"
            style={{
              maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
              maxHeight: "680px",
            }}
          >
            <TestimonialsColumn testimonials={firstColumn}  duration={20} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={25} />
            <TestimonialsColumn testimonials={thirdColumn}  className="hidden lg:block" duration={22} />
          </div>
        </div>
      </section>

      {/* ── CTA BLOCK ────────────────────────────────────────────────────── */}
      <section id="get-started" className="sys-section">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="border border-[#1c1f30] bg-[#070910] p-12 md:p-20 relative overflow-hidden">
            {/* Amber glow */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 70% 50%, rgba(74,108,247,0.10) 0%, transparent 60%)",
              }}
            />
            {/* Corner marks */}
            <span className="absolute top-3 left-3   w-5 h-5 border-t border-l border-[#4a6cf7]" />
            <span className="absolute top-3 right-3  w-5 h-5 border-t border-r border-[#4a6cf7]" />
            <span className="absolute bottom-3 left-3  w-5 h-5 border-b border-l border-[#363c52]" />
            <span className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[#363c52]" />

            <div className="relative z-10 max-w-2xl">
              <div className="rule-accent mb-7">
                <span className="sys-label">Get Started</span>
              </div>
              <h2
                className="font-display font-bold uppercase text-[#e8eaf2] mb-7"
                style={{ fontSize: "clamp(40px,6.5vw,84px)", letterSpacing: "0.03em", lineHeight: "0.90" }}
              >
                Ready to Reach<br />the People<br />
                <span style={{ color: "var(--gold)" }}>Who Decide?</span>
              </h2>
              <p className="sys-body max-w-lg mb-10">
                Request a briefing and we&apos;ll show you exactly how DWM can work for your business.
                No generic demos — a structured conversation about your market and your goals.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#" className="sys-btn-primary">
                  Request a Briefing
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#141726]">
        {/* Main footer columns */}
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-14 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10">
          {/* Brand column */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="grid grid-cols-2 gap-[5px]">
                <span className="w-1.5 h-1.5 bg-[#4a6cf7]" />
                <span className="w-1.5 h-1.5 bg-[#363c52]" />
                <span className="w-1.5 h-1.5 bg-[#363c52]" />
                <span className="w-1.5 h-1.5 bg-[#363c52]" />
              </div>
              <span className="font-display font-bold text-[14px] tracking-[0.3em] uppercase text-[#e8eaf2]">
                DIWANIYA MEDIA
              </span>
            </div>
            <p className="sys-body text-[13px] max-w-xs">
              Precision advertising and media intelligence for Kuwait and the GCC corporate market.
            </p>
          </div>

          {/* Nav columns */}
          {[
            {
              heading: "Platform",
              links: ["Targeted Distribution", "Content & PR", "Audience Intelligence", "Capabilities"],
            },
            {
              heading: "Company",
              links: ["About", "Careers", "Methodology", "Contact"],
            },
            {
              heading: "Resources",
              links: ["Case Studies", "Blog", "Documentation", "Support"],
            },
          ].map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              <span className="sys-label text-[#363c52]">{col.heading}</span>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#636b84] hover:text-[#e8eaf2] transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#141726] px-6 md:px-10 py-5">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#4a6cf7] animate-pulse" />
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#363c52]">
                Kuwait
              </span>
            </div>
            <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#363c52]">
              © 2026 Diwaniya Media (DWM). All rights reserved.
            </span>
            <div className="flex items-center gap-6">
              {["Privacy Policy", "Terms of Service"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#363c52] hover:text-[#636b84] transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
