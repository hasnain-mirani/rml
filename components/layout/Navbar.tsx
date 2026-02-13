"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * These IDs MUST match the Home page sections:
 * hero, features, process, stories, footer, cta
 */
type SlideId = "hero" | "features" | "process" | "stories" | "footer" | "cta";
type NavLink = { label: string; id: SlideId };

/** ✅ REORDERED + UNIQUE IDs (no duplicates) */
const navLinks: NavLink[] = [
  { label: "Home", id: "hero" },
  { label: "About Us", id: "features" },
  { label: "Services", id: "process" },
  { label: "Resources", id: "cta" },
  { label: "Testimonals", id: "stories" },
  { label: "Contact Us", id: "footer" },
];

function setHash(id: string) {
  if (typeof window === "undefined") return;
  window.history.replaceState(null, "", `#${id}`);
}

export default function Navbar({
  scrollContainerRef,
}: {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<SlideId>("hero");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const lastY = useRef(0);

  // sync from hash once
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = (window.location.hash || "").replace("#", "");
    const found = navLinks.find((l) => l.id === hash);
    if (found) setActiveId(found.id);
  }, []);

  // close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // hide/show + active sync from the home scroll container
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    let raf = 0;

    const onScroll = () => {
      const y = el.scrollTop;

      setScrolled(y > 8);

      if (y > lastY.current && y > 120) setHidden(true);
      else if (y < lastY.current) setHidden(false);
      lastY.current = y;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const slides = Array.from(
          el.querySelectorAll<HTMLElement>("[data-slide]")
        );
        if (!slides.length) return;

        // nearest slide to the top
        let best = slides[0]!;
        let bestDist = Math.abs(best.offsetTop - y);
        for (const s of slides) {
          const d = Math.abs(s.offsetTop - y);
          if (d < bestDist) {
            bestDist = d;
            best = s;
          }
        }

        const idAttr = (best.getAttribute("data-slide") || "hero") as SlideId;
        if (idAttr !== activeId && navLinks.some((n) => n.id === idAttr)) {
          setActiveId(idAttr);
          setHash(idAttr);
        }
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
  }, [scrollContainerRef, activeId]);

  /**
   * ✅ FIXED: no double navigation.
   * - If already on "/", just scroll the container + set hash.
   * - If on another page, push "/#id" and let Home handle it.
   */
  const goToId = (id: SlideId) => {
    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) {
      // fallback hash update
      setActiveId(id);
      setHash(id);
      return;
    }

    const slide = container.querySelector<HTMLElement>(`[data-slide="${id}"]`);
    setActiveId(id);
    setHash(id);

    if (slide) {
      container.scrollTo({ top: slide.offsetTop, behavior: "smooth" });
      return;
    }

    // fallback (kept)
    const index = navLinks.findIndex((x) => x.id === id);
    if (index >= 0 && typeof window !== "undefined") {
      container.scrollTo({
        top: index * window.innerHeight,
        behavior: "smooth",
      });
    }
  };

  const activeLabel = useMemo(() => {
    if (pathname !== "/") return "Menu";
    return navLinks.find((l) => l.id === activeId)?.label ?? "Menu";
  }, [activeId, pathname]);

  return (
    <motion.header
      className="fixed top-0 z-50 w-full"
      animate={hidden ? { y: -96, opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mx-auto max-w-6xl px-4 pt-4 md:pt-6">
        <div
          className={cn(
            "relative flex h-[64px] items-center rounded-full overflow-hidden bg-[#7F289A]",
            scrolled
              ? "shadow-[0_14px_40px_rgba(0,0,0,0.22)]"
              : "shadow-[0_10px_26px_rgba(0,0,0,0.16)]"
          )}
        >
          {/* Logo -> hero */}
          <Link
            href="/#hero"
            className="flex h-full w-[140px] items-center justify-center bg-[#6c217f] rounded-l-full"
            onClick={(e) => {
              e.preventDefault();
              goToId("hero");
            }}
          >
            <Image src="/images/logo.png" alt="Logo" width={46} height={46} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden h-full flex-1 items-center md:flex">
            {navLinks.map((l) => {
              const active = pathname === "/" ? activeId === l.id : false;

              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => goToId(l.id)}
                  className={cn(
                    "flex h-full flex-1 items-center justify-center text-sm font-medium transition",
                    active
                      ? "bg-[#CDB6FF] text-[#1E1230]"
                      : "text-white/90 hover:text-white"
                  )}
                >
                  {l.label}
                </button>
              );
            })}
          </nav>

          {/* Right side (✅ Demo removed) */}
          <div className="ml-auto flex items-center gap-2 pr-2">
            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label="Open menu"
              className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/15 text-white"
              onClick={() => setDrawerOpen(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Mobile active label */}
            <div className="pr-2 text-xs text-white/70 md:hidden">
              {activeLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[60] bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              key="drawer"
              className="fixed right-0 top-0 z-[61] h-full w-[84%] max-w-xs bg-[#1E1230] text-white shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
                <span className="text-sm font-semibold">Menu</span>
                <button
                  className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/15"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 6l12 12M18 6l-12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <nav className="px-2 py-2">
                {navLinks.map((l) => {
                  const active = pathname === "/" ? activeId === l.id : false;
                  return (
                    <button
                      key={l.id}
                      onClick={() => {
                        setDrawerOpen(false);
                        goToId(l.id);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-lg text-sm font-medium",
                        active
                          ? "bg-white text-[#1E1230]"
                          : "text-white/90 hover:bg-white/10"
                      )}
                    >
                      {l.label}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-auto px-4 py-4 border-t border-white/10">
                <div className="text-xs text-white/60">
                  Select a section to jump.
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
