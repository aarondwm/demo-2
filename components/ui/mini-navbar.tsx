"use client";

import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
  FileText, Users, Globe, BarChart2,
  Target, TrendingUp, Building2, Layers,
  Crosshair, Shield, Zap, Send, LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/components/ui/language-context";

/* ── useScroll hook (from header-3) ─────────────────────────────────────── */
function useScroll(threshold: number) {
  const [scrolled, setScrolled] = React.useState(false);
  const onScroll = React.useCallback(
    () => setScrolled(window.scrollY > threshold),
    [threshold]
  );
  React.useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);
  React.useEffect(() => { onScroll(); }, [onScroll]);
  return scrolled;
}

/* ── MenuToggleIcon (from header-3 / sshaider pattern) ──────────────────── */
function MenuToggleIcon({
  open,
  className = "",
  duration = 300,
}: {
  open: boolean;
  className?: string;
  duration?: number;
}) {
  return (
    <svg
      strokeWidth={2}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 32 32"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform ease-in-out ${open ? "-rotate-45" : ""} ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      <path
        className={`transition-all ease-in-out ${
          open
            ? "[stroke-dasharray:20_300] [stroke-dashoffset:-32.42px]"
            : "[stroke-dasharray:12_63]"
        }`}
        style={{ transitionDuration: `${duration}ms` }}
        d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
      />
      <path d="M7 16 27 16" />
    </svg>
  );
}

/* ── Nav data with icons (header-3 ListItem pattern) ────────────────────── */
type NavItem = { title: string; href: string; icon: LucideIcon; description?: string };

const methodologyLinks: NavItem[] = [
  { title: "Editorial Targeting",    href: "#methodology", icon: FileText,   description: "Brand narrative shaped for industry audiences" },
  { title: "Internal Saturation",    href: "#methodology", icon: Users,      description: "Content distributed inside target organisations" },
  { title: "Market-Wide Reach",      href: "#methodology", icon: Globe,      description: "Senior professionals and adjacent stakeholders" },
  { title: "Intelligence Reporting", href: "#methodology", icon: BarChart2,  description: "Granular audience data, exportable and boardroom-ready" },
];

const servicesLinks: NavItem[] = [
  { title: "Targeted Distribution",    href: "#services", icon: Target,    description: "Precision by industry, seniority, company" },
  { title: "Content & PR",             href: "#services", icon: FileText,  description: "Editorial-quality stories produced in-house" },
  { title: "Media Distribution",       href: "#services", icon: Globe,     description: "Curated network of regional news publications" },
  { title: "Audience Intelligence",    href: "#services", icon: BarChart2, description: "Who read it, their role, company, seniority" },
  { title: "Decision Maker Marketing", href: "#services", icon: TrendingUp,description: "Reach executives who influence purchasing" },
  { title: "Campaign Analytics",       href: "#services", icon: Zap,       description: "Views, engagement, audience composition" },
];

const intelligenceLinks: NavItem[] = [
  { title: "Audience Intelligence",  href: "#intelligence", icon: Users,     description: "Full breakdown of who engaged with your content" },
  { title: "Company Engagement",     href: "#intelligence", icon: Building2, description: "Organisation-level engagement tracking" },
  { title: "Seniority Breakdown",    href: "#intelligence", icon: Layers,    description: "Analyst through C-Suite segmentation" },
  { title: "Industry Segmentation",  href: "#intelligence", icon: BarChart2, description: "Categorised by sector and vertical" },
];

const capabilitiesLinks: NavItem[] = [
  { title: "Regional Distribution",  href: "#capabilities", icon: Globe,     description: "Kuwait and GCC-wide precision delivery" },
  { title: "Audience Intelligence",  href: "#capabilities", icon: Shield,    description: "Exportable reports, boardroom-ready" },
  { title: "Precision Targeting",    href: "#capabilities", icon: Crosshair, description: "Company, seniority, and industry filters" },
];

const NAV_GROUPS_EN = [
  { label: "Home",       href: "/#home" },
  { label: "Placement",  href: "/#media-placement" },
  { label: "Targeting",  href: "/#audience-selection" },
  { label: "Insights",   href: "/#sample-insights" },
  { label: "Reviews",    href: "/#reviews" },
];
const NAV_GROUPS_AR = [
  { label: "الرئيسية",   href: "/ar#home" },
  { label: "النشر",      href: "/ar#media-placement" },
  { label: "الاستهداف",  href: "/ar#audience-selection" },
  { label: "التقارير",   href: "/ar#sample-insights" },
  { label: "التقييمات",  href: "/ar#reviews" },
];

