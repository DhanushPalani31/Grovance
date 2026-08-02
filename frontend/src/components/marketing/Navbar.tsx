import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu automatically whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

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
            <div className="hidden items-center gap-3 md:flex">
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-brand">
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Sign up
              </Link>
            </div>
          )}
          {!onAuditPage && (
            <Link
              to="/audit"
              className="hidden rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-dark hover:shadow-md md:block"
            >
              Free Audit
            </Link>
          )}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="text-slate-600 hover:text-brand md:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-200 bg-white md:hidden"
          >
            <nav className="flex flex-col px-6 py-4">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `border-b border-slate-100 py-3 text-sm font-medium last:border-0 ${
                      isActive ? "text-brand" : "text-slate-600"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              {!user && (
                <>
                  <Link to="/login" className="border-b border-slate-100 py-3 text-sm font-medium text-slate-600">
                    Log in
                  </Link>
                  <Link to="/signup" className="border-b border-slate-100 py-3 text-sm font-medium text-slate-600">
                    Sign up
                  </Link>
                </>
              )}
              {!onAuditPage && (
                <Link
                  to="/audit"
                  className="mt-3 rounded-lg bg-brand px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Free Audit
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
