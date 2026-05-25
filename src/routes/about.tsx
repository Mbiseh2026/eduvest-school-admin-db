import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/eduvest/SiteLayout";
import { About } from "@/components/landing/About";
import { CTA } from "@/components/landing/CTA";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — EduVest" },
      { name: "description", content: "Mission, vision and the story behind EduVest." },
      { property: "og:title", content: "About — EduVest" },
      { property: "og:description", content: "Mission, vision and the story behind EduVest." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">About</p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            We're building the operating system for African schools.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-muted-foreground">
            EduVest started with a simple frustration: school software felt like punishment,
            and school finance felt like a guess. We're fixing both — in one platform.
          </p>
        </div>
      </section>
      <About />
      <CTA />
    </SiteLayout>
  );
}
