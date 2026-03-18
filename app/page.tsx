"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Navbar }          from "@/components/ui/mini-navbar";
import { Spotlight }       from "@/components/ui/spotlight";
import { TestimonialsColumn, type Testimonial } from "@/components/ui/testimonials-columns-1";
import { HoverActionButton } from "@/components/ui/hover-action-button";

/* ── TextScramble (from Heroeffect.txt — scrambled character reveal) ──────── */
class TextScramble {
  private el: HTMLElement;
  private chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private queue: Array<{ from: string; to: string; start: number; end: number; char?: string }> = [];
  private frame = 0;
  private frameRequest = 0;
  private resolve: () => void = () => {};
  private speed: number;
  private sequential: boolean;
  private seqStep: number;

  constructor(el: HTMLElement, speed = 30, sequential = false, seqStep = 4) {
    this.el = el;
    this.speed = speed;
    this.sequential = sequential;
    this.seqStep = seqStep;
    this.update = this.update.bind(this);
  }

  setText(newText: string) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise<void>((r) => (this.resolve = r));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from  = oldText[i] || "";
      const to    = newText[i] || "";
      let start: number, end: number;
      if (this.sequential) {
        // each letter starts after the previous one resolves: strict left-to-right
        start = i * this.seqStep;
        end   = start + 6;
      } else {
        start = Math.floor(Math.random() * this.speed);
        end   = start + Math.floor(Math.random() * this.speed);
      }
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  private update() {
    let output = "";
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      const item = this.queue[i];
      let { from, to, start, end, char } = item;
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          item.char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

function ScrambledLine({
  text,
  delay = 0,
  className,
  style,
  loopInterval = 2500,
}: {
  text: string;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  loopInterval?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    const scrambler = new TextScramble(el, 30, true);
    let loopTimer: ReturnType<typeof setTimeout>;

    const run = () => {
      el.style.opacity = "1";
      el.innerHTML = "";
      scrambler.setText(text).then(() => {
        loopTimer = setTimeout(run, loopInterval);
      });
    };

    const initTimer = setTimeout(run, delay);
    return () => {
      clearTimeout(initTimer);
      clearTimeout(loopTimer);
    };
  }, [text, delay, loopInterval]);

  return (
    <span ref={ref} className={className} style={{ display: "block", opacity: 0, ...style }}>
      {text}
    </span>
  );
}

/* ── ScrambleOnView — fires once when element enters viewport, faster speed ── */
function ScrambleOnView({
  text, delay = 0, className, style, onDone,
}: {
  text: string; delay?: number; className?: string; style?: React.CSSProperties; onDone?: () => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    let t: ReturnType<typeof setTimeout>;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasRun.current) {
        hasRun.current = true;
        t = setTimeout(() => {
          el.style.opacity = "1";
          el.innerHTML = "";
          new TextScramble(el, 14, true, 3).setText(text).then(() => onDone?.());
        }, delay);
        obs.disconnect();
      }
    }, { threshold: 0.05 });
    obs.observe(el);
    return () => { obs.disconnect(); clearTimeout(t); };
  }, [text, delay, onDone]);

  return <span ref={ref} className={className} style={style}>{text}</span>;
}

/* ── ScrambleOnTrigger — skips first render, scrambles only on trigger change ── */
function ScrambleOnTrigger({
  text, trigger, className, style,
}: {
  text: string; trigger: number | string; className?: string; style?: React.CSSProperties;
}) {
  const ref     = useRef<HTMLSpanElement>(null);
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "1";
    el.innerHTML = "";
    new TextScramble(el, 14, true, 3).setText(text);
  }, [text, trigger]);
  return <span ref={ref} className={className} style={style}>{text}</span>;
}

/* ── ScrambleOnSignal — fires once when signal becomes true ──────────────── */
function ScrambleOnSignal({
  text, signal, delay = 0, className, style, onDone,
}: {
  text: string; signal: boolean; delay?: number; className?: string; style?: React.CSSProperties; onDone?: () => void;
}) {
  const ref    = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);
  useEffect(() => {
    if (!signal || hasRun.current) return;
    hasRun.current = true;
    const el = ref.current;
    if (!el) return;
    const t = setTimeout(() => {
      el.style.opacity = "1";
      el.innerHTML = "";
      new TextScramble(el, 14, true, 3).setText(text).then(() => onDone?.());
    }, delay);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signal]);
  return <span ref={ref} className={className} style={{ display: "block", opacity: 0, ...style }}>{text}</span>;
}

const HERO_VIDEOS = [
  "https://videos.files.wordpress.com/PG2Rvigf/5727833-uhd_3840_2160_30fps.mp4",
  "https://videos.files.wordpress.com/hBSfaNz4/13153068_1440_2560_30fps.mp4",
  "https://videos.files.wordpress.com/AEBAMyhY/5058333-uhd_2160_3840_25fps.mp4",
];

