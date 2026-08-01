import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";

const columns = [
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/careers", label: "Careers" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Product",
    links: [
      { to: "/services", label: "Services" },
      { to: "/pricing", label: "Pricing" },
      { to: "/portal", label: "Live Demo" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/terms", label: "Terms of Service" },
      { to: "/privacy", label: "Privacy Policy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-ink text-slate-300">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <img src="/logo.svg" alt="Grovance" className="h-7 w-auto brightness-0 invert" />
            <p className="mt-4 max-w-xs text-sm text-slate-400">
              Automation, AI, and end-to-end maintenance for brands and growing
              businesses — built and proven on our own platform.
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                Chennai, India
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} />
                grovanceco@gmail.com
              </div>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-slate-400 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Grovance. All rights reserved.</p>
          <p>Built on Grovance — automation, AI, and maintenance, demonstrated live.</p>
        </div>
      </div>
    </footer>
  );
}
