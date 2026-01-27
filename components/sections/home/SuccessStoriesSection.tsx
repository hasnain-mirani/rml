"use client";

import Image from "next/image";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

type Story = {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  quote: string;
};

const stories: Story[] = [
  {
    id: "1",
    name: "John Smith",
    avatar: "/images/avatar1.png", // replace or remove
    quote:
      "This HR management platform has been a game-changer for our organization. Before we switched, our HR processes were fragmented and time-consuming. Performance management is seamlessly integrated.",
  },
  {
    id: "2",
    name: "Mike Josaf",
    avatar: "/images/avatar2.png",
    quote:
      "This HR management platform has been a game-changer for our organization. Before we switched, our HR processes were fragmented and time-consuming. Performance management is seamlessly integrated.",
  },
  {
    id: "3",
    name: "John Fulton",
    avatar: "/images/avatar3.png",
    quote:
      "This HR management platform has been a game-changer for our organization. Before we switched, our HR processes were fragmented and time-consuming. Performance management is seamlessly integrated.",
  },
];

function StoryCard({ s }: { s: Story }) {
  return (
    <article
      className={cn(
        "relative w-[340px] shrink-0 rounded-[18px] bg-white",
        "px-6 py-6 shadow-[0_14px_28px_rgba(0,0,0,0.18)]"
      )}
    >
      {/* close icon bubble (as in figma) */}
      <div className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-[#F2E8FF] shadow-[0_10px_20px_rgba(0,0,0,0.14)]">
        <span className="text-[18px] leading-none text-[#D6B000]">×</span>
      </div>

      {/* header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 overflow-hidden rounded-full bg-[#F2E8FF]">
          {s.avatar ? (
            <Image
              src={s.avatar}
              alt={s.name}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-[#7F289A]">
            {s.name}
          </p>
          <div className="mt-1 h-px w-[120px] bg-black/10" />
        </div>
      </div>

      {/* quote */}
      <p className="mt-5 text-[18px] leading-[1.15] text-[#7F289A]">
        <span className="mr-2 align-top text-[26px] leading-none">“</span>
        {s.quote}
        <span className="ml-1 align-bottom text-[26px] leading-none">”</span>
      </p>
    </article>
  );
}

/**
 * SuccessStoriesSection
 * - auto scrolls to LEFT
 * - pauses on hover
 */
export default function SuccessStoriesSection() {
  const loop = useMemo(() => [...stories, ...stories], []);

  return (
    <section className="w-full bg-[#D8B9FF]">
      <div className="mx-auto max-w-6xl px-4 py-14">
        {/* Heading */}
        <div className="text-center">
          <h2 className="font-display text-[34px] font-semibold text-black md:text-[40px]">
            Success Stories &amp; Real Results
          </h2>
          <p className="mt-3 text-[16px] font-semibold text-[#6F2AA7] md:text-[18px]">
            See What Our Clients Say and Discover Our Impactful Work
          </p>
        </div>

        {/* Marquee */}
        <div className="mt-10">
          {/* viewport */}
          <div
            className={cn(
              "group relative overflow-hidden",
              "py-4"
            )}
          >
            {/* fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#D8B9FF] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#D8B9FF] to-transparent" />

            {/* track */}
            <div
              className={cn(
                "flex w-max gap-10",
                "animate-[marquee-left_18s_linear_infinite]",
                "group-hover:[animation-play-state:paused]"
              )}
            >
              {loop.map((s, idx) => (
                <StoryCard key={`${s.id}-${idx}`} s={s} />
              ))}
            </div>
          </div>
        </div>

        {/* keyframes */}
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
