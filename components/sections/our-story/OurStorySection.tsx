"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";



type Pillar = {
  title: string;
  desc: string;
  image: string; 
  side: "left" | "right";
};

const pillars: Pillar[] = [
  {
    title: "Domain-Specific Innovation",
    desc: "We partner with doctors, lawyers, operators, and industry veterans to identify high-value problems where insight is more important that raw data",
    image: "/images/pillar-domain.png",
    side: "left",
  },
  {
    title: "Technical Stewardship",
    desc: "We own the engineering decisions that matter such as model strategy, infrastructure, evaluation, cost curves, and system reliability so you don't inherit technical failures during your growth",
    image: "/images/pillar-technical.png",
    side: "right",
  },
  {
    title: "Skin in the Game",
    desc: "Our incentives are aligned. We earn through equity and OKR-linked outcomes. We succeed only when your venture succeeds.",
    image: "/images/pillar-skin.png",
    side: "left",
  },
  {
    title: "The Ubiquitous Ecosystem",
    desc: "Each venture strengthens the whole. Over time, our portfolio companies share infrastructure, insight, and distribution, creating a quiet but powerful AI foundation beneath everyday technology.",
    image: "/images/pillar-eco.png",
    side: "right",
  },
];

function PillarRow({ p }: { p: Pillar }) {
  const imgLeft = p.side === "left";

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[820px]",
        "rounded-[16px] bg-[#CDA8FF]/60",
        "shadow-[0_12px_26px_rgba(0,0,0,0.16)]",
        "border border-black/5",
        "overflow-hidden"
      )}
    >
      <div
        className={cn(
          "flex items-stretch",
          // desktop: image left/right
          imgLeft ? "flex-row" : "flex-row-reverse",
          // mobile: stack nicely but still combined
          "max-md:flex-col"
        )}
      >
        {/* IMAGE AREA (inside card) */}
        <div
          className={cn(
            "relative",
            "w-full md:w-[38%]",
            "min-h-[150px] md:min-h-[170px]",
            imgLeft ? "bg-transparent" : "bg-transparent"
          )}
        >
          <Image
            src={p.image}
            alt={p.title}
            fill
            priority={false}
            className={cn(
              "object-contain",
              // give padding like figma
              "p-4 md:p-5"
            )}
          />
        </div>

        {/* TEXT AREA (inside card) */}
        <div className="flex w-full md:w-[62%] items-center px-6 py-6 md:px-8 md:py-7">
          <div className={cn("w-full", imgLeft ? "text-left" : "text-left")}>
            <h4 className="font-display text-[18px] font-semibold text-[#7F289A] md:text-[20px]">
              {p.title}
            </h4>
            <p className="mt-3 text-[13px] leading-[1.35] text-[#7F289A]/75 md:text-[14px]">
              {p.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AboutUsSection() {
  return (
    <section className="w-full bg-[#F5EEFF]">
      <div className="mt-8 mx-auto max-w-6xl px-4 py-14 md:py-16">
        {/* ABOUT US */}
        <div className="text-center">
          <h2 className="font-display text-[44px] font-semibold text-[#7F289A] md:text-[56px]">
            About Us
          </h2>

          <div className="mx-auto mt-6 max-w-[760px] rounded-[12px] bg-white px-6 py-6 text-left shadow-[0_12px_26px_rgba(0,0,0,0.16)]">
            <p className="text-[13px] leading-[1.35] text-[#7F289A]/80 md:text-[14px]">
              Most AI products today are built on borrowed intelligence—thin
              wrappers around rented APIs, indistinguishable from competitors and
              impossible to defend.
              <br />
              <br />
              We exist to build Proprietary Intelligence.
              <br />
              <br />
              Our model bridges two worlds that rarely meet:
              <br />
              • Domain Specialists who understand the problem at depth
              <br />
              • Technical Stewards who can design, scale, and operate the AI engine
              <br />
              <br />
              By uniting these roles under a single venture architecture, we create
              companies with real moats, disciplined execution, and long-term value.
            </p>
          </div>
        </div>

        {/* PILLARS HEADING */}
        <div className="mt-12 text-center md:mt-14">
          <h3 className="font-display text-[36px] font-semibold leading-[1.05] text-[#7F289A] md:text-[48px]">
            The Pillars Of our
            <br />
            Model
          </h3>
        </div>

        {/* PILLARS LIST */}
        <div className="mt-10 space-y-8 md:mt-12">
          {pillars.map((p) => (
            <PillarRow key={p.title} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
