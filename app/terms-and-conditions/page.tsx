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
            className="font-bold uppercase text-white mb-10"
            style={{ fontFamily: "'Neue Montreal', var(--font-display), sans-serif", fontSize: "clamp(30px, 5.5vw, 64px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: "1.05" }}
          >
            Terms &amp;<br />
            <span style={{ color: "#4a6cf7" }}>Conditions.</span>
          </h1>

          <div className="flex flex-col gap-10">
            {/* 01 */}
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">01</span> Agreement to Terms
              </h2>
              <p className="font-mono text-[13px] tracking-[0.04em] text-white/70 leading-relaxed">By accessing or using the website at diwaniyamedia.com (the &ldquo;Site&rdquo;), operated by Diwaniya Media W.L.L. (&ldquo;DWM&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), you agree to be bound by these Terms &amp; Conditions. If you do not agree with any part of these terms, you should not use the Site.</p>
            </div>

            {/* 02 */}
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">02</span> Description of Services
              </h2>
              <p className="font-mono text-[13px] tracking-[0.04em] text-white/70 leading-relaxed">DWM is a B2B media intelligence and precision advertising company serving the Gulf Cooperation Council (GCC) region. The Site provides general information about our services, capabilities, and contact details. The Site does not constitute an offer to provide services, and any engagement is subject to a separate written agreement.</p>
            </div>

            {/* 03 */}
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">03</span> Intellectual Property
              </h2>
              <div className="flex flex-col gap-3 font-mono text-[13px] tracking-[0.04em] text-white/70 leading-relaxed">
                <p>All content on the Site — including but not limited to text, graphics, logos, images, design elements, and software — is the property of Diwaniya Media W.L.L. or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content on the Site without our prior written consent.</p>
                <p>The DWM name, logo, and all related marks are trademarks of Diwaniya Media W.L.L. Unauthorised use is prohibited.</p>
              </div>
            </div>

            {/* 04 */}
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">04</span> Use of the Site
              </h2>
              <div className="flex flex-col gap-3 font-mono text-[13px] tracking-[0.04em] text-white/70 leading-relaxed">
                <p>You agree to use the Site only for lawful purposes and in a manner that does not infringe the rights of, or restrict or inhibit the use of the Site by, any third party. Prohibited conduct includes but is not limited to:</p>
                <ul className="list-disc pl-5 flex flex-col gap-2">
                  <li>Attempting to gain unauthorised access to any part of the Site, its servers, or any connected systems</li>
                  <li>Using automated tools, scrapers, or bots to extract data from the Site</li>
                  <li>Transmitting any material that is defamatory, offensive, or otherwise objectionable</li>
                  <li>Using the Site in any way that could damage, disable, or impair its functionality</li>
                </ul>
              </div>
            </div>

            {/* 05 */}
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">05</span> Confidentiality
              </h2>
              <p className="font-mono text-[13px] tracking-[0.04em] text-white/70 leading-relaxed">Any information shared by DWM through the Site, in meetings, or via correspondence — including methodologies, data capabilities, audience insights, and campaign strategies — is proprietary and confidential. You agree not to disclose, reproduce, or use such information for any purpose other than evaluating a potential engagement with DWM, unless expressly authorised in writing.</p>
            </div>

            {/* 06 */}
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">06</span> Third-Party Links
              </h2>
              <p className="font-mono text-[13px] tracking-[0.04em] text-white/70 leading-relaxed">The Site may contain links to third-party websites or services. These links are provided for convenience only. DWM does not endorse, control, or assume responsibility for the content, privacy practices, or availability of any third-party sites. Accessing third-party links is at your own risk.</p>
            </div>

            {/* 07 */}
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">07</span> Disclaimer of Warranties
              </h2>
              <p className="font-mono text-[13px] tracking-[0.04em] text-white/70 leading-relaxed">The Site and its content are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. DWM does not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components.</p>
            </div>

            {/* 08 */}
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">08</span> Limitation of Liability
              </h2>
              <p className="font-mono text-[13px] tracking-[0.04em] text-white/70 leading-relaxed">To the fullest extent permitted by law, DWM, its founders, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenue, data, or business opportunities, arising from or related to your use of the Site, regardless of the theory of liability.</p>
            </div>

            {/* 09 */}
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">09</span> Indemnification
              </h2>
              <p className="font-mono text-[13px] tracking-[0.04em] text-white/70 leading-relaxed">You agree to indemnify and hold harmless Diwaniya Media W.L.L., its founders, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including legal fees) arising from your use of the Site or violation of these Terms.</p>
            </div>

            {/* 10 */}
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">10</span> Modifications
              </h2>
              <p className="font-mono text-[13px] tracking-[0.04em] text-white/70 leading-relaxed">DWM reserves the right to modify these Terms at any time. Changes will be effective upon posting to the Site. Your continued use of the Site following any changes constitutes acceptance of the updated Terms. We encourage you to review this page periodically.</p>
            </div>

            {/* 11 */}
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">11</span> Governing Law
              </h2>
              <p className="font-mono text-[13px] tracking-[0.04em] text-white/70 leading-relaxed">These Terms shall be governed by and construed in accordance with the laws of the State of Kuwait. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Kuwait.</p>
            </div>

            {/* 12 */}
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">12</span> Contact
              </h2>
              <p className="font-mono text-[13px] tracking-[0.04em] text-white/70 leading-relaxed">If you have any questions about these Terms, please contact us at <a href="mailto:eisa@diwaniyamedia.com" className="text-[#4a6cf7] hover:text-white transition-colors">eisa@diwaniyamedia.com</a>.</p>
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
