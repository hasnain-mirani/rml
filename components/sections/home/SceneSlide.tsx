"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type SceneSlideProps = {
  children: (progress: number) => React.ReactNode; // progress 0..1
  onNext?: () => void;
  onPrev?: () => void;
  className?: string;
  lockAtStart?: boolean;
  lockAtEnd?: boolean;
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export default function SceneSlide({
  children,
  onNext,
  onPrev,
  className,
  lockAtStart = true,
  lockAtEnd = true,
}: SceneSlideProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mv = useMotionValue(0);
  const [progress, setProgress] = useState(0);

  // keep local state in sync for rendering
  useEffect(() => mv.on("change", (v) => setProgress(clamp01(v))), [mv]);

  const api = useMemo(() => {
    const setTo = (to: number) =>
      animate(mv, clamp01(to), {
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      });
    return { setTo };
  }, [mv]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let touchY = 0;

    const onWheel = (e: WheelEvent) => {
      // only handle while pointer is over this slide
      // (it’s fullpage so it will be)
      const dy = e.deltaY;

      const p = mv.get();

      // at end and user continues → go next
      if (dy > 0 && p >= 0.999) {
        if (lockAtEnd) {
          e.preventDefault();
          onNext?.();
          return;
        }
      }

      // at start and user scrolls up → go prev
      if (dy < 0 && p <= 0.001) {
        if (lockAtStart) {
          e.preventDefault();
          onPrev?.();
          return;
        }
      }

      // otherwise: consume scroll and move scene progress
      e.preventDefault();

      // sensitivity
      const delta = dy / 900; // smaller = faster
      api.setTo(p + delta);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touchY;
      const dy = touchY - y;
      touchY = y;

      const p = mv.get();

      // at end and swipe up again → next
      if (dy > 0 && p >= 0.999) {
        if (lockAtEnd) {
          e.preventDefault();
          onNext?.();
          return;
        }
      }

      // at start and swipe down → prev
      if (dy < 0 && p <= 0.001) {
        if (lockAtStart) {
          e.preventDefault();
          onPrev?.();
          return;
        }
      }

      e.preventDefault();
      api.setTo(p + dy / 900);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [api, mv, onNext, onPrev, lockAtEnd, lockAtStart]);

  return (
    <div ref={ref} className={cn("relative h-screen w-full overflow-hidden", className)}>
      {children(progress)}

      {/* subtle hint */}
      <motion.div
        className="pointer-events-none absolute bottom-5 left-1/2 z-30 -translate-x-1/2 text-xs text-white/70"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: progress < 0.15 ? 1 : 0, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        Scroll to explore
      </motion.div>
    </div>
  );
}
