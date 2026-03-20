"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "wipe-in" | "hold" | "wipe-out">("idle");
  const pendingHref = useRef<string | null>(null);
  const prevPath = useRef(pathname);

  /* Intercept all <a> clicks that navigate internally */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;

      const isInternal = href.startsWith("/") && !href.startsWith("//");
      const isHashOnly = href.startsWith("#");
      const hrefPath = href.split("#")[0] || "/";
      const isSamePage = hrefPath === prevPath.current;

      if (!isInternal || isHashOnly || isSamePage) return;

      e.preventDefault();
      if (phase !== "idle") return;

      pendingHref.current = href;
      setPhase("wipe-in");
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [phase]);

  /* When wipe-in animation ends → navigate and hold */
  const handleAnimationEnd = useCallback(() => {
    if (phase === "wipe-in" && pendingHref.current) {
      router.push(pendingHref.current);
      pendingHref.current = null;
      setPhase("hold");
    } else if (phase === "wipe-out") {
      setPhase("idle");
    }
  }, [phase, router]);

  /* When pathname changes while holding → new page is rendered, start wipe-out */
  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname;
      if (phase === "hold") {
        /* Small delay to let the new page paint a frame */
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setPhase("wipe-out");
          });
        });
      }
    }
  }, [pathname, phase]);

  return (
    <>
      {children}
      {phase !== "idle" && (
        <div
          onAnimationEnd={handleAnimationEnd}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#4a6cf7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: phase === "wipe-in" || phase === "hold" ? "all" : "none",
            animation:
              phase === "wipe-in"
                ? "wipeIn 0.5s cubic-bezier(0.77, 0, 0.175, 1) forwards"
                : phase === "wipe-out"
                  ? "wipeOut 0.5s cubic-bezier(0.77, 0, 0.175, 1) forwards"
                  : "none",
            /* Hold phase: panel stays fully covering the screen */
            transform: phase === "hold" ? "translateX(0%)" : undefined,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/D*M website.png"
            alt="DWM"
            style={{
              width: 80,
              height: "auto",
              opacity: phase === "hold" ? 1 : 0.85,
              filter: "brightness(0) invert(1)",
              transition: "opacity 0.2s ease",
            }}
          />
        </div>
      )}
    </>
  );
}
