import { Navbar } from "@/components/ui/mini-navbar";

export default function PrivacyPolicyPageAr() {
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
            سياسة<br />
            <span style={{ color: "#4a6cf7" }}>الخصوصية</span>
          </h1>

          <div className="flex flex-col gap-10">
            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">٠١</span> من نحن
              </h2>
              <div className="flex flex-col gap-3 text-[15px] text-white/70 leading-relaxed">
                <p>ديوانية ميديا ذ.م.م (&ldquo;DWM&rdquo;، &ldquo;نحن&rdquo;، &ldquo;لنا&rdquo;) هي شركة استخبارات إعلامية وإعلانات دقيقة مسجلة في الكويت، تعمل في منطقة مجلس التعاون الخليجي. موقعنا الإلكتروني هو diwaniyamedia.com.</p>
                <p>للاستفسارات المتعلقة بالخصوصية، يمكنكم التواصل معنا على <a href="mailto:eisa@diwaniyamedia.com" className="text-[#4a6cf7] hover:text-white transition-colors">eisa@diwaniyamedia.com</a>.</p>
              </div>
            </div>

            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">٠٢</span> المعلومات التي نجمعها
              </h2>
              <div className="flex flex-col gap-4 text-[15px] text-white/70 leading-relaxed">
                <h3 className="text-white/90 font-bold text-[14px]">المعلومات التي تقدمها</h3>
                <p>عند تقديم استفسار عبر نموذج الاتصال أو التواصل معنا عبر البريد الإلكتروني، قد نجمع اسمك وعنوان بريدك الإلكتروني ورقم هاتفك واسم شركتك ومسماك الوظيفي ومحتوى رسالتك.</p>
                <h3 className="text-white/90 font-bold text-[14px] mt-2">المعلومات المجمعة تلقائياً</h3>
                <p>عند زيارتك للموقع، قد نجمع تلقائياً معلومات تقنية معينة، بما في ذلك عنوان IP الخاص بك ونوع المتصفح ونوع الجهاز ونظام التشغيل والصفحات التي تمت زيارتها.</p>
                <h3 className="text-white/90 font-bold text-[14px] mt-2">ملفات تعريف الارتباط</h3>
                <p>قد يستخدم الموقع ملفات تعريف الارتباط وتقنيات التتبع المماثلة لتحسين تجربة التصفح وتحليل استخدام الموقع. يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح.</p>
              </div>
            </div>

            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">٠٣</span> كيف نستخدم معلوماتك
              </h2>
              <div className="flex flex-col gap-3 text-[15px] text-white/70 leading-relaxed">
                <p>نستخدم المعلومات التي نجمعها للأغراض التالية:</p>
                <ul className="list-disc pr-5 flex flex-col gap-2">
                  <li>للرد على استفساراتك والتواصل معك بشأن خدماتنا</li>
                  <li>لتشغيل الموقع وصيانته وتحسينه</li>
                  <li>لتحليل استخدام الموقع وفهم كيفية تفاعل الزوار مع محتوانا</li>
                  <li>للامتثال للالتزامات القانونية وحماية حقوقنا</li>
                  <li>لتقييم علاقات الأعمال المحتملة</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">٠٤</span> الأساس القانوني للمعالجة
              </h2>
              <div className="flex flex-col gap-3 text-[15px] text-white/70 leading-relaxed">
                <p>نعالج معلوماتك الشخصية على الأسس التالية:</p>
                <ul className="list-disc pr-5 flex flex-col gap-2">
                  <li>موافقتك، حيث قدمت معلومات طوعاً عبر نموذج الاتصال</li>
                  <li>مصالحنا التجارية المشروعة</li>
                  <li>الامتثال للالتزامات القانونية</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">٠٥</span> مشاركة معلوماتك
              </h2>
              <div className="flex flex-col gap-3 text-[15px] text-white/70 leading-relaxed">
                <p>نحن لا نبيع أو نؤجر أو نتاجر بمعلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك في الظروف المحدودة التالية:</p>
                <ul className="list-disc pr-5 flex flex-col gap-2">
                  <li>مع مقدمي خدمات موثوقين يساعدوننا في تشغيل الموقع</li>
                  <li>حيثما يقتضي القانون أو اللوائح أو الإجراءات القانونية</li>
                  <li>لحماية حقوق DWM أو ممتلكاتها أو سلامتها</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">٠٦</span> الاحتفاظ بالبيانات
              </h2>
              <p className="text-[15px] text-white/70 leading-relaxed">نحتفظ بالمعلومات الشخصية فقط طالما كان ذلك ضرورياً لتحقيق الأغراض التي جُمعت من أجلها، بما في ذلك تلبية أي متطلبات قانونية أو محاسبية أو متطلبات إعداد التقارير.</p>
            </div>

            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">٠٧</span> أمن البيانات
              </h2>
              <p className="text-[15px] text-white/70 leading-relaxed">نتخذ تدابير تقنية وتنظيمية معقولة لحماية معلوماتك الشخصية ضد الوصول غير المصرح به أو التعديل أو الإفصاح أو التدمير.</p>
            </div>

            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">٠٨</span> حقوقك
              </h2>
              <div className="flex flex-col gap-3 text-[15px] text-white/70 leading-relaxed">
                <p>حسب ولايتك القضائية، قد يكون لديك الحق في:</p>
                <ul className="list-disc pr-5 flex flex-col gap-2">
                  <li>الوصول إلى المعلومات الشخصية التي نحتفظ بها عنك</li>
                  <li>طلب تصحيح المعلومات غير الدقيقة</li>
                  <li>طلب حذف معلوماتك الشخصية</li>
                  <li>الاعتراض على معالجة معينة أو تقييدها</li>
                  <li>سحب الموافقة حيث تستند المعالجة إلى الموافقة</li>
                </ul>
                <p>لممارسة أي من هذه الحقوق، يرجى الاتصال بنا على <a href="mailto:eisa@diwaniyamedia.com" className="text-[#4a6cf7] hover:text-white transition-colors">eisa@diwaniyamedia.com</a>.</p>
              </div>
            </div>

            <div>
              <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#4a6cf7] mb-4 flex items-center gap-3">
                <span className="text-[#4a6cf7]/40">٠٩</span> التواصل
              </h2>
              <p className="text-[15px] text-white/70 leading-relaxed">إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا على <a href="mailto:eisa@diwaniyamedia.com" className="text-[#4a6cf7] hover:text-white transition-colors">eisa@diwaniyamedia.com</a>.</p>
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
