import { Navbar } from "@/components/ui/mini-navbar";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#04060c] text-white">
      <Navbar />

      <div className="pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-2xl mx-auto">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#4a6cf7]/70 mb-4 block">
            Legal
          </span>
          <h1
            className="font-bold uppercase text-white mb-10"
            style={{ fontFamily: "'Neue Montreal', var(--font-display), sans-serif", fontSize: "clamp(30px, 5.5vw, 64px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: "1.05" }}
          >
            Privacy<br />
            <span style={{ color: "#4a6cf7" }}>Policy.</span>
          </h1>

          <div className="flex flex-col gap-10">
            {/* 01 */}
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">01</span> Who We Are
              </h2>
              <div className="flex flex-col gap-3 font-mono text-[13px] tracking-[0.04em] text-white/70 leading-relaxed">
                <p>Diwaniya Media W.L.L. (&ldquo;DWM&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is a media intelligence and precision advertising company registered in Kuwait, operating across the Gulf Cooperation Council (GCC) region. Our website is diwaniyamedia.com.</p>
                <p>For privacy-related enquiries, you can reach us at <a href="mailto:info@diwaniyamedia.com" className="text-[#4a6cf7] hover:text-white transition-colors">info@diwaniyamedia.com</a>.</p>
              </div>
            </div>

            {/* 02 */}
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">02</span> Information We Collect
              </h2>
              <div className="flex flex-col gap-4 font-mono text-[13px] tracking-[0.04em] text-white/70 leading-relaxed">
                <h3 className="text-white/90 font-bold text-[12px] tracking-[0.1em] uppercase">Information you provide</h3>
                <p>When you submit an enquiry through our contact form or communicate with us via email, we may collect your name, email address, phone number, company name, job title, and the content of your message.</p>
                <h3 className="text-white/90 font-bold text-[12px] tracking-[0.1em] uppercase mt-2">Information collected automatically</h3>
                <p>When you visit the Site, we may automatically collect certain technical information, including your IP address, browser type and version, device type, operating system, referring URL, pages visited, and the date and time of your visit.</p>
                <h3 className="text-white/90 font-bold text-[12px] tracking-[0.1em] uppercase mt-2">Cookies and similar technologies</h3>
                <p>The Site may use cookies and similar tracking technologies to improve your browsing experience and to analyse Site usage. You can control cookies through your browser settings. Disabling cookies may affect certain functionality of the Site.</p>
              </div>
            </div>

            {/* 03 */}
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">03</span> How We Use Your Information
              </h2>
              <div className="flex flex-col gap-3 font-mono text-[13px] tracking-[0.04em] text-white/70 leading-relaxed">
                <p>We use the information we collect for the following purposes:</p>
                <ul className="list-disc pl-5 flex flex-col gap-2">
                  <li>To respond to your enquiries and communicate with you about our services</li>
                  <li>To operate, maintain, and improve the Site</li>
                  <li>To analyse Site usage and understand how visitors interact with our content</li>
                  <li>To comply with legal obligations and protect our rights</li>
                  <li>To evaluate potential business relationships</li>
                </ul>
                <p>We do not use your information for automated decision-making or profiling in relation to your interaction with our website.</p>
              </div>
            </div>

            {/* 04 */}
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">04</span> Legal Basis for Processing
              </h2>
              <div className="flex flex-col gap-3 font-mono text-[13px] tracking-[0.04em] text-white/70 leading-relaxed">
                <p>We process your personal information on the following bases:</p>
                <ul className="list-disc pl-5 flex flex-col gap-2">
                  <li>Your consent, where you have voluntarily submitted information through our contact form</li>
                  <li>Our legitimate business interests, including responding to enquiries, improving our services, and ensuring the security of our Site</li>
                  <li>Compliance with legal obligations</li>
                </ul>
              </div>
            </div>

            {/* 05 */}
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">05</span> Sharing Your Information
              </h2>
              <div className="flex flex-col gap-3 font-mono text-[13px] tracking-[0.04em] text-white/70 leading-relaxed">
                <p>We do not sell, rent, or trade your personal information to third parties. We may share your information in the following limited circumstances:</p>
                <ul className="list-disc pl-5 flex flex-col gap-2">
                  <li>With trusted service providers who assist us in operating the Site and processing communications, subject to appropriate confidentiality obligations</li>
                  <li>Where required by law, regulation, or legal process</li>
                  <li>To protect DWM&apos;s rights, property, or safety, or that of our clients or the public</li>
                </ul>
              </div>
            </div>

            {/* 06 */}
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">06</span> Data Retention
              </h2>
              <p className="font-mono text-[13px] tracking-[0.04em] text-white/70 leading-relaxed">We retain personal information only for as long as necessary to fulfil the purposes for which it was collected, including to satisfy any legal, accounting, or reporting requirements. Contact form submissions are retained for the duration of any ongoing business relationship or discussion, and for a reasonable period thereafter.</p>
            </div>

            {/* 07 */}
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">07</span> Data Security
              </h2>
              <p className="font-mono text-[13px] tracking-[0.04em] text-white/70 leading-relaxed">We take reasonable technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the internet or method of electronic storage is completely secure, and we cannot guarantee absolute security.</p>
            </div>

            {/* 08 */}
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">08</span> Your Rights
              </h2>
              <div className="flex flex-col gap-3 font-mono text-[13px] tracking-[0.04em] text-white/70 leading-relaxed">
                <p>Depending on your jurisdiction, you may have the right to:</p>
                <ul className="list-disc pl-5 flex flex-col gap-2">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Object to or restrict certain processing</li>
                  <li>Withdraw consent where processing is based on consent</li>
                </ul>
                <p>To exercise any of these rights, please contact us at <a href="mailto:info@diwaniyamedia.com" className="text-[#4a6cf7] hover:text-white transition-colors">info@diwaniyamedia.com</a>.</p>
              </div>
            </div>

            {/* 09 */}
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">09</span> Changes to This Policy
              </h2>
              <p className="font-mono text-[13px] tracking-[0.04em] text-white/70 leading-relaxed">We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. We encourage you to review this page periodically.</p>
            </div>

            {/* 10 */}
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">10</span> Contact
              </h2>
              <p className="font-mono text-[13px] tracking-[0.04em] text-white/70 leading-relaxed">If you have any questions about this Privacy Policy, please contact us at <a href="mailto:info@diwaniyamedia.com" className="text-[#4a6cf7] hover:text-white transition-colors">info@diwaniyamedia.com</a>.</p>
            </div>

            <p className="text-white/30 text-[11px] font-mono tracking-[0.1em] pt-6 border-t border-white/[0.06]">
              Last updated: March 2026
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
