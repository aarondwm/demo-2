import { Navbar } from "@/components/ui/mini-navbar";

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-[#04060c] text-white">
      <Navbar />

      <div className="pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-2xl mx-auto">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#4a6cf7]/70 mb-4 block">
            Legal
          </span>
          <h1
            className="font-display font-bold uppercase text-white mb-10"
            style={{ fontSize: "clamp(28px, 5vw, 64px)", letterSpacing: "0.03em", lineHeight: "0.95" }}
          >
            Terms &amp;<br />
            <span style={{ color: "#4a6cf7" }}>Conditions.</span>
          </h1>

          <div className="flex flex-col gap-8 font-mono text-[13px] tracking-[0.04em] text-white/70 leading-relaxed">
            <p>
              These terms and conditions will be updated with the full terms. Please check back soon.
            </p>
            <p className="text-white/40 text-[11px]">
              Last updated: March 2026
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
