import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-5 lg:gap-12 lg:px-8">
        <div className="lg:col-span-2">
          <Logo variant="light" />
          <p className="mt-4 max-w-sm text-sm text-navy-foreground/70">
            EduVest is the School ERP + Financial Intelligence platform for modern African schools.
            Run academics, finance and communication from one trusted workspace.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Product</h4>
          <ul className="mt-4 space-y-2 text-sm text-navy-foreground/70">
            <li><Link to="/features" className="hover:text-white">Features</Link></li>
            <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link to="/ai" className="hover:text-white">EduVest AI</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-navy-foreground/70">
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><a href="#" className="hover:text-white">Privacy</a></li>
            <li><a href="#" className="hover:text-white">Terms</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Get a demo</h4>
          <p className="mt-4 text-sm text-navy-foreground/70">
            See EduVest with your school's data in 30 minutes.
          </p>
          <a
            href="mailto:hello@eduvest.app"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Mail className="h-4 w-4" />
            Book a demo
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-navy-foreground/60 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} EduVest. All rights reserved.</p>
          <p>Made for African schools — built for the world.</p>
        </div>
      </div>
    </footer>
  );
}
