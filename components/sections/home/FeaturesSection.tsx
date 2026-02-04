"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";

type PanelKey = "scale" | "innovate" | null;

const content = {
  scale: {
    eyebrow: "For teams ready to grow",
    title: "Scale with Us",
    desc: "Go from prototype → production. Build resilient systems, ship faster, and keep costs predictable.",
    points: [
      "Production-grade AI architecture",
      "Infrastructure & deployment optimization",
      "Evaluation, monitoring & governance",
      "Long-term engineering partnership",
    ],
    cta: "Scale Up Your Product",
  },
  innovate: {
    eyebrow: "For founders & domain experts",
    title: "Innovate with Us",
    desc: "Bring the problem. We co-design the solution with research-grade engineering and rapid iteration.",
    points: [
      "Problem framing & AI feasibility",
      "Rapid prototyping & validation",
      "System design + data strategy",
      "Launch support & iteration loop",
    ],
    cta: "Become a Co-Founder",
  },
};

export default function FeaturesSection() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<PanelKey>(null);

  const isScale = open === "scale";
  const isInnovate = open === "innovate";

  const handlers = useMemo(
    () => ({
      onScaleClick: () => setOpen((p) => (p === "scale" ? null : "scale")),
      onInnovateClick: () =>
        setOpen((p) => (p === "innovate" ? null : "innovate")),
    }),
    []
  );

  return (
    <section className="relative w-full bg-white">
      {/* soft background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_30%_10%,rgba(111,42,167,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_70%_40%,rgba(0,0,0,0.06),transparent_60%)]" />
      </div>

      {/* ⛔ height unchanged (same container) */}
      <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-20">
        {/* ✅ heading centered + bigger (ONLY section heading changed) */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium tracking-[0.22em] text-black/55">
            PATHS WE OFFER
          </p>

          <h2 className="mt-4 font-display font-semibold tracking-tight text-black text-[44px] leading-[1.05] md:text-[64px]">
            Choose the way you want to build
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-black/60 md:text-base">
            Two engagement modes — both designed to deliver real outcomes with
            clear milestones.
          </p>
        </div>

        {/* main card */}
        <div className="relative mt-10 overflow-hidden rounded-3xl border border-black/10 bg-white/70 shadow-[0_25px_80px_rgba(0,0,0,0.10)] backdrop-blur-xl">
          {/* top sheen */}
          {!reduce && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 rotate-12 bg-black/5 blur-2xl"
              animate={{ x: ["-25%", "420%"] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatDelay: 2.5,
                ease: "easeInOut",
              }}
            />
          )}

          {/* ✅ content vertically centered (NO height change) */}
          <div className="grid min-h-[520px] grid-cols-1 md:grid-cols-2">
            {/* SCALE */}
            <div
              className={cn(
                "group relative text-left",
                "p-8 md:p-10",
                "flex items-center", // ✅ center inside column
                "transition-opacity duration-200",
                open && !isScale ? "opacity-60" : "opacity-100"
              )}
            >
              {/* gradient panel */}
              <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_40%_20%,rgba(111,42,167,0.18),transparent_60%)]" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#F6EEFF] via-white to-white" />

              <div className="relative w-full">
                <p className="text-xs font-medium tracking-[0.18em] text-[#6F2AA7]/70">
                  {content.scale.eyebrow}
                </p>

                {/* ⛔ untouched: only section heading requested */}
                <h3 className="mt-3 font-display text-3xl font-semibold leading-[1.1] text-[#6F2AA7] md:text-4xl">
                  {content.scale.title}
                </h3>

                <p className="mt-4 max-w-[420px] text-sm leading-relaxed text-black/60 md:text-base">
                  {content.scale.desc}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Tag tone="purple">Architecture</Tag>
                  <Tag tone="purple">Deployment</Tag>
                  <Tag tone="purple">Reliability</Tag>
                </div>

                <div className="mt-10">
                  <button
                    type="button"
                    onClick={handlers.onScaleClick}
                    className={cn(
                      "inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium",
                      "border border-[#6F2AA7]/20 bg-white/70 text-[#6F2AA7] shadow-sm backdrop-blur",
                      "transition hover:bg-white active:translate-y-[1px]"
                    )}
                  >
                    {isScale ? "Hide details" : "View details"}
                  </button>
                </div>
              </div>
            </div>

            {/* INNOVATE */}
            <div
              className={cn(
                "group relative text-left",
                "p-8 md:p-10",
                "flex items-center", // ✅ center inside column
                "transition-opacity duration-200",
                open && !isInnovate ? "opacity-60" : "opacity-100"
              )}
            >
              <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_60%_30%,rgba(0,0,0,0.12),transparent_60%)]" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#F7F7F7] via-white to-white" />

              <div className="relative w-full">
                <p className="text-xs font-medium tracking-[0.18em] text-black/55">
                  {content.innovate.eyebrow}
                </p>

                {/* ⛔ untouched */}
                <h3 className="mt-3 font-display text-3xl font-semibold leading-[1.1] text-black md:text-4xl">
                  {content.innovate.title}
                </h3>

                <p className="mt-4 max-w-[420px] text-sm leading-relaxed text-black/60 md:text-base">
                  {content.innovate.desc}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Tag tone="dark">Discovery</Tag>
                  <Tag tone="dark">Prototype</Tag>
                  <Tag tone="dark">Launch</Tag>
                </div>

                <div className="mt-10">
                  <button
                    type="button"
                    onClick={handlers.onInnovateClick}
                    className={cn(
                      "inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium",
                      "border border-black/10 bg-white/70 text-black shadow-sm backdrop-blur",
                      "transition hover:bg-white active:translate-y-[1px]"
                    )}
                  >
                    {isInnovate ? "Hide details" : "View details"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* overlay details drawer */}
          <AnimatePresence>
            {open && (
              <motion.div
                key="drawer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.18 }}
                className="pointer-events-none absolute inset-0"
              >
                <div className="absolute inset-0 bg-black/6" />

                <motion.div
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 18, scale: 0.98 }}
                  transition={{
                    duration: reduce ? 0 : 0.22,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={cn(
                    "pointer-events-auto absolute left-4 right-4 top-1/2 -translate-y-1/2",
                    "mx-auto max-w-3xl",
                    "rounded-3xl border border-black/10 bg-white/80 backdrop-blur-xl",
                    "shadow-[0_30px_90px_rgba(0,0,0,0.18)]"
                  )}
                >
                  <div className="p-6 md:p-8">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <p
                          className={cn(
                            "text-xs font-medium tracking-[0.22em]",
                            open === "scale"
                              ? "text-[#6F2AA7]/80"
                              : "text-black/60"
                          )}
                        >
                          DETAILS
                        </p>
                        <h4
                          className={cn(
                            "mt-2 font-display text-2xl font-semibold md:text-3xl",
                            open === "scale"
                              ? "text-[#6F2AA7]"
                              : "text-black"
                          )}
                        >
                          {open === "scale"
                            ? content.scale.title
                            : content.innovate.title}
                        </h4>
                        <p className="mt-3 text-sm leading-relaxed text-black/60 md:text-base">
                          {open === "scale"
                            ? content.scale.desc
                            : content.innovate.desc}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setOpen(null)}
                        className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-sm text-black/70 shadow-sm backdrop-blur transition hover:bg-white"
                        aria-label="Close details"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="mt-6 grid gap-3 md:grid-cols-2">
                      {(open === "scale"
                        ? content.scale.points
                        : content.innovate.points
                      ).map((t) => (
                        <div
                          key={t}
                          className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm text-black/70"
                        >
                          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-black/20" />
                          {t}
                        </div>
                      ))}
                    </div>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-xs text-black/50">
                        Click “View details” on either side.
                      </div>

                      <button
                        type="button"
                        className={cn(
                          "inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium",
                          open === "scale"
                            ? "bg-[#6F2AA7] text-white shadow-[0_18px_45px_rgba(111,42,167,0.30)] hover:opacity-95"
                            : "bg-black text-white shadow-[0_18px_45px_rgba(0,0,0,0.22)] hover:opacity-95",
                          "transition active:translate-y-[1px]"
                        )}
                      >
                        <Link
                          href={open === "scale" ? "/services" : "/services"}
                          className="inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium"
                        >
                          {open === "scale" ? content.scale.cta : content.innovate.cta}
                        </Link>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/10" />
        </div>
      </div>
    </section>
  );
}

function Tag({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "purple" | "dark";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide",
        tone === "purple"
          ? "border-[#6F2AA7]/20 bg-[#6F2AA7]/10 text-[#6F2AA7]"
          : "border-black/10 bg-black/5 text-black/70"
      )}
    >
      {children}
    </span>
  );
}
