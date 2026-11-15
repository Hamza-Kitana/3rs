import { createFileRoute } from "@tanstack/react-router";
import type { gsap as GsapInstance } from "gsap";
import { useEffect, useRef, useState, type ReactNode } from "react";
import bride from "@/assets/bride.webp";
import floral from "@/assets/floral-corner.webp";
import groom from "@/assets/groom.webp";

const EVENT_START = new Date("2026-11-26T20:30:00+03:00");
const EVENT_END = new Date("2026-11-26T23:00:00+03:00");
const TITLE = "دعوة زفاف — محمد وضحى";

function mapUrl(coords: string) {
  return `https://www.google.com/maps?q=${coords}&z=17&hl=ar`;
}

/** Static mini-map preview — always visible (no blank iframe). */
function mapPreview(coords: string) {
  const [lat, lng] = coords.split(",");
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=15&size=640x320&maptype=mapnik&markers=${lat},${lng},red-pushpin`;
}

type Place = {
  id: string;
  step: string;
  title: string;
  event: string;
  time: string;
  timeLabel: string;
  place: string;
  detail: string;
  coords: string;
  link?: string;
  accent: "groom" | "bride" | "hall";
};

function placeHref(place: Place) {
  return place.link ?? mapUrl(place.coords);
}

const PLACES: Place[] = [
  {
    id: "groom",
    step: "01",
    title: "منزل العريس",
    event: "زفة العريس",
    time: "6:30",
    timeLabel: "مساءً",
    place: "اسكان طلال",
    detail: "تجمّع العريس والانطلاق",
    coords: "32.031463623046875,36.0638313293457",
    link: "https://www.google.com/maps?q=32.031463623046875,36.0638313293457&z=17&hl=ar",
    accent: "groom",
  },
  {
    id: "bride",
    step: "02",
    title: "منزل العروس",
    event: "الفاردة",
    time: "7:30",
    timeLabel: "مساءً",
    place: "اسكان هاشم",
    detail: "استقبال العروس والانطلاق للقاعة",
    coords: "32.0036859,36.0324288",
    link: "https://maps.app.goo.gl/HzYi7KiEKZJT7uoY7?g_st=iw",
    accent: "bride",
  },
  {
    id: "hall",
    step: "03",
    title: "الصالة",
    event: "حفل الزفاف",
    time: "8:30",
    timeLabel: "حتى 11:00",
    place: "قاعة أدونيس",
    detail: "أوتوستراد عمان الزرقاء — مقابل نقليات جت",
    coords: "32.00365,36.037211",
    accent: "hall",
  },
];

const VENUE = PLACES[2].place;
const VENUE_MAP_URL = mapUrl(PLACES[2].coords);
const GROOM_AREA = PLACES[0].place;
const BRIDE_AREA = PLACES[1].place;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      {
        name: "description",
        content:
          "يتشرف آل الكرمي وآل البدور بدعوتكم لحضور حفل زفاف محمد وضحى، الخميس 26/11/2026 في قاعة أدونيس.",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: `الخميس 26/11/2026 — ${VENUE}` },
    ],
  }),
  component: Invitation,
});

function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`ornament flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="ornament-line w-14 sm:w-20" />
      <span className="ornament-diamond h-2 w-2 rotate-45 bg-rose" />
      <span className="ornament-line w-14 sm:w-20" />
    </div>
  );
}

function LineIcon({ size = 20, children }: { size?: number; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function PinIcon() {
  return (
    <LineIcon>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </LineIcon>
  );
}

function ChatIcon() {
  return (
    <LineIcon>
      <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19.1L4 20z" />
      <path d="M9 10.5h6M9 13.5h4" />
    </LineIcon>
  );
}

function CalendarIcon() {
  return (
    <LineIcon>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </LineIcon>
  );
}

function Sparkles({ count = 14 }: { count?: number }) {
  const dots = useRef(
    Array.from({ length: count }, (_, i) => ({
      left: `${(i * 37 + 11) % 100}%`,
      top: `${(i * 53 + 9) % 100}%`,
      size: 3 + ((i * 7) % 6),
      delay: `${(i * 0.32) % 2.6}s`,
    })),
  ).current;

  return (
    <div className="sparkles pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {dots.map((d, i) => (
        <span
          key={i}
          className="sparkle"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            animationDelay: d.delay,
          }}
        />
      ))}
    </div>
  );
}

