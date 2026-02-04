import ContactWaves from "@/components/sections/contact/ContactWaves";
import ContactCard from "@/components/sections/contact/ContactCard";
import Link from "next/link";


export default function ContactSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--bg-soft)] pb-20">
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
        </div> </div>
      {/* subtle wave background like figma */}
      <div className="pointer-events-none absolute inset-0">
        <ContactWaves />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pt-20 md:pt-24">
        <h1 className="font-display text-center text-[44px] font-semibold leading-[1.05] text-[var(--purple)] md:text-[64px]">
          Contact Us
        </h1>

        <div className="mt-10 md:mt-12">
          <ContactCard />
        </div>
      </div>
    </section>
  );
}
