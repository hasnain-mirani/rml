"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CTASection() {
  const reduce = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#ddbffa]">
      {/* background depth */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_650px_at_50%_10%,rgba(255,255,255,0.14),rgba(0,0,0,0)_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_600px_at_50%_85%,rgba(0,0,0,0.35),rgba(0,0,0,0)_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.12),rgba(0,0,0,0.22))]" />
      </div>

      {/* ambient rings (cleaner than neon circles) */}
      {!reduce && (
        <>
          <motion.div
            className="pointer-events-none absolute -left-24 top-20 h-[520px] w-[520px] rounded-full border border-white/15 blur-[1px]"
            animate={{ rotate: [0, 25, 0], x: [0, 18, 0], y: [0, 10, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute -right-28 bottom-10 h-[620px] w-[620px] rounded-full border border-black/30 blur-[1px]"
            animate={{ rotate: [0, -22, 0], x: [0, -16, 0], y: [0, -10, 0] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <div className="relative mx-auto flex h-full max-w-6xl items-center px-4">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.8, ease }}
          className={cn(
            "relative w-full overflow-hidden rounded-[28px]",
            "border border-white/14 bg-black/55 backdrop-blur-xl",
            "shadow-[0_35px_120px_rgba(0,0,0,0.45)]"
          )}
        >
          {/* subtle top highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/25" />

          {/* soft inner glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_50%_20%,rgba(111,42,167,0.35),transparent_65%)]" />

          {/* sheen */}
          {!reduce && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 rotate-12 bg-white/10 blur-2xl"
              animate={{ x: ["-30%", "420%"] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatDelay: 2.8,
                ease: "easeInOut",
              }}
            />
          )}

          <div className="relative px-7 py-14 text-center md:px-12 md:py-20">
            <motion.p
              initial={{ opacity: 0, y: reduce ? 0 : 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.65, ease, delay: 0.05 }}
              className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-medium tracking-[0.22em] text-white/70"
            >
              READY WHEN YOU ARE
            </motion.p>

            <motion.h3
              initial={{ opacity: 0, y: reduce ? 0 : 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.75, ease, delay: 0.1 }}
              className="mt-6 font-display text-3xl font-semibold leading-tight text-white md:text-5xl"
            >
              Start transforming your <br className="hidden md:block" />
              workplace today with AI.
            </motion.h3>

            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.75, ease, delay: 0.18 }}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Button
                className={cn(
                  "h-11 rounded-full px-8",
                  "bg-white text-black",
                  "shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
                  "transition hover:opacity-95 active:translate-y-[1px]"
                )}
              >
                Get In Touch
              </Button>

              <Button
                variant="outline"
                className={cn(
                  "h-11 rounded-full px-8",
                  "border-white/20 bg-transparent text-white",
                  "hover:bg-white/10"
                )}
              >
                View Work
              </Button>
            </motion.div>

            <p className="mt-6 text-xs tracking-wide text-white/55">
              Clear milestones. Production outcomes. Long-term support.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
