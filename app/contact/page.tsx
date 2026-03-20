"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/ui/mini-navbar";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass =
    "w-full bg-transparent border border-white/[0.35] px-4 py-3 font-mono text-[13px] tracking-[0.06em] text-white placeholder:text-white/50 focus:outline-none focus:border-[#4a6cf7]/50 transition-colors";

  return (
    <main className="min-h-screen bg-[#04060c] text-white">
      <Navbar />

      <div className="pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-2xl mx-auto">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#4a6cf7]/70 mb-4 block">
            Contact
          </span>
          <h1
            className="font-display font-bold uppercase text-white mb-4"
            style={{ fontSize: "clamp(36px, 5vw, 64px)", letterSpacing: "0.03em", lineHeight: "0.95" }}
          >
            Request a<br />
            <span style={{ color: "#4a6cf7" }}>Briefing.</span>
          </h1>
          <p className="font-mono text-[13px] tracking-[0.04em] text-white leading-relaxed max-w-md mb-12">
            We&apos;ll be in touch if you&apos;re a fit.
          </p>

          {submitted ? (
            <div className="border border-[#4a6cf7]/20 bg-[#4a6cf7]/[0.04] p-10 text-center">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#4a6cf7]/70 block mb-3">
                Received
              </span>
              <p className="font-display font-bold uppercase text-white text-[24px] tracking-[0.03em] mb-2">
                We&apos;ll be in touch.
              </p>
              <p className="font-mono text-[12px] text-white/30">
                Our team will review your request and get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                  style={{ boxShadow: "0 0 16px rgba(255,255,255,0.06)" }}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                  style={{ boxShadow: "0 0 16px rgba(255,255,255,0.06)" }}
                />
              </div>
              <input
                type="text"
                name="company"
                placeholder="Company (Leave blank if no company mention)"
                value={form.company}
                onChange={handleChange}
                className={inputClass}
                style={{ boxShadow: "0 0 16px rgba(255,255,255,0.06)" }}
              />
              <textarea
                name="message"
                placeholder="Tell us about your goals"
                rows={5}
                value={form.message}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
                style={{ boxShadow: "0 0 16px rgba(255,255,255,0.06)" }}
              />
              <button
                type="submit"
                className="group self-start relative inline-flex items-center h-12 font-mono text-[12px] tracking-[0.22em] uppercase font-bold overflow-hidden"
                style={{ borderRadius: "12px", transform: "translateZ(0)" }}
              >
                {/* Static blue background */}
                <span className="absolute inset-0 bg-[#4a6cf7]" />
                {/* White overlay slides in on hover */}
                <span className="absolute inset-0 flex items-center justify-center duration-700 ease-[cubic-bezier(0.50,0.20,0,1)] -translate-x-full group-hover:translate-x-0 z-10 bg-white">
                  <img src="/D*M website.png" alt="DWM" className="h-6 w-auto" />
                </span>
                {/* Text — fades out on hover, stays centered */}
                <span className="absolute inset-0 flex items-center justify-center text-white transition-opacity duration-300 group-hover:opacity-0 z-20">
                  Submit
                </span>
                {/* Invisible sizer */}
                <span className="invisible px-10">Submit</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
