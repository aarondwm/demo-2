"use client";

import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
  FileText, Users, Globe, BarChart2,
  Target, TrendingUp, Building2, Layers,
  Crosshair, Shield, Zap, Send, LucideIcon,
} from "lucide-react";

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

const NAV_GROUPS = [
  { label: "Home",       href: "#home" },
  { label: "Placement",  href: "#media-placement" },
  { label: "Targetting", href: "#what-we-do" },
  { label: "Insights",   href: "#intelligence" },
  { label: "Reviews",    href: "#reviews" },
  { label: "Contact",    href: "#get-started" },
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

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent`}
    >

      {/* ── Main nav row — max-w-7xl centered (header-3 max-w-5xl pattern) ── */}
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 h-16 flex items-center justify-between gap-6">

        {/* Logo block */}
        <a
          href="#home"
          className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity"
        >
          <img
            src="/D*M website.png"
            alt="DWM"
            className="h-10 w-auto"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center flex-1 justify-center">
          {NAV_GROUPS.map((group) => (
            <a
              key={group.label}
              href={group.href}
              className="py-5 px-5 font-mono font-bold text-[13px] tracking-[0.18em] uppercase text-white hover:text-white/70 transition-colors duration-150 whitespace-nowrap"
            >
              {group.label}
            </a>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href="/contact"
            className="group hidden sm:inline-flex items-center h-11 font-mono text-[12px] tracking-[0.22em] uppercase text-black font-bold relative overflow-hidden"
            style={{ borderRadius: "12px", transform: "translateZ(0)" }}
          >
            {/* Static white background */}
            <span className="absolute inset-0 bg-white" />
            {/* Blue overlay slides in on hover */}
            <span className="absolute inset-0 flex items-center justify-center duration-700 ease-[cubic-bezier(0.50,0.20,0,1)] -translate-x-full group-hover:translate-x-0 z-10" style={{ background: "#4a6cf7" }}>
              <img src="/D*M website.png" alt="DWM" className="h-6 w-auto" style={{ mixBlendMode: "screen" }} />
            </span>
            {/* Text — fades out on hover, stays centered */}
            <span className="absolute inset-0 flex items-center justify-center text-black transition-opacity duration-300 group-hover:opacity-0 z-20">
              Check Eligibility
            </span>
            {/* Invisible sizer keeps button width stable */}
            <span className="invisible px-7">Check Eligibility</span>
          </a>

          {/* Animated toggle (header-3 MenuToggleIcon) */}
          <button
            className="lg:hidden w-10 h-10 border border-white/[0.08] flex items-center justify-center text-white/30 hover:text-white hover:border-[#4a6cf7]/40 transition-colors"
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
              className="px-6 py-5 font-mono font-bold text-[15px] tracking-[0.2em] uppercase text-white hover:text-white/80 hover:bg-white/[0.02] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {group.label}
            </a>
          ))}

          <div className="px-6 py-6">
            <a
              href="/contact"
              className="flex items-center justify-center gap-2 h-12 font-mono text-[12px] tracking-[0.22em] uppercase bg-[#4a6cf7] text-[#04060c] font-bold"
              onClick={() => setMobileOpen(false)}
            >
              Request a Briefing
            </a>
          </div>
        </nav>
      </MobileMenu>
    </header>
  );
}
