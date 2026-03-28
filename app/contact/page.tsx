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
    "w-full bg-transparent border border-white/[0.45] px-4 py-3 font-mono text-[13px] tracking-[0.06em] text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-colors";

  return (
    <main className="min-h-screen bg-[#04060c] text-white">
      <Navbar />

      <div className="pt-20 md:pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-2xl mx-auto">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#4a6cf7]/70 mb-4 block">
            Contact
          </span>
          <h1
            className="font-bold uppercase text-white mb-4"
            style={{ fontFamily: "'Neue Montreal', var(--font-display), sans-serif", fontSize: "clamp(28px, 5vw, 64px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: "1.05" }}
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
              <p className="font-mono text-[12px] text-white/80">
                Our team will review your request and get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-5">
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

          {/* WhatsApp alternative */}
          <div className="flex items-center gap-3 mt-8 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="font-mono text-[10px] tracking-[0.1em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>or</span>
            <a
              href="https://wa.me/96566457010?text=whats%20up%20cuzzeh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3"
              style={{
                background: "rgba(74,108,247,0.1)",
                border: "1px solid rgba(74,108,247,0.25)",
                borderRadius: "8px",
                color: "#4a6cf7",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#4a6cf7">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contact Us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
