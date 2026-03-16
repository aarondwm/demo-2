"use client";

import { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DottedMap from "dotted-map";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end:   { lat: number; lng: number; label?: string };
  }>;
  lineColor?:         string;
  showLabels?:        boolean;
  animationDuration?: number;
  loop?:              boolean;
  /** SVG viewBox string — use to zoom into a region. Defaults to full world. */
  svgViewBox?:        string;
  /** Height of the arc curve in SVG coordinate units. Smaller = flatter arcs. */
  curveHeight?:       number;
}

// ── Full-world Mercator projection (SVG coordinate space: 800 × 400) ──────
const projectPoint = (lat: number, lng: number) => ({
  x: (lng + 180) * (800 / 360),
  y: (90 - lat)  * (400 / 180),
});

export function WorldMap({
  dots = [],
  lineColor         = "#4a6cf7",
  showLabels        = true,
  animationDuration = 2,
  loop              = true,
  svgViewBox        = "0 0 800 400",
  curveHeight       = 50,
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  const map = useMemo(() => new DottedMap({ height: 100, grid: "diagonal" }), []);

  const svgMap = useMemo(
    () =>
      map.getSVG({
        radius:          0.22,
        color:           "rgba(255,255,255,0.12)",
        shape:           "circle",
        backgroundColor: "transparent",
      }),
    [map]
  );

  const createCurvedPath = (
    s: { x: number; y: number },
    e: { x: number; y: number }
  ) => {
    const midX = (s.x + e.x) / 2;
    const midY = Math.min(s.y, e.y) - curveHeight;
    return `M ${s.x} ${s.y} Q ${midX} ${midY} ${e.x} ${e.y}`;
  };

  const staggerDelay       = 0.3;
  const totalAnimationTime = dots.length * staggerDelay + animationDuration;
  const pauseTime          = 2;
  const fullCycleDuration  = totalAnimationTime + pauseTime;

  return (
    <div
      className="w-full relative overflow-hidden border border-white/[0.08]"
      style={{
        // Mask gradient fades at top & bottom
        maskImage:
          "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
        aspectRatio: "2 / 1",
      }}
    >
      {/* Classification corner marks */}
      <span className="absolute top-2 left-2   w-4 h-4 border-t border-l border-[#4a6cf7] z-10 pointer-events-none" />
      <span className="absolute top-2 right-2  w-4 h-4 border-t border-r border-[#4a6cf7] z-10 pointer-events-none" />
      <span className="absolute bottom-2 left-2  w-4 h-4 border-b border-l border-white/20 z-10 pointer-events-none" />
      <span className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-white/20 z-10 pointer-events-none" />

      {/* Single SVG — background map + connections, both sharing the same viewBox */}
      <svg
        ref={svgRef}
        viewBox={svgViewBox}
        className="w-full h-full absolute inset-0 pointer-events-auto select-none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="map-path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="white"     stopOpacity="0" />
            <stop offset="5%"   stopColor={lineColor}  stopOpacity="1" />
            <stop offset="95%"  stopColor={lineColor}  stopOpacity="1" />
            <stop offset="100%" stopColor="white"     stopOpacity="0" />
          </linearGradient>
          <filter id="map-glow">
            <feMorphology operator="dilate" radius="0.1" />
            <feGaussianBlur stdDeviation="0.3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background: world dot map embedded at full 800×400 coordinate space */}
        <image
          href={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          x="0"
          y="0"
          width="800"
          height="400"
          preserveAspectRatio="xMidYMid meet"
        />

        {/* Connection paths */}
        {dots.map((dot, i) => {
          const sp   = projectPoint(dot.start.lat, dot.start.lng);
          const ep   = projectPoint(dot.end.lat,   dot.end.lng);
          const path = createCurvedPath(sp, ep);
          const t0   = (i * staggerDelay)                    / fullCycleDuration;
          const t1   = (i * staggerDelay + animationDuration) / fullCycleDuration;
          const tR   = totalAnimationTime                    / fullCycleDuration;

          return (
            <g key={`path-${i}`}>
              <motion.path
                d={path}
                fill="none"
                stroke="url(#map-path-gradient)"
                strokeWidth="0.2"
                initial={{ pathLength: 0 }}
                animate={loop ? { pathLength: [0, 0, 1, 1, 0] } : { pathLength: 1 }}
                transition={
                  loop
                    ? { duration: fullCycleDuration, times: [0, t0, t1, tR, 1], ease: "easeInOut", repeat: Infinity }
                    : { duration: animationDuration, delay: i * staggerDelay, ease: "easeInOut" }
                }
              />
              {loop && (
                <motion.circle
                  r="0.4"
                  fill={lineColor}
                  filter="url(#map-glow)"
                  initial={{ offsetDistance: "0%", opacity: 0 }}
                  animate={{
                    offsetDistance: [null, "0%", "100%", "100%", "100%"],
                    opacity:        [0, 0, 1, 0, 0],
                  }}
                  transition={{
                    duration: fullCycleDuration,
                    times:    [0, t0, t1, tR, 1],
                    ease:     "easeInOut",
                    repeat:   Infinity,
                  }}
                  style={{ offsetPath: `path('${path}')` }}
                />
              )}
            </g>
          );
        })}

        {/* City dot markers */}
        {dots.map((dot, i) => {
          const sp = projectPoint(dot.start.lat, dot.start.lng);
          const ep = projectPoint(dot.end.lat,   dot.end.lng);

          return (
            <g key={`pts-${i}`}>
              {[
                { pt: sp, label: dot.start.label, delay: i * 0.5 + 0.3 },
                { pt: ep, label: dot.end.label,   delay: i * 0.5 + 0.5 },
              ].map(({ pt, label, delay }, j) => (
                <g key={j}>
                  <motion.g
                    onHoverStart={() => setHoveredLocation(label || "")}
                    onHoverEnd={() => setHoveredLocation(null)}
                    className="cursor-crosshair"
                    whileHover={{ scale: 1.5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <circle cx={pt.x} cy={pt.y} r="0.5" fill={lineColor} filter="url(#map-glow)" />
                    <circle cx={pt.x} cy={pt.y} r="0.5" fill={lineColor} opacity="0.4">
                      <animate attributeName="r"       from="0.5" to="2"   dur="2s" begin={`${j * 0.5}s`} repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.5" to="0"   dur="2s" begin={`${j * 0.5}s`} repeatCount="indefinite" />
                    </circle>
                  </motion.g>

                  {showLabels && label && (
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay, duration: 0.4 }}
                      className="pointer-events-none"
                    >
                      <text
                        x={pt.x}
                        y={pt.y - 1.2}
                        textAnchor="middle"
                        fontSize="1.4"
                        fontFamily="'IBM Plex Mono', monospace"
                        letterSpacing="0.08"
                        fill={lineColor}
                        opacity="0.85"
                      >
                        {label}
                      </text>
                    </motion.g>
                  )}
                </g>
              ))}
            </g>
          );
        })}
      </svg>

      {/* Status bar — HTML overlay, outside SVG */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-white/20">
          LIVE NETWORK VIEW
        </span>
        <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-white/20">
          {dots.length} ACTIVE CONNECTIONS
        </span>
      </div>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hoveredLocation && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute bottom-8 left-4 z-20 px-3 py-2 border border-white/[0.08] bg-white/[0.02]"
          >
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#4a6cf7]">
              {hoveredLocation}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
