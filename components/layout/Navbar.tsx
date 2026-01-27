"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

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

function Hamburger({ open }: { open: boolean }) {
  return (
    <div className="relative h-5 w-6">
      <span
        className={cn(
          "absolute left-0 top-0 h-[2px] w-full rounded bg-white transition-transform duration-200",
          open && "translate-y-[9px] rotate-45"
        )}
      />
      <span
        className={cn(
          "absolute left-0 top-[9px] h-[2px] w-full rounded bg-white transition-opacity duration-200",
          open ? "opacity-0" : "opacity-100"
        )}
      />
      <span
        className={cn(
          "absolute left-0 top-[18px] h-[2px] w-full rounded bg-white transition-transform duration-200",
          open && "-translate-y-[9px] -rotate-45"
        )}
      />
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { scrollY } = useScroll();

  // show/hide on scroll direction
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;

    setScrolled(latest > 8);

    if (latest > prev && latest > 120) setHidden(true);
    else setHidden(false);
  });

  const activeLabel = useMemo(() => {
    const found = navLinks.find((l) => isRouteActive(pathname, l.href));
    return found?.label ?? "Menu";
  }, [pathname]);

  return (
    <>
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
              scrolled
                ? "shadow-[0_14px_40px_rgba(0,0,0,0.22)]"
                : "shadow-[0_10px_26px_rgba(0,0,0,0.16)]"
            )}
          >
            {/* Left logo block */}
            <Link
              href="/"
              className="flex h-full w-[140px] items-center justify-center bg-[#6c217f]"
              aria-label="Go to home"
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

            {/* Desktop nav */}
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

            {/* Mobile menu button */}
            <div className="ml-auto flex h-full items-center pr-3 md:hidden">
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className={cn(
                  "flex h-[44px] items-center gap-3 rounded-full px-4",
                  "bg-black/15 text-white",
                  "transition",
                  "hover:bg-black/20 active:translate-y-[1px]"
                )}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
              >
                <span className="text-xs font-medium">{activeLabel}</span>
                <Hamburger open={mobileOpen} />
              </button>
            </div>
          </div>

          {/* Mobile dropdown (same brand) */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="md:hidden"
              >
                <div
                  className={cn(
                    "mt-3 overflow-hidden rounded-[18px] bg-[#7F289A]",
                    "shadow-[0_18px_50px_rgba(0,0,0,0.22)]"
                  )}
                >
                  <div className="grid">
                    {navLinks.map((l) => {
                      const active = isRouteActive(pathname, l.href);
                      return (
                        <Link
                          key={l.href}
                          href={l.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center justify-between px-5 py-4 text-sm font-medium",
                            "transition-colors",
                            active
                              ? "bg-[#CDB6FF] text-[#1E1230]"
                              : "text-white/90 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          <span>{l.label}</span>
                          <span
                            className={cn(
                              "text-xs",
                              active ? "text-[#1E1230]/70" : "text-white/60"
                            )}
                          >
                            →
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Optional: click-away backdrop for mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: "rgba(0,0,0,0.15)" }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