/* ── ListItem (adapted from header-3 pattern) ────────────────────────────── */
function ListItem({ title, description, icon: Icon, href }: NavItem) {
  return (
    <a
      href={href}
      className="group flex items-start gap-3 px-3 py-3 bg-black hover:bg-white/[0.03] transition-colors"
    >
      <div className="flex-shrink-0 w-9 h-9 border border-white/[0.08] flex items-center justify-center group-hover:border-[#4a6cf7]/40 transition-colors">
        <Icon className="w-4 h-4 text-white/20 group-hover:text-[#4a6cf7] transition-colors" />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="font-mono font-bold text-[13px] tracking-[0.14em] uppercase text-white group-hover:text-white transition-colors leading-tight">
          {title}
        </span>
        {description && (
          <span className="font-mono text-[9px] tracking-[0.06em] text-white/10 group-hover:text-white/25 transition-colors leading-relaxed">
            {description}
          </span>
        )}
      </div>
    </a>
  );
}

/* ── Dropdown panel ──────────────────────────────────────────────────────── */
function DropdownPanel({
  items, cols = 1, cta, visible,
}: {
  items: NavItem[];
  cols?: number;
  cta?: { label: string; href: string };
  visible: boolean;
}) {
  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 w-max min-w-[300px] bg-black border border-white/[0.08] z-50 transition-all duration-200 origin-top ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
      }`}
    >
      <div className="h-px w-full bg-[#4a6cf7] opacity-60" />
      <ul className={`p-2 gap-px bg-white/[0.04] ${cols === 2 ? "grid grid-cols-2" : "flex flex-col"}`}>
        {items.map((item) => (
          <li key={item.title}>
            <ListItem {...item} />
          </li>
        ))}
      </ul>
      {cta && (
        <div className="p-2 pt-0">
          <a
            href={cta.href}
            className="block text-center font-mono text-[11px] tracking-[0.2em] uppercase text-[#4a6cf7] border border-[#4a6cf7]/25 px-4 py-2.5 hover:bg-[#4a6cf7]/10 transition-colors"
          >
            {cta.label}
          </a>
        </div>
      )}
    </div>
  );
}

/* ── MobileMenu portal (from header-3 createPortal pattern) ─────────────── */
// Total header height: classification strip (h-7 = 28px) + main row (h-16 = 64px) = 92px
function MobileMenu({ open, children }: { open: boolean; children: React.ReactNode }) {
  if (!open || typeof window === "undefined") return null;
  return createPortal(
    <div
      id="mobile-menu"
      className="fixed left-0 right-0 bottom-0 z-40 bg-black/98 backdrop-blur-md border-t border-white/[0.08] flex flex-col overflow-hidden"
      style={{ top: 64 }}
    >
      <div
        data-slot={open ? "open" : "closed"}
        className="data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out size-full overflow-y-auto p-0"
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

/* ── Main Navbar ─────────────────────────────────────────────────────────── */
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScroll(10);
  const { lang } = useLanguage();
  const NAV_GROUPS = lang === "ar" ? NAV_GROUPS_AR : NAV_GROUPS_EN;

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-full ${
        scrolled
          ? "bg-black/97 backdrop-blur-md"
          : "bg-transparent"
      }`}
      style={{ maxWidth: "1360px" }}
    >

      {/* ── Main nav row — max-w-7xl centered (header-3 max-w-5xl pattern) ── */}
      <div className="mx-auto w-full px-6 md:px-10 h-16 flex items-center justify-between gap-6">

        {/* Logo block */}
        <a
          href={lang === "ar" ? "/ar" : "/"}
          className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity"
        >
          <span
            className="inline-block h-10 w-10"
            style={{
              backgroundColor: "white",
              WebkitMaskImage: "url('/D*M website.png')",
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskImage: "url('/D*M website.png')",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              maskMode: "luminance",
              clipPath: "circle(38% at 50% 50%)",
            }}
          />
          <span className="ml-2 font-bold uppercase tracking-[0.08em]" style={{ fontFamily: "'Neue Montreal', var(--font-display), sans-serif", fontSize: lang === "ar" ? "clamp(20px, 4vw, 24px)" : "clamp(10px, 2.5vw, 15px)", color: "#e8e8e8" }}>{lang === "ar" ? "ديوانية ميديا" : "Diwaniya Media"}</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center flex-1 justify-end gap-8">
          {NAV_GROUPS.map((group) => (
            <a
              key={group.label}
              href={group.href}
              className={`py-5 font-mono font-normal ${lang === "ar" ? "text-[15px]" : "text-[12px]"} tracking-[0.22em] uppercase text-white/70 hover:text-white transition-colors duration-150 whitespace-nowrap`}
            >
              {group.label}
            </a>
          ))}
        </nav>

        {/* CTA + Lang toggle + mobile toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href={lang === "ar" ? "/ar/contact" : "/contact"}
            className={`group hidden sm:inline-flex items-center h-9 font-mono ${lang === "ar" ? "text-[15px]" : "text-[13px]"} tracking-[0.14em] uppercase text-black font-bold relative overflow-hidden`}
            style={{ borderRadius: "12px", transform: "translateZ(0)" }}
          >
            <span className="absolute inset-0 bg-white" />
            <span className="absolute inset-0 flex items-center justify-center duration-700 ease-[cubic-bezier(0.50,0.20,0,1)] -translate-x-full group-hover:translate-x-0 z-10" style={{ background: "#4a6cf7" }}>
              <img src="/D*M website.png" alt="DWM" className="h-6 w-auto" style={{ mixBlendMode: "screen" }} />
            </span>
            <span className="absolute inset-0 flex items-center justify-center text-black transition-opacity duration-300 group-hover:opacity-0 z-20">
              {lang === "ar" ? "تحقق من الأهلية" : "Check Eligibility"}
            </span>
            <span className="invisible px-7">{lang === "ar" ? "تحقق من الأهلية" : "Check Eligibility"}</span>
          </a>
          {/* Language switch — same style as CTA */}
          <a
            href={lang === "en" ? "/ar" : "/"}
            className={`group inline-flex items-center h-9 font-mono ${lang === "ar" ? "text-[15px]" : "text-[13px]"} tracking-[0.14em] uppercase font-bold relative overflow-hidden`}
            style={{ borderRadius: "12px", transform: "translateZ(0)", textDecoration: "none" }}
          >
            <span className="absolute inset-0" style={{ background: "rgba(74,108,247,0.15)", border: "1px solid rgba(74,108,247,0.3)", borderRadius: "12px" }} />
            <span className="absolute inset-0 flex items-center justify-center duration-700 ease-[cubic-bezier(0.50,0.20,0,1)] -translate-x-full group-hover:translate-x-0 z-10" style={{ background: "#4a6cf7", borderRadius: "12px" }}>
              <span className="text-white text-[13px] tracking-[0.14em] uppercase font-bold">{lang === "en" ? "عربي" : "EN"}</span>
            </span>
            <span className="absolute inset-0 flex items-center justify-center text-white transition-opacity duration-300 group-hover:opacity-0 z-20">
              {lang === "en" ? "عربي" : "EN"}
            </span>
            <span className="invisible px-5">{lang === "en" ? "عربي" : "EN"}</span>
          </a>

          {/* Animated toggle (header-3 MenuToggleIcon) */}
          <button
            className="lg:hidden w-11 h-11 border border-white/[0.08] flex items-center justify-center text-white/30 hover:text-white hover:border-[#4a6cf7]/40 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <MenuToggleIcon open={mobileOpen} className="w-5 h-5" duration={300} />
          </button>
        </div>
      </div>

      {/* ── Mobile menu portal (header-3 createPortal pattern) ── */}
      <MobileMenu open={mobileOpen}>
        <nav className="flex flex-col divide-y divide-white/[0.05]">
          {NAV_GROUPS.map((group) => (
            <a
              key={group.label}
              href={group.href}
              className={`px-6 py-5 font-mono font-bold ${lang === "ar" ? "text-[18px]" : "text-[15px]"} tracking-[0.18em] uppercase text-white hover:text-white/80 hover:bg-white/[0.02] transition-colors`}
              onClick={() => setMobileOpen(false)}
            >
              {group.label}
            </a>
          ))}

          <div className="px-6 py-6">
            <a
              href={lang === "ar" ? "/ar/contact" : "/contact"}
              className="flex items-center justify-center gap-2 h-12 font-mono text-[12px] tracking-[0.18em] uppercase bg-[#4a6cf7] text-[#04060c] font-bold"
              onClick={() => setMobileOpen(false)}
            >
              {lang === "ar" ? "اطلب جلسة تعريفية" : "Request a Briefing"}
            </a>
          </div>
        </nav>
      </MobileMenu>
    </header>
  );
}
