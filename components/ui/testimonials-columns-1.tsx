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
                className="sys-card p-7 max-w-[300px] w-full flex flex-col items-center gap-5 text-center"
              >
                {/* Quote */}
                <p className="sys-body text-[13px] leading-[1.75]">
                  &ldquo;{text}&rdquo;
                </p>

                {/* Divider */}
                <div className="h-px w-full bg-white/[0.08]" />

                {/* Attribution — centered column */}
                <div className="flex flex-col items-center gap-2">
                  <img
                    width={32}
                    height={32}
                    src={image}
                    alt={name}
                    className="h-8 w-8 rounded-full object-cover grayscale opacity-60"
                  />
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-white">
                      {name}
                    </div>
                    <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-white/20">
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
