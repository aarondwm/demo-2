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
  private seqWindow: number;

  constructor(el: HTMLElement, speed = 30, sequential = false, seqStep = 4, seqWindow = 6) {
    this.el = el;
    this.speed = speed;
    this.sequential = sequential;
    this.seqStep = seqStep;
    this.seqWindow = seqWindow;
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
        end   = start + this.seqWindow;
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
    const scrambler = new TextScramble(el, 30, true, 3.2, 5);
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
          new TextScramble(el, 14, true, 2.4, 5).setText(text).then(() => onDone?.());
        }, delay);
        obs.disconnect();
      }
    }, { threshold: 0, rootMargin: "200px 0px 200px 0px" });
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
    new TextScramble(el, 14, true, 2.4, 5).setText(text);
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
      new TextScramble(el, 14, true, 2.4, 5).setText(text).then(() => onDone?.());
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
function ScrambleNumber({ value, trigger }: { value: string; trigger: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isFirst = useRef(true);
  const [pulsing, setPulsing] = useState(false);
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    const el = ref.current;
    if (!el) return;
    setPulsing(true);
    const chars = "0123456789,";
    type Q = { to: string; start: number; end: number; char?: string };
    const queue: Q[] = Array.from(value).map((to, i) => ({ to, start: i, end: i + 3 }));
    let frame = 0;
    let raf = 0;
    const tick = () => {
      let out = "";
      let done = 0;
      for (const item of queue) {
        if (frame >= item.end) { done++; out += item.to; }
        else if (frame >= item.start) {
          if (!item.char || Math.random() < 0.4) item.char = chars[Math.floor(Math.random() * chars.length)];
          out += `<span style="color:#4a6cf7">${item.char}</span>`;
        } else { out += ""; }
      }
      el.innerHTML = out;
      if (done < queue.length) { raf = requestAnimationFrame(tick); frame++; }
      else { setTimeout(() => setPulsing(false), 300); }
    };
    cancelAnimationFrame(raf);
    tick();
  }, [value, trigger]);
  return <span ref={ref} style={{ transition: "text-shadow 0.3s ease", textShadow: pulsing ? "0 0 10px rgba(74,108,247,0.6), 0 0 20px rgba(74,108,247,0.3)" : "none" }}>{value}</span>;
}

/* ── Campaign Dashboard (replaces old table + ticker) ────────────────────── */
const DASH_INDUSTRIES = [
  { name: "Finance", views: 42180, blurName: false, blurViews: true },
  { name: "Oil & Gas", views: 31420, blurName: true, blurViews: false },
  { name: "Real Estate", views: 24890, blurName: false, blurViews: true },
  { name: "Construction", views: 19740, blurName: true, blurViews: false },
  { name: "Technology", views: 16350, blurName: false, blurViews: false },
  { name: "Healthcare", views: 12870, blurName: false, blurViews: false },
];
const DASH_COMPANIES = [
  { rank: "01", name: "Saudi Aramco", views: 5130, blur: false, blurViews: true },
  { rank: "02", name: "Emirates NBD", views: 4215, blur: false, blurViews: false },
  { rank: "03", name: "SABIC Industries", views: 3510, blur: true, blurViews: true },
  { rank: "04", name: "Qatar Energy Corp", views: 2970, blur: true, blurViews: false },
  { rank: "05", name: "Etisalat Group", views: 2460, blur: false, blurViews: true },
  { rank: "06", name: "Emaar Properties", views: 1935, blur: true, blurViews: false },
];
const DASH_SENIORITY = [
  { level: "Managers", count: 48200, blur: true },
  { level: "CFO", count: 36800, blur: true },
  { level: "Directors", count: 12400, blur: false },
  { level: "CEO", count: 4180, blur: false },
];
const DASH_TABS = ["Overview", "Industries", "Companies"];

