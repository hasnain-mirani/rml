"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

import ProcessSection from "./ProcessSection";
import FeaturesSection from "./FeaturesSection";
import SuccessStoriesSection from "./SuccessStoriesSection";
import CTASection from "./CTASection";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

/**
 * ✅ FIXED: no blank bg on slide 2 + more "Goonies" feel
 * - Hard background layer per slide (prevents flash / blank area)
 * - Wheel paging (story feel)
 * - Cinematic overlay transition
 * - Dots + progress bar
 * - Hero with richer layered motion + floating chips + arrow restored
 */

type SectionDef = { id: string; node: React.ReactNode; bg: string };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function FullpageHome() {
  const sections: SectionDef[] = useMemo(
    () => [
      { id: "hero", node: <HeroSlide />, bg: "bg-[var(--bg-soft)]" },
      { id: "process", node: <ProcessSection  />, bg: "bg-[var(--purple)]" },
      { id: "features", node: <FeaturesSection />, bg: "bg-white" },
      { id: "stories", node: <SuccessStoriesSection />, bg: "bg-white" },
      { id: "cta", node: <CTASection />, bg: "bg-white" },
      { id: "footer", node: <Footer />, bg: "bg-white" },
    ],
    []
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

  // sync active on manual scroll (trackpad)
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

  // ✅ Wheel paging (Webflow/story feel)
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
      if (dy < 0) next();
      else prev();
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
                    isOn ? "bg-[var(--purple)] scale-110" : "bg-black/20 hover:bg-black/30"
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
          "h-screen w-full overflow-y-auto",
          "scroll-smooth overscroll-none",
          "bg-[var(--bg-soft)]"
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
              className="relative h-screen w-full overflow-hidden"
              style={{ minHeight: "100vh" }}
            >
              {/* ✅ HARD background per slide (fixes blank bg on slide 2) */}
              <div className={cn("absolute inset-0 -z-10", s.bg)} />

              {/* transition overlay */}
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

              {/* ✅ hard seal */}
              <div className={cn("pointer-events-none absolute bottom-0 left-0 right-0 h-[2px]", s.bg)} />
            </div>
          );
        })}
      </div>
    </>
  );
}

/* =========================
   HERO SLIDE — animated elements like ref
   ========================= */

function HeroSlide({ onNext }: { onNext?: () => void }) {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const wavesY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);
  const centerY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -75]);
  const sideY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -55]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -18]);

  return (
    <section
      ref={(el) => (heroRef.current = el)}
      className="relative h-screen w-full overflow-hidden bg-[var(--bg-soft)]"
    >
      {/* cinematic background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1000px_520px_at_50%_0%,rgba(111,42,167,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_20%_45%,rgba(0,0,0,0.06),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.05)_55%,rgba(0,0,0,0.10)_100%)]" />
      </div>

      {/* subtle moving lights (ref vibe) */}
      {!reduce && (
        <>
          <motion.div
            className="pointer-events-none absolute -left-28 top-24 h-[420px] w-[420px] rounded-full bg-[var(--purple)]/10 blur-3xl"
            animate={{ x: [0, 24, 0], y: [0, 18, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute -right-40 top-40 h-[520px] w-[520px] rounded-full bg-black/10 blur-3xl"
            animate={{ x: [0, -20, 0], y: [0, -16, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {/* TEXT */}
      <div className="mx-auto max-w-6xl px-4 pt-20 md:pt-24">
        <div className="text-center">
          <motion.p
            style={{ y: titleY }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display mt-8 text-[22px] tracking-wide text-[var(--purple)] md:text-[32px]"
          >
            RevelationML
          </motion.p>

          <motion.h1
            style={{ y: titleY }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="mt-5 font-display text-[40px] font-semibold leading-[1.10] text-[var(--purple)] md:text-[68px]"
          >
            Unlocking Value <br className="hidden md:block" />
            Through AI Integration
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
            className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-black/55 md:text-base"
          >
            Design, deploy, and scale production-grade AI systems — with clarity, speed, and durable outcomes.
          </motion.p>
        </div>
      </div>

      {/* VISUAL */}
      <div className="relative mt-10">
        <motion.div
          style={{ y: wavesY }}
          className="pointer-events-none absolute inset-x-0 top-0 h-[360px] md:h-[520px]"
        >
          <Image
            src="/images/hero-waves.png"
            alt="Wave background"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </motion.div>

        {/* floating chips */}
        {!reduce && (
          <>
            <motion.div
              className="pointer-events-none absolute left-[8%] top-[40px] hidden md:block"
              animate={{ y: [0, -10, 0], rotate: [0, -2, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs text-black/60 shadow-sm backdrop-blur">
                Model evaluation
              </div>
            </motion.div>

            <motion.div
              className="pointer-events-none absolute right-[10%] top-[95px] hidden md:block"
              animate={{ y: [0, 10, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs text-black/60 shadow-sm backdrop-blur">
                Production deployment
              </div>
            </motion.div>
          </>
        )}

        <div className="relative mx-auto max-w-6xl px-4">
          <div className="relative h-[360px] md:h-[520px]">
            {/* Center */}
            <motion.div
              style={{ y: centerY }}
              className="absolute left-1/2 top-[70px] -translate-x-1/2 md:top-[60px]"
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={
                reduce
                  ? undefined
                  : { duration: 4.4, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <div className="relative h-[240px] w-[240px] md:h-[390px] md:w-[390px]">
                <Image
                  src="/images/hero-center.png"
                  alt="Hero center"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </motion.div>

            {/* Left */}
            <motion.div
              style={{ y: sideY }}
              className="absolute left-[10px] top-[185px] hidden md:block"
            >
              <div className="relative h-[240px] w-[240px]">
                <Image
                  src="/images/hero-left.png"
                  alt="Hero left"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>

            {/* Right */}
            <motion.div
              style={{ y: sideY }}
              className="absolute right-[10px] top-[185px] hidden md:block"
            >
              <div className="relative h-[240px] w-[240px]">
                <Image
                  src="/images/hero-right.png"
                  alt="Hero right"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>

            {/* Mobile */}
            <motion.div
              style={{ y: sideY }}
              className="absolute left-4 top-[240px] md:hidden"
            >
              <div className="relative h-[120px] w-[120px]">
                <Image src="/images/hero-left.png" alt="Hero left" fill className="object-contain" />
              </div>
            </motion.div>

            <motion.div
              style={{ y: sideY }}
              className="absolute right-4 top-[240px] md:hidden"
            >
              <div className="relative h-[120px] w-[120px]">
                <Image src="/images/hero-right.png" alt="Hero right" fill className="object-contain" />
              </div>
            </motion.div>

            {/* ✅ ARROW (restored) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <button
                type="button"
                onClick={onNext}
                className="group grid h-12 w-12 place-items-center rounded-full border border-black/10 bg-white/70 shadow-sm backdrop-blur transition hover:bg-white/85 active:translate-y-[1px]"
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

              <div className="mt-3 text-center text-[11px] tracking-wide text-black/40">
                Scroll
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* hard seal */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--bg-soft)]" />
    </section>
  );
}
