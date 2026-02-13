"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Story = {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  quote: string;
};

function StoryCard({ s }: { s: Story }) {
  return (
    <article
      className={cn(
        "relative w-[360px] shrink-0 overflow-hidden rounded-3xl",
        "border border-black/10 bg-white/70 backdrop-blur-xl",
        "shadow-[0_22px_70px_rgba(0,0,0,0.12)]"
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_220px_at_25%_20%,rgba(111,42,167,0.10),transparent_60%)]" />

      <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/80 shadow-[0_10px_24px_rgba(0,0,0,0.10)] backdrop-blur">
        <span className="text-[18px] leading-none text-black/50">×</span>
      </div>

      <div className="relative px-6 py-7">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 overflow-hidden rounded-full border border-black/10 bg-[#F2E8FF]">
            {s.avatar ? (
              <Image
                src={s.avatar}
                alt={s.name}
                width={44}
                height={44}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>

          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-black">
              {s.name}
            </p>
            <div className="mt-1 h-px w-[140px] bg-black/10" />
          </div>
        </div>

        <p className="mt-5 text-[16px] leading-relaxed text-black/70">
          <span className="mr-2 align-top text-[22px] leading-none text-[#6F2AA7]">
            “
          </span>
          {s.quote}
          <span className="ml-1 align-bottom text-[22px] leading-none text-[#6F2AA7]">
            ”
          </span>
        </p>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-xs tracking-wide text-black/45">
            Verified client
          </div>
          <div className="h-8 w-8 rounded-full bg-[#6F2AA7]/10" />
        </div>
      </div>
    </article>
  );
}

export default function SuccessStoriesSection() {
  const reduce = useReducedMotion();
  const [stories, setStories] = useState<Story[]>([]);

  // fetch testimonials
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/testimonials?published=1", {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to load testimonials");
        const data = await res.json();

        const mapped: Story[] = (data.items || []).map((t: any) => ({
          id: String(t._id || t.id || Math.random()),
          name: t.name,
          avatar: t.image || "",
          quote: t.text,
        }));

        setStories(mapped);
      } catch (err) {
        console.error("Testimonials load error:", err);
      }
    }

    load();
  }, []);

  const loop = useMemo(() => [...stories, ...stories], [stories]);

  if (stories.length === 0) return null;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#ebe5f1]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_600px_at_50%_10%,rgba(255,255,255,0.22),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_90%,rgba(0,0,0,0.12),transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.06),rgba(0,0,0,0)_40%,rgba(0,0,0,0.08))]" />
      </div>

      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-4 py-14">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <p className="text-xs font-medium tracking-[0.22em] text-black/55">
            TESTIMONIALS
          </p>

          <h2 className="mt-4 font-display text-[34px] font-semibold text-black md:text-[44px]">
            Success Stories &amp; Real Results
          </h2>

          <p className="mt-3 text-[15px] font-medium text-[#6F2AA7] md:text-[18px]">
            See What Our Clients Say and Discover Our Impactful Work
          </p>
        </motion.div>

        <div className="mt-10">
          <div className={cn("group relative overflow-hidden py-6")}>
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#D8B9FF] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#D8B9FF] to-transparent" />

            <div
              className={cn(
                "flex w-max gap-8",
                reduce ? "" : "animate-[marquee-left_22s_linear_infinite]",
                "group-hover:[animation-play-state:paused]"
              )}
            >
              {loop.map((s, idx) => (
                <motion.div
                  key={`${s.id}-${idx}`}
                  whileHover={reduce ? undefined : { y: -6 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <StoryCard s={s} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs tracking-wide text-black/45">
          Hover to pause • Scroll to continue
        </div>

        <style jsx>{`
          @keyframes marquee-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </div>
    </section>
  );
}
