import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/">
          <img src="/logo.svg" alt="Grovance" className="h-8 w-auto" />
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? "text-brand-indigo" : "text-slate-600 hover:text-brand-indigo"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <Link
          to="/portal"
          className="rounded-lg bg-brand-indigo px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          View Live Demo
        </Link>
      </div>
    </header>
  );
}
