"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import { cn } from "@/lib/utils";
import ProcessSection from "./ProcessSection";
import FeaturesSection from "./FeaturesSection";
import SuccessStoriesSection from "./SuccessStoriesSection";
import CTASection from "./CTASection";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

type SectionDef = { id: string; node: React.ReactNode; bg: string };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function FullpageHome() {
  const sections: SectionDef[] = useMemo(
    () => [
      { id: "hero", node: <HeroSlide />, bg: "bg-transparent" }, 
      { id: "features", node: <FeaturesSection />, bg: "bg-white" },
      { id: "process", node: <ProcessSection />, bg: "bg-[var(--purple)]" },
      { id: "cta", node: <CTASection />, bg: "bg-white" },
      { id: "stories", node: <SuccessStoriesSection />, bg: "bg-white" },
      { id: "footer", node: <Footer />, bg: "bg-white" },
    ],
    [],
  );

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [entering, setEntering] = useState<number | null>(null);

  const lockRef = useRef(false);

  const setHash = (id: string) => {
    if (typeof window === "undefined") return;
    history.replaceState(null, "", `#${id}`);
  };

  const scrollToIndex = (idx: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: idx * window.innerHeight, behavior: "smooth" });
  };

  const goTo = (idx: number) => {
    const el = containerRef.current;
    if (!el) return;

    const nextIdx = clamp(idx, 0, sections.length - 1);
    if (nextIdx === active || lockRef.current) return;

    lockRef.current = true;
    setLeaving(active);
    setEntering(nextIdx);
    setActive(nextIdx);
    setHash(sections[nextIdx].id);
    scrollToIndex(nextIdx);

    window.setTimeout(() => {
      setLeaving(null);
      setEntering(null);
      lockRef.current = false;
    }, 900);
  };

  const next = () => goTo(active + 1);
  const prev = () => goTo(active - 1);

  // initial hash
  useEffect(() => {
    const hash = (window.location.hash || "").replace("#", "");
    if (!hash) {
      setHash(sections[0].id);
      return;
    }
    const idx = sections.findIndex((s) => s.id === hash);
    if (idx >= 0) {
      setActive(idx);
      requestAnimationFrame(() => scrollToIndex(idx));
    } else {
      setHash(sections[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // sync active on manual scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      if (lockRef.current) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const idx = Math.round(el.scrollTop / window.innerHeight);
        const clamped = clamp(idx, 0, sections.length - 1);
        if (clamped !== active) {
          setActive(clamped);
          setHash(sections[clamped].id);
        }
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
  }, [active, sections.length]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lockRef.current) return;
      if (e.key === "ArrowDown") next();
      if (e.key === "ArrowUp") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  // wheel paging
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let acc = 0;
    let t: number | null = null;

    const onWheel = (e: WheelEvent) => {
      if (lockRef.current) return;
      e.preventDefault();
      acc += e.deltaY;

      const threshold = 180;

      if (t) window.clearTimeout(t);
      t = window.setTimeout(() => {
        acc = 0;
      }, 140);

      if (Math.abs(acc) > threshold) {
        acc > 0 ? next() : prev();
        acc = 0;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [active]);

  // swipe on mobile
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let sx = 0;
    let sy = 0;

    const onStart = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    };

    const onEnd = (e: TouchEvent) => {
      if (lockRef.current) return;
      const t = e.changedTouches[0];
      if (!t) return;

      const dx = t.clientX - sx;
      const dy = t.clientY - sy;

      if (Math.abs(dy) < 55 || Math.abs(dy) < Math.abs(dx)) return;
      dy < 0 ? next() : prev();
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [active]);

  const progress = useSpring((active + 1) / sections.length, {
    stiffness: 140,
    damping: 22,
    mass: 0.6,
  });

  return (
    <>
      <Navbar scrollContainerRef={containerRef} />

      {/* dots + progress */}
      <div className="pointer-events-none fixed left-6 top-1/2 z-[60] hidden -translate-y-1/2 md:block">
        <div className="flex flex-col items-center gap-3">
          {sections.map((s, idx) => {
            const isOn = idx === active;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(idx)}
                className="pointer-events-auto"
                aria-label={`Go to ${s.id}`}
              >
                <div
                  className={cn(
                    "h-2.5 w-2.5 rounded-full transition-all duration-200",
                    isOn
                      ? "bg-[var(--purple)] scale-110"
                      : "bg-black/20 hover:bg-black/30",
                  )}
                />
              </button>
            );
          })}
          <div className="mt-3 h-24 w-px bg-black/10 overflow-hidden rounded-full">
            <motion.div
              className="w-px bg-[var(--purple)] origin-top"
              style={{ height: "100%", scaleY: progress }}
            />
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className={cn(
          "min-h-[100svh] md:h-screen w-full overflow-y-auto",
          "scroll-smooth overscroll-none",
          "bg-[var(--bg-soft)]",
        )}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {sections.map((s, idx) => {
          const isLeaving = leaving === idx;
          const isEntering = entering === idx;

          return (
            <div
              key={s.id}
              data-slide={s.id}
              className={cn(
                "relative w-full overflow-hidden",
                "min-h-[100svh] md:h-screen",
              )}
            >
              <div className={cn("absolute inset-0 -z-10", s.bg)} />

              {isLeaving && (
                <motion.div
                  className="pointer-events-none absolute inset-0 z-30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  style={{
                    background:
                      "radial-gradient(1200px 600px at 50% 30%, rgba(0,0,0,0.10), rgba(0,0,0,0.55))",
                    backdropFilter: "blur(14px)",
                  }}
                />
              )}

              <motion.div
                className="h-full w-full"
                initial={isEntering ? { opacity: 0, y: 34, scale: 0.985 } : false}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={
                  isEntering
                    ? { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                    : { duration: 0 }
                }
                style={{ transformOrigin: "center" }}
              >
                {idx === 0 ? <HeroSlide onNext={next} /> : s.node}
              </motion.div>

              <div
                className={cn(
                  "pointer-events-none absolute bottom-0 left-0 right-0 h-[2px]",
                  s.bg,
                )}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}

/* =========================
   HERO SLIDE — SINGLE precise wave (/images/hero-waves.png)
   ========================= */

function HeroSlide({ onNext }: { onNext?: () => void }) {
  const reduce = useReducedMotion();

  const heroRef = useRef<HTMLElement | null>(null);
  const titleWrapRef = useRef<HTMLDivElement | null>(null);
  const [waveTop, setWaveTop] = useState<number>(0);

  // Text/icon motion (unchanged)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -8]);
  const centerY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -6]);
  const sideY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -4]);
  const floatY = reduce ? 0 : [0, -10, 0];

  // Precisely position wave BELOW headline using real layout
  useLayoutEffect(() => {
    function positionWave() {
      const hero = heroRef.current;
      const title = titleWrapRef.current;
      if (!hero || !title) return;

      const heroRect = hero.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();

      const heroTop = window.scrollY + heroRect.top;
      const titleBottom = window.scrollY + titleRect.bottom;

      const withinHeroY = titleBottom - heroTop;
      const GAP = 28; // distance from headline to wave (px). Tweak to taste.
      setWaveTop(Math.max(0, Math.round(withinHeroY + GAP)));
    }

    positionWave();

    // React to headline size changes & viewport changes
    const ro = new ResizeObserver(positionWave);
    if (titleWrapRef.current) ro.observe(titleWrapRef.current);
    window.addEventListener("resize", positionWave);

    // Re-run after fonts load (headings change height)
    if ((document as any).fonts?.ready) {
      (document as any).fonts.ready.then(positionWave).catch(() => {});
    }

    return () => {
      window.removeEventListener("resize", positionWave);
      ro.disconnect();
    };
  }, []);

  return (
    <section
      ref={(el) => (heroRef.current = el)}
      className="relative min-h-[100svh] md:h-screen overflow-hidden bg-[#F5EFFF]"
    >
      {/* HEADLINE we measure */}
      <div
        ref={titleWrapRef}
        className="relative z-[2] mx-auto max-w-6xl px-4 pt-24 md:pt-28 text-center"
      >
        <motion.p
          style={{ y: titleY }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[38px] sm:text-[44px] md:text-[54px] tracking-[0.06em] text-[var(--purple)] inline-block border-b border-[var(--purple)]/40 pt-4"
        >
          RevelationML
        </motion.p>

        <motion.h1
          style={{ y: titleY }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className="mt-4 font-display text-[42px] sm:text-[56px] md:text-[78px] font-semibold leading-[1.05] text-[var(--purple)]"
        >
          Unlocking Value
          <br />
          Through AI Integration
        </motion.h1>
      </div>

      {/* WAVE — single image, positioned precisely under headline */}
      <div
        className="pointer-events-none absolute left-1/2 z-[1] -translate-x-1/2"
        style={{
          top: waveTop,
          width: "min(2000px, 170vw)",     // full-bleed without over-stretch
          aspectRatio: "2000 / 560",       // keep the original curve ratio of your asset
        }}
      >
        <div className="relative h-full w-full">
          <Image
            src="/images/hero-waves.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* ICONS (same positions) */}
      <div className="relative z-[2] mx-auto mt-6 max-w-6xl px-4">
        <div className="relative mx-auto h-[360px] w-full max-w-[980px] md:h-[520px]">
          {/* center */}
          <motion.div
            style={{ y: centerY }}
            className="absolute left-1/2 top-[52px] -translate-x-1/2 md:top-[64px]"
            animate={reduce ? undefined : { y: floatY }}
            transition={
              reduce ? undefined : { duration: 4.2, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <div className="relative h-[210px] w-[210px] sm:h-[260px] sm:w-[260px] md:h-[360px] md:w-[360px]">
              <Image
                src="/images/hero-center.png"
                alt="Center"
                fill
                priority
                className="object-contain"
              />
            </div>
          </motion.div>

          {/* left */}
          <motion.div
            style={{ y: sideY }}
            className="absolute left-0 top-[160px] md:left-[40px] md:top-[230px]"
          >
            <div className="relative h-[120px] w-[120px] sm:h-[150px] sm:w-[150px] md:h-[190px] md:w-[190px]">
              <Image
                src="/images/hero-left.png"
                alt="Left"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>

          {/* right */}
          <motion.div
            style={{ y: sideY }}
            className="absolute right-0 top-[160px] md:right-[40px] md:top-[230px]"
          >
            <div className="relative h-[120px] w-[120px] sm:h-[150px] sm:w-[150px] md:h-[190px] md:w-[190px]">
              <Image
                src="/images/hero-right.png"
                alt="Right"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>

          {/* arrow */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <button
              type="button"
              onClick={onNext}
              className="grid h-12 w-12 place-items-center rounded-full bg-white/70 shadow-sm backdrop-blur transition hover:bg-white/85 active:translate-y-[1px]"
              aria-label="Next section"
            >
              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                className="text-[var(--purple)]"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
