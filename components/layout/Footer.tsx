"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const columns = [
  {
    title: "Company",
    links: ["Home", "About", "Pricing", "Blog", "FAQ"],
  },
  {
    title: "Features",
    links: ["Careers", "Integrations", "Team"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms & Conditions"],
  },
  {
    title: "Account",
    links: ["Login", "Sign up"],
  },
];

export default function FooterSection() {
  return (
    <section className="relative h-screen w-full bg-white">
      {/* soft background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1000px_420px_at_50%_0%,rgba(111,42,167,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_70%)]" />
      </div>

      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-between px-4 py-20">
        {/* TOP – CTA */}
        <div className="text-center">
          <h2 className="font-display text-[42px] font-semibold leading-tight text-black md:text-[56px]">
            Let’s build something <br className="hidden md:block" />
            meaningful with AI
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-black/60 md:text-base">
            Whether you’re exploring an idea or scaling a production system,
            we partner with you as a technical co-founder.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Button
              className={cn(
                "h-11 rounded-full px-8",
                "bg-[var(--purple)] text-white",
                "shadow-[0_18px_50px_rgba(111,42,167,0.30)]",
                "hover:opacity-95"
              )}
            >
              Get in touch
            </Button>

            <Button
              variant="outline"
              className="h-11 rounded-full px-8 border-black/15"
            >
              View case studies
            </Button>
          </div>
        </div>

        {/* MIDDLE – LINKS */}
        <div className="grid gap-10 border-t border-black/10 pt-14 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--purple)] text-sm font-semibold text-white">
                RM
              </div>
              <h4 className="font-display text-xl font-semibold text-[var(--purple)]">
                Revelation ML
              </h4>
            </div>

            <p className="mt-5 max-w-[260px] text-sm leading-relaxed text-black/55">
              Designing, engineering, and scaling production-grade AI systems.
            </p>
          </div>

          {/* Columns */}
          {columns.map((c) => (
            <div key={c.title}>
              <p className="text-sm font-semibold text-[var(--purple)]">
                {c.title}
              </p>
              <ul className="mt-4 space-y-3 text-sm text-black/55">
                {c.links.map((l) => (
                  <li key={l}>
                    <Link href="#" className="hover:text-black">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BOTTOM */}
        <div className="border-t border-black/10 pt-6 text-center text-xs text-black/45">
          © {new Date().getFullYear()} Revelation ML. All rights reserved.
        </div>
      </div>
    </section>
  );
}
