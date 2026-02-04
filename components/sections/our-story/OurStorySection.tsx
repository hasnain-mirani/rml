"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import VideoCard from "./VideoCard";

type Pillar = {
  id: string;
  title: string;
  body: string;
  image: string;
  align: "left" | "right";
};

const pillars: Pillar[] = [
  {
    id: "domain",
    title: "Domain-Specific Innovation",
    body: "We partner with doctors, lawyers, operators, and industry veterans to identify high-value problems where insight is more important than raw data.",
    image: "/images/pillar-ai.png",
    align: "left",
  },
  {
    id: "stewardship",
    title: "Technical Stewardship",
    body: "We own the engineering decisions that matter such as model strategy, infrastructure, evaluation, cost curves, and system reliability so you don’t inherit technical failures during your growth.",
    image: "/images/pillar-gear.png",
    align: "right",
  },
  {
    id: "delivery",
    title: "Production Delivery",
    body: "We ship systems that work in the real world—monitoring, governance, and iteration loops included—so you can scale with confidence.",
    image: "/images/pillar-rocket.png",
    align: "left",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function OurStoryPage() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-18, 18]);

  return (
    <main ref={sectionRef} className="relative min-h-screen bg-[#F5EFFF]">
      {/* Background waves / glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-[-240px] h-[520px] bg-[radial-gradient(900px_420px_at_50%_50%,rgba(111,42,167,0.22),transparent_65%)]" />
        <motion.div style={{ y: bgY }} className="absolute inset-0 opacity-[0.14]">
          <Image
            src="/images/hero-waves.png"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </motion.div>
      </div>

      {/* ✅ Layout container */}
      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 md:pt-20">
        {/* ✅ Back button (top-left, aligned) */}
        <div className="flex items-center justify-start">
          <Link
            href="/"
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2",
              "bg-white/50 backdrop-blur-md",
              "border border-white/40 shadow-sm",
              "text-sm font-medium text-[var(--purple)]",
              "transition hover:bg-white/70 active:translate-y-[1px]"
            )}
          >
            <span className="text-base">←</span>
            Back to Home Page
          </Link>
        </div>

        {/* ✅ Video card centered */}
        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-[780px]">
            <VideoCard videoUrl={""} />
          </div>
        </div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.75, ease }}
          className="mt-14 text-center font-display text-[34px] font-semibold leading-[1.05] text-[var(--purple)] sm:text-[40px] md:text-[52px]"
        >
          The Pillars Of our <br className="hidden md:block" />
          Model
        </motion.h2>

        {/* Cards */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          variants={{
            hidden: {},
            show: {
              transition: reduce
                ? undefined
                : { staggerChildren: 0.14, delayChildren: 0.06 },
            },
          }}
          className="mx-auto mt-8 sm:mt-10 grid max-w-[1200px] gap-6 sm:gap-8 md:gap-10"
        >
          {pillars.map((p) => (
            <PillarCard key={p.id} pillar={p} />
          ))}
        </motion.div>
      </div>
    </main>
  );
}

function PillarCard({ pillar }: { pillar: Pillar }) {
  const reduce = useReducedMotion();
  const isLeft = pillar.align === "left";
  const cardRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const floatY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [10, -10]);
  const floatX = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : isLeft ? [-6, 6] : [6, -6]
  );

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : 22 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
      }}
      className={cn("w-full", "md:flex", isLeft ? "md:justify-start" : "md:justify-end")}
    >
      <motion.article
        ref={cardRef}
        style={{ y: floatY, x: floatX }}
        whileHover={reduce ? undefined : { y: -6 }}
        className={cn(
          "relative overflow-hidden rounded-[22px]",
          "border border-black/10 bg-[#D9B8FF]",
          "shadow-[0_22px_80px_rgba(20,10,30,0.22)]",
          "transition-transform duration-300",
          "w-full md:w-[920px]"
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_240px_at_50%_10%,rgba(255,255,255,0.32),transparent_72%)]" />

        {/* desktop image box */}
        <div
          className={cn(
            "absolute top-1/2 z-10 -translate-y-1/2",
            "hidden md:block",
            isLeft ? "left-0" : "right-0"
          )}
        >
          <div
            className={cn(
              "relative h-[130px] w-[180px] rounded-[18px]",
              "bg-white/30 backdrop-blur-md",
              "ring-1 ring-white/40",
              "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),0_18px_55px_rgba(17,6,28,0.18)]"
            )}
          >
            <div className="pointer-events-none absolute inset-0 rounded-[18px] bg-[radial-gradient(220px_140px_at_40%_20%,rgba(255,255,255,0.55),transparent_70%)]" />
            <div className="relative h-full w-full p-3">
              <div className="relative h-full w-full">
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  fill
                  className="object-contain"
                  sizes="180px"
                />
              </div>
            </div>
          </div>
        </div>

        {/* content */}
        <div
          className={cn(
            "relative px-5 py-8 sm:px-7 sm:py-10 md:px-12 md:py-12",
            isLeft ? "md:pl-[260px] md:pr-[90px]" : "md:pr-[260px] md:pl-[90px]"
          )}
        >
          <h3 className="text-center font-display text-[20px] font-semibold text-[var(--purple)] sm:text-[22px] md:text-[24px]">
            {pillar.title}
          </h3>
          <p className="mx-auto mt-3 sm:mt-4 max-w-[740px] text-center text-[13px] leading-relaxed text-[var(--purple)]/80 sm:text-[14px]">
            {pillar.body}
          </p>

          {/* mobile image */}
          <div className="mt-5 flex justify-center md:hidden">
            <div
              className={cn(
                "relative h-[118px] w-[168px] sm:h-[128px] sm:w-[180px]",
                "rounded-[18px]",
                "bg-white/30 backdrop-blur-md",
                "ring-1 ring-white/40",
                "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.32),0_18px_55px_rgba(17,6,28,0.16)]"
              )}
            >
              <div className="pointer-events-none absolute inset-0 rounded-[18px] bg-[radial-gradient(220px_140px_at_40%_20%,rgba(255,255,255,0.55),transparent_70%)]" />
              <div className="relative h-full w-full p-3">
                <div className="relative h-full w-full">
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    className="object-contain"
                    sizes="180px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(to_top,rgba(69,18,103,0.09),transparent)]" />
      </motion.article>
    </motion.div>
  );
}
