"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/our-story" },
  { label: "Services", href: "/services" },
  { label: "Resources", href: "/resources" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQs", href: "/faq" },
];

function isRouteActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Navbar() {
  const pathname = usePathname();

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();

  // show/hide on scroll direction
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;

    // background/shadow after slight scroll
    setScrolled(latest > 8);

    // If user scrolls DOWN -> hide, UP -> show
    if (latest > prev && latest > 120) setHidden(true);
    else setHidden(false);
  });

  // close any mobile menu etc. if needed later
  useEffect(() => {
    // placeholder for route-change side effects
  }, [pathname]);

  return (
    <motion.header
      className="fixed top-0 z-50 w-full"
      initial={false}
      animate={hidden ? "hidden" : "visible"}
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: -90, opacity: 0 },
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-6xl px-4 pt-4 md:pt-6">
        {/* Floating pill */}
        <div
          className={cn(
            "relative flex h-[64px] w-full items-center overflow-hidden rounded-full bg-[#7F289A]",
            // floating effect + smooth shadow
            scrolled
              ? "shadow-[0_14px_40px_rgba(0,0,0,0.22)]"
              : "shadow-[0_10px_26px_rgba(0,0,0,0.16)]"
          )}
        >
          {/* Left logo block */}
          <Link
            href="/"
            className="flex h-full w-[140px] items-center justify-center bg-[#6c217f]"
          >
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={46}
              height={46}
              priority
              className="h-11 w-11"
            />
          </Link>

          {/* Tabs (equal segments, exact Figma active block style) */}
          <nav className="hidden h-full flex-1 items-center md:flex">
            {navLinks.map((l, idx) => {
              const active = isRouteActive(pathname, l.href);

              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative flex h-full flex-1 items-center justify-center text-sm font-medium transition-colors",
                    active
                      ? "bg-[#CDB6FF] text-[#1E1230]"
                      : "text-white/90 hover:text-white"
                  )}
                >
                  {l.label}

                  {/* separators */}
                  {idx !== navLinks.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none absolute right-0 top-1/2 h-[34px] w-px -translate-y-1/2",
                        active ? "bg-black/10" : "bg-white/15"
                      )}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right CTA (invert hover + depth click) */}
        
        </div>
      </div>
    </motion.header>
  );
}
