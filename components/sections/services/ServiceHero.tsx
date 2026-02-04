import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ServicesHero() {
  return (
    <section className="pt-8 relative overflow-hidden bg-[var(--bg-soft)]">
      <div className="relative mx-auto max-w-6xl px-4 pt-16 md:pt-20">
        {/* ✅ Back button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--purple)] transition hover:opacity-80"
          >
            <span className="text-lg">←</span>
            Back to Home Page
          </Link>
        </div>
        </div>
      {/* TEXT */}
      <div className="mx-auto max-w-6xl px-4 pt-14 md:pt-16">
        <div className="text-center">
          <h1 className="font-display text-[40px] font-semibold leading-[1.08] text-[#7F289A] md:text-[64px]">
            Revolutionize Your <br className="hidden md:block" />
            Business with Cutting-Edge <br className="hidden md:block" />
            AI Solutions:
          </h1>

          <Button className="mt-7 rounded-full bg-[#7F289A] px-10 text-white hover:bg-[#6c217f]">
            Get Started
          </Button>
        </div>
      </div>

      {/* VISUAL AREA */}
      <div className="relative mt-10">
        {/* ✅ Full-width wave background image (same approach as Home) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[360px] md:h-[460px]">
          <Image
            src="/images/hero-waves.png" // ✅ use SAME background as home
            alt="Wave background"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        {/* ✅ Center aligned hero illustration */}
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="relative h-[380px] md:h-[520px]">
            <div className="absolute left-1/2 top-[40px] -translate-x-1/2 md:top-[10px]">
              <div className="relative h-[260px] w-[320px] sm:w-[420px] md:h-[420px] md:w-[620px]">
                <Image
                  src="/images/services-hero.png"
                  alt="Services hero illustration"
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 640px) 320px, (max-width: 768px) 420px, 620px"
                />
              </div>
            </div>

            {/* bottom title */}
            <div className="absolute bottom-10 left-0 right-0 text-center">
              <h2 className="font-display text-2xl font-semibold text-[#7F289A] md:text-3xl">
                Your Business, Reinvented by AI
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* purple strip like figma transition */}
   
    </section>
  );
}