function HeroVideoBackground() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading]   = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % HERO_VIDEOS.length);
        setFading(false);
      }, 800); // crossfade duration
    }, 7000); // show each video for 7s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {HERO_VIDEOS.map((src, i) => (
        <video
          key={src}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: i === current ? (fading ? 0 : 1) : 0,
            transition: "opacity 0.8s ease-in-out",
          }}
        />
      ))}
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(6,10,20,0.80)" }} />
    </div>
  );
}

/* ── Testimonials ────────────────────────────────────────────────────────── */
const testimonials: Testimonial[] = [
  {
    text: "I genuinely didn't believe it at first. They sent us a link to our article live on a real news site. Not a sponsored post, not a banner — an actual editorial piece. I forwarded it to the whole company.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "CEO",
    role: "Kuwait Real Estate Development",
  },
  {
    text: "We've been trying to get press coverage for two years. DWM got us into three publications in one week. The calls we got after that were from people we'd been trying to reach for months.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "CFO",
    role: "GCC Telecommunications",
  },
  {
    text: "The reporting is what sold us. We don't just know our content ran — we know exactly who read it, what they do, and where they work. That's what we needed to make the right decisions.",
    image: "https://randomuser.me/api/portraits/men/58.jpg",
    name: "Head of Marketing",
    role: "Kuwait Investment Management",
  },
  {
    text: "We put the audience report in front of our board. It changed the conversation about where we actually stand in the market. We hadn't had that clarity before.",
    image: "https://randomuser.me/api/portraits/women/61.jpg",
    name: "Managing Director",
    role: "Regional Energy & Infrastructure",
  },
  {
    text: "My PR agency had been pitching journalists for months with nothing. DWM confirmed our placement before we even signed. That kind of certainty is rare.",
    image: "https://randomuser.me/api/portraits/men/71.jpg",
    name: "Founder",
    role: "Gulf Technology Startup",
  },
  {
    text: "Our story ran in four outlets simultaneously. We saw website traffic spike that same afternoon. People were reaching out saying they'd read about us. It felt like we'd actually arrived.",
    image: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "Head of Communications",
    role: "Saudi Arabia Financial Services",
  },
  {
    text: "Other campaigns gave us impression numbers. DWM gave us names. After the first campaign we knew exactly which firms had read our content. That changes how you follow up completely.",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    name: "Business Development Director",
    role: "UAE Infrastructure Group",
  },
  {
    text: "I was sceptical — I'd heard 'guaranteed media' before and it always meant something small or obscure. These were real publications. People in our industry actually read them.",
    image: "https://randomuser.me/api/portraits/women/53.jpg",
    name: "Chief Marketing Officer",
    role: "Bahrain Logistics & Trade",
  },
];

const firstColumn  = [testimonials[0], testimonials[1], testimonials[4], testimonials[5]];
const secondColumn = [testimonials[2], testimonials[3], testimonials[6]];
const thirdColumn  = [testimonials[5], testimonials[7], testimonials[0], testimonials[3]];

/* ── Dashboard card (inside ContainerScroll) ─────────────────────────────── */
function DashboardCard({ engagement }: { engagement: string[] }) {
  const orgs       = ["**********", "********", "******", "*********", "************"];
  const industries = ["Banking", "Investment", "Energy", "Telecom", "Logistics"];
  const seniorities= ["C-Suite", "Director", "VP", "Manager", "Analyst"];
  const rows = orgs.map((org, i) => ({
    org, industry: industries[i], seniority: seniorities[i], engagement: engagement[i],
  }));

  return (
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
      {/* Card header */}
      <div className="relative flex items-center justify-between px-6 py-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 bg-[#4a6cf7] animate-pulse" />
          <span className="font-mono font-bold tracking-[0.22em] uppercase" style={{ fontSize: "13px", color: "#e8e2d6" }}>
            Campaign Intelligence — Live
          </span>
        </div>
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: "#3d4a5e" }}>
          AXM.DWM.FEED
        </span>
      </div>
      {/* Table */}
      <div className="relative flex-1 overflow-hidden px-2">
        <div className="grid grid-cols-4 gap-0 px-4 py-2.5 border-b border-white/[0.05]">
          {["Organization", "Industry", "Seniority", "Engagement"].map((h) => (
            <span key={h} className="font-mono tracking-[0.2em] uppercase" style={{ fontSize: "12px", color: "#5a6a84" }}>
              {h}
            </span>
          ))}
        </div>
        {rows.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-4 gap-0 px-4 border-b border-white/[0.04] hover:bg-white/[0.04] transition-colors duration-150"
            style={{ paddingTop: "14px", paddingBottom: "14px" }}
          >
            <span className="font-mono tracking-wider" style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)" }}>{row.org}</span>
            <span className="font-mono tracking-[0.1em] uppercase" style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)" }}>{row.industry}</span>
            <span className="font-mono tracking-[0.1em] uppercase" style={{ fontSize: "14px", color: "rgba(255,255,255,0.25)" }}>{row.seniority}</span>
            <span className="font-mono" style={{ fontSize: "14px", color: "rgba(255,255,255,0.80)", fontWeight: 600, letterSpacing: "0.05em" }}>{row.engagement}</span>
          </div>
        ))}
      </div>
      {/* Footer */}
      <div className="relative flex items-center justify-between px-6 py-2.5 border-t border-white/[0.08]">
        <span className="font-mono tracking-[0.2em] uppercase" style={{ fontSize: "11px", color: "#4d5a6e" }}>
          Full data available after onboarding
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 bg-[#4a6cf7]" />
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/20">RESTRICTED</span>
        </div>
      </div>
    </div>
  );
}