function Petals() {
  const items = useRef(
    Array.from({ length: 11 }, (_, i) => ({
      left: `${(i * 29 + 6) % 94}%`,
      size: 8 + ((i * 5) % 10),
      delay: `${i * 1.25}s`,
      duration: `${10 + (i % 4) * 2.2}s`,
    })),
  ).current;

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden" aria-hidden="true">
      {items.map((p, i) => (
        <span
          key={i}
          className="petal motion-reduce:hidden"
          style={{
            left: p.left,
            top: "-5vh",
            width: p.size,
            height: p.size * 0.78,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}

function WeddingRings({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 84" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ring-rose" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="oklch(0.42 0.11 12)" />
          <stop offset="0.5" stopColor="oklch(0.74 0.08 28)" />
          <stop offset="1" stopColor="oklch(0.48 0.12 10)" />
        </linearGradient>
      </defs>
      <circle cx="46" cy="54" r="24" fill="none" stroke="url(#ring-rose)" strokeWidth="5" />
      <circle cx="74" cy="54" r="24" fill="none" stroke="url(#ring-rose)" strokeWidth="5" />
      <path
        d="M74 30 L65 19 L69 13 H79 L83 19 Z"
        fill="var(--paper)"
        stroke="url(#ring-rose)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CoupleNames({ size = "hero" }: { size?: "hero" | "section" | "inline" }) {
  if (size === "hero" || size === "inline") {
    const big = size === "hero";
    return (
      <div
        className={`relative flex flex-wrap items-center justify-center px-4 text-center ${
          big ? "gap-x-3 gap-y-2 sm:gap-x-5" : "gap-x-3 gap-y-1"
        }`}
      >
        <p
          className={`hero-name-groom name-mark ${
            big
              ? "text-[clamp(2.75rem,11vw,5.75rem)]"
              : "text-[clamp(2.35rem,8.5vw,4.25rem)]"
          }`}
        >
          محمد
        </p>
        <span
          className={`hero-amp font-latin italic text-sage/70 ${
            big ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl lg:text-4xl"
          }`}
        >
          &amp;
        </span>
        <p
          className={`hero-name-bride name-mark ${
            big
              ? "text-[clamp(2.75rem,11vw,5.75rem)]"
              : "text-[clamp(2.35rem,8.5vw,4.25rem)]"
          }`}
        >
          ضحى
        </p>
      </div>
    );
  }

  return (
    <div className="relative px-5 text-center">
      <p className="name-mark text-[clamp(2.5rem,9vw,4.5rem)]">محمد</p>
      <p className="my-1 font-latin text-3xl italic text-sage/65 lg:text-4xl">&amp;</p>
      <p className="name-mark text-[clamp(2.5rem,9vw,4.5rem)]">ضحى</p>
    </div>
  );
}

function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <span className="float-orb float-orb-a absolute -left-[10%] top-[18%] h-56 w-56 lg:h-80 lg:w-80" />
      <span className="float-orb float-orb-b absolute -right-[8%] top-[42%] h-48 w-48 lg:h-72 lg:w-72" />
      <span className="float-orb float-orb-c absolute bottom-[8%] left-[30%] h-40 w-40 lg:h-56 lg:w-56" />
    </div>
  );
}

function Splash() {
  return (
    <div
      className="splash pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper motion-reduce:hidden"
      aria-hidden="true"
    >
      <div className="splash-bloom hero-bloom absolute inset-0" />
      <div className="relative flex h-44 w-44 items-center justify-center lg:h-60 lg:w-60">
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
          <circle cx="50" cy="50" r="47" className="splash-ring" />
          <circle cx="50" cy="50" r="42" className="splash-ring splash-ring-inner" />
        </svg>
        <p className="splash-mono font-latin text-5xl italic text-rose lg:text-7xl">M &amp; D</p>
      </div>
      <p className="splash-sub relative mt-8 font-display text-xl text-sage lg:text-2xl">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>
      <p className="splash-sub relative mt-2 text-sm tracking-wide text-muted-foreground">دعوة زفاف</p>
    </div>
  );
}

function DoorSeal() {
  const text = "محمد & ضحى  ✦  26 · 11 · 2026  ✦  ";
  const r = 81;
  return (
    <div className="door-seal relative flex h-[17rem] w-[17rem] items-center justify-center lg:h-[26rem] lg:w-[26rem]">
      <div className="hero-bloom absolute -inset-16 opacity-80" />
      <svg
        viewBox="0 0 200 200"
        className="seal-ring absolute inset-0 overflow-visible text-rose"
        aria-hidden="true"
      >
        <defs>
          <path
            id="door-seal-path"
            d={`M100 100 m-${r} 0 a${r} ${r} 0 1 1 ${r * 2} 0 a${r} ${r} 0 1 1 -${r * 2} 0`}
          />
        </defs>
        <circle cx="100" cy="100" r="97" fill="none" stroke="currentColor" strokeWidth="0.7" />
        <circle
          cx="100"
          cy="100"
          r="73"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeDasharray="0.5 3"
        />
        <text className="font-display" fontSize="12.5" fill="currentColor" direction="ltr">
          <textPath href="#door-seal-path" textLength={2 * Math.PI * r} lengthAdjust="spacing">
            {text.repeat(3)}
          </textPath>
        </text>
      </svg>
      <div className="relative flex aspect-square w-[66%] flex-col items-center justify-center rounded-full border border-rose/35 bg-paper shadow-soft">
        <div className="pointer-events-none absolute inset-2 rounded-full border border-rose/20" />
        <p className="font-latin text-4xl italic leading-none text-rose lg:text-6xl">M &amp; D</p>
        <Divider className="my-3 lg:my-4" />
        <h1 className="font-display text-lg text-ink lg:text-2xl">دعوة زفاف كريمة</h1>
      </div>
    </div>
  );
}

function Door({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <div
      className={`door-${side} bg-door absolute top-0 h-full w-1/2 ${isLeft ? "left-0" : "right-0"}`}
      style={{
        transformOrigin: isLeft ? "left center" : "right center",
        backfaceVisibility: "hidden",
      }}
    >
      <div className="absolute inset-4 rounded-t-[999px] border border-rose/45 lg:inset-8" />
      <div className="absolute inset-7 rounded-t-[999px] border border-rose/25 lg:inset-12" />
      <div className="door-pattern absolute inset-7 rounded-t-[999px] lg:inset-12" />
      <div className="absolute inset-x-10 bottom-[18%] top-[30%] rounded-t-[999px] border border-rose/30 lg:inset-x-[18%] lg:bottom-[14%] lg:top-[24%]" />
      <img
        src={floral}
        decoding="async"
        alt=""
        width={900}
        height={900}
        className="absolute bottom-0 w-[85%] max-w-none opacity-95 lg:h-[58%] lg:w-auto"
        style={{
          [isLeft ? "left" : "right"]: 0,
          transform: `scaleY(-1) ${isLeft ? "" : "scaleX(-1)"}`,
        }}
      />
      <img
        src={floral}
        decoding="async"
        alt=""
        width={900}
        height={900}
        className="absolute top-0 w-[58%] max-w-none opacity-90 lg:h-[38%] lg:w-auto"
        style={{ [isLeft ? "left" : "right"]: 0, transform: isLeft ? "" : "scaleX(-1)" }}
      />
      <div
        className={`absolute top-1/2 h-16 w-2 -translate-y-1/2 rounded-full bg-rose lg:h-28 lg:w-2.5 ${isLeft ? "right-4 lg:right-8" : "left-4 lg:left-8"}`}
      />
    </div>
  );
}

function DoorHero() {
  return (
    <section className="scene-doors scene-hero relative h-[230svh]">
      <div className="sticky top-0 h-svh overflow-hidden" style={{ perspective: "1600px" }}>
        <div className="bg-silk door-curtain absolute inset-0 origin-center" />
        <div className="door-glow hero-bloom absolute inset-0" />
        <FloatingOrbs />
        <Sparkles count={16} />

        {/* Revealed after doors open — names centered, never side-clipped */}
        <div className="door-reveal absolute inset-0 z-[5] flex flex-col items-center justify-center px-6 text-center opacity-0">
          <p className="font-display text-xl text-sage lg:text-3xl">بكل الحب نزفّ إليكم</p>
          <div className="mt-5 w-full max-w-3xl">
            <CoupleNames size="hero" />
          </div>
          <Divider className="mt-7" />
          <p
            className="mt-5 font-latin text-lg tracking-[0.28em] text-rose lining-nums lg:text-2xl"
            dir="ltr"
          >
            26 · 11 · 2026
          </p>
          <p className="mt-3 text-sm text-muted-foreground lg:text-base">
            منزل العريس · منزل العروس · الصالة
          </p>
        </div>

        <Door side="left" />
        <Door side="right" />

        <div className="door-crack pointer-events-none absolute inset-y-0 left-1/2 z-10 w-1 -translate-x-1/2 motion-reduce:hidden">
          <span className="door-crack-light absolute inset-0" />
        </div>

        <div className="door-intro pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
          <DoorSeal />
          <p className="mt-6 animate-pulse text-sm text-muted-foreground lg:hidden">
            اسحب للأسفل لفتح الدعوة
          </p>
          <span className="mt-2 text-rose lg:hidden" aria-hidden="true">
            ↓
          </span>
          <div className="mt-7 hidden flex-col items-center gap-3 lg:flex">
            <span className="mouse-hint" aria-hidden="true" />
            <p className="text-base text-muted-foreground">مرّر عجلة الفأرة لفتح الباب</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CoupleScene() {
  return (
    <section className="scene-couple relative h-[260svh]" aria-label="محمد وضحى">
      <div className="bg-mist sticky top-0 flex h-svh flex-col overflow-hidden">
        <div className="couple-glow pointer-events-none absolute inset-x-0 top-[35%] mx-auto h-[55vmin] w-[55vmin] rounded-full bg-rose-soft/40 blur-3xl" />

        <div className="couple-intro relative z-20 shrink-0 px-5 pb-2 pt-[7svh] text-center">
          <p className="couple-caption font-display text-xl text-sage lg:text-3xl">
            وتلاقت القلوب على بركة الله
          </p>
          <div className="couple-names mt-2">
            <CoupleNames size="inline" />
          </div>
          <Divider className="couple-divider mx-auto mt-4 opacity-80" />
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-end pb-[5svh]">
          <div className="couple-rings-wrap relative z-20 mb-1 flex justify-center">
            <WeddingRings className="couple-rings heart-beat w-14 drop-shadow-sm lg:w-16" />
          </div>

          <div
            className="couple-stage relative flex h-[52svh] origin-bottom items-end justify-center lg:h-[62svh]"
            dir="ltr"
          >
            <div className="couple-burst pointer-events-none absolute left-1/2 top-0" aria-hidden="true" />
            <div className="couple-bride relative h-[94%]">
              <img
                src={bride}
                alt="العروس ضحى"
                width={555}
                height={1014}
                loading="lazy"
                decoding="async"
                className="couple-step h-full w-auto max-w-none"
              />
            </div>
            <div className="couple-groom relative -ml-[2svh] h-full">
              <img
                src={groom}
                alt="العريس محمد"
                width={381}
                height={1113}
                loading="lazy"
                decoding="async"
                className="couple-step h-full w-auto max-w-none"
              />
            </div>
          </div>

          <div className="couple-floor pointer-events-none absolute bottom-[3svh] left-1/2 h-8 w-[min(70vw,22rem)] -translate-x-1/2 rounded-[50%] lg:h-10 lg:w-[28rem]" />
        </div>
      </div>
    </section>
  );
}

function Letter() {
  return (
    <section className="scene-letter bg-paper px-5 py-16 lg:py-28">
      <div className="letter-card relative mx-auto max-w-xl rounded-[2.2rem] border border-border bg-paper px-6 py-12 text-center shadow-lift lg:px-14 lg:py-16">
        <div className="letter-frame pointer-events-none absolute inset-3 rounded-[1.7rem]" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.2rem]" aria-hidden="true">
          <img
            src={floral}
            alt=""
            width={900}
            height={900}
            loading="lazy"
            decoding="async"
            className="animate-sway absolute -right-10 -top-6 w-40 opacity-45 lg:w-52"
            style={{ scale: "-1 1" }}
          />
          <img
            src={floral}
            alt=""
            width={900}
            height={900}
            loading="lazy"
            decoding="async"
            className="absolute -bottom-10 -left-10 w-40 opacity-35 lg:w-48"
            style={{ transform: "scaleY(-1)" }}
          />
        </div>

        <p className="reveal relative font-display text-3xl text-rose lg:text-4xl">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <div className="reveal relative mx-auto mt-6 max-w-sm rounded-2xl border border-rose/15 bg-rose-soft/40 px-5 py-4">
          <p className="text-balance text-lg leading-loose text-sage">
            ﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا ﴾
          </p>
        </div>
        <Divider className="reveal relative my-8" />
        <p className="reveal relative text-lg leading-loose">بكل الحب والسرور يتشرف</p>
        <p className="reveal relative mt-4 font-display text-2xl lg:text-3xl">السيد اسماعيل سالم الكرمي</p>
        <p className="reveal relative my-1 font-latin text-xl italic text-rose">&amp;</p>
        <p className="reveal relative font-display text-xl leading-snug lg:text-2xl">
          آل المرحوم محمدسعيد احمد البدور
        </p>
        <p className="reveal relative mt-5 text-lg">بدعوتكم لحضور حفل زفاف</p>
        <div className="reveal relative mt-8">
          <CoupleNames size="section" />
        </div>
      </div>
    </section>
  );
}

function PlaceCard({
  place,
  index,
}: {
  place: Place;
  index: number;
}) {
  const href = placeHref(place);
  return (
    <article
      className={`place-card place-${place.accent} relative overflow-hidden rounded-[1.75rem] border border-border bg-paper shadow-lift`}
      style={{ zIndex: 3 - index }}
    >
      <div className="place-glow pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full opacity-60" />
      <div className="relative flex items-start justify-between gap-3 px-5 pt-5">
        <div className="text-right">
          <p className="font-latin text-sm tracking-[0.25em] text-rose/70">{place.step}</p>
          <h3 className="mt-1 font-display text-3xl text-ink lg:text-4xl">{place.title}</h3>
          <p className="mt-1 font-display text-lg text-rose">{place.event}</p>
        </div>
        <div className="place-time shrink-0 rounded-2xl border border-rose/25 bg-rose-soft/50 px-3 py-2 text-center">
          <p className="font-latin text-3xl leading-none text-rose tabular-nums" dir="ltr">
            {place.time}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">{place.timeLabel}</p>
        </div>
      </div>

      <div className="relative mt-4 px-5">
        <p className="font-display text-xl text-sage">{place.place}</p>
        <p className="mt-1 text-sm text-muted-foreground">{place.detail}</p>
      </div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`افتح موقع ${place.title} على الخريطة`}
        className="place-map group relative mt-5 block overflow-hidden border-t border-border"
      >
        <div className="relative h-40 overflow-hidden bg-mist sm:h-44">
          <img
            src={mapPreview(place.coords)}
            alt={`خريطة ${place.title}`}
            width={640}
            height={320}
            loading="lazy"
            decoding="async"
            className="map-frame h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-paper/90 via-transparent to-transparent" />
          <span className="absolute right-3 top-3 rounded-full border border-rose/30 bg-paper/95 px-3 py-1 text-xs text-rose shadow-sm">
            خرائط جوجل
          </span>
          <span className="map-pin map-pin-pulse absolute bottom-3 left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-rose text-primary-foreground shadow-soft">
            <PinIcon />
          </span>
        </div>
        <div className="flex items-center gap-3 bg-paper px-5 py-3.5">
          <div className="min-w-0 flex-1 text-right">
            <p className="font-display text-base">افتح الموقع</p>
            <p className="text-xs text-muted-foreground">اضغط للاتجاهات</p>
          </div>
          <span className="shrink-0 rounded-full border border-rose/40 px-3 py-1 text-sm text-rose transition group-hover:bg-rose group-hover:text-primary-foreground">
            اتجاهات
          </span>
        </div>
      </a>
    </article>
  );
}

function JourneyPlaces() {
  return (
    <section className="scene-places relative overflow-hidden bg-mist px-5 py-16 lg:py-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="float-orb float-orb-a absolute left-[8%] top-[12%] h-48 w-48 opacity-30" />
        <span className="float-orb float-orb-b absolute right-[5%] bottom-[18%] h-56 w-56 opacity-25" />
      </div>

      <div className="reveal relative mx-auto max-w-2xl text-center">
        <p className="font-latin text-sm tracking-[0.35em] text-rose">JOURNEY</p>
        <h2 className="mt-2 font-display text-4xl text-ink lg:text-5xl">مسيرة الفرح</h2>
        <p className="mt-3 text-muted-foreground">ثلاث محطات… منزل العريس، منزل العروس، ثم الصالة</p>
        <p className="mt-1 text-sm text-sage">الخميس 26 / 11 / 2026</p>
      </div>

      {/* Desktop journey path */}
      <div className="reveal relative mx-auto mt-10 hidden max-w-3xl lg:block" aria-hidden="true">
        <div className="journey-path relative mx-auto h-2 w-full max-w-xl overflow-hidden rounded-full bg-rose/15">
          <span className="journey-path-fill absolute inset-y-0 right-0 w-full origin-right rounded-full bg-linear-to-l from-rose via-rose/80 to-sage/70" />
        </div>
        <div className="mt-3 flex justify-between px-2">
          {PLACES.map((p) => (
            <div key={p.id} className="journey-stop flex flex-col items-center gap-1">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-rose bg-paper font-latin text-sm text-rose">
                {p.step}
              </span>
              <span className="font-display text-sm text-ink">{p.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto mt-10 flex max-w-xl flex-col gap-8 lg:mt-14 lg:max-w-5xl lg:flex-row lg:items-stretch lg:gap-5">
        {/* Mobile connecting rail */}
        <span
          className="journey-rail pointer-events-none absolute top-8 bottom-8 w-px origin-top bg-rose/35 lg:hidden"
          style={{ right: "1.35rem" }}
          aria-hidden="true"
        />
        {PLACES.map((place, index) => (
          <div key={place.id} className="place-wrap relative flex-1">
            <span className="absolute top-6 z-20 flex h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-rose bg-paper lg:hidden" style={{ right: "1.1rem" }} />
            {index < PLACES.length - 1 && (
              <div className="place-connector pointer-events-none absolute inset-x-0 -bottom-8 z-0 hidden justify-center lg:flex" aria-hidden="true">
                <span className="font-display text-rose/50">⟵</span>
              </div>
            )}
            <PlaceCard place={place} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}

const COUNTDOWN_UNITS = [
  { label: "يوم", ms: 86_400_000 },
  { label: "ساعة", ms: 3_600_000 },
  { label: "دقيقة", ms: 60_000 },
  { label: "ثانية", ms: 1_000 },
] as const;

function Countdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  let body: ReactNode;
  if (now !== null && now >= EVENT_END.getTime()) {
    body = <p className="py-6 text-lg text-sage">تمّ العرس بحمد الله، شكراً لحضوركم</p>;
  } else if (now !== null && now >= EVENT_START.getTime()) {
    body = <p className="py-6 text-lg text-sage">الحفل قائم الآن، بانتظاركم</p>;
  } else {
    let remaining = now === null ? null : EVENT_START.getTime() - now;
    body = (
      <div className="grid grid-cols-4 gap-3" dir="ltr" role="timer" aria-live="off">
        {COUNTDOWN_UNITS.map(({ label, ms }) => {
          let value: number | null = null;
          if (remaining !== null) {
            value = Math.floor(remaining / ms);
            remaining -= value * ms;
          }
          const text = value === null ? "--" : String(value).padStart(2, "0");
          return (
            <div key={label} className="countdown-unit flex flex-col items-center">
              <div className="countdown-face flex aspect-square w-full max-w-[4.4rem] items-center justify-center rounded-2xl border border-border">
                <span key={text} className="animate-tick font-latin text-2xl text-rose tabular-nums">
                  {text}
                </span>
              </div>
              <span className="mt-2 text-xs text-muted-foreground">{label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="reveal mx-auto max-w-md rounded-[1.85rem] border border-border bg-paper px-4 py-8 text-center shadow-soft">
      <p className="mb-6 font-display text-xl text-sage lg:text-2xl">العدّ التنازلي لفرحتنا</p>
      {body}
    </div>
  );
}

function Closing() {
  return (
    <section className="scene-closing bg-mist px-5 pb-28 pt-16 lg:pb-28 lg:pt-24">
      <Countdown />

      <p className="reveal closing-wish mt-14 text-center font-display text-3xl text-rose lg:text-5xl">
        بحضوركم تكتمل فرحتنا
      </p>

      <div className="details-actions reveal mx-auto mt-10 flex max-w-md flex-col gap-3">
        <button
          type="button"
          onClick={share}
          className="btn-primary btn-shine rounded-2xl px-6 py-3.5 font-bold"
        >
          مشاركة الدعوة عبر واتساب
        </button>
        <button type="button" onClick={saveCalendar} className="btn-ghost rounded-2xl px-6 py-3.5">
          حفظ الموعد في التقويم
        </button>
      </div>

      <div className="reveal mt-16 text-center">
        <Divider />
        <div className="animate-float mt-7">
          <CoupleNames size="section" />
        </div>
      </div>
    </section>
  );
}

function MobileBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".scene-hero");
    const actions = document.querySelector(".details-actions");
    let actionsInView = false;
    const update = () => {
      const pastHero = hero ? hero.getBoundingClientRect().bottom < window.innerHeight * 0.35 : true;
      setVisible(pastHero && !actionsInView);
    };
    const observer = new IntersectionObserver(([entry]) => {
      actionsInView = entry?.isIntersecting ?? false;
      update();
    });
    if (actions) observer.observe(actions);
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <nav
      aria-label="اختصارات الدعوة"
      inert={!visible}
      className={`fixed inset-x-4 z-30 transition-all duration-500 ease-out lg:hidden ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[150%] opacity-0"
      }`}
      style={{ bottom: "calc(0.85rem + env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-sm items-center rounded-2xl border border-border bg-paper/95 px-2 py-1.5 shadow-lift backdrop-blur-sm">
        <button
          type="button"
          onClick={share}
          className="flex flex-1 flex-col items-center gap-0.5 py-1.5 text-rose active:scale-90"
        >
          <ChatIcon />
          <span className="text-[11px] text-foreground/75">مشاركة</span>
        </button>
        <span className="h-7 w-px bg-border" />
        <a
          href={VENUE_MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 flex-col items-center gap-0.5 py-1.5 text-rose active:scale-90"
        >
          <PinIcon />
          <span className="text-[11px] text-foreground/75">الموقع</span>
        </a>
        <span className="h-7 w-px bg-border" />
        <button
          type="button"
          onClick={saveCalendar}
          className="flex flex-1 flex-col items-center gap-0.5 py-1.5 text-rose active:scale-90"
        >
          <CalendarIcon />
          <span className="text-[11px] text-foreground/75">التقويم</span>
        </button>
      </div>
    </nav>
  );
}

const CONFETTI_COLORS = [
  "oklch(0.62 0.13 12)",
  "oklch(0.72 0.09 30)",
  "oklch(0.55 0.1 15)",
  "oklch(0.78 0.05 175)",
  "oklch(0.85 0.06 40)",
];

function burstConfetti(gsap: typeof GsapInstance) {
  const host = document.querySelector(".couple-burst");
  if (!host) return;
  const count = 34;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length] ?? "";
    if (i % 3 === 0) piece.style.borderRadius = "999px";
    host.appendChild(piece);
    const angle = (i / count) * Math.PI * 2 + gsap.utils.random(-0.25, 0.25);
    const distance = gsap.utils.random(80, 200);
    gsap
      .timeline({ onComplete: () => piece.remove() })
      .fromTo(
        piece,
        { x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 },
        {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance * 0.65 - 40,
          scale: gsap.utils.random(0.7, 1.5),
          rotate: gsap.utils.random(-280, 280),
          duration: 0.75,
          ease: "power3.out",
        },
      )
      .to(piece, {
        y: "+=150",
        rotate: "+=160",
        opacity: 0,
        duration: 1.5,
        ease: "power1.in",
      });
  }
}

function Invitation() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;
    let ctx: { revert: () => void } | undefined;
    let mm: { revert: () => void } | undefined;

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      ctx = gsap.context(() => {
        if (reduce) return;

        // Ambient floating orbs
        gsap.utils.toArray<HTMLElement>(".float-orb").forEach((orb, i) => {
          gsap.to(orb, {
            y: gsap.utils.random(-28, 28),
            x: gsap.utils.random(-20, 20),
            duration: gsap.utils.random(4.5, 7),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.4,
          });
        });

        // Soft seal entrance after splash
        gsap.from(".door-seal", {
          scale: 0.82,
          opacity: 0,
          duration: 1.15,
          delay: 2.15,
          ease: "expo.out",
        });

        // Doors open on scroll
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".scene-doors",
              start: "top top",
              end: "bottom bottom",
              scrub: 1.05,
            },
          })
          .to(".door-intro", { opacity: 0, y: -28, duration: 0.22 }, 0)
          .to(".door-left", { rotateY: -108, duration: 1, ease: "power2.inOut" }, 0.08)
          .to(".door-right", { rotateY: 108, duration: 1, ease: "power2.inOut" }, 0.08)
          .fromTo(
            ".door-glow",
            { opacity: 0.25, scale: 0.65 },
            { opacity: 1, scale: 1.35, duration: 1 },
            0.08,
          )
          .fromTo(
            ".door-reveal",
            { opacity: 0, scale: 0.88, filter: "blur(6px)" },
            { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.55, ease: "power2.out" },
            0.42,
          )
          .to(".door-curtain", { scaleX: 0.12, opacity: 0, duration: 0.55 }, 0.65)
          .to(".door-crack", { scaleX: 42, opacity: 0, duration: 0.45, ease: "power1.in" }, 0.05);

        gsap.from(".door-reveal .hero-name-groom", {
          x: 36,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".scene-doors",
            start: "45% top",
            toggleActions: "play none none reverse",
          },
        });
        gsap.from(".door-reveal .hero-amp", {
          scale: 0.5,
          opacity: 0,
          duration: 0.55,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: ".scene-doors",
            start: "45% top",
            toggleActions: "play none none reverse",
          },
        });
        gsap.from(".door-reveal .hero-name-bride", {
          x: -36,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".scene-doors",
            start: "45% top",
            toggleActions: "play none none reverse",
          },
        });

        // Couple meet — clean walk-in, no busy overlays
        const couple = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ".scene-couple",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.1,
          },
        });

        couple
          .from(".couple-intro", { opacity: 0, y: 18, duration: 0.2 }, 0)
          .from(".couple-stage", { scale: 0.9, duration: 0.65, ease: "power1.out" }, 0)
          .from(".couple-bride", { x: "-48vw", opacity: 0, duration: 0.55, ease: "power2.out" }, 0.05)
          .from(".couple-groom", { x: "48vw", opacity: 0, duration: 0.55, ease: "power2.out" }, 0.05)
          .to(
            ".couple-bride .couple-step",
            { keyframes: { y: [0, -4, 0, -4, 0] }, duration: 0.55 },
            0.05,
          )
          .to(
            ".couple-groom .couple-step",
            { keyframes: { y: [0, -6, 0, -5, 0] }, duration: 0.55 },
            0.05,
          )
          .from(".couple-floor", { opacity: 0, scaleX: 0.3, duration: 0.45 }, 0.08)
          .fromTo(".couple-glow", { opacity: 0.15, scale: 0.7 }, { opacity: 0.9, scale: 1, duration: 0.35 }, 0.35)
          .from(
            ".couple-rings",
            { scale: 0, opacity: 0, y: 12, duration: 0.2, ease: "back.out(2)" },
            0.5,
          )
          .call(
            () => {
              if (couple.scrollTrigger?.direction !== -1) burstConfetti(gsap);
            },
            [],
            0.55,
          )
          .to(".couple-bride", { x: "0.8vw", duration: 0.15 }, 0.7)
          .to(".couple-groom", { x: "-0.8vw", duration: 0.15 }, 0.7);

        // Soft reveals
        gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 32,
            filter: "blur(4px)",
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          });
        });

        // Letter card cinematic lift
        gsap.from(".letter-card", {
          y: 56,
          opacity: 0,
          rotateX: 8,
          transformPerspective: 1200,
          duration: 1.25,
          ease: "expo.out",
          scrollTrigger: { trigger: ".letter-card", start: "top 88%" },
        });

        // Journey of three places
        gsap.from(".journey-path-fill", {
          scaleX: 0,
          duration: 1.4,
          ease: "power2.inOut",
          scrollTrigger: { trigger: ".scene-places", start: "top 70%" },
        });
        gsap.from(".journey-stop", {
          opacity: 0,
          y: 16,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ".scene-places", start: "top 70%" },
        });
        gsap.from(".journey-rail", {
          scaleY: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: { trigger: ".scene-places", start: "top 75%" },
        });
        gsap.from(".place-card", {
          opacity: 0,
          y: 50,
          duration: 1.05,
          stagger: 0.22,
          ease: "expo.out",
          scrollTrigger: { trigger: ".scene-places", start: "top 72%" },
        });
        gsap.from(".place-time", {
          scale: 0.7,
          opacity: 0,
          duration: 0.7,
          stagger: 0.2,
          ease: "back.out(1.8)",
          scrollTrigger: { trigger: ".scene-places", start: "top 68%" },
        });
        gsap.utils.toArray<HTMLElement>(".place-card .map-pin").forEach((pin) => {
          gsap.from(pin, {
            y: -36,
            opacity: 0,
            duration: 1,
            ease: "bounce.out",
            scrollTrigger: { trigger: pin, start: "top 92%" },
          });
        });

        // Countdown
        const units = gsap.utils.toArray<HTMLElement>(".countdown-unit");
        if (units[0]) {
          gsap.from(units, {
            scale: 0.35,
            opacity: 0,
            y: 20,
            duration: 0.75,
            stagger: 0.1,
            ease: "back.out(1.9)",
            scrollTrigger: { trigger: units[0], start: "top 90%" },
          });
        }

        // Closing wish
        gsap.from(".closing-wish", {
          scale: 0.92,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".closing-wish", start: "top 88%" },
        });

        // Ornaments
        gsap.utils.toArray<HTMLElement>(".ornament").forEach((orn) => {
          const lines = orn.querySelectorAll(".ornament-line");
          const diamond = orn.querySelector(".ornament-diamond");
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: orn,
              start: "top 92%",
              toggleActions: "play none none reverse",
            },
          });
          if (diamond) tl.from(diamond, { scale: 0, rotate: -120, duration: 0.55, ease: "back.out(2)" });
          tl.from(lines, { scaleX: 0, duration: 0.85, ease: "power3.out" }, 0.1);
        });
      }, root);

      const desktop = gsap.matchMedia(root.current);
      mm = desktop;

      desktop.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".scroll-progress",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: document.documentElement,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.2,
            },
          },
        );
      });

      desktop.add(
        "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const layers = gsap.utils.toArray<HTMLElement>("[data-depth]").map((el) => {
            const depth = Number(el.dataset["depth"]);
            return {
              depth,
              x: gsap.quickTo(el, "x", { duration: 1.35, ease: "power3" }),
              y: gsap.quickTo(el, "y", { duration: 1.35, ease: "power3" }),
            };
          });
          const glow = document.querySelector<HTMLElement>(".cursor-glow");
          gsap.set(glow, { xPercent: -50, yPercent: -50, opacity: 0 });
          const glowX = gsap.quickTo(glow, "x", { duration: 0.5, ease: "power3" });
          const glowY = gsap.quickTo(glow, "y", { duration: 0.5, ease: "power3" });

          const trail = document.createElement("div");
          trail.className = "pointer-events-none fixed inset-0 z-20 overflow-hidden";
          trail.setAttribute("aria-hidden", "true");
          root.current?.appendChild(trail);
          let lastDust = 0;

          const dropDust = (x: number, y: number) => {
            const t = performance.now();
            if (t - lastDust < 40 || trail.childElementCount > 24) return;
            lastDust = t;
            const dust = document.createElement("span");
            dust.className = "trail-dust";
            dust.style.left = `${x}px`;
            dust.style.top = `${y}px`;
            trail.appendChild(dust);
            gsap.fromTo(
              dust,
              { scale: gsap.utils.random(0.55, 1.2), opacity: 0.95 },
              {
                x: gsap.utils.random(-20, 20),
                y: gsap.utils.random(10, 44),
                scale: 0,
                opacity: 0,
                duration: gsap.utils.random(0.7, 1.25),
                ease: "power1.out",
                onComplete: () => dust.remove(),
              },
            );
          };

          let shown = false;
          const onMove = (e: MouseEvent) => {
            dropDust(e.clientX, e.clientY);
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            layers.forEach((l) => {
              l.x(-nx * l.depth);
              l.y(-ny * l.depth);
            });
            glowX(e.clientX);
            glowY(e.clientY);
            if (!shown) {
              shown = true;
              gsap.to(glow, { opacity: 1, duration: 0.45, overwrite: "auto" });
            }
          };
          const onLeave = () => {
            shown = false;
            gsap.to(glow, { opacity: 0, duration: 0.45, overwrite: "auto" });
          };

          window.addEventListener("mousemove", onMove, { passive: true });
          document.documentElement.addEventListener("mouseleave", onLeave);
          return () => {
            window.removeEventListener("mousemove", onMove);
            document.documentElement.removeEventListener("mouseleave", onLeave);
            trail.remove();
          };
        },
      );

      void document.fonts?.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
    })();

    return () => {
      cancelled = true;
      mm?.revert();
      ctx?.revert();
    };
  }, []);

  return (
    <main ref={root} className="bg-background font-body text-foreground">
      <Splash />
      <div
        className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-40 origin-right motion-reduce:hidden"
        style={{ transform: "scaleX(0)" }}
      />
      <div className="cursor-glow pointer-events-none fixed left-0 top-0 z-20 hidden h-[34rem] w-[34rem] rounded-full opacity-0 lg:block" />
      <Petals />
      <DoorHero />
      <CoupleScene />
      <Letter />
      <JourneyPlaces />
      <Closing />
      <MobileBar />
    </main>
  );
}

