"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type PanelKey = "scale" | "innovate" | null;

export default function FeatureSection() {
  const [open, setOpen] = useState<PanelKey>(null);

  const isScale = open === "scale";
  const isInnovate = open === "innovate";

  // ✅ hover on desktop, click on mobile/touch
  const handlers = useMemo(
    () => ({
      onLeave: () => setOpen(null),
      onScaleEnter: () => setOpen("scale"),
      onInnovateEnter: () => setOpen("innovate"),
      onScaleClick: () => setOpen((p) => (p === "scale" ? null : "scale")),
      onInnovateClick: () => setOpen((p) => (p === "innovate" ? null : "innovate")),
    }),
    []
  );

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div
          className="relative overflow-hidden rounded-[10px]"
          onMouseLeave={handlers.onLeave}
        >
          {/* ✅ Background split with diagonal */}
          <div className="relative h-[420px] md:h-[460px]">
            <div className="absolute inset-0 bg-[#F3ECFF]" />
            <div
              className="absolute inset-0 bg-[#D8B9FF]"
              style={{ clipPath: "polygon(58% 0, 100% 0, 100% 100%, 42% 100%)" }}
            />

            {/* Left base heading */}
            <div className="absolute inset-0 flex">
              <button
                type="button"
                onMouseEnter={handlers.onScaleEnter}
                onFocus={handlers.onScaleEnter}
                onClick={handlers.onScaleClick}
                className={cn(
                  "relative h-full w-1/2 text-left outline-none",
                  "px-8 md:px-12",
                  "transition-opacity duration-200",
                  open && !isScale ? "opacity-60" : "opacity-100"
                )}
              >
                <div className="flex h-full flex-col justify-center">
                  <h3 className="font-display text-[38px] leading-[1.05] text-[#6F2AA7] md:text-[46px]">
                    Scale with Us
                  </h3>
                  <p className="mt-4 max-w-[340px] text-[15px] text-[#6F2AA7]/80 md:text-[16px]">
                    Cross the threshold from prototype to scale
                  </p>
                </div>

                {/* subtle hover hint */}
                <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/5 to-transparent" />
              </button>

              {/* Right base heading */}
              <button
                type="button"
                onMouseEnter={handlers.onInnovateEnter}
                onFocus={handlers.onInnovateEnter}
                onClick={handlers.onInnovateClick}
                className={cn(
                  "relative h-full w-1/2 text-left outline-none",
                  "px-8 md:px-12",
                  "transition-opacity duration-200",
                  open && !isInnovate ? "opacity-60" : "opacity-100"
                )}
              >
                <div className="flex h-full flex-col justify-center">
                  <h3 className="font-display text-[34px] leading-[1.05] text-[#1A0F24] md:text-[44px]">
                    Innovate with Us
                  </h3>
                  <p className="mt-4 max-w-[340px] text-[15px] text-[#1A0F24]/70 md:text-[16px]">
                    You bring the problem we engineer the solution
                  </p>
                </div>

                <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/5 to-transparent" />
              </button>
            </div>

            {/* ✅ Modal-like hover panels */}
            <div
              className={cn(
                "pointer-events-none absolute inset-0 flex items-center justify-center",
                "transition-opacity duration-200",
                open ? "opacity-100" : "opacity-0"
              )}
              aria-hidden={!open}
            >
              {/* SCALE PANEL (matches 3rd screenshot vibe) */}
              <div
                className={cn(
                  "pointer-events-auto absolute left-[8%] right-[8%] md:left-[7%] md:right-[50%]",
                  "top-1/2 -translate-y-1/2",
                  "transition-all duration-200 ease-out",
                  isScale ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                )}
              >
                <div className="rounded-[16px] bg-transparent p-0">
                  <div className="flex flex-col items-center text-center">
                    <h4 className="font-display text-[30px] text-[#6F2AA7] md:text-[34px]">
                      Scale with Us
                    </h4>
                    <p className="mt-2 text-[14px] text-[#6F2AA7]/75 md:text-[15px]">
                      Cross the threshold from prototype to scale
                    </p>

                    <div className="mt-5 w-full max-w-[320px] rounded-full bg-[#6F2AA7] px-6 py-3 text-[12px] font-medium text-white shadow-[0_10px_22px_rgba(0,0,0,0.18)] md:text-[13px]">
                      SCALE UP YOUR ENTERPRISE
                    </div>

                    <div className="mt-4 w-full max-w-[520px] rounded-[14px] bg-[#6F2AA7] px-6 py-4 text-[13px] text-white shadow-[0_12px_24px_rgba(0,0,0,0.18)] md:text-[14px]">
                      You are already, a startup or have a developed product with an interesting idea
                    </div>

                    <div className="mt-4 w-full max-w-[520px] rounded-[16px] bg-[#6F2AA7] px-6 py-5 text-left text-[13px] text-white shadow-[0_14px_28px_rgba(0,0,0,0.20)] md:text-[14px]">
                      <p className="mb-2 font-medium">
                        We provide long-term support and skilled resources:
                      </p>
                      <ul className="list-disc space-y-1 pl-5 text-white/95">
                        <li>AI and systems architecture designed for scale</li>
                        <li>Cloud and infrastructure optimization</li>
                        <li>Cost-efficient model deployment</li>
                        <li>Reliability, evaluation, and governance frameworks</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* INNOVATE PANEL (matches 2nd screenshot vibe) */}
              <div
                className={cn(
                  "pointer-events-auto absolute left-[8%] right-[8%] md:left-[50%] md:right-[7%]",
                  "top-1/2 -translate-y-1/2",
                  "transition-all duration-200 ease-out",
                  isInnovate ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                )}
              >
                <div className="flex flex-col items-center text-center">
                  <h4 className="font-display text-[30px] text-[#1A0F24] md:text-[36px]">
                    Innovate with Us
                  </h4>
                  <p className="mt-2 text-[14px] text-[#1A0F24]/70 md:text-[15px]">
                    You bring the problem we engineer the solution
                  </p>

                  <div className="mt-5 w-full max-w-[320px] rounded-full bg-white px-6 py-3 text-[12px] font-medium text-[#1A0F24] shadow-[0_10px_22px_rgba(0,0,0,0.18)] md:text-[13px]">
                    BECOME A CO-FOUNDER
                  </div>

                  <div className="mt-5 w-full max-w-[560px] rounded-[14px] bg-white px-6 py-4 text-[13px] text-[#1A0F24]/80 shadow-[0_12px_24px_rgba(0,0,0,0.18)] md:text-[14px]">
                    You are a domain expert with a sharp insight into a real, high-stakes problem.
                    You bring the idea, we bring the technical expertise.
                  </div>

                  <div className="mt-4 w-full max-w-[560px] rounded-[14px] bg-white px-6 py-4 text-[13px] text-[#1A0F24]/80 shadow-[0_12px_24px_rgba(0,0,0,0.18)] md:text-[14px]">
                    We bring the Deep AI engineering expertise, System architecture knowledge and
                    infrastructure design
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ click-outside feel (optional): dim overlay when panel open */}
            <div
              className={cn(
                "pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-200",
                open ? "bg-black/5" : "bg-black/0"
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
