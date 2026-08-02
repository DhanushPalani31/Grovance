import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../lib/AuthContext";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const onAuditPage = location.pathname === "/audit";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`sticky top-0 z-20 border-b bg-white/85 backdrop-blur-md transition-shadow ${
        scrolled ? "border-slate-200 shadow-sm" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="shrink-0">
          <img src="/logo.svg" alt="Grovance" className="h-8 w-auto" />
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? "text-brand" : "text-slate-600 hover:text-brand"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {!user && (
            <Link to="/login" className="hidden text-sm font-medium text-slate-600 hover:text-brand sm:block">
              Log in
            </Link>
          )}
          {!onAuditPage && (
            <Link
              to="/audit"
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-dark hover:shadow-md"
            >
              Free Audit
            </Link>
          )}
          {user && (
            <Link
              to="/portal"
              className="rounded-lg border border-brand/30 px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand/5"
            >
              My Dashboard
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}
