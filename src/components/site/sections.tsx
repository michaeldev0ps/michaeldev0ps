import { motion, useInView, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import {
  ArrowUpRight,
  GitBranch,
  Boxes,
  ShieldCheck,
  Rocket,
  TerminalSquare,
  Gauge,
} from "lucide-react";
import { Reveal, Tilt, Magnetic } from "./primitives";
import { blip } from "@/lib/sound";

/* ---------------- Marquee ---------------- */

const TICKER = [
  "linux",
  "bash",
  "ci/cd",
  "github actions",
  "docker",
  "nginx",
  "observability",
  "incident readiness",
  "automation",
  "zero-downtime deploys",
];

export function Ticker() {
  return (
    <div className="relative overflow-hidden border-y border-border bg-surface/40 py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="flex w-max animate-marquee">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0">
            {TICKER.map((t) => (
              <span
                key={`${dup}-${t}`}
                className="flex items-center gap-4 whitespace-nowrap px-6 font-mono text-[12px] uppercase tracking-[0.28em] text-muted-foreground"
              >
                {t}
                <span className="h-1 w-1 rounded-full bg-signal/70" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Capabilities ---------------- */

const CAPS = [
  {
    icon: TerminalSquare,
    title: "Automation-first workflows",
    body: "Shell-native scripts, repeatable tasks, and infrastructure hygiene that quietly delete manual work.",
    metric: "less toil",
  },
  {
    icon: Rocket,
    title: "Deployment readiness",
    body: "CI/CD pipelines, artifact tracking and release checks tuned for production safety and fast rollback.",
    metric: "safe releases",
  },
  {
    icon: Gauge,
    title: "Systems thinking",
    body: "Linux-first approach with observability, incident readiness and documentation people actually read.",
    metric: "fewer 3am pages",
  },
];

export function Capabilities() {
  return (
    <section id="work" className="relative px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-signal">
            01 — what i build
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.02] tracking-tight">
            Backend services and pipelines
            <span className="block text-muted-foreground">built for reliability, not applause.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {CAPS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1}>
              <Tilt className="group relative h-full overflow-hidden rounded-2xl border border-border bg-surface/70 p-7">
                <c.icon className="h-6 w-6 text-signal transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110" />
                <h3 className="mt-6 font-display text-xl font-semibold leading-snug">
                  {c.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                <div className="mt-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-signal/80">
                  <span className="h-px w-6 bg-signal/60 transition-all duration-500 group-hover:w-12" />
                  {c.metric}
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Pipeline (scroll-driven) ---------------- */

const STAGES = [
  { icon: GitBranch, label: "commit", detail: "branch protection, conventional commits" },
  { icon: Boxes, label: "build", detail: "reproducible artifacts, cached layers" },
  { icon: ShieldCheck, label: "verify", detail: "tests, lint, security checks" },
  { icon: Rocket, label: "deploy", detail: "health checks, instant rollback" },
];

export function Pipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const glowTop = useTransform(line, [0, 1], ["0%", "100%"]);

  return (
    <section id="systems" className="relative overflow-hidden px-6 py-28 sm:px-10">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />
      <div className="relative mx-auto max-w-4xl">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-signal">
            02 — the pipeline
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight">
            From commit to production.
          </h2>
        </Reveal>

        <div ref={ref} className="relative mt-16 pl-10">
          <div className="absolute left-[15px] top-2 h-full w-px bg-border" />
          <motion.div
            style={{ scaleY: line }}
            className="absolute left-[15px] top-2 h-full w-px origin-top bg-signal"
          />
          <motion.div
            style={{ top: glowTop }}
            className="absolute left-[9px] h-3.5 w-3.5 rounded-full bg-signal shadow-[0_0_24px_6px_oklch(0.82_0.155_178/45%)]"
          />
          <div className="space-y-12">
            {STAGES.map((s, i) => (
              <Stage key={s.label} {...s} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stage({
  icon: Icon,
  label,
  detail,
  index,
}: {
  icon: typeof GitBranch;
  label: string;
  detail: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-45% 0px -35% 0px" });

  return (
    <motion.div
      ref={ref}
      animate={{ opacity: inView ? 1 : 0.35, x: inView ? 0 : -12 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div className="absolute -left-10 top-1 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-background">
        <Icon
          className={`h-4 w-4 transition-colors duration-500 ${
            inView ? "text-signal" : "text-muted-foreground"
          }`}
        />
      </div>
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-mono text-[11px] text-signal/70">0{index + 1}</span>
        <h3 className="font-display text-2xl font-semibold tracking-tight">{label}</h3>
      </div>
      <p className="mt-2 font-mono text-sm text-muted-foreground">{detail}</p>
    </motion.div>
  );
}

/* ---------------- Projects ---------------- */

const PROJECTS = [
  {
    name: "Child Lens",
    tag: "product",
    body: "Parent-focused behavior-support platform for ages 3–12, designed around privacy and guided workflows.",
    href: "https://child-behavior-compass.vercel.app/",
    stack: ["react", "supabase", "production"],
  },
  {
    name: "Polling App",
    tag: "realtime",
    body: "Real-time polling system with backend workflow automation and a production-focused setup.",
    href: "https://polling-5rz6qbxru-michaels-projects-f46388ef.vercel.app/",
    stack: ["realtime", "backend", "automation"],
  },
  {
    name: "PAIXX",
    tag: "commerce",
    body: "Luxury streetwear platform exploring pain, purpose and peace through editorial design.",
    href: "https://deno-fresh-poc.vercel.app/",
    stack: ["deno fresh", "editorial", "edge"],
  },
  {
    name: "Real Estate Portfolio",
    tag: "delivery",
    body: "Deployment-ready portfolio with structured environments and clean build pipelines.",
    href: "https://real-estate-pnsevn9y2-michaels-projects-f46388ef.vercel.app/",
    stack: ["envs", "ci/cd", "build"],
  },
];

export function Projects() {
  return (
    <section id="projects" className="relative px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-signal">
            03 — live projects
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight">
            Shipped, running, reachable.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => blip("click")}
                className="group block h-full"
              >
                <Tilt className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface/70 p-7">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 rounded-full border border-signal/25 bg-signal/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-pulse-ring absolute inset-0 rounded-full bg-signal" />
                        <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                      </span>
                      live · {p.tag}
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-signal" />
                  </div>

                  <h3 className="mt-8 font-display text-2xl font-semibold tracking-tight">
                    {p.name}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-md border border-border bg-background/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <span className="mt-6 block h-px w-full origin-left scale-x-0 bg-signal transition-transform duration-500 group-hover:scale-x-100" />
                </Tilt>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden px-6 py-32 sm:px-10">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/10 blur-[140px]" />
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-signal">
            04 — contact
          </p>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,6vw,4.5rem)] font-bold leading-[1] tracking-tight">
            Let's put something
            <span className="text-signal-gradient"> into production.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            Open to remote roles and client collaborations in backend engineering and DevOps.
          </p>
        </Reveal>

        <Reveal delay={0.12} className="mt-12 flex flex-wrap justify-center gap-4">
          <Magnetic>
            <a
              href="mailto:michealdevops@gmail.com"
              onClick={() => blip("click")}
              className="inline-flex items-center gap-2 rounded-full bg-signal px-8 py-4 font-mono text-[13px] font-semibold uppercase tracking-[0.14em] text-primary-foreground shadow-[var(--shadow-signal)]"
            >
              michealdevops@gmail.com
            </a>
          </Magnetic>
        </Reveal>
      </div>

      <footer className="relative mx-auto mt-28 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-border pt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        <span>michaeldevops — nigeria</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
          all systems operational
        </span>
      </footer>
    </section>
  );
}
