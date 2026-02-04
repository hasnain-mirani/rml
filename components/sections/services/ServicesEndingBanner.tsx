import { Button } from "@/components/ui/button";
import WaveLines from "@/components/shared/WaveLines";
import Link from "next/dist/client/link";

export default function ServicesEndingBanner() {
  return (
    <section className="relative overflow-hidden bg-[var(--purple)]">
      {/* Wave lines overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-x-0 top-10 h-[260px]">
          <WaveLines />
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 text-center md:py-20">
        <h3 className="font-display text-2xl font-semibold text-white md:text-3xl">
          Get Ready to unleash your <br className="hidden md:block" />
          Project with Revelation ML
        </h3>

        <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 md:text-base">
          Book A Free Strategy Call & Level Up with AI
        </p>

       <Link href="/contact">
        <Button className="mt-6 rounded-full bg-[var(--purple-dark)] px-10 text-white hover:opacity-95">
          Contact Us
        </Button>
        </Link>
      </div>
    </section>
  );
}
