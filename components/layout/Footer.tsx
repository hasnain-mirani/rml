"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FiLinkedin, FiGithub } from "react-icons/fi";

export default function FooterSection() {
  return (
    <section
      className={cn(
        "relative w-full min-h-svh bg-white",
        "flex flex-col justify-between overflow-hidden",
      )}
    >
      {/* soft glow background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1000px_420px_at_50%_0%,rgba(111,42,167,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_70%)]" />
      </div>

      {/* TOP – CTA (kept, but compact + responsive) */}
      <div className="relative mx-auto w-full max-w-6xl px-4 mt-50 py-8 md:py-10">
        <div className="text-center">
          <h2 className="font-display font-semibold leading-tight text-black text-[clamp(28px,5vw,56px)]">
            Let’s build something <br className="hidden md:block" />
            meaningful with AI
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-black/60 md:text-base">
            Whether you’re exploring an idea or scaling a production system, we
            partner with you as a technical co-founder.
          </p>

          <div className="mt-6 flex justify-center gap-3 md:mt-8 md:gap-4">
           <Link href="/contact">
              <Button
                className={cn(
                  "h-11 rounded-full px-6 md:px-8",
                  "bg-[var(--purple)] text-white",
                  "shadow-[0_18px_50px_rgba(111,42,167,0.30)]",
                  "hover:opacity-95",
                )}
              >
                Get in touch
              </Button>
            </Link>
          
          <Link href='/portfolio/case-study-1'>
            <Button
              variant="outline"
              className="h-11 rounded-full px-6 md:px-8 border-black/15"
            >
              View case studies
            </Button>
          </Link>
          </div>
        </div>
      </div>

      {/* MINIMAL FOOTER – reference style */}
      <div className="relative w-full">
        <div className="bg-[rgba(242,239,245,0.08)]">
          <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-6 text-center md:py-7">
            <h4 className="font-display text-lg md:text-xl font-semibold text-[var(--purple)]">
              Revelation ML
            </h4>

            <p className="mt-1 text-[11px] md:text-xs text-black/60">
              Ready to accelerate your AI journey?
            </p>

            <p className="mt-1 text-[11px] md:text-xs text-black/60">
              Follow us:
            </p>

            <div className="mt-2 flex items-center gap-4">
              <Link
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-black/70 transition hover:text-black"
              >
                <FiLinkedin className="h-6 w-6 md:h-7 md:w-7" />
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-black/70 transition hover:text-black"
              >
                <FiGithub className="h-6 w-6 md:h-7 md:w-7" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
