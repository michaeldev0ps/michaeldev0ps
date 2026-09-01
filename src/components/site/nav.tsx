import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useState } from "react";
import { Terminal } from "lucide-react";
import { SoundToggle } from "./sound-toggle";
import { blip } from "@/lib/sound";

const LINKS = [
  { label: "work", href: "#work" },
  { label: "systems", href: "#systems" },
  { label: "projects", href: "#projects" },
  { label: "contact", href: "#contact" },
];

export function Nav() {
  const { scrollYProgress, scrollY } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });
  const [condensed, setCondensed] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setCondensed(v > 40));

  return (
    <>
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed left-0 top-0 z-[80] h-[2px] w-full origin-left bg-signal"
      />
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-[70] px-4 pt-4 sm:px-8"
      >
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border px-3 py-2 transition-all duration-500 ${
            condensed
              ? "glass-panel border-border shadow-[var(--shadow-lift)]"
              : "border-transparent bg-transparent"
          }`}
        >
          <a
            href="#top"
            onClick={() => blip("click")}
            className="group flex items-center gap-2 pl-2 font-mono text-sm tracking-tight"
          >
            <Terminal className="h-4 w-4 text-signal transition-transform duration-300 group-hover:rotate-6" />
            <span className="font-semibold">michael</span>
            <span className="text-signal">devops</span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => blip("click")}
                onPointerEnter={() => blip("hover")}
                className="group relative rounded-full px-4 py-2 font-mono text-[12px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="text-signal/60">/</span>
                {l.label}
                <span className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-signal transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <SoundToggle />
          </div>
        </div>
      </motion.header>
    </>
  );
}