function share() {
  const url = window.location.origin + window.location.pathname;
  const text = [
    TITLE,
    "الخميس 26/11/2026",
    "",
    `① منزل العريس — زفة العريس 6:30 مساءً`,
    `${GROOM_AREA}`,
    placeHref(PLACES[0]),
    "",
    `② منزل العروس — الفاردة 7:30 مساءً`,
    `${BRIDE_AREA}`,
    placeHref(PLACES[1]),
    "",
    `③ الصالة — الحفل 8:30 حتى 11:00`,
    `${VENUE}`,
    placeHref(PLACES[2]),
    "",
    `الدعوة: ${url}`,
  ].join("\n");
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
}

function toIcsDate(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function saveCalendar() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Urs//AR",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:urs-mohammad-duha-20261126@wedding",
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(EVENT_START)}`,
    `DTEND:${toIcsDate(EVENT_END)}`,
    "SUMMARY:زفاف محمد وضحى",
    `LOCATION:${VENUE} — أوتوستراد عمان الزرقاء`,
    "DESCRIPTION:منزل العريس (زفة 6:30) اسكان طلال\\nمنزل العروس (فاردة 7:30) اسكان هاشم\\nالصالة (8:30–11:00) قاعة أدونيس",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:زفاف محمد وضحى",
    "TRIGGER:-PT3H",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "urs-mohammad-duha.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
