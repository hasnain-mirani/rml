"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type CtaCard = {
  id: string;
  title: string;
  desc: string;
  image: string;
  href?: string;
};

const cards: CtaCard[] = [
  {
    id: "blog",
    title: "Blog",
    desc: "Latest trends. Breakthrough findings. Practical tips. Fuel your next move with our fresh perspectives on everything AI.",
    image: "/images/cta-blog.png",
    href: "/resources",
  },
  {
    id: "podcast",
    title: "Podcast",
    desc: "Tune in for candid conversations and fresh perspectives with AI pioneers, industry disruptors, and our own in-house experts.",
    image: "/images/cta-podcast.png",
    href: "/resources",
  },
  {
    id: "portfolio",
    title: "Portfolio",
    desc: "Explore real outcomes, measurable results, and practical case studies that show what production-grade AI looks like.",
    image: "/images/cta-portfolio.png",
    href: "/portfolio",
  },
];

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

      {/* ambient rings */}
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

          <div className="relative px-6 py-10 md:px-10 md:py-14">
            {/* heading */}
            <div className="text-center">
           
            </div>

            {/* ✅ Glass cards */}
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {cards.map((c) => {
                const Card = (
                  <motion.article
                    whileHover={reduce ? undefined : { y: -6 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                      "group relative overflow-hidden rounded-[22px]",
                      "border border-white/22",
                      "bg-white/14 backdrop-blur-xl",
                      "shadow-[0_22px_70px_rgba(0,0,0,0.22)]"
                    )}
                  >
                    {/* glossy highlight */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_260px_at_30%_10%,rgba(255,255,255,0.26),transparent_70%)]" />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/20" />

                    {/* image (CENTER aligned) */}
                    <div className="relative grid place-items-center px-6 pt-8">
                      <div className="relative h-[150px] w-[230px] md:h-[160px] md:w-[240px]">
                        <Image
                          src={c.image}
                          alt={c.title}
                          fill
                          className="object-contain object-center"
                          sizes="240px"
                        />
                      </div>
                    </div>

                    {/* content */}
                    <div className="relative px-6 pb-7 pt-6">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-display text-2xl font-semibold text-white">
                          {c.title}
                        </h4>

                        {/* view pill */}
                        <div
                          className={cn(
                            "inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-medium",
                            "border border-white/25 bg-white/10 text-white/90",
                            "transition group-hover:bg-white/15"
                          )}
                        >
                          View
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-relaxed text-white/75">
                        {c.desc}
                      </p>
                    </div>

                    {/* soft bottom shading */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,rgba(0,0,0,0.25),transparent)]" />
                  </motion.article>
                );

                return c.href ? (
                  <Link key={c.id} href={c.href} className="block">
                    {Card}
                  </Link>
                ) : (
                  <div key={c.id}>{Card}</div>
                );
              })}
            </div>

           
          </div>
        </motion.div>
      </div>
    </section>
  );
}
