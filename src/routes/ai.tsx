import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/eduvest/SiteLayout";
import { AISection } from "@/components/landing/AISection";
import { CTA } from "@/components/landing/CTA";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "EduVest AI — School-aware intelligence" },
      { name: "description", content: "AI that understands schools. Informational at launch, operational next." },
      { property: "og:title", content: "EduVest AI" },
      { property: "og:description", content: "AI that understands schools. Informational at launch, operational next." },
      { property: "og:url", content: "/ai" },
    ],
    links: [{ rel: "canonical", href: "/ai" }],
  }),
  component: AIPage,
});

function AIPage() {
  return (
    <SiteLayout>
      <AISection />
      <CTA />
    </SiteLayout>
  );
}
