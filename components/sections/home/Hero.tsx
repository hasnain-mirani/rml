"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";




export default function Hero() {
  return (
    <section className="mt-8 relative overflow-hidden bg-[var(--bg-soft)]">
      {/* TEXT */}
      <div className="mx-auto max-w-6xl px-4 pt-14 md:pt-16">
        <div className="text-center">
          <motion.h1
            
            initial="hidden"
            animate="show"
            custom={0}
            className="font-display text-[40px] font-semibold leading-[1.08] text-[var(--purple)] md:text-[64px]"
          >
            Empower your workforce through <br className="hidden md:block" />
            seamless automation.
          </motion.h1>

          <motion.p
         
            initial="hidden"
            animate="show"
            custom={0.08}
            className="mx-auto mt-5 max-w-2xl text-[15px] leading-6 text-[var(--purple)]/75 md:text-lg"
          >
            Welcome to Revelation ML, where innovative minds transform bold ideas into
            business-changing, AI-powered solutions.
          </motion.p>

          <motion.div
     
            initial="hidden"
            animate="show"
            custom={0.16}
            className="mt-7"
          >
            <Button className="rounded-full text-amber-50 bg-[var(--purple)] px-10 hover:outline-fuchsia-900 ">
              Get In Touch
            </Button>
          </motion.div>
        </div>
      </div>

      {/* VISUAL AREA */}
      <div className="relative mt-10">
        {/* ✅ Full-width background waves (fills the whole hero visual area) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[360px] md:h-[460px]">
          <Image
            src="/images/hero-waves.png"
            alt="Wave background"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        {/* Content wrapper (controls alignment) */}
        <div className="relative mx-auto max-w-6xl px-4">
          {/* This height defines the hero visual block */}
          <div className="relative h-[360px] md:h-[460px]">
            {/* Center image */}
            <motion.div
              
              initial="initial"
              animate="animate"
              custom={0}
              className="absolute left-1/2 top-[70px] -translate-x-1/2 md:top-[60px]"
            >
              <div className="relative h-[240px] w-[240px] md:h-[380px] md:w-[380px]">
                <Image
                  src="/images/hero-center.png"
                  alt="Hero center"
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 768px) 240px, 380px"
                />
              </div>
            </motion.div>

            {/* Left image */}
            <motion.div
          
              initial="initial"
              animate="animate"
              custom={0.4}
              className="absolute left-[10px] top-[185px] hidden md:block"
            >
              <div className="relative h-[240px] w-[240px]">
                <Image
                  src="/images/hero-left.png"
                  alt="Hero left"
                  fill
                  className="object-contain"
                  sizes="240px"
                />
              </div>
            </motion.div>

            {/* Right image */}
            <motion.div
             
              initial="initial"
              animate="animate"
              custom={0.8}
              className="absolute right-[10px] top-[185px] hidden md:block"
            >
              <div className="relative h-[240px] w-[240px]">
                <Image
                  src="/images/hero-right.png"
                  alt="Hero right"
                  fill
                  className="object-contain"
                  sizes="240px"
                />
              </div>
            </motion.div>

            {/* ✅ Mobile: show left/right smaller so it still feels like figma */}
            <motion.div
          
              initial="initial"
              animate="animate"
              custom={0.4}
              className="absolute left-4 top-[240px] md:hidden"
            >
              <div className="relative h-[120px] w-[120px]">
                <Image
                  src="/images/hero-left.png"
                  alt="Hero left"
                  fill
                  className="object-contain"
                  sizes="120px"
                />
              </div>
            </motion.div>

            <motion.div
             
              initial="initial"
              animate="animate"
              custom={0.8}
              className="absolute right-4 top-[240px] md:hidden"
            >
              <div className="relative h-[120px] w-[120px]">
                <Image
                  src="/images/hero-right.png"
                  alt="Hero right"
                  fill
                  className="object-contain"
                  sizes="120px"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Purple strip like figma */}
      <div className="mt-6 h-14 bg-[var(--purple)]" />
    </section>
  );
}
