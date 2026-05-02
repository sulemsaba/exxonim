import type { HomeHeroContent } from "../types";

interface ReferenceHeroProps {
  content: HomeHeroContent;
}

export function ReferenceHero({ content }: ReferenceHeroProps) {
  return (
    <section className="relative overflow-hidden pb-10 pt-11 md:pt-12 lg:pt-14">
      <div className="mx-auto px-[clamp(16px,4vw,48px)]">
        <div className="grid items-center gap-7 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left: Copy */}
          <div data-reveal>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-accent">
              {content.eyebrow}
            </p>
            <h1 className="m-0 max-w-[11ch] text-[clamp(3.25rem,6vw,5.85rem)] leading-[0.93] tracking-[-0.06em] text-balance">
              {content.title}
            </h1>
            <p className="mt-5 max-w-[38rem] text-[clamp(1rem,1.45vw,1.22rem)] leading-relaxed text-[rgba(17,35,37,0.78)] dark:text-[rgba(237,244,242,0.78)]">
              {content.description}
            </p>
            <div className="mt-9 flex flex-wrap gap-4 max-md:flex-col max-md:items-stretch">
              <a
                href={content.cta.href}
                className="inline-flex h-14 items-center justify-center rounded-full bg-accent px-7 text-sm font-extrabold text-white shadow-accent-glow transition-all hover:bg-accent-hover hover:-translate-y-0.5"
              >
                {content.cta.label}
              </a>
            </div>
          </div>

          {/* Right: Device mockup */}
          <div className="relative min-h-[39rem] lg:min-h-[30rem] max-md:min-h-[24rem]" data-reveal>
            <DeviceMockup highlights={content.highlights} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// DeviceMockup — complex gradients need inline styles
// ----------------------------------------------------------------------

function DeviceMockup({ highlights }: { highlights: HomeHeroContent["highlights"] }) {
  return (
    <div
      className="absolute bottom-0 right-0 z-[2] w-[min(34rem,100%)] max-lg:left-1/2 max-lg:right-auto max-lg:-translate-x-1/2 max-sm:w-full"
      style={{ filter: "drop-shadow(0 32px 64px rgba(9,68,73,0.16))" }}
    >
      {/* Device frame */}
      <div
        className="relative rounded-[30px_30px_18px_18px] px-[0.7rem] pb-[0.85rem] pt-[0.65rem]"
        style={{
          background: "linear-gradient(180deg,#f2ebe0 0%,#d8c9b7 42%,#93b1b5 100%)",
          boxShadow: "inset 0 1px 0 rgba(250,244,235,0.92), inset 0 -1px 0 rgba(63,93,97,0.18), 0 20px 38px rgba(9,68,73,0.12)"
        }}
        // Dark mode override
        data-dark-frame
      >
        {/* Pseudo via element */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: "linear-gradient(135deg, rgba(248,240,226,0.3), transparent 26%)" }}
        />

        {/* Camera notch */}
        <div
          className="absolute left-1/2 top-0 z-[3] h-4 w-[6.4rem] -translate-x-1/2 rounded-b-[0.9rem]"
          style={{
            background: "linear-gradient(180deg,#203336,#0f181a)",
            boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.08)"
          }}
        >
          <div
            className="absolute left-1/2 top-[0.34rem] h-[0.34rem] w-[0.34rem] -translate-x-1/2 rounded-full"
            style={{
              background: "radial-gradient(circle at 35% 35%, rgba(105,182,190,0.9), rgba(18,31,34,0.3) 48%, #030708 100%)"
            }}
          />
        </div>

        {/* Screen */}
        <div
          className="relative min-h-[21rem] overflow-hidden rounded-[22px_22px_12px_12px] p-[1.05rem] max-sm:min-h-[17rem]"
          style={{
            border: "1px solid rgba(9,68,73,0.18)",
            background: "linear-gradient(180deg, rgba(250,245,237,0.96), rgba(236,226,212,0.92)), linear-gradient(180deg, rgba(248,242,231,0.94), rgba(240,232,219,0.98))",
            boxShadow: "inset 0 1px 0 rgba(250,244,236,0.6), 0 18px 40px rgba(9,68,73,0.14)"
          }}
        >
          {/* Top shine */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[1.2rem]"
            style={{ background: "linear-gradient(180deg, rgba(248,240,226,0.18), transparent)" }}
          />

          {/* Slide content */}
          <div
            className="absolute inset-[1.1rem] flex flex-col rounded-[22px] p-8 opacity-100 max-sm:inset-[0.9rem] max-sm:p-5"
            style={{
              background: "linear-gradient(180deg, rgba(249,244,236,0.94), rgba(239,231,219,0.96)), radial-gradient(circle at top right, rgba(44,139,145,0.18), transparent 34%), #fbf5ea",
              transform: "translateX(0) scale(1)",
              transition: "opacity 520ms ease, transform 520ms ease"
            }}
          >
            <span className="text-xs font-extrabold tracking-[0.14em] text-accent">
              Key services
            </span>
            {highlights.length > 0 && (
              <h2 className="mt-2 text-lg font-bold">What we support</h2>
            )}
            <div className="mt-4 grid gap-3">
              {highlights.map((item) => (
                <div key={item.title}>
                  <strong className="block text-sm">{item.title}</strong>
                  <span className="text-sm text-text-muted">{item.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deck */}
        <div
          className="relative mx-auto mt-[-0.08rem] h-[2.35rem] w-[calc(100%+3.8rem)] -translate-x-[1.9rem] rounded-b-[24px]"
          style={{
            background: "linear-gradient(180deg,#efe7da 0%,#cbbdac 52%,#8caeb2 100%)",
            boxShadow: "inset 0 1px 0 rgba(249,243,234,0.78), inset 0 -1px 0 rgba(72,98,103,0.22)"
          }}
        >
          {/* Deck lines */}
          <div
            className="absolute left-1/2 top-[0.42rem] h-[0.72rem] w-[68%] -translate-x-1/2 rounded-[10px] opacity-85"
            style={{
              background: "repeating-linear-gradient(90deg, rgba(45,59,63,0.18) 0 0.28rem, transparent 0.28rem 0.45rem), linear-gradient(180deg, rgba(248,241,229,0.26), rgba(9,68,73,0.06))"
            }}
          />
        </div>

        {/* Trackpad */}
        <div
          className="absolute bottom-[0.28rem] left-1/2 h-[0.72rem] w-[29%] -translate-x-1/2 rounded-[0.45rem]"
          style={{
            border: "1px solid rgba(83,110,115,0.22)",
            background: "linear-gradient(180deg, rgba(248,241,229,0.86), rgba(191,209,212,0.74))"
          }}
        />

        {/* Base */}
        <div
          className="mx-auto mt-[-0.02rem] h-[0.6rem] w-[calc(100%+5rem)] -translate-x-[2.5rem] rounded-b-[999px]"
          style={{
            background: "linear-gradient(180deg,#96b3b7,#647f84)",
            boxShadow: "0 16px 28px rgba(9,68,73,0.18)"
          }}
        />
      </div>
    </div>
  );
}
