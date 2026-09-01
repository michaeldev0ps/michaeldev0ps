import { motion, useInView, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { blip } from "@/lib/sound";

/* ---------------- Reveal on scroll ---------------- */

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -12% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (inView) blip("reveal");
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0 }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- Magnetic element ---------------- */

export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.6 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.6 });

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={className}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerEnter={() => blip("hover")}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- Typewriter ---------------- */

export function Typewriter({
  lines,
  speed = 26,
  startDelay = 300,
  onDone,
}: {
  lines: string[];
  speed?: number;
  startDelay?: number;
  onDone?: () => void;
}) {
  const [out, setOut] = useState<string[]>([""]);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setOut(lines);
      onDone?.();
      return;
    }
    let li = 0;
    let ci = 0;
    let raf = 0;
    const acc: string[] = [""];
    const tick = () => {
      if (li >= lines.length) {
        onDone?.();
        return;
      }
      const line = lines[li]!;
      if (ci < line.length) {
        acc[li] = line.slice(0, ++ci);
        setOut([...acc]);
        raf = window.setTimeout(tick, speed + Math.random() * 34);
      } else {
        li += 1;
        ci = 0;
        acc[li] = "";
        setOut([...acc]);
        raf = window.setTimeout(tick, 260);
      }
    };
    const start = window.setTimeout(tick, startDelay);
    return () => {
      clearTimeout(start);
      clearTimeout(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {out.map((l, i) => (
        <div key={i} className="whitespace-pre-wrap">
          <span className="text-signal-dim">$ </span>
          <span>{l}</span>
          {i === out.length - 1 && (
            <span className="animate-caret ml-0.5 inline-block h-[1em] w-[0.55ch] translate-y-[0.15em] bg-signal align-middle" />
          )}
        </div>
      ))}
    </>
  );
}

/* ---------------- Tilt card ---------------- */

export function Tilt({
  children,
  className,
  max = 9,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      whileHover={{ scale: 1.015 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onPointerEnter={() => blip("hover")}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * max * 2);
        rx.set(-(py - 0.5) * max * 2);
        setGlow({ x: px * 100, y: py * 100 });
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 [.group:hover_&]:opacity-100"
        style={{
          background: `radial-gradient(420px circle at ${glow.x}% ${glow.y}%, oklch(0.82 0.155 178 / 12%), transparent 60%)`,
        }}
      />
      {children}
    </motion.div>
  );
}