/* ── MediaCard (secured media placement rows) ───────────────────────────── */
function MediaCard({ n, title, body, index, visible }: { n: string; title: string; body: string; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#0f1829" : "#0d0f14",
        padding: hovered ? "32px 28px" : "20px 24px",
        transition: "background 0.3s ease, padding 0.3s ease",
        cursor: "default",
        display: "flex",
        alignItems: "flex-start",
        gap: "24px",
      }}
    >
      <span style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: "11px",
        letterSpacing: "0.25em",
        flexShrink: 0,
        paddingTop: "2px",
        color: hovered ? "#a0c4ff" : "#2e3a4e",
        transition: "color 0.3s ease",
      }}>{n}</span>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <span style={{
          fontFamily: "var(--font-display), sans-serif",
          fontWeight: 700,
          textTransform: "uppercase",
          fontSize: hovered ? "15px" : "13px",
          letterSpacing: hovered ? "0.14em" : "0.1em",
          color: hovered ? "#ffffff" : "#7a8598",
          opacity: visible ? 1 : 0,
          transition: `opacity 0.35s ease ${0.05 + index * 0.08}s, color 0.3s ease, font-size 0.3s ease, letter-spacing 0.3s ease`,
        }}>{title}</span>
        <span style={{
          fontFamily: "var(--font-body), sans-serif",
          fontSize: hovered ? "14px" : "13px",
          lineHeight: "1.75",
          color: hovered ? "rgba(255,255,255,0.88)" : "#3a4255",
          opacity: visible ? 1 : 0,
          transition: `opacity 0.35s ease ${0.15 + index * 0.08}s, color 0.3s ease, font-size 0.3s ease`,
        }}>{body}</span>
      </div>
    </div>
  );
}

