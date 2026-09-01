import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";
import { ArrowDownRight, MapPin, Mail, Activity } from "lucide-react";
import { Magnetic, Typewriter } from "./primitives";
import { blip } from "@/lib/sound";

const HEADLINE = "MichaelDevOps".split("");

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  // pointer-reactive aurora
  const px = useSpring(useMotionValue(0.5), { stiffness: 60, damping: 20 });
  const py = useSpring(useMotionValue(0.4), { stiffness: 60, damping: 20 });
  useEffect(() => {
    const on = (e: PointerEvent) => {
      px.set(e.clientX / window.innerWidth);
      py.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", on);
    return () => window.removeEventListener("pointermove", on);
  }, [px, py]);
  const auroraX = useTransform(px, [0, 1], ["-12%", "12%"]);
  const auroraY = useTransform(py, [0, 1], ["-10%", "10%"]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden px-6 pt-28 sm:px-10"
    >
      <motion.div
        aria-hidden
        style={{ y: gridY }}
        className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(circle_at_50%_35%,black,transparent_78%)]"
      />
      <motion.div
        aria-hidden
        style={{ x: auroraX, y: auroraY }}
        className="animate-float-slow pointer-events-none absolute -left-40 top-0 h-[38rem] w-[38rem] rounded-full bg-signal/20 blur-[130px]"
      />
      <motion.div
        aria-hidden
        style={{ x: auroraX, y: auroraY }}
        className="pointer-events-none absolute -right-32 bottom-0 h-[32rem] w-[32rem] rounded-full bg-amber/10 blur-[140px]"
      />
      <div className="scanlines pointer-events-none absolute inset-0 opacity-40" />

      <motion.div
        style={{ y: yText, opacity }}
        className="relative mx-auto grid w-full max-w-6xl gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center"
      >
        <div>
          <motion.img
            src="/author.jpg"
            alt="MichaelDevOps"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 180, damping: 18 }}
            className="mb-5 h-16 w-16 rounded-full border border-signal/40 object-cover object-top shadow-[0_0_30px_oklch(0.82_0.155_178/18%)]"
          />
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-signal"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse-ring absolute inset-0 rounded-full bg-signal" />
              <span className="h-2 w-2 rounded-full bg-signal" />
            </span>
            uptime: available for work
          </motion.div>

          <h1 className="font-display text-[clamp(2.6rem,8vw,6rem)] font-bold leading-[0.92] tracking-tight">
            <span className="block whitespace-nowrap">
              {HEADLINE.map((c, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, y: 40, rotateX: -60 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    delay: 0.25 + i * 0.035,
                    type: "spring",
                    stiffness: 220,
                    damping: 18,
                  }}
                >
                  {c}
                </motion.span>
              ))}
            </span>

            <motion.span
              className="text-signal-gradient block"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              ships quietly.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Backend &amp; DevOps engineer building Linux-native systems, automation and
            deployment pipelines that stay boring in production — which is the whole point.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.8 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <a
                href="#projects"
                onClick={() => blip("click")}
                className="group inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3.5 font-mono text-[13px] font-semibold uppercase tracking-[0.14em] text-primary-foreground shadow-[var(--shadow-signal)] transition-shadow hover:shadow-[0_0_0_1px_oklch(0.82_0.155_178/40%),0_24px_70px_-20px_oklch(0.82_0.155_178/60%)]"
              >
                see live systems
                <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a
                href="mailto:michealdevops@gmail.com"
                onClick={() => blip("click")}
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 font-mono text-[13px] uppercase tracking-[0.14em] text-foreground transition-colors hover:border-signal/60 hover:text-signal"
              >
                <Mail className="h-4 w-4" /> hire me
              </a>
            </Magnetic>
          </motion.div>
        </div>

        {/* live terminal */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateY: 12 }}
          animate={{ opacity: 1, y: 0, rotateY: 0 }}
          transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel relative overflow-hidden rounded-2xl shadow-[var(--shadow-lift)]"
        >
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-signal/70" />
            <span className="ml-2 font-mono text-[11px] text-muted-foreground">
              michael@prod — zsh
            </span>
            <Activity className="ml-auto h-3.5 w-3.5 text-signal" />
          </div>
          <div className="space-y-1.5 p-5 font-mono text-[12.5px] leading-relaxed text-foreground/90 sm:text-[13px]">
            <Typewriter
              lines={[
                "whoami",
                "michael — backend & devops, nigeria",
                "systemctl status delivery.service",
                "● active (running) — ci/cd, linux, automation",
                "deploy --env production --check",
                "✔ build ✔ tests ✔ artifacts ✔ rollback plan",
              ]}
            />
          </div>
          <div className="grid grid-cols-3 gap-px border-t border-border bg-border/60 font-mono text-[11px]">
            {[
              { k: "location", v: "Nigeria", icon: MapPin },
              { k: "focus", v: "CI/CD · Linux", icon: Activity },
              { k: "email", v: "gmail", icon: Mail },
            ].map((s) => (
              <div key={s.k} className="bg-surface px-3 py-3">
                <div className="flex items-center gap-1.5 uppercase tracking-[0.16em] text-muted-foreground">
                  <s.icon className="h-3 w-3 text-signal" />
                  {s.k}
                </div>
                <div className="mt-1 truncate text-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
