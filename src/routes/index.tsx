import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Ticker, Capabilities, Pipeline, Projects, Contact } from "@/components/site/sections";
import { SignalCursor } from "@/components/site/cursor";

const title = "MichaelDevOps — Backend & DevOps Engineer";
const description =
  "Linux-native backend and DevOps engineer building automation, CI/CD pipelines and deployments that stay boring in production.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://michaeldev0ps.vercel.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "MichaelDevOps",
          alternateName: "Michael DevOps",
          url: "https://michaeldev0ps.vercel.app/",
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative bg-background">
      <SignalCursor />
      <Nav />
      <Hero />
      <Ticker />
      <Capabilities />
      <Pipeline />
      <Projects />
      <Contact />
    </main>
  );
}
