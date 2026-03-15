import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Layout, Pointer, Zap } from "lucide-react";

interface Step  { number: string; title: string; body: string }
interface Item  { title: string; body: string }
interface Line  { number: string; label: string }

interface TabContent {
  badge:       string;
  title:       string;
  description: string;
  buttonText:  string;
  imageSrc:    string;
  imageAlt:    string;
  steps?:      Step[];
  items?:      Item[];
  lines?:      Line[];
}

interface Tab {
  value:   string;
  icon:    React.ReactNode;
  label:   string;
  content: TabContent;
}

interface Feature108Props {
  badge?:       string;
  heading?:     string;
  description?: string;
  tabs?:        Tab[];
}

const Feature108 = ({
  badge = "OUR PLATFORM",
  heading = "Built for the Gulf's Corporate Decision-Makers",
  description = "From content creation to precision distribution and performance intelligence — everything under one roof.",
  tabs = [
    {
      value: "tab-1",
      icon:  <Zap className="h-3.5 w-3.5 shrink-0" />,
      label: "Methodology",
      content: {
        badge:       "STRATEGIC FRAMEWORK",
        title:       "Layered Targeting. Compounding Reach.",
        description: "Our proprietary distribution system ensures your content reaches both internal stakeholders and the broader industry audience, creating organic awareness that rises to the C-suite.",
        buttonText:  "Request a Briefing",
        imageSrc:    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=85",
        imageAlt:    "Campaign methodology",
        steps: [
          { number: "01", title: "Content Creation",       body: "Editorial-grade PR stories, industry analysis, and news features tailored to your brand narrative." },
          { number: "02", title: "Internal Saturation",    body: "Content distributed to employees within target companies, creating organic internal discussion." },
          { number: "03", title: "Market-Wide Reach",      body: "Broader campaigns targeting senior professionals, analysts, and adjacent stakeholders." },
          { number: "04", title: "Intelligence & Reporting", body: "Granular audience data: industry breakdowns, seniority, company-level engagement. The insight is the product." },
        ],
      },
    },
    {
      value: "tab-2",
      icon:  <Pointer className="h-3.5 w-3.5 shrink-0" />,
      label: "Services",
      content: {
        badge:       "FULL-STACK OPERATION",
        title:       "The Full-Stack Media Operation",
        description: "From content creation to precision distribution and performance intelligence — everything under one roof.",
        buttonText:  "Request a Briefing",
        imageSrc:    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=85",
        imageAlt:    "Media services",
        items: [
          { title: "Targeted Distribution",     body: "Precision targeting by industry, seniority, and company across Kuwait and GCC. Delivered at scale." },
          { title: "Content & PR",              body: "Editorial-quality stories and industry features produced in-house for your target audience." },
          { title: "Media Distribution",        body: "Placement across a curated network of regional news publications." },
          { title: "Audience Intelligence",     body: "Granular data on who read your content, their role, company, and seniority." },
          { title: "Decision Maker Marketing",  body: "Reach the executives who influence purchasing decisions at a fraction of the cost." },
          { title: "Campaign Analytics",        body: "Performance reports with views, engagement, and audience composition. Exportable. Actionable." },
        ],
      },
    },
    {
      value: "tab-3",
      icon:  <Layout className="h-3.5 w-3.5 shrink-0" />,
      label: "Capabilities",
      content: {
        badge:       "TECHNICAL EXCELLENCE",
        title:       "What We Do",
        description: "Details are shared during onboarding. Request a briefing to learn more.",
        buttonText:  "Request Access",
        imageSrc:    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=85",
        imageAlt:    "Platform capabilities",
        lines: [
          { number: "01", label: "Regional Distribution"  },
          { number: "02", label: "Audience Intelligence"  },
          { number: "03", label: "Precision Targeting"    },
        ],
      },
    },
  ],
}: Feature108Props) => {
  return (
    <section id="methodology" className="sys-section">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* Section header */}
        <div className="max-w-2xl">
          <div className="rule-accent mb-5">
            <span className="sys-label">{badge}</span>
          </div>
          <h2 className="sys-title text-[clamp(36px,5vw,56px)] mb-5">{heading}</h2>
          <p className="sys-body max-w-lg">{description}</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={tabs[0].value} className="mt-14">
          <TabsList className="flex gap-0 border border-[#1c1f30] w-fit mb-0 overflow-x-auto">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2.5 px-6 py-3.5
                  font-mono text-[11px] tracking-[0.18em] uppercase text-[#636b84]
                  border-r border-[#1c1f30] last:border-r-0
                  transition-all duration-200
                  data-[state=active]:bg-[#0a0c16] data-[state=active]:text-[#4a6cf7]
                  data-[state=active]:border-b data-[state=active]:border-b-[#4a6cf7]
                  hover:text-[#e8eaf2] whitespace-nowrap"
              >
                {tab.icon}{tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="border border-[#1c1f30] border-t-0 bg-[#070910]">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="grid gap-0 lg:grid-cols-2 data-[state=inactive]:hidden"
              >
                {/* ── Left: text panel */}
                <div className="p-10 lg:p-14 flex flex-col gap-6 border-r border-[#1c1f30]">
                  <span className="sys-label">{tab.content.badge}</span>
                  <h3 className="sys-title text-[clamp(26px,3vw,38px)]">
                    {tab.content.title}
                  </h3>
                  <p className="sys-body">{tab.content.description}</p>

                  {/* Steps (Methodology) */}
                  {tab.content.steps && (
                    <ol className="flex flex-col gap-5 mt-1">
                      {tab.content.steps.map((s) => (
                        <li key={s.number} className="flex gap-4">
                          <span className="sys-label text-[#4a6cf7] flex-shrink-0 w-5 pt-px">
                            {s.number}
                          </span>
                          <div>
                            <div className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#e8eaf2] mb-1">
                              {s.title}
                            </div>
                            <p className="sys-body text-[13px]">{s.body}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}

                  {/* Service items grid (Services) */}
                  {tab.content.items && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                      {tab.content.items.map((item) => (
                        <div key={item.title} className="border-l border-[#1c1f30] pl-4">
                          <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#4a6cf7] mb-1.5">
                            {item.title}
                          </div>
                          <p className="sys-body text-[12px] leading-[1.65]">{item.body}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Capability lines (Capabilities) */}
                  {tab.content.lines && (
                    <ul className="flex flex-col gap-3 mt-1">
                      {tab.content.lines.map((line) => (
                        <li key={line.number} className="flex items-center gap-4 border-b border-[#141726] pb-3 last:border-0">
                          <span className="sys-label text-[#363c52] w-5 flex-shrink-0">
                            {line.number}
                          </span>
                          <span className="font-mono text-[12px] tracking-[0.15em] uppercase text-[#636b84]">
                            {line.label}
                          </span>
                          <span className="ml-auto sys-label text-[#363c52]">RESTRICTED</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-2">
                    <a href="#get-started" className="sys-btn-primary">
                      {tab.content.buttonText}
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="square" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* ── Right: image panel */}
                <div className="relative overflow-hidden h-64 lg:h-auto">
                  <img
                    src={tab.content.imageSrc}
                    alt={tab.content.imageAlt}
                    className="w-full h-full object-cover opacity-50 grayscale"
                  />
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 4px)",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#070910] via-transparent to-transparent" />
                  <div className="absolute bottom-4 right-4">
                    <span className="sys-label text-[8px] text-[#363c52]">
                      REF: DWM-{tab.value.replace("tab-", "").padStart(3, "0")}
                    </span>
                  </div>
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export { Feature108 };
