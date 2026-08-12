"use client";

import { useEffect, useRef } from "react";

/**
 * Attaches a smooth mouse parallax to the returned element: it writes the
 * cursor offset (eased) into CSS custom properties `--px` / `--py` in pixels.
 * Children opt in with `translate(calc(var(--px) * depth), calc(var(--py) * depth))`.
 * Disabled on coarse pointers (touch), where there's no cursor to follow.
 */
export function useParallax<T extends HTMLElement>(maxShift = 22) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * -2 * maxShift;
      targetY = (e.clientY / window.innerHeight - 0.5) * -2 * maxShift;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      el.style.setProperty("--px", `${currentX.toFixed(2)}px`);
      el.style.setProperty("--py", `${currentY.toFixed(2)}px`);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [maxShift]);

  return ref;
}
