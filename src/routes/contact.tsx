import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/eduvest/SiteLayout";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — EduVest" },
      { name: "description", content: "Get in touch with the EduVest team." },
      { property: "og:title", content: "Contact — EduVest" },
      { property: "og:description", content: "Get in touch with the EduVest team." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Contact</p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Let's bring EduVest to your school.
          </h1>
        </div>
      </section>
      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-5">
            {[
              { Icon: Mail, label: "Email", value: "hello@eduvest.app" },
              { Icon: Phone, label: "Phone", value: "+237 6 00 00 00 00" },
              { Icon: MapPin, label: "Address", value: "Douala · Yaoundé · Remote-first" },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{label}</div>
                  <div className="font-semibold">{value}</div>
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); alert("Thanks — we'll be in touch."); }}
            className="space-y-4 rounded-2xl border border-border bg-card p-8 shadow-soft"
          >
            <h2 className="text-xl font-semibold">Book a demo</h2>
            <input required placeholder="School name" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            <input required type="email" placeholder="Work email" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            <input required placeholder="Phone" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            <textarea rows={4} placeholder="Tell us about your school" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            <Button variant="hero" size="lg" className="w-full" type="submit">Request demo</Button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
