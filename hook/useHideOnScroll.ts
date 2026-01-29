"use client";

import { useEffect, useState } from "react";

export function useHideOnScroll(
  scrollEl: HTMLElement | null,
  threshold = 12
) {
  const [hidden, setHidden] = useState(false);
  let lastY = 0;

  useEffect(() => {
    if (!scrollEl) return;

    const onScroll = () => {
      const y = scrollEl.scrollTop;

      if (y > lastY + threshold) {
        setHidden(true); // scrolling down
      } else if (y < lastY - threshold) {
        setHidden(false); // scrolling up
      }

      // eslint-disable-next-line react-hooks/immutability
      lastY = y;
    };

    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", onScroll);
  }, [scrollEl, threshold]);

  return hidden;
}
