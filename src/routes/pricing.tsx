import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/eduvest/SiteLayout";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — EduVest" },
      { name: "description", content: "Simple, school-friendly pricing — placeholder tiers." },
      { property: "og:title", content: "Pricing — EduVest" },
      { property: "og:description", content: "Simple, school-friendly pricing — placeholder tiers." },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Pricing</p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Honest pricing. Real value.
          </h1>
        </div>
      </section>
      <Pricing />
      <FAQ />
    </SiteLayout>
  );
}
