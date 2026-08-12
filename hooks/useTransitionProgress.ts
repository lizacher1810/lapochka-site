"use client";

import { useEffect, useRef } from "react";

/**
 * 0 while screen 1 fills the viewport, 1 once screen 2 has fully taken over.
 * Both sections are 100vh, so the transition happens over exactly one
 * viewport height of scrolling (scrollY 0 -> innerHeight), then holds at 1.
 *
 * Returns a ref (not state) so the R3F render loop can read it every frame
 * without forcing a React re-render on every scroll tick.
 */
export function useTransitionProgress() {
  const progressRef = useRef(0);

  useEffect(() => {
    const update = () => {
      const vh = window.innerHeight || 1;
      progressRef.current = Math.min(Math.max(window.scrollY / vh, 0), 1);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return progressRef;
}
