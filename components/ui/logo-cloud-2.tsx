import { cn } from "@/lib/utils";

type Logo = {
  name: string;       // always shown as accessible label
  src?: string;       // SVG image — optional
  text?: string;      // display text when no image available
};

const logos: Logo[] = [
  { name: "Meta",       src: "https://svgl.app/library/meta-wordmark.svg",              text: "META"       },
  { name: "Google",     src: "https://svgl.app/library/google_wordmark.svg",            text: "GOOGLE"     },
  { name: "OpenAI",     src: "https://svgl.app/library/openai_wordmark_light.svg",      text: "OPENAI"     },
  { name: "Anthropic",  src: "https://svgl.app/library/anthropic.svg",                  text: "ANTHROPIC"  },
  { name: "xAI",        text: "xAI" },
  { name: "Microsoft",  src: "https://svgl.app/library/microsoft.svg",                  text: "MICROSOFT"  },
  { name: "LinkedIn",   src: "https://svgl.app/library/linkedin.svg",                   text: "LINKEDIN"   },
  { name: "NVIDIA",     src: "https://svgl.app/library/nvidia-wordmark-light.svg",      text: "NVIDIA"     },
  { name: "Palantir",   text: "PALANTIR" },
  { name: "AWS",        src: "https://svgl.app/library/aws.svg",                        text: "AWS"        },
  { name: "Salesforce", src: "https://svgl.app/library/salesforce.svg",                 text: "SALESFORCE" },
  { name: "Gemini",     src: "https://svgl.app/library/gemini.svg",                     text: "GEMINI"     },
];

type LogoCloudProps = React.ComponentProps<"div">;

export function LogoCloud({ className, ...props }: LogoCloudProps) {
  return (
    <div
      className={cn("grid grid-cols-2 md:grid-cols-4 border border-[#1c1f30]", className)}
      {...props}
    >
      {logos.map((logo, i) => (
        <LogoCell key={logo.name} logo={logo} index={i} total={logos.length} />
      ))}
    </div>
  );
}

function LogoCell({
  logo,
  index,
  total,
}: {
  logo: Logo;
  index: number;
  total: number;
}) {
  const col       = index % 4;
  const row       = Math.floor(index / 4);
  const totalRows = Math.ceil(total / 4);
  const isLastCol = col === 3;
  const isLastRow = row === totalRows - 1;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center px-6 py-8 md:py-10",
        "transition-colors duration-200 hover:bg-[#0a0c16] group",
        !isLastCol && "border-r border-[#1c1f30]",
        !isLastRow && "border-b border-[#1c1f30]",
      )}
    >
      {logo.src ? (
        /* Try image first — onError falls back to text */
        <img
          alt={logo.name}
          src={logo.src}
          className="h-4 md:h-[18px] w-auto max-w-[90px] select-none pointer-events-none
            brightness-0 invert opacity-20 group-hover:opacity-45
            transition-opacity duration-300"
          draggable={false}
          onError={(e) => {
            const parent = (e.target as HTMLImageElement).parentElement;
            if (parent) {
              (e.target as HTMLImageElement).style.display = "none";
              const span = parent.querySelector(".logo-text-fallback") as HTMLElement;
              if (span) span.style.display = "block";
            }
          }}
        />
      ) : null}

      {/* Text fallback — always rendered, hidden when image loads */}
      <span
        className={cn(
          "logo-text-fallback font-mono text-[11px] tracking-[0.2em] uppercase",
          "text-[#363c52] group-hover:text-[#636b84] transition-colors duration-300",
          logo.src ? "hidden" : "block"
        )}
      >
        {logo.text ?? logo.name}
      </span>

      {/* Index mark */}
      <span className="absolute bottom-2 right-2.5 font-mono text-[8px] tracking-widest text-[#363c52]">
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}
