import { Navbar } from "@/components/ui/mini-navbar";

export default function TermsPageAr() {
  return (
    <main className="min-h-screen bg-[#04060c] text-white" dir="rtl" lang="ar" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
      <Navbar />

      <div className="pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-2xl mx-auto">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#4a6cf7]/70 mb-4 block">
            القانونية
          </span>
          <h1
            className="font-bold uppercase text-white mb-10"
            style={{ fontFamily: "'Neue Montreal', var(--font-display), sans-serif", fontSize: "clamp(30px, 5.5vw, 64px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: "1.05" }}
          >
            الشروط<br />
            <span style={{ color: "#4a6cf7" }}>والأحكام</span>
          </h1>

          <div className="flex flex-col gap-10">
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">٠١</span> الموافقة على الشروط
              </h2>
              <p className="text-[15px] text-white/70 leading-relaxed">بالوصول إلى موقع diwaniyamedia.com أو استخدامه (&ldquo;الموقع&rdquo;)، الذي تديره ديوانية ميديا ذ.م.م (&ldquo;DWM&rdquo;، &ldquo;نحن&rdquo;)، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا لم توافق على أي جزء من هذه الشروط، يجب عليك عدم استخدام الموقع.</p>
            </div>

            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">٠٢</span> وصف الخدمات
              </h2>
              <p className="text-[15px] text-white/70 leading-relaxed">DWM هي شركة استخبارات إعلامية وإعلانات دقيقة تخدم منطقة مجلس التعاون الخليجي. يقدم الموقع معلومات عامة عن خدماتنا وقدراتنا وتفاصيل الاتصال. لا يشكل الموقع عرضاً لتقديم الخدمات، وأي تعاقد يخضع لاتفاقية مكتوبة منفصلة.</p>
            </div>

            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">٠٣</span> الملكية الفكرية
              </h2>
              <div className="flex flex-col gap-3 text-[15px] text-white/70 leading-relaxed">
                <p>جميع المحتويات على الموقع — بما في ذلك النصوص والرسومات والشعارات والصور وعناصر التصميم والبرمجيات — هي ملك لديوانية ميديا ذ.م.م أو مرخصيها ومحمية بموجب قوانين الملكية الفكرية المعمول بها.</p>
                <p>اسم DWM والشعار وجميع العلامات ذات الصلة هي علامات تجارية لديوانية ميديا ذ.م.م. الاستخدام غير المصرح به محظور.</p>
              </div>
            </div>

            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">٠٤</span> استخدام الموقع
              </h2>
              <div className="flex flex-col gap-3 text-[15px] text-white/70 leading-relaxed">
                <p>أنت توافق على استخدام الموقع فقط لأغراض مشروعة. تشمل السلوكيات المحظورة:</p>
                <ul className="list-disc pr-5 flex flex-col gap-2">
                  <li>محاولة الوصول غير المصرح به إلى أي جزء من الموقع</li>
                  <li>استخدام أدوات آلية لاستخراج البيانات من الموقع</li>
                  <li>نقل أي مواد تشهيرية أو مسيئة</li>
                  <li>استخدام الموقع بأي طريقة قد تضر بوظائفه</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">٠٥</span> السرية
              </h2>
              <p className="text-[15px] text-white/70 leading-relaxed">أي معلومات تشاركها DWM عبر الموقع أو في الاجتماعات أو عبر المراسلات — بما في ذلك المنهجيات وقدرات البيانات ورؤى الجمهور واستراتيجيات الحملات — هي ملكية خاصة وسرية.</p>
            </div>

            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">٠٦</span> روابط الطرف الثالث
              </h2>
              <p className="text-[15px] text-white/70 leading-relaxed">قد يحتوي الموقع على روابط لمواقع أو خدمات تابعة لأطراف ثالثة. يتم توفير هذه الروابط للراحة فقط. لا تتحمل DWM المسؤولية عن محتوى أو ممارسات الخصوصية لأي مواقع تابعة لأطراف ثالثة.</p>
            </div>

            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">٠٧</span> إخلاء المسؤولية
              </h2>
              <p className="text-[15px] text-white/70 leading-relaxed">يتم تقديم الموقع ومحتواه على أساس &ldquo;كما هو&rdquo; و&ldquo;حسب التوفر&rdquo; دون ضمانات من أي نوع. لا تضمن DWM أن الموقع سيكون متاحاً دون انقطاع أو خالياً من الأخطاء.</p>
            </div>

            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">٠٨</span> تحديد المسؤولية
              </h2>
              <p className="text-[15px] text-white/70 leading-relaxed">إلى أقصى حد يسمح به القانون، لن تكون DWM ومؤسسوها وموظفوها ووكلاؤها مسؤولين عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية ناشئة عن استخدامك للموقع.</p>
            </div>

            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">٠٩</span> التعديلات
              </h2>
              <p className="text-[15px] text-white/70 leading-relaxed">تحتفظ DWM بالحق في تعديل هذه الشروط في أي وقت. ستكون التغييرات سارية عند نشرها على الموقع. استمرارك في استخدام الموقع بعد أي تغييرات يشكل قبولاً للشروط المحدثة.</p>
            </div>

            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">١٠</span> القانون الحاكم
              </h2>
              <p className="text-[15px] text-white/70 leading-relaxed">تخضع هذه الشروط لقوانين دولة الكويت وتُفسر وفقاً لها. أي نزاعات ناشئة بموجب هذه الشروط تخضع للاختصاص الحصري لمحاكم الكويت.</p>
            </div>

            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">١١</span> التواصل
              </h2>
              <p className="text-[15px] text-white/70 leading-relaxed">إذا كان لديك أي أسئلة حول هذه الشروط، يرجى الاتصال بنا على <a href="mailto:eisa@diwaniyamedia.com" className="text-[#4a6cf7] hover:text-white transition-colors">eisa@diwaniyamedia.com</a>.</p>
            </div>

            <p className="text-white/30 text-[11px] font-mono tracking-[0.1em] pt-6 border-t border-white/[0.06]">
              آخر تحديث: مارس ٢٠٢٦
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