/* ── FeatureCard (border trace + in-view fade) ───────────────────────────── */
function FeatureCard({
  n, title, body, index, visible,
}: {
  n: string; title: string; body: string; index: number; visible: boolean;
}) {
  const ref  = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { setInView(entry.isIntersecting); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const traceDelay = `${index * 0.15}s`;

  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: "#1c2030", borderLeft: "2px solid #1e3a5c" }}
    >
      {/* Spinning trace — hidden until in-view, so no spotlight before card appears */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "50%", left: "50%",
          width: "300%", height: "300%",
          background: `conic-gradient(
            from 0deg,
            rgba(232,226,214,0.03) 0deg,
            rgba(232,226,214,0.35) 8deg,
            rgba(232,226,214,0.85) 14deg,
            rgba(232,226,214,0.35) 20deg,
            rgba(232,226,214,0.03) 27deg,
            transparent 33deg,
            transparent 360deg
          )`,
          opacity: inView ? 1 : 0,
          animation: inView ? "card-trace 4.5s linear infinite" : "none",
          animationDelay: traceDelay,
        }}
      />
      {/* Inner mask — always present, permanently covers card interior so gradient never bleeds through */}
      <div aria-hidden className="absolute pointer-events-none" style={{ inset: "0.5px", background: "#12151c", zIndex: 1 }} />

      {/* Content — fades in/out with viewport */}
      <div
        className="relative"
        style={{
          zIndex: 2,
          opacity: inView ? 1 : 0,
          transition: "opacity 0.4s ease 0.2s",
        }}
      >
        <div className="p-8 md:p-10 flex flex-col gap-5">
          <span className="font-mono text-[10px] tracking-[0.25em] font-light" style={{ color: "#3d4a5e" }}>{n}</span>
          <h3
            className="font-display font-bold uppercase"
            style={{ fontSize: "clamp(20px,2vw,28px)", letterSpacing: "0.05em", lineHeight: "1", color: "#e8e2d6", opacity: visible ? 1 : 0, transition: `opacity 0.35s ease ${0.05 + index * 0.08}s` }}
          >
            {title}
          </h3>
          <p
            className="text-[13px] leading-[1.8]"
            style={{ color: "#5a6272", opacity: visible ? 1 : 0, transition: `opacity 0.35s ease ${0.15 + index * 0.08}s` }}
          >
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function Home() {
  const [activeIntelItem, setActiveIntelItem] = useState(0);
  const [intelVisible, setIntelVisible] = useState(true);
  const [hoveredIntelItem, setHoveredIntelItem] = useState<number | null>(null);
  const [sec2Visible,       setSec2Visible]       = useState(false);
  const [sec3Visible,       setSec3Visible]       = useState(false);
  const [sec4Visible,       setSec4Visible]       = useState(false);
  const [sec5Visible,       setSec5Visible]       = useState(false);
  const [secCtaVisible,     setSecCtaVisible]     = useState(false);
  const [sec2BodyVisible,   setSec2BodyVisible]   = useState(false);
  const [sec3BodyVisible,   setSec3BodyVisible]   = useState(false);
  const [sec4BodyVisible,   setSec4BodyVisible]   = useState(false);
  const [sec5BodyVisible,   setSec5BodyVisible]   = useState(false);
  const sec2Done     = useCallback(() => setSec2Visible(true),     []);
  const sec3Done     = useCallback(() => setSec3Visible(true),     []);
  const sec4Done     = useCallback(() => setSec4Visible(true),     []);
  const sec5Done     = useCallback(() => setSec5Visible(true),     []);
  const secCtaDone   = useCallback(() => setSecCtaVisible(true),   []);
  const sec2BodyDone = useCallback(() => setSec2BodyVisible(true), []);
  const sec3BodyDone = useCallback(() => setSec3BodyVisible(true), []);
  const sec4BodyDone = useCallback(() => setSec4BodyVisible(true), []);
  const sec5BodyDone = useCallback(() => setSec5BodyVisible(true), []);

  const displayItem = hoveredIntelItem !== null ? hoveredIntelItem : activeIntelItem;

  const intelStats = [
    [{ value: "147", label: "Companies" },       { value: "23",   label: "Sectors" },       { value: "94%",  label: "Identified" }],
    [{ value: "68%", label: "Senior Level" },     { value: "31%",  label: "C-Suite" },        { value: "8%",   label: "Board Level" }],
    [{ value: "12",  label: "Industries" },       { value: "8",    label: "Verticals" },      { value: "47%",  label: "Finance & Banking" }],
    [{ value: "100%",label: "White-Label" },      { value: "48hr", label: "Delivery" },       { value: "2",    label: "Export Formats" }],
    [{ value: "4.2×",label: "Avg Return Rate" },  { value: "18%",  label: "Daily Active" },   { value: "62%",  label: "Weekly Active" }],
    [{ value: "340+",label: "Titles Tracked" },   { value: "97%",  label: "Identified" },     { value: "3.1×", label: "Avg Views" }],
    [{ value: "+24%",label: "WoW Growth" },       { value: "6wk",  label: "Tracked" },        { value: "89%",  label: "Retention" }],
    [{ value: "34%", label: "Shared Audience" },  { value: "12",   label: "Competitors" },    { value: "2.4×", label: "Reach Advantage" }],
  ];

  const tableEngagement = [
    ["2,847", "1,392", "934",  "611",  "478"],
    ["1,204", "897",   "743",  "521",  "389"],
    ["3,102", "1,847", "1,203","872",  "641"],
    ["891",   "743",   "612",  "489",  "334"],
    ["2,103", "1,648", "1,287","934",  "712"],
    ["1,847", "1,203", "987",  "743",  "521"],
    ["3,841", "2,910", "2,104","1,763","1,302"],
    ["2,847", "2,103", "1,847","1,392","987"],
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIntelVisible(false);
      setTimeout(() => {
        setActiveIntelItem(i => (i + 1) % 8);
        setIntelVisible(true);
      }, 250);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="relative min-h-screen bg-black grain">

      {/* ── NAVBAR ───────────────────────────────────────────────────────── */}
      <Navbar />

      {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
      <section id="home" className="relative pt-[72px]" style={{ backgroundColor: "#060a14" }}>

        <HeroVideoBackground />

        {/* Hero content sits above the videos */}
        <div className="relative z-10 flex flex-col items-center px-6 py-24 md:py-36 gap-6">
          <div
            className="opacity-0 mb-3"
            style={{ animation: "reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s forwards" }}
          >
            <div className="flex items-center justify-center">
              <span className="sys-label"><ScrambleOnView text="Proprietary GCC Media & Insight Technology" delay={0} style={{ display: "inline" }} /></span>
            </div>
          </div>

          <h1
            className="font-display font-bold uppercase text-center leading-[0.90]"
            style={{ fontSize: "clamp(52px,9vw,110px)", letterSpacing: "0.03em" }}
          >
            <ScrambledLine
              text="RIGHT STORY."
              delay={300}
              loopInterval={8000}
              className="text-white"
            />
            <ScrambledLine
              text="RIGHT AUDIENCE."
              delay={700}
              loopInterval={8000}
              style={{ color: "var(--accent)" }}
            />
            <ScrambledLine
              text="REAL IMPACT."
              delay={1100}
              loopInterval={8000}
              className="text-white"
            />
          </h1>

          <div
            className="flex flex-row items-center gap-6 opacity-0 mt-20 mb-20"
            style={{ animation: "reveal-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.7s forwards" }}
          >
            <HoverActionButton labelText="Request a Briefing" scramble href="#get-started" variant="white" className="text-[15px] font-bold w-80" style={{ borderRadius: "999px", padding: "28px 0", background: "rgba(255,255,255,0.10)", backdropFilter: "blur(40px) saturate(180%) brightness(1.15)", WebkitBackdropFilter: "blur(40px) saturate(180%) brightness(1.15)", borderColor: "rgba(255,255,255,0.22)", boxShadow: "0 0 0 1px rgba(255,255,255,0.10) inset, 0 2px 24px rgba(255,255,255,0.04) inset, 0 12px 40px rgba(0,0,0,0.35)" }} />
            <HoverActionButton labelText="How It Works" scramble scrambleStep={6.2} href="#what-we-do" variant="white" direction="vertical" className="text-[15px] font-bold w-80" style={{ borderRadius: "999px", padding: "28px 0", background: "rgba(255,255,255,0.10)", backdropFilter: "blur(40px) saturate(180%) brightness(1.15)", WebkitBackdropFilter: "blur(40px) saturate(180%) brightness(1.15)", borderColor: "rgba(255,255,255,0.22)", boxShadow: "0 0 0 1px rgba(255,255,255,0.10) inset, 0 2px 24px rgba(255,255,255,0.04) inset, 0 12px 40px rgba(0,0,0,0.35)" }} />
          </div>
        </div>
      </section>

      {/* ── 2. WHAT WE DO ────────────────────────────────────────────────── */}
      <section id="what-we-do" className="sys-section">
        <div className="max-w-6xl mx-auto px-6 md:px-10">

          <div className="mb-14">
            <div className="flex items-center mb-5">
              <span className="sys-label" style={{ fontSize: "13px" }}>
                <img src="/Untitled design.png" alt="" style={{ width: "14px", height: "14px", marginRight: "8px", display: "inline-block", verticalAlign: "middle", mixBlendMode: "screen" }} />
                <ScrambleOnView text="What We Do" delay={0} onDone={sec2Done} />
              </span>
            </div>
            <h2
              className="font-display font-bold uppercase text-white"
              style={{ fontSize: "clamp(36px,5vw,60px)", letterSpacing: "0.05em", lineHeight: "0.93" }}
            >
              <ScrambleOnSignal text="We Run It." signal={sec2Visible} style={{ color: "#ffffff" }} />
              <ScrambleOnSignal text="You See Who Engaged." signal={sec2Visible} onDone={sec2BodyDone} style={{ color: "#ffffff" }} />
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            {[
              { n: "01", title: "Secured Media Placement", body: "Your story, guaranteed publishing. We lock in editorial coverage across the region's most-read publications." },
              { n: "02", title: "Targeted Distribution",   body: "Your content reaches the people who matter, we make sure the right eyes see it — every time." },
              { n: "03", title: "Audience Intelligence",   body: "After every campaign, you find out who read it, what they do, and where they're from. Not estimates. Real people." },
            ].map(({ n, title, body }, i) => (
              <FeatureCard key={n} n={n} title={title} body={body} index={i} visible={sec2Visible} />
            ))}
          </div>

        </div>
      </section>

      {/* ── 3. SECURED MEDIA PLACEMENT ───────────────────────────────────── */}
      <section id="media-placement" className="sys-section relative">
        {/* Subtle top glow line */}
        <div aria-hidden className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "1px", background: "linear-gradient(90deg, transparent, #a0c4ff33, transparent)" }} />

        <div className="max-w-6xl mx-auto px-6 md:px-10">

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left */}
            <div className="flex flex-col gap-8">
              <div className="flex items-center mb-5">
                <span className="sys-label" style={{ fontSize: "13px" }}><img src="/Untitled design.png" alt="" style={{ width: "14px", height: "14px", marginRight: "8px", display: "inline-block", verticalAlign: "middle", mixBlendMode: "screen" }} /><ScrambleOnView text="Secured Media Placement" delay={0} style={{ display: "inline" }} onDone={sec3Done} /></span>
              </div>
              <h2
                className="font-display font-bold uppercase"
                style={{ fontSize: "clamp(36px,5vw,60px)", letterSpacing: "0.05em", lineHeight: "0.93" }}
              >
                <ScrambleOnSignal text="Your Story." signal={sec3Visible} style={{ color: "#ffffff" }} />
                <ScrambleOnSignal text="Guaranteed Publishing." signal={sec3Visible} onDone={sec3BodyDone} style={{ color: "#4a6cf7" }} />
              </h2>

              {/* Stat counters */}
              <div className="flex items-stretch divide-x divide-white/[0.06]" style={{ opacity: sec3Visible ? 1 : 0, transition: "opacity 0.35s ease 0.05s" }}>
                {[
                  { value: "6",   label: "GCC Markets" },
                  { value: "12+", label: "Publications" },
                ].map(({ value, label }) => (
                  <div key={label} className="flex flex-col gap-1 pr-8 first:pl-0 pl-8">
                    <span className="font-display font-bold" style={{ fontSize: "28px", color: "#e8e2d6" }}>{value}</span>
                    <span className="font-mono uppercase" style={{ fontSize: "8px", letterSpacing: "0.2em", color: "#7a8598" }}>{label}</span>
                  </div>
                ))}
              </div>

              <p style={{ color: "#c8c0b0", fontFamily: "var(--font-body), sans-serif", fontSize: "14px", lineHeight: "1.8", opacity: sec3Visible ? 1 : 0, transition: "opacity 0.35s ease 0.15s" }}>
                We produce and place editorially-driven stories across a network of Gulf business and industry publications. Your content goes live — as a confirmed placement.
              </p>
            </div>

            {/* Right — 4 card rows */}
            <div className="flex flex-col" style={{ gap: "1px", background: "#ffffff08" }}>
              {[
                { n: "01", title: "Confirmed Placement", body: "Your content is placed, not pitched. Every partner publication is pre-contracted — your story runs." },
                { n: "02", title: "Gulf-Wide Network",   body: "Kuwait, UAE, Saudi Arabia, Bahrain, Qatar, Oman. Every major GCC market covered." },
                { n: "03", title: "Editorial Quality",   body: "Produced and formatted to editorial standard. It reads like news because it is." },
                { n: "04", title: "Timed & Controlled",  body: "You choose when it runs. We coordinate across every publication simultaneously." },
              ].map(({ n, title, body }, i) => (
                <MediaCard key={n} n={n} title={title} body={body} index={i} visible={sec3Visible} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── 3b. AUDIENCE SELECTION MAP ───────────────────────────────────── */}
      <section className="sys-section">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="flex items-center mb-8">
            <span className="sys-label" style={{ fontSize: "13px" }}>
              <img src="/Untitled design.png" alt="" style={{ width: "14px", height: "14px", marginRight: "8px", display: "inline-block", verticalAlign: "middle", mixBlendMode: "screen" }} />
              <ScrambleOnView text="Audience Selection" delay={0} style={{ display: "inline" }} />
            </span>
          </div>
          <div style={{
            position: "relative",
            borderRadius: "4px",
            border: "1px solid rgba(74,108,247,0.30)",
            boxShadow: "0 0 0 1px rgba(74,108,247,0.06), 0 0 40px rgba(74,108,247,0.18), 0 0 80px rgba(74,108,247,0.08), inset 0 0 40px rgba(4,13,28,0.6)",
            overflow: "hidden",
          }}>
            {/* Atmospheric glow — centred on the Gulf */}
            <div aria-hidden style={{
              position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
              background: "radial-gradient(ellipse 55% 50% at 62% 52%, rgba(74,108,247,0.08) 0%, transparent 70%)",
            }} />
            <iframe
              src="/dwm-gcc-map.html"
              scrolling="no"
              style={{ width: "100%", height: "860px", border: "none", display: "block", position: "relative", zIndex: 0 }}
              title="GCC Audience Map"
            />
          </div>
        </div>
      </section>

      {/* ── 4. AUDIENCE INTELLIGENCE ─────────────────────────────────────── */}
      <section id="intelligence" className="sys-section">
        <div className="max-w-6xl mx-auto px-6 md:px-10">

          <div className="grid lg:grid-cols-2 gap-10 mb-12 items-end">
            <div>
              <div className="flex items-center mb-5">
                <span className="sys-label" style={{ fontSize: "13px" }}><img src="/Untitled design.png" alt="" style={{ width: "20px", height: "20px", marginRight: "12px", display: "inline-block", verticalAlign: "middle", mixBlendMode: "screen" }} /><ScrambleOnView text="Intelligence, Delivered" delay={0} style={{ display: "inline" }} onDone={sec4Done} /></span>
              </div>
              <h2
                className="font-display font-bold uppercase text-white"
                style={{ fontSize: "clamp(36px,5vw,60px)", letterSpacing: "0.05em", lineHeight: "0.93" }}
              >
                <ScrambleOnSignal text="Know Exactly" signal={sec4Visible} style={{ color: "#ffffff" }} />
                <ScrambleOnSignal text="Who Engaged" signal={sec4Visible} onDone={sec4BodyDone} style={{ color: "#ffffff" }} />
              </h2>
            </div>
            <p className="lg:max-w-sm lg:ml-auto" style={{ color: "#c8c0b0", fontFamily: "var(--font-body), sans-serif", fontSize: "14px", lineHeight: "1.8", opacity: sec4Visible ? 1 : 0, transition: "opacity 0.35s ease 0.05s" }}>
              Other agencies show you impressions. We show you exactly who read it.
            </p>
          </div>

          <div className="relative w-full bg-white/[0.02] border border-white/[0.08] overflow-hidden">
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#4a6cf7" />

            <div className="p-10 md:p-14 grid md:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col gap-6">
                <span className="sys-label" style={{ fontSize: "20px" }}><img src="/Untitled design.png" alt="" style={{ width: "20px", height: "20px", marginRight: "12px", display: "inline-block", verticalAlign: "middle", mixBlendMode: "screen" }} /><ScrambleOnView text="Engagement Breakdowns" delay={0} style={{ display: "inline" }} /></span>

                {/* Stats row */}
                <div className="flex items-stretch divide-x divide-[#161c2c]" style={{ opacity: sec4Visible ? 1 : 0, transition: "opacity 0.35s ease 0.1s" }}>
                  {intelStats[displayItem].map(({ value, label }, i) => (
                    <div key={i} className="flex flex-col gap-1 pr-6 first:pl-0 pl-6" style={{ transition: "opacity 0.25s ease" }}>
                      <span className="font-display font-bold" style={{ fontSize: "22px", color: "#e8e2d6" }}>
                        <ScrambleOnTrigger text={value} trigger={displayItem} style={{ display: "inline" }} />
                      </span>
                      <span className="font-mono uppercase" style={{ fontSize: "8px", letterSpacing: "0.2em", color: "#c8c0b0" }}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                <p style={{ color: "#c8c0b0", fontFamily: "var(--font-body), sans-serif", fontSize: "14px", lineHeight: "1.8", opacity: sec4Visible ? 1 : 0, transition: "opacity 0.35s ease 0.25s" }}>
                  Exportable. Presentable. Boardroom-ready.
                </p>
                <HoverActionButton label="Request a Briefing" href="#get-started" className="mt-2" />
              </div>

              <ul className="grid grid-cols-2 gap-px border border-[#161c2c]" style={{ backgroundColor: "#161c2c" }}>
                {[
                  { n: "01", label: "Company-Level Engagement" },
                  { n: "02", label: "Role & Seniority Breakdown" },
                  { n: "03", label: "Industry Segmentation" },
                  { n: "04", label: "Exportable, Branded Reports" },
                  { n: "05", label: "Engagement Frequency per Company" },
                  { n: "06", label: "Individual Job Title Tracking" },
                  { n: "07", label: "Week-over-Week Engagement Trends" },
                  { n: "08", label: "Competitor Audience Overlap" },
                ].map(({ n, label }, idx) => {
                  const active = idx === displayItem;
                  return (
                    <li
                      key={n}
                      className="p-6 flex flex-col gap-3 cursor-pointer"
                      onMouseEnter={() => setHoveredIntelItem(idx)}
                      onMouseLeave={() => setHoveredIntelItem(null)}
                      style={{
                        background: active && intelVisible ? "rgba(74,108,247,0.08)" : "rgba(255,255,255,0.02)",
                        borderLeft: active && intelVisible ? "2px solid #4a6cf7" : "2px solid transparent",
                        boxShadow: active && intelVisible ? "inset 0 0 24px rgba(74,108,247,0.07)" : "none",
                        transition: "background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
                      }}
                    >
                      <span
                        className="font-mono text-[10px] tracking-[0.2em]"
                        style={{
                          color: active && intelVisible ? "#4a6cf7" : "#2e3a4e",
                          transition: "color 0.25s ease",
                        }}
                      >{n}</span>
                      <span
                        className="font-mono tracking-[0.12em] uppercase leading-relaxed"
                        style={{
                          fontSize: active && intelVisible ? "13px" : "11px",
                          color: active && intelVisible ? "#ffffff" : "#c8c0b0",
                          transition: "color 0.25s ease, font-size 0.25s ease",
                        }}
                      >
                        <span style={{ opacity: sec4Visible ? 1 : 0, transition: `opacity 0.35s ease ${0.05 + idx * 0.03}s` }}>{label}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <span className="absolute top-2 left-2   w-3 h-3 border-t border-l border-[#4a6cf7] pointer-events-none" />
            <span className="absolute top-2 right-2  w-3 h-3 border-t border-r border-[#4a6cf7] pointer-events-none" />
            <span className="absolute bottom-2 left-2  w-3 h-3 border-b border-l border-white/20 pointer-events-none" />
            <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-white/20 pointer-events-none" />
          </div>

          <div
            style={{
              opacity: hoveredIntelItem !== null ? 1 : 0,
              maxHeight: hoveredIntelItem !== null ? "600px" : "0px",
              overflow: "hidden",
              transition: "opacity 0.3s ease, max-height 0.4s ease",
              pointerEvents: hoveredIntelItem !== null ? "auto" : "none",
            }}
          >
            <div className="py-8 text-center border border-white/[0.08] border-t-0 border-b-0">
              <span className="sys-label" style={{ fontSize: "20px" }}>
                <img src="/Untitled design.png" alt="" style={{ width: "20px", height: "20px", marginRight: "12px", display: "inline-block", verticalAlign: "middle", mixBlendMode: "screen" }} />
                Sample Insights
              </span>
            </div>

            <div className="h-[420px] border border-white/[0.08] border-t-0">
              <DashboardCard engagement={tableEngagement[displayItem]} />
            </div>
          </div>

        </div>
      </section>

      {/* ── 5. WHO WE WORK WITH ──────────────────────────────────────────── */}
      <section id="reviews" className="sys-section">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="mb-14 text-center">
            <div className="flex items-center justify-center mb-5">
              <span className="sys-label" style={{ fontSize: "13px" }}><img src="/Untitled design.png" alt="" style={{ width: "14px", height: "14px", marginRight: "8px", display: "inline-block", verticalAlign: "middle", mixBlendMode: "screen" }} /><ScrambleOnView text="Who We Work With" delay={0} style={{ display: "inline" }} onDone={sec5Done} /></span>
            </div>
            <h2
              className="font-display font-bold uppercase text-white"
              style={{ fontSize: "clamp(36px,5vw,60px)", letterSpacing: "0.05em", lineHeight: "0.93" }}
            >
              <ScrambleOnSignal text="In Their" signal={sec5Visible} style={{ color: "#ffffff" }} />
              <ScrambleOnSignal text="Own Words" signal={sec5Visible} onDone={sec5BodyDone} style={{ color: "#ffffff" }} />
            </h2>
          </div>

          <div className="relative">
            {/* Blue tint gradient overlay */}
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(74,108,247,0.06) 0%, transparent 40%, transparent 60%, rgba(74,108,247,0.06) 100%)", pointerEvents: "none", zIndex: 10 }} />
          <div
            className="flex justify-center gap-4 overflow-hidden"
            style={{
              maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
              maxHeight: "680px",
              opacity: sec5Visible ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
          >
            <TestimonialsColumn testimonials={firstColumn}  duration={14} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={17} />
            <TestimonialsColumn testimonials={thirdColumn}  className="hidden lg:block" duration={15} />
          </div>
          </div>
        </div>
      </section>

      {/* ── 5. CTA ───────────────────────────────────────────────────────── */}
      <section id="get-started" className="sys-section">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="border border-white/[0.08] bg-white/[0.02] p-12 md:p-20 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 70% 50%, rgba(74,108,247,0.10) 0%, transparent 60%)",
              }}
            />
            <span className="absolute top-3 left-3   w-5 h-5 border-t border-l border-[#4a6cf7]" />
            <span className="absolute top-3 right-3  w-5 h-5 border-t border-r border-[#4a6cf7]" />
            <span className="absolute bottom-3 left-3  w-5 h-5 border-b border-l border-white/20" />
            <span className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-white/20" />

            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center mb-7">
                <span className="sys-label" style={{ fontSize: "13px" }}><img src="/Untitled design.png" alt="" style={{ width: "14px", height: "14px", marginRight: "8px", display: "inline-block", verticalAlign: "middle", mixBlendMode: "screen" }} /><ScrambleOnView text="Get Started" delay={0} style={{ display: "inline" }} onDone={secCtaDone} /></span>
              </div>
              <h2
                className="font-display font-bold uppercase text-white mb-7"
                style={{ fontSize: "clamp(40px,6.5vw,84px)", letterSpacing: "0.03em", lineHeight: "0.90" }}
              >
                <span style={{ display: "block", opacity: secCtaVisible ? 1 : 0, transition: "opacity 0.35s ease 0.05s" }}>Start with</span>
                <span style={{ display: "block", opacity: secCtaVisible ? 1 : 0, transition: "opacity 0.35s ease 0.1s" }}>a Briefing.</span>
                <span style={{ display: "block", color: "var(--accent)", opacity: secCtaVisible ? 1 : 0, transition: "opacity 0.35s ease 0.18s" }}>See What Returns.</span>
              </h2>
              <p className="sys-body max-w-lg mb-10" style={{ opacity: secCtaVisible ? 1 : 0, transition: "opacity 0.35s ease 0.25s" }}>
                Book a briefing. We&apos;ll walk you through what we&apos;d run, who we&apos;d reach, and whether you&apos;re eligible.
              </p>
              <HoverActionButton label="Request a Briefing" href="#" />
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-14 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10">
          <div className="flex flex-col gap-4">
            <img src="/D*M website.png" alt="DWM" className="h-9 w-auto self-start" />
            <p className="font-mono text-[11px] tracking-[0.08em] text-white/25 max-w-xs leading-relaxed">
              Proprietary GCC Media &amp; Insight Technology
            </p>
          </div>

          {[
            { heading: "Services", links: [
              { label: "Our Aim", href: "#what-we-do" },
              { label: "Media Placement", href: "#media-placement" },
              { label: "Targeting", href: "#audience-selection" },
              { label: "Audience Insights", href: "#intelligence" },
            ]},
            { heading: "Company", links: [
              { label: "Home", href: "#home" },
              { label: "Contact", href: "#get-started" },
              { label: "Reviews", href: "#reviews" },
            ]},
            { heading: "Legal", links: [
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms & Conditions", href: "/terms-and-conditions" },
            ]},
          ].map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/40">{col.heading}</span>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/20 hover:text-white/40 transition-colors duration-200">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.05] px-6 md:px-10 py-5">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/15">
              © 2026 Diwaniya Media. All rights reserved.
            </span>
          </div>
        </div>
      </footer>

    </main>
  );
}
