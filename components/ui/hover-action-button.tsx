"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* Inline sequential scrambler — same algorithm as TextScramble in page.tsx */
function runScramble(el: HTMLElement, text: string, step = 4) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  type Q = { to: string; start: number; end: number; char?: string };
  const queue: Q[] = Array.from(text).map((to, i) => ({ to, start: Math.round(i * step), end: Math.round(i * step) + 6 }));
  let frame = 0;
  let raf = 0;
  const tick = () => {
    let out = "";
    let done = 0;
    for (const item of queue) {
      if (frame >= item.end) {
        done++;
        out += item.to === " " ? " " : item.to;
      } else if (frame >= item.start) {
        if (!item.char || Math.random() < 0.28)
          item.char = chars[Math.floor(Math.random() * 26)];
        out += `<span class="dud">${item.char}</span>`;
      } else {
        out += item.to === " " ? " " : "";
      }
    }
    el.innerHTML = out;
    if (done < queue.length) { raf = requestAnimationFrame(tick); frame++; }
  };
  cancelAnimationFrame(raf);
  el.style.opacity = "1";
  el.innerHTML = "";
  tick();
}

interface HoverActionButtonProps {
  label?: React.ReactNode;
  labelText?: string;
  scramble?: boolean;
  scrambleStep?: number;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  variant?: "blue" | "white";
  direction?: "horizontal" | "vertical";
}

export const HoverActionButton = ({
  label = "Button",
  labelText,
  scramble = false,
  scrambleStep = 4,
  href = "#",
  className,
  style,
  variant = "blue",
  direction = "horizontal",
}: HoverActionButtonProps = {}) => {
  const sizerText  = labelText ?? (typeof label === "string" ? label : "");
  const fillClass  = variant === "white" ? "group-hover:bg-white"    : "group-hover:bg-[#4a6cf7]";
  const textHover  = variant === "white" ? "text-black"              : "text-white";
  const borderBase = variant === "white" ? "border-white/40 bg-black": "border-white/20 bg-black";

  const isVertical = direction === "vertical";
  const Arrow      = isVertical ? ArrowDown : ArrowRight;
  const exitClass  = isVertical ? "group-hover:-translate-y-6 group-hover:opacity-0"
                                : "group-hover:-translate-x-8 group-hover:opacity-0";
  const enterFrom  = isVertical ? "-translate-y-6" : "-translate-x-8";
  const enterTo    = isVertical ? "group-hover:translate-y-0" : "group-hover:translate-x-0";

  const scrambleRef = useRef<HTMLSpanElement>(null);

  /* Fire once on mount */
  useEffect(() => {
    if (scramble && scrambleRef.current && sizerText) {
      runScramble(scrambleRef.current, sizerText, scrambleStep);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Re-fire when hover ends (default label slides back in) */
  const handleMouseLeave = useCallback(() => {
    if (scramble && scrambleRef.current && sizerText) {
      runScramble(scrambleRef.current, sizerText, scrambleStep);
    }
  }, [scramble, sizerText]);

  return (
    <a
      href={href}
      style={style}
      onMouseLeave={scramble ? handleMouseLeave : undefined}
      className={cn(
        "group relative cursor-pointer border py-4 px-10 font-mono text-[11px] font-semibold tracking-[0.2em] uppercase text-white inline-flex items-center justify-center whitespace-nowrap overflow-hidden",
        borderBase,
        className
      )}
    >
      {/* Invisible sizer */}
      <span className="invisible flex items-center gap-3" aria-hidden>
        {sizerText}
        <Arrow className="w-4 h-4 flex-shrink-0" />
      </span>

      {/* Background fill */}
      <span
        className={cn(
          "absolute left-[20%] top-[40%] h-2 w-2 scale-[1] bg-transparent transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] pointer-events-none",
          fillClass
        )}
      />

      {/* Default label — exits on hover */}
      <span className={cn("absolute z-10 transition-all duration-300", exitClass)}>
        {scramble
          ? <span ref={scrambleRef} style={{ opacity: 0 }}>{sizerText}</span>
          : label}
      </span>

      {/* Hover state — enters on hover */}
      <span className={cn(
        "absolute z-10 flex items-center justify-center gap-3 opacity-0 transition-all duration-300 group-hover:opacity-100",
        enterFrom,
        enterTo,
        textHover
      )}>
        <span>{sizerText}</span>
        <Arrow className="w-4 h-4 flex-shrink-0" />
      </span>
    </a>
  );
};
