"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "wipe-in" | "hold" | "wipe-out">("idle");
  const pendingHref = useRef<string | null>(null);
  const prevPath = useRef(pathname);

  /* Intercept all <a> clicks that navigate to a different page */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;

      /* Hash-only links (#section) stay on same page — skip */
      if (href.startsWith("#")) return;
      /* External links — skip */
      if (!href.startsWith("/") || href.startsWith("//")) return;

      /* Extract the page path (strip hash) */
      const hrefPath = href.split("#")[0] || "/";
      const currentPage = prevPath.current;

      /* Same page — skip (e.g. /#reviews on homepage) */
      if (hrefPath === currentPage) return;

      e.preventDefault();
      e.stopPropagation();
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
      const href = pendingHref.current;
      pendingHref.current = null;
      router.push(href);
      setPhase("hold");

      /* Safety: if pathname doesn't change within 2s, force wipe-out */
      setTimeout(() => {
        setPhase((p) => (p === "hold" ? "wipe-out" : p));
      }, 2000);
    } else if (phase === "wipe-out") {
      setPhase("idle");
    }
  }, [phase, router]);

  /* When pathname changes while holding → new page is rendered, start wipe-out */
  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname;
      if (phase === "hold") {
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
              mixBlendMode: "screen",
            }}
          />
        </div>
      )}
    </>
  );
}
