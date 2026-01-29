"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const content = {
  eyebrow: "OUR APPROACH",
  title: "We build AI like a technical co-founder",
  description:
    "We partner with ambitious teams to design, engineer, and scale research-grade AI systems that actually work in production — not demos.",
  highlights: [
    {
      title: "Design",
      body: "We translate business problems into clear technical architectures and AI strategies.",
    },
    {
      title: "Develop",
      body: "Production-ready systems, not notebooks. Built for reliability, cost, and scale.",
    },
    {
      title: "Scale",
      body: "Long-term support, infrastructure optimization, and governance as you grow.",
    },
  ],
};

export default function ProcessSection() {
  const reduce = useReducedMotion();

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-white">
      {/* Background (premium but clean) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(111,42,167,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_20%_55%,rgba(0,0,0,0.06),transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.0)_0%,rgba(255,255,255,0.7)_55%,rgba(255,255,255,1)_100%)]" />
      </div>

      {/* subtle animated light sweep */}
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-1/3 top-[-20%] h-[140%] w-1/3 rotate-12 bg-black/5 blur-2xl"
          animate={{ x: ["-35%", "420%"] }}
          transition={{ duration: 7, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
        />
      )}

      {/* Content */}
      <div className="relative mx-auto flex h-full max-w-6xl items-center px-4">
        <div className="grid w-full items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.75, ease }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-[11px] font-medium tracking-[0.22em] text-black/60 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[var(--purple)]/60" />
              {content.eyebrow}
            </div>

            <h2 className="mt-6 font-display text-[40px] font-semibold leading-[1.05] text-black md:text-[54px]">
              {content.title}
            </h2>

            <p className="mt-5 max-w-[520px] text-[15px] leading-relaxed text-black/60 md:text-[16px]">
              {content.description}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button
                className={cn(
                  "h-11 rounded-full px-8",
                  "bg-[#6F2AA7] text-white",
                  "shadow-[0_16px_48px_rgba(111,42,167,0.28)]",
                  "transition hover:opacity-95 active:translate-y-[1px]"
                )}
              >
                Learn how we work
              </Button>

              <div className="text-xs text-black/45">
                Built for production, not prototypes.
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: 0.75, ease, delay: 0.08 }}
            className="grid gap-4"
          >
            {content.highlights.map((item, idx) => (
              <motion.div
                key={item.title}
                whileHover={reduce ? undefined : { y: -4 }}
                transition={{ duration: 0.25, ease }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl",
                  "border border-black/10 bg-white/70 backdrop-blur",
                  "shadow-[0_18px_50px_rgba(0,0,0,0.08)]"
                )}
              >
                {/* left accent bar */}
                <div className="absolute left-0 top-0 h-full w-[3px] bg-[#6F2AA7]/50" />

                {/* soft glow */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-[radial-gradient(700px_200px_at_20%_50%,rgba(111,42,167,0.12),transparent_60%)]" />
                </div>

                <div className="relative flex gap-4 px-6 py-6">
                  <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold text-[#6F2AA7]">
                    {String(idx + 1).padStart(2, "0")}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-black">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-black/60">
                      {item.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* small footer card */}
            <div className="mt-2 rounded-2xl border border-black/10 bg-white/60 px-6 py-5 text-sm text-black/60 shadow-sm backdrop-blur">
              <span className="font-medium text-black">Outcome-first.</span> Clear milestones,
              measurable delivery, and a system that holds up under real users.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