function AnimatedViewCount({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const hasRun = useRef(false);
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setDisplay(Math.floor((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, duration]);
  return <>{display.toLocaleString()}</>;
}

function CampaignDashboard() {
  const [tab, setTab] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="border border-white/[0.08] bg-black rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#4a6cf7", boxShadow: "0 0 6px #4a6cf7, 0 0 12px rgba(74,108,247,0.5)" }} />
          <span className="font-mono font-bold tracking-[0.22em] uppercase" style={{ fontSize: "11px", color: "#e8e2d6" }}>Campaign Report</span>
        </div>
        <span className="font-mono text-[9px] tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>SAMPLE</span>
      </div>

      {/* Hero Stat */}
      <div className="bg-black px-6 py-5 md:py-6 flex flex-col items-center gap-1 border-b border-white/[0.06]">
        <span style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: "clamp(36px, 8vw, 64px)", fontWeight: 800, color: "#4a6cf7", letterSpacing: "-0.03em" }}>
          {visible ? <AnimatedViewCount value={247610} /> : "0"}
        </span>
        <span className="font-mono uppercase" style={{ fontSize: "9px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.35)" }}>Total Article Views</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/[0.06]">
        {DASH_TABS.map((t, i) => (
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
      <div className="p-4 md:p-6">
        {tab === 0 && (
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/30">Seniority Breakdown</span>
              <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-white/20">Viewership</span>
            </div>
            {DASH_SENIORITY.map((s, i) => (
              <div key={s.level} className="flex items-center gap-2 md:gap-3">
                <span className="font-mono w-[110px] md:w-[140px] flex-shrink-0 truncate" style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>{s.level}</span>
                <div className="flex-1 h-[6px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div className="h-full rounded-full" style={{ width: visible ? `${(s.count / 48200) * 100}%` : "0%", background: i === 0 ? "#4a6cf7" : `rgba(74,108,247,${0.8 - i * 0.1})`, transition: `width 0.8s ease ${i * 0.1}s` }} />
                </div>
                <span className="font-mono font-bold flex-shrink-0 w-[50px] md:w-[60px] text-right" style={{ fontSize: "11px", color: "#4a6cf7", filter: s.blur ? "blur(4px)" : "none", userSelect: s.blur ? "none" as const : "auto" as const }}>{s.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 1 && (
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/30">Top Industries</span>
              <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-white/20">Viewership</span>
            </div>
            {DASH_INDUSTRIES.map((ind, i) => (
              <div key={ind.name} className="flex items-center gap-2 md:gap-3">
                <span className="font-mono w-[110px] md:w-[160px] flex-shrink-0 truncate" style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", filter: ind.blurName ? "blur(4px)" : "none", userSelect: ind.blurName ? "none" as const : "auto" as const }}>{ind.name}</span>
                <div className="flex-1 h-[6px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(ind.views / 42180) * 100}%`, background: `rgba(74,108,247,${1 - i * 0.07})`, transition: `width 0.8s ease ${i * 0.06}s` }} />
                </div>
                <span className="font-mono font-bold flex-shrink-0 w-[50px] text-right" style={{ fontSize: "11px", color: "#4a6cf7", filter: ind.blurViews ? "blur(4px)" : "none", userSelect: ind.blurViews ? "none" as const : "auto" as const }}>{ind.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 2 && (
          <div className="flex flex-col gap-0">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/30">Top Companies</span>
              <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-white/20">Viewership</span>
            </div>
            {DASH_COMPANIES.map((c, i) => (
              <div key={c.rank} className="flex items-center gap-2 md:gap-3 py-2 md:py-2.5 border-b border-white/[0.03]" style={{ opacity: i < 5 ? 1 : 0.6 }}>
                <span className="font-mono flex-shrink-0 w-[18px]" style={{ fontSize: "10px", color: i === 0 ? "#4a6cf7" : "rgba(74,108,247,0.4)", letterSpacing: "0.1em" }}>{c.rank}</span>
                <span className="font-mono flex-1 truncate" style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", filter: c.blur ? "blur(5px)" : "none", userSelect: c.blur ? "none" as const : "auto" as const }}>{c.name}</span>
                <div className="w-[40px] md:w-[60px] h-[4px] rounded-full overflow-hidden flex-shrink-0" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(c.views / 5130) * 100}%`, background: "#4a6cf7", transition: `width 0.6s ease ${i * 0.05}s` }} />
                </div>
                <span className="font-mono font-bold flex-shrink-0 w-[40px] md:w-[50px] text-right" style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", filter: c.blurViews ? "blur(4px)" : "none", userSelect: c.blurViews ? "none" as const : "auto" as const }}>{c.views}</span>
              </div>
            ))}
            <div className="mt-3 font-mono text-[9px] text-white/20 text-center">40+ companies with 500+ views each</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 md:px-6 py-2.5 border-t border-white/[0.08]">
        <span className="font-mono tracking-[0.2em] uppercase" style={{ fontSize: "clamp(7px, 2vw, 9px)", color: "rgba(255,255,255,0.35)" }}>Full data available after onboarding</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 bg-[#4a6cf7]" />
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/50">SAMPLE</span>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ engagement, trigger = 0 }: { engagement: string[]; trigger?: number }) {
  const orgs       = ["**********", "********", "******", "*********", "************"];
  const industries = ["Banking", "Investment", "Energy", "Telecom", "Logistics"];
  const seniorities= ["C-Suite", "Director", "VP", "Manager", "Analyst"];
  const rows = orgs.map((org, i) => ({
    org, industry: industries[i], seniority: seniorities[i], engagement: engagement[i],
  }));

  return (
    <div className="relative w-full flex flex-col overflow-hidden bg-black">
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
      <div className="relative flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: "#4a6cf7", boxShadow: "0 0 6px #4a6cf7, 0 0 12px rgba(74,108,247,0.5), 0 0 20px rgba(74,108,247,0.3)" }} />
          <span className="font-mono font-bold tracking-[0.22em] uppercase truncate" style={{ fontSize: "clamp(9px, 2.5vw, 13px)", color: "#e8e2d6" }}>
            Campaign Intelligence — Live
          </span>
        </div>
      </div>
      {/* Table */}
      <div className="relative flex-1 overflow-x-auto">
        <table className="w-full" style={{ minWidth: "480px" }}>
          <thead>
            <tr className="border-b border-white/[0.10]">
              {["Organization", "Industry", "Seniority", "Engagement"].map((h) => (
                <th key={h} className="font-mono tracking-[0.2em] uppercase text-left font-normal px-4 py-2.5" style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.04] transition-colors duration-150">
                <td className="font-mono tracking-wider px-4 py-3" style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)" }}>{row.org}</td>
                <td className="font-mono tracking-[0.1em] uppercase px-4 py-3" style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)" }}>{row.industry}</td>
                <td className="font-mono tracking-[0.1em] uppercase px-4 py-3" style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)" }}>{row.seniority}</td>
                <td className="font-mono px-4 py-3" style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", fontWeight: 600, letterSpacing: "0.05em" }}>
                  <ScrambleNumber value={row.engagement} trigger={trigger} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Footer */}
      <div className="relative flex items-center justify-between px-4 md:px-6 py-2.5 border-t border-white/[0.08]">
        <span className="font-mono tracking-[0.2em] uppercase" style={{ fontSize: "clamp(8px, 2vw, 11px)", color: "rgba(255,255,255,0.35)" }}>
          Full data available after onboarding
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 bg-[#4a6cf7]" />
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/50">RESTRICTED</span>
        </div>
      </div>
    </div>
  );
}

/* ── Mobile Live Feed Ticker for Campaign Intelligence ───────────────────── */
const FEED_ENTRIES = [
  { seniority: "C-Suite", industry: "Banking", views: "2,847", time: "2m ago" },
  { seniority: "Director", industry: "Investment", views: "1,392", time: "4m ago" },
  { seniority: "VP", industry: "Energy", views: "934", time: "6m ago" },
  { seniority: "Manager", industry: "Telecom", views: "611", time: "9m ago" },
  { seniority: "C-Suite", industry: "Real Estate", views: "1,204", time: "11m ago" },
  { seniority: "Director", industry: "Oil & Gas", views: "897", time: "14m ago" },
  { seniority: "Analyst", industry: "Logistics", views: "478", time: "16m ago" },
  { seniority: "C-Suite", industry: "Healthcare", views: "3,102", time: "18m ago" },
  { seniority: "VP", industry: "Construction", views: "743", time: "21m ago" },
  { seniority: "Manager", industry: "Technology", views: "521", time: "24m ago" },
  { seniority: "Director", industry: "Financial Services", views: "1,847", time: "27m ago" },
  { seniority: "C-Suite", industry: "Insurance", views: "891", time: "30m ago" },
];

function LiveFeedTicker() {
  const [items, setItems] = useState<typeof FEED_ENTRIES>([]);
  const [nextIdx, setNextIdx] = useState(0);

  useEffect(() => {
    // Add first 4 items immediately
    setItems(FEED_ENTRIES.slice(0, 4));
    setNextIdx(4);
  }, []);

  useEffect(() => {
    if (nextIdx === 0) return;
    const timer = setInterval(() => {
      setNextIdx(prev => {
        const idx = prev % FEED_ENTRIES.length;
        setItems(current => {
          const next = [FEED_ENTRIES[idx], ...current];
          return next.slice(0, 8);
        });
        return prev + 1;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, [nextIdx]);

  return (
    <div className="flex flex-col bg-black border border-white/[0.08] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: "#4a6cf7", boxShadow: "0 0 6px #4a6cf7, 0 0 12px rgba(74,108,247,0.5)" }} />
          <span className="font-mono font-bold tracking-[0.22em] uppercase" style={{ fontSize: "11px", color: "#e8e2d6" }}>
            Live Activity
          </span>
        </div>
        <span className="font-mono text-[8px] tracking-[0.15em] uppercase" style={{ color: "rgba(74,108,247,0.6)" }}>STREAMING</span>
      </div>

      {/* Feed */}
      <div className="flex flex-col" style={{ minHeight: "240px" }}>
        {items.map((item, i) => (
          <div
            key={`${item.industry}-${item.views}-${i}`}
            className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.03]"
            style={{
              opacity: i === 0 ? 1 : Math.max(0.3, 1 - i * 0.15),
              animation: i === 0 ? "feedIn 0.4s ease" : "none",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                background: i === 0 ? "#4a6cf7" : "rgba(74,108,247,0.3)",
                boxShadow: i === 0 ? "0 0 6px rgba(74,108,247,0.6)" : "none",
              }}
            />
            <div className="flex-1 min-w-0">
              <span className="font-mono" style={{ fontSize: "11px", color: i === 0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)" }}>
                {item.seniority}
              </span>
              <span className="font-mono" style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", margin: "0 6px" }}>·</span>
              <span className="font-mono" style={{ fontSize: "11px", color: i === 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)" }}>
                {item.industry}
              </span>
            </div>
            <span className="font-mono font-bold flex-shrink-0" style={{ fontSize: "11px", color: i === 0 ? "#4a6cf7" : "rgba(74,108,247,0.4)" }}>
              {item.views}
            </span>
            <span className="font-mono flex-shrink-0" style={{ fontSize: "8px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>
              {item.time}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.08]">
        <span className="font-mono tracking-[0.2em] uppercase" style={{ fontSize: "8px", color: "rgba(255,255,255,0.35)" }}>Full data after onboarding</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 bg-[#4a6cf7]" />
          <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-white/50">RESTRICTED</span>
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
        color: hovered ? "#a0c4ff" : "#c8c0b0",
        transition: "color 0.3s ease",
      }}>{n}</span>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <span style={{
          fontFamily: "'Neue Montreal', var(--font-display), sans-serif",
          fontWeight: 700,
          textTransform: "uppercase",
          fontSize: hovered ? "15px" : "13px",
          letterSpacing: hovered ? "0.14em" : "0.1em",
          color: hovered ? "#ffffff" : "#c8c0b0",
          opacity: visible ? 1 : 0,
          transition: `opacity 0.35s ease ${0.05 + index * 0.08}s, color 0.3s ease, font-size 0.3s ease, letter-spacing 0.3s ease`,
        }}>{title}</span>
        <span style={{
          fontFamily: "var(--font-body), sans-serif",
          fontSize: hovered ? "14px" : "13px",
          lineHeight: "1.75",
          color: hovered ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.7)",
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
          <span className="font-mono text-[10px] tracking-[0.25em] font-light" style={{ color: "#c8c0b0" }}>{n}</span>
          <h3
            className="font-bold uppercase"
            style={{ fontFamily: "'Neue Montreal', var(--font-display), sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: "0.03em", lineHeight: 1.35, color: "#e8e8e8", opacity: visible ? 1 : 0, transition: `opacity 0.35s ease ${0.05 + index * 0.08}s` }}
          >
            {title}
          </h3>
          <p
            className="text-[13px] leading-[1.8]"
            style={{ color: "rgba(255,255,255,0.55)", opacity: visible ? 1 : 0, transition: `opacity 0.35s ease ${0.15 + index * 0.08}s` }}
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
  const [activeWwdCard, setActiveWwdCard] = useState(0);
  const [wwdHovered, setWwdHovered] = useState(false);
  const [activeIntelItem, setActiveIntelItem] = useState(0);
  const [intelVisible, setIntelVisible] = useState(true);
  const [hoveredIntelItem, setHoveredIntelItem] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  const tableTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intelSectionRef = useRef<HTMLDivElement>(null);
  const [sec2Visible,       setSec2Visible]       = useState(false);
  const [sec3Visible,       setSec3Visible]       = useState(false);
  const [sec4Visible,       setSec4Visible]       = useState(false);
  const [sec5Visible,       setSec5Visible]       = useState(false);
  const [secCtaVisible,     setSecCtaVisible]     = useState(false);
  const [sec2BodyVisible,   setSec2BodyVisible]   = useState(false);
  const [sec3BodyVisible,   setSec3BodyVisible]   = useState(false);
  const [sec4BodyVisible,   setSec4BodyVisible]   = useState(false);
  const [sec5BodyVisible,   setSec5BodyVisible]   = useState(false);
  const [secMapVisible,     setSecMapVisible]     = useState(false);
  const sec2Done     = useCallback(() => setSec2Visible(true),     []);
  const sec3Done     = useCallback(() => setSec3Visible(true),     []);
  const sec4Done     = useCallback(() => setSec4Visible(true),     []);
  const sec5Done     = useCallback(() => setSec5Visible(true),     []);
  const secCtaDone   = useCallback(() => setSecCtaVisible(true),   []);
  const sec2BodyDone = useCallback(() => setSec2BodyVisible(true), []);
  const sec3BodyDone = useCallback(() => setSec3BodyVisible(true), []);
  const sec4BodyDone = useCallback(() => setSec4BodyVisible(true), []);
  const sec5BodyDone = useCallback(() => setSec5BodyVisible(true), []);
  const secMapDone   = useCallback(() => setSecMapVisible(true),   []);

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
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  /* Cycle WE RUN IT cards every 8s, pause on hover */
  useEffect(() => {
    if (wwdHovered) return;
    const timer = setInterval(() => {
      setActiveWwdCard(c => (c + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, [wwdHovered]);

  /* Hide table when clicking outside intel section */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (intelSectionRef.current && !intelSectionRef.current.contains(e.target as Node)) {
        setShowTable(false);
        if (tableTimerRef.current) { clearTimeout(tableTimerRef.current); tableTimerRef.current = null; }
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <main className="relative min-h-screen bg-black grain">

      {/* ── NAVBAR ───────────────────────────────────────────────────────── */}
      <Navbar />

      {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
      <section id="home" className="relative pt-[72px]" style={{ backgroundColor: "#060a14" }}>

        <HeroVideoBackground />

        {/* Hero content sits above the videos */}
        <div className="relative z-10 flex flex-col items-center px-6 py-14 md:py-24 lg:py-36 gap-6">
          <div
            className="opacity-0 mb-3"
            style={{ animation: "reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s forwards" }}
          >
            <div className="flex items-center justify-center w-full text-center">
              <span className="sys-label" style={{ textAlign: "center" }}><ScrambleOnView text="Proprietary GCC Media & Insight Technology" delay={0} style={{ display: "inline" }} /></span>
            </div>
          </div>

          <h1
            className="font-bold uppercase text-center"
            style={{ fontFamily: "'Neue Montreal', var(--font-display), sans-serif", fontSize: "clamp(48px,12vw,110px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.05 }}
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
              style={{ color: "#4a6cf7" }}
            />
          </h1>

          <div
            className="flex flex-col md:flex-row items-stretch md:items-center md:justify-center gap-4 md:gap-6 opacity-0 mt-10 md:mt-20 mb-10 md:mb-20 max-w-xs md:max-w-none mx-auto w-full"
            style={{ animation: "reveal-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.7s forwards" }}
          >
            <HoverActionButton labelText="Request a Briefing" scramble href="/contact" variant="blue-fill" className="!flex md:!inline-flex text-[11px] md:text-[15px] font-bold w-full md:w-80 hero-btn" style={{ borderRadius: "999px", padding: "28px 0", background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)", backdropFilter: "blur(48px) saturate(200%) brightness(1.2)", WebkitBackdropFilter: "blur(48px) saturate(200%) brightness(1.2)", borderColor: "rgba(255,255,255,0.30)", boxShadow: "0 0 0 1px rgba(255,255,255,0.15) inset, 0 1px 0 0 rgba(255,255,255,0.20) inset, 0 -1px 0 0 rgba(255,255,255,0.05) inset, 0 4px 30px rgba(255,255,255,0.06) inset, 0 16px 48px rgba(0,0,0,0.4)" }} />
            <HoverActionButton labelText="How It Works" scramble scrambleStep={6.2} href="#what-we-do" variant="white" direction="vertical" className="!flex md:!inline-flex text-[11px] md:text-[15px] font-bold w-full md:w-80 hero-btn" style={{ borderRadius: "999px", padding: "28px 0", background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)", backdropFilter: "blur(48px) saturate(200%) brightness(1.2)", WebkitBackdropFilter: "blur(48px) saturate(200%) brightness(1.2)", borderColor: "rgba(255,255,255,0.30)", boxShadow: "0 0 0 1px rgba(255,255,255,0.15) inset, 0 1px 0 0 rgba(255,255,255,0.20) inset, 0 -1px 0 0 rgba(255,255,255,0.05) inset, 0 4px 30px rgba(255,255,255,0.06) inset, 0 16px 48px rgba(0,0,0,0.4)" }} />
          </div>
        </div>
      </section>

      {/* ── 2. WHAT WE DO ────────────────────────────────────────────────── */}
      <section id="what-we-do" className="sys-section">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">

          <div className="flex items-center mb-5">
            <span className="sys-label" style={{ fontSize: "12px", letterSpacing: "0.3em" }}>
              <img src="/Untitled design.png" alt="" style={{ width: "14px", height: "14px", marginRight: "8px", display: "inline-block", verticalAlign: "middle", mixBlendMode: "screen" }} />
              <ScrambleOnView text="What We Do" delay={0} style={{ display: "inline" }} onDone={sec2Done} />
            </span>
          </div>

          <h2
            style={{ fontFamily: "'Neue Montreal', var(--font-display), sans-serif", fontSize: "clamp(44px,6vw,72px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em", textTransform: "uppercase", marginBottom: "64px", color: "#e8e8e8" }}
          >
            <ScrambleOnSignal text="WE RUN IT." signal={sec2Visible} style={{ color: "#e8e8e8" }} />
            <ScrambleOnSignal text="YOU SEE WHO ENGAGED." signal={sec2Visible} style={{ color: "#4a6cf7" }} />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-[6px]" style={{ marginBottom: "56px", opacity: sec2Visible ? 1 : 0, transition: "opacity 0.5s ease 0.1s" }}>
            {[
              { n: "01", stat: "<24hr", statLabel: "DELIVERY GUARANTEED", title: "SECURED MEDIA PLACEMENT", desc: "We craft your messaging, manage your media presence, and place your story across the region\u2019s most-read publications. Not pitches \u2014 placements.", accent: false, href: "#media-placement" },
              { n: "02", stat: "44.7M+", statLabel: "REACHABLE AUDIENCE", title: "PRECISION DISTRIBUTION", desc: "6 GCC markets. 32 industries. Your content reaches the right audience \u2014 from the general population to the C-suite.", accent: false, href: "#audience-selection" },
              { n: "03", stat: "94%", statLabel: "READER IDENTIFICATION", title: "FULL ENGAGEMENT VISIBILITY", desc: "Who read it. Where they\u2019re from. What they do. Full audience breakdowns across every campaign \u2014 delivered as a branded, exportable report.", accent: false, href: "#sample-insights" },
            ].map(({ n, stat, statLabel, title, desc, accent, href }, i) => {
              const isActive = wwdHovered ? false : i === activeWwdCard;
              return (
              <a
                key={n}
                href={href}
                className={`wwd-card wwd-card-inner${isActive ? " wwd-card-active" : ""}`}
                onMouseEnter={() => setWwdHovered(true)}
                onMouseLeave={() => setWwdHovered(false)}
                style={{
                  background: "#12151b",
                  borderTop: accent ? "2px solid #4a6cf7" : "2px solid transparent",
                  borderRadius: "12px",
                  display: "block",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                }}
              >
                <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "rgba(74,108,247,0.4)", letterSpacing: "0.15em", marginBottom: "32px" }}>{n}</div>
                <div className="wwd-stat" style={{ fontFamily: "'Neue Montreal', var(--font-display), sans-serif", fontWeight: 800, letterSpacing: "-0.03em", color: "#e8e8e8", lineHeight: 1 }}>{stat}</div>
                <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(74,108,247,0.4)", marginTop: "8px", paddingBottom: "28px", marginBottom: "28px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{statLabel}</div>
                <div style={{ fontFamily: "'Neue Montreal', var(--font-display), sans-serif", fontSize: "16px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em", lineHeight: 1.35, color: "#e8e8e8", marginBottom: "16px" }}>{title}</div>
                <div style={{ fontFamily: "var(--font-body), sans-serif", fontSize: "13.5px", lineHeight: 1.7, color: "#6b7080" }}>{desc}</div>
              </a>
              );
            })}
          </div>

          <div className="flex justify-center" style={{ marginBottom: "56px", opacity: sec2Visible ? 1 : 0, transition: "opacity 0.5s ease 0.3s" }}>
            <a
              href="/contact"
              className="group inline-flex items-center h-14 font-mono text-[13px] tracking-[0.22em] uppercase text-black font-bold relative overflow-hidden"
              style={{ borderRadius: "12px", transform: "translateZ(0)" }}
            >
              <span className="absolute inset-0 bg-white" />
              <span className="absolute inset-0 flex items-center justify-center duration-700 ease-[cubic-bezier(0.50,0.20,0,1)] -translate-x-full group-hover:translate-x-0 z-10" style={{ background: "#4a6cf7" }}>
                <img src="/D*M website.png" alt="DWM" className="h-7 w-auto" style={{ mixBlendMode: "screen" }} />
              </span>
              <span className="absolute inset-0 flex items-center justify-center text-black transition-opacity duration-300 group-hover:opacity-0 z-20">
                Get In Touch
              </span>
              <span className="invisible px-12">Get In Touch</span>
            </a>
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
                <span className="sys-label" style={{ fontSize: "12px", letterSpacing: "0.3em" }}><img src="/Untitled design.png" alt="" style={{ width: "14px", height: "14px", marginRight: "8px", display: "inline-block", verticalAlign: "middle", mixBlendMode: "screen" }} /><ScrambleOnView text="Secured Media Placement" delay={0} style={{ display: "inline" }} onDone={sec3Done} /></span>
              </div>
              <h2
                className="font-bold uppercase"
                style={{ fontFamily: "'Neue Montreal', var(--font-display), sans-serif", fontSize: "clamp(44px,6vw,72px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.05 }}
              >
                <ScrambleOnSignal text="Your Story." signal={sec3Visible} style={{ color: "#ffffff" }} />
                <ScrambleOnSignal text="Guaranteed Publishing." signal={sec3Visible} style={{ color: "#4a6cf7" }} />
              </h2>

              {/* Stat counters */}
              <div className="flex items-stretch divide-x divide-white/[0.06]" style={{ opacity: sec3Visible ? 1 : 0, transition: "opacity 0.35s ease 0.05s" }}>
                {[
                  { value: "100%", label: "Placement Rate" },
                  { value: "12+",  label: "Publications" },
                ].map(({ value, label }) => (
                  <div key={label} className="flex flex-col gap-1 pr-4 md:pr-8 first:pl-0 pl-4 md:pl-8">
                    <span className="font-bold" style={{ fontFamily: "'Neue Montreal', var(--font-display), sans-serif", fontSize: "28px", fontWeight: 800, color: "#e8e2d6" }}>{value}</span>
                    <span className="font-mono uppercase" style={{ fontSize: "8px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.5)" }}>{label}</span>
                  </div>
                ))}
              </div>

              <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body), sans-serif", fontSize: "13.5px", lineHeight: 1.7, opacity: sec3Visible ? 1 : 0, transition: "opacity 0.35s ease 0.15s" }}>
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
      <section id="audience-selection" className="sys-section">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="mb-14">
            <div className="flex items-center mb-5">
              <span className="sys-label" style={{ fontSize: "12px", letterSpacing: "0.3em" }}>
                <img src="/Untitled design.png" alt="" style={{ width: "14px", height: "14px", marginRight: "8px", display: "inline-block", verticalAlign: "middle", mixBlendMode: "screen" }} />
                <ScrambleOnView text="Audience Selection" delay={0} style={{ display: "inline" }} onDone={secMapDone} />
              </span>
            </div>
            <h2
              className="font-bold uppercase text-white"
              style={{ fontFamily: "'Neue Montreal', var(--font-display), sans-serif", fontSize: "clamp(44px,6vw,72px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.05 }}
            >
              <ScrambleOnSignal text="Target Anyone." signal={secMapVisible} style={{ color: "#ffffff" }} />
              <ScrambleOnSignal text="Anywhere." signal={secMapVisible} style={{ color: "#4a6cf7" }} />
            </h2>
            <p className="sys-body max-w-lg mt-6" style={{ opacity: secMapVisible ? 1 : 0, transition: "opacity 0.35s ease 0.2s" }}>
              Our proprietary technology allows us to ensure anyone you want to read the story, reads it.
            </p>
          </div>
          {/* Desktop: Interactive map */}
          <div className="hidden md:block" style={{
            position: "relative",
            borderRadius: "4px",
            border: "1px solid rgba(74,108,247,0.30)",
            boxShadow: "0 0 0 1px rgba(74,108,247,0.06), 0 0 40px rgba(74,108,247,0.18), 0 0 80px rgba(74,108,247,0.08), inset 0 0 40px rgba(4,13,28,0.6)",
            overflow: "hidden",
            opacity: secMapVisible ? 1 : 0,
            transition: "opacity 0.6s ease 0.3s",
          }}>
            {/* Atmospheric glow — centred on the Gulf */}
            <div aria-hidden style={{
              position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
              background: "radial-gradient(ellipse 55% 50% at 62% 52%, rgba(74,108,247,0.08) 0%, transparent 70%)",
            }} />
            <iframe
              src="/dwm-gcc-map.html"
              scrolling="no"
              loading="lazy"
              style={{ width: "100%", height: "680px", border: "none", display: "block", position: "relative", zIndex: 0 }}
              title="GCC Audience Map"
            />
          </div>
          {/* Mobile: GCC Slideshow */}
          <div className="block md:hidden" style={{
            position: "relative",
            borderRadius: "4px",
            border: "1px solid rgba(74,108,247,0.30)",
            boxShadow: "0 0 0 1px rgba(74,108,247,0.06), 0 0 40px rgba(74,108,247,0.18), 0 0 80px rgba(74,108,247,0.08), inset 0 0 40px rgba(4,13,28,0.6)",
            overflow: "hidden",
            opacity: secMapVisible ? 1 : 0,
            transition: "opacity 0.6s ease 0.3s",
          }}>
            <iframe
              src="/dwm-gcc-slideshow.html"
              scrolling="no"
              loading="lazy"
              style={{ width: "100%", height: "540px", border: "none", display: "block" }}
              title="GCC Audience Slideshow"
            />
          </div>
        </div>
      </section>

      {/* ── Sample Insights ────────────────────────────────────────────────── */}
      <section id="sample-insights" className="sys-section">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="flex items-center mb-5">
            <span className="sys-label" style={{ fontSize: "12px", letterSpacing: "0.3em" }}>
              <img src="/Untitled design.png" alt="" style={{ width: "14px", height: "14px", marginRight: "8px", display: "inline-block", verticalAlign: "middle", mixBlendMode: "screen" }} />
              Sample Insights
            </span>
          </div>
          <h2
            className="font-bold uppercase text-left mb-10"
            style={{ fontFamily: "'Neue Montreal', var(--font-display), sans-serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.05 }}
          >
            <ScrambleOnView text="What We Know," delay={0} style={{ display: "inline", color: "#ffffff" }} />
            {" "}
            <ScrambleOnView text="They Don't." delay={200} style={{ display: "inline", color: "#4a6cf7" }} />
          </h2>
          <CampaignDashboard />
        </div>
      </section>

      {/* ── 4. WHO WE WORK WITH ──────────────────────────────────────────── */}
      <section id="reviews" className="sys-section">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="mb-14 text-center">
            <div className="flex items-center justify-center mb-5">
              <span className="sys-label" style={{ fontSize: "12px", letterSpacing: "0.3em" }}><img src="/Untitled design.png" alt="" style={{ width: "14px", height: "14px", marginRight: "8px", display: "inline-block", verticalAlign: "middle", mixBlendMode: "screen" }} /><ScrambleOnView text="Who We Work With" delay={0} style={{ display: "inline" }} onDone={sec5Done} /></span>
            </div>
            <h2
              className="font-bold uppercase text-white"
              style={{ fontFamily: "'Neue Montreal', var(--font-display), sans-serif", fontSize: "clamp(44px,6vw,72px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.05 }}
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
              maxHeight: "clamp(400px, 60vh, 680px)",
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
          <div className="border border-white/[0.08] bg-white/[0.02] p-6 md:p-12 lg:p-20 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 70% 50%, rgba(74,108,247,0.10) 0%, transparent 60%)",
              }}
            />
            <span className="absolute top-2 left-2 md:top-3 md:left-3 w-3 h-3 md:w-5 md:h-5 border-t border-l border-[#4a6cf7]" />
            <span className="absolute top-2 right-2 md:top-3 md:right-3 w-3 h-3 md:w-5 md:h-5 border-t border-r border-[#4a6cf7]" />
            <span className="absolute bottom-2 left-2 md:bottom-3 md:left-3 w-3 h-3 md:w-5 md:h-5 border-b border-l border-[#4a6cf7]" />
            <span className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-3 h-3 md:w-5 md:h-5 border-b border-r border-[#4a6cf7]" />

            <div className="relative z-10">
              <div className="flex items-center mb-5">
                <span className="sys-label" style={{ fontSize: "12px", letterSpacing: "0.3em" }}><img src="/Untitled design.png" alt="" style={{ width: "14px", height: "14px", marginRight: "8px", display: "inline-block", verticalAlign: "middle", mixBlendMode: "screen" }} /><ScrambleOnView text="Get Started" delay={0} style={{ display: "inline" }} onDone={secCtaDone} /></span>
              </div>
              <h2
                className="font-bold uppercase text-white mb-5 text-center"
                style={{ fontFamily: "'Neue Montreal', var(--font-display), sans-serif", fontSize: "clamp(44px,6vw,72px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.05 }}
              >
                <ScrambleOnSignal text="Start with" signal={secCtaVisible} style={{ color: "#ffffff" }} />
                <ScrambleOnSignal text="a Briefing." signal={secCtaVisible} style={{ color: "#ffffff" }} />
                <ScrambleOnSignal text="See What Returns." signal={secCtaVisible} style={{ color: "#4a6cf7" }} />
              </h2>
              <p className="sys-body max-w-lg mb-10 mx-auto text-center" style={{ opacity: secCtaVisible ? 1 : 0, transition: "opacity 0.35s ease 0.25s" }}>
                Book a briefing. We&apos;ll walk you through what we&apos;d run, who we&apos;d reach, and whether you&apos;re eligible.
              </p>
              <div className="flex justify-center" style={{ opacity: secCtaVisible ? 1 : 0, transition: "opacity 0.35s ease 0.32s" }}>
                <HoverActionButton label="Request a Briefing" href="/contact" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="relative">
        <div aria-hidden className="absolute top-0 left-[10%] right-[10%] h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.12) 70%, transparent)" }} />
        <div aria-hidden className="absolute -top-1 left-[15%] right-[15%] h-[9px] pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.04) 70%, transparent)", filter: "blur(4px)" }} />
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-6 md:gap-10">
          <div className="flex flex-col gap-4">
            <img src="/D*M website.png" alt="DWM" className="h-9 w-auto self-start" />
            <p className="font-mono text-[11px] tracking-[0.08em] text-white/60 max-w-xs leading-relaxed">
              Proprietary GCC Media &amp; Insight Technology
            </p>
          </div>

          {[
            { heading: "Services", links: [
              { label: "Our Aim", href: "/#what-we-do" },
              { label: "Media Placement", href: "/#media-placement" },
              { label: "Targeting", href: "/#audience-selection" },
              { label: "Audience Insights", href: "/#intelligence" },
            ]},
            { heading: "Company", links: [
              { label: "Home", href: "/#home" },
              { label: "Contact", href: "/#get-started" },
              { label: "Reviews", href: "/#reviews" },
            ]},
            { heading: "Legal", links: [
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms & Conditions", href: "/terms-and-conditions" },
            ]},
          ].map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/70">{col.heading}</span>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/50 hover:text-white/80 transition-colors duration-200">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="relative px-6 md:px-10 py-5">
          <div aria-hidden className="absolute top-0 left-[10%] right-[10%] h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.08) 70%, transparent)" }} />
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/50">
              © 2026 Diwaniya Media. All rights reserved.
            </span>
          </div>
        </div>
      </footer>

    </main>
  );
}
