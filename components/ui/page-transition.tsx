"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "wipe-in" | "wipe-out">("idle");
  const pendingHref = useRef<string | null>(null);
  const currentPath = useRef(pathname);

  /* Intercept all <a> clicks that navigate internally */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;

      const isInternal = href.startsWith("/") && !href.startsWith("//");
      const isHashOnly = href.startsWith("#");
      const isSamePage = href === currentPath.current || href.split("#")[0] === currentPath.current;

      if (!isInternal || isHashOnly || isSamePage) return;

      e.preventDefault();
      if (phase !== "idle") return;

      pendingHref.current = href;
      setPhase("wipe-in");
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [phase]);

  /* When wipe-in animation ends, navigate and start wipe-out */
  const handleAnimationEnd = useCallback(() => {
    if (phase === "wipe-in" && pendingHref.current) {
      router.push(pendingHref.current);
      pendingHref.current = null;
      setTimeout(() => setPhase("wipe-out"), 100);
    } else if (phase === "wipe-out") {
      setPhase("idle");
    }
  }, [phase, router]);

  /* Update current path ref */
  useEffect(() => {
    currentPath.current = pathname;
  }, [pathname]);

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
            pointerEvents: phase === "wipe-in" ? "all" : "none",
            animation: phase === "wipe-in"
              ? "wipeIn 0.5s cubic-bezier(0.77, 0, 0.175, 1) forwards"
              : "wipeOut 0.5s cubic-bezier(0.77, 0, 0.175, 1) forwards",
          }}
        />
      )}
    </>
  );
}
