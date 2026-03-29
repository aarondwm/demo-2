"use client";
import React from "react";
import { motion } from "motion/react";

export type Testimonial = {
  text:  string;
  image: string;
  name:  string;
  role:  string;
};

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className} style={{ overflow: "hidden" }}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration:   props.duration || 12,
          repeat:     Infinity,
          ease:       "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-4 pb-4"
      >
        {[...new Array(2).fill(0).map((_, outerIdx) => (
          <React.Fragment key={outerIdx}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div
                key={i}
                className="p-5 sm:p-7 max-w-[280px] sm:max-w-[300px] w-full flex flex-col items-center gap-4 sm:gap-5 text-center"
                style={{ background: "rgba(74,108,247,0.06)", border: "1px solid rgba(74,108,247,0.18)", boxShadow: "0 0 24px rgba(74,108,247,0.06) inset" }}
              >
                {/* Quote */}
                <p className="sys-body text-[13px] leading-[1.75] text-white/80">
                  &ldquo;{text}&rdquo;
                </p>

                {/* Divider */}
                <div className="h-px w-full bg-white/[0.08]" />

                {/* Attribution — centered column */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-white">
                      {name}
                    </div>
                    <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-white/60">
                      {role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))]}
      </motion.div>
    </div>
  );
};
