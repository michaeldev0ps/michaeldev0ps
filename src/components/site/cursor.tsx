import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/** Spring-trailing halo cursor. Desktop / fine-pointer only. */
export function SignalCursor() {
  const [active, setActive] = useState(false);
  const [hot, setHot] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const hx = useSpring(x, { stiffness: 140, damping: 18, mass: 0.7 });
  const hy = useSpring(y, { stiffness: 140, damping: 18, mass: 0.7 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setActive(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      setHot(Boolean(el?.closest("a, button, [data-hot]")));
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  if (!active) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal mix-blend-screen"
        style={{ x, y }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[89] -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal/50 mix-blend-screen"
        style={{ x: hx, y: hy }}
        animate={{
          width: hot ? 56 : 30,
          height: hot ? 56 : 30,
          opacity: hot ? 0.9 : 0.45,
          backgroundColor: hot
            ? "oklch(0.82 0.155 178 / 10%)"
            : "oklch(0.82 0.155 178 / 0%)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      />
    </>
  );
}
