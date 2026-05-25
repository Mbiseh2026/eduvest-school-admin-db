import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/eduvest/SiteLayout";
import { Features } from "@/components/landing/Features";
import { Customers } from "@/components/landing/Customers";
import { CTA } from "@/components/landing/CTA";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — EduVest" },
      { name: "description", content: "Ten modules. One workspace. Built for modern schools." },
      { property: "og:title", content: "Features — EduVest" },
      { property: "og:description", content: "Ten modules. One workspace. Built for modern schools." },
      { property: "og:url", content: "/features" },
    ],
    links: [{ rel: "canonical", href: "/features" }],
  }),
  component: FeaturesPage,
});

function FeaturesPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Products & Features</p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Everything your school needs. Nothing it doesn't.
          </h1>
        </div>
      </section>
      <Features />
      <Customers />
      <CTA />
    </SiteLayout>
  );
}
