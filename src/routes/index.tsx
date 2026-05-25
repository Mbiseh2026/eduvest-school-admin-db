import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/eduvest/SiteLayout";
import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { Features } from "@/components/landing/Features";
import { Customers } from "@/components/landing/Customers";
import { AISection } from "@/components/landing/AISection";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EduVest — School ERP + Financial Intelligence" },
      {
        name: "description",
        content:
          "Run admissions, attendance, finance, payroll, communication and AI for your school in one workspace.",
      },
      { property: "og:title", content: "EduVest — School ERP + Financial Intelligence" },
      {
        property: "og:description",
        content:
          "Run admissions, attendance, finance, payroll, communication and AI for your school in one workspace.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      <Hero />
      <About />
      <Features />
      <Customers />
      <AISection />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
    </SiteLayout>
  );
}
