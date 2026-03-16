"use client";

import React from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface HoverActionButtonProps {
  label?: string;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  variant?: "blue" | "white";
  direction?: "horizontal" | "vertical";
}

export const HoverActionButton = ({
  label = "Button",
  href = "#",
  className,
  style,
  variant = "blue",
  direction = "horizontal",
}: HoverActionButtonProps = {}) => {
  const fillClass  = variant === "white" ? "group-hover:bg-white"    : "group-hover:bg-[#4a6cf7]";
  const textHover  = variant === "white" ? "text-black"               : "text-white";
  const borderBase = variant === "white" ? "border-white/40 bg-black" : "border-white/20 bg-black";

  const isVertical = direction === "vertical";
  const Arrow = isVertical ? ArrowDown : ArrowRight;

  // Exit: default label slides out
  const exitClass   = isVertical ? "group-hover:-translate-y-6 group-hover:opacity-0"
                                 : "group-hover:-translate-x-8 group-hover:opacity-0";
  // Enter: hover label slides in
  const enterFrom   = isVertical ? "-translate-y-6" : "-translate-x-8";
  const enterTo     = isVertical ? "group-hover:translate-y-0" : "group-hover:translate-x-0";

  return (
    <a
      href={href}
      style={style}
      className={cn(
        "group relative cursor-pointer border py-4 px-10 font-mono text-[11px] font-semibold tracking-[0.2em] uppercase text-white inline-flex items-center justify-center whitespace-nowrap overflow-hidden",
        borderBase,
        className
      )}
    >
      {/* Invisible sizer */}
      <span className="invisible flex items-center gap-3" aria-hidden>
        {label}
        <Arrow className="w-4 h-4 flex-shrink-0" />
      </span>

      {/* Background fill */}
      <span
        className={cn(
          "absolute left-[20%] top-[40%] h-2 w-2 scale-[1] bg-white/10 transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] pointer-events-none",
          fillClass
        )}
      />

      {/* Default label — exits on hover */}
      <span className={cn("absolute z-10 transition-all duration-300", exitClass)}>
        {label}
      </span>

      {/* Hover state — enters on hover */}
      <span className={cn(
        "absolute z-10 flex items-center justify-center gap-3 opacity-0 transition-all duration-300 group-hover:opacity-100",
        enterFrom,
        enterTo,
        textHover
      )}>
        <span>{label}</span>
        <Arrow className="w-4 h-4 flex-shrink-0" />
      </span>
    </a>
  );
};
