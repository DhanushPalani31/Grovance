import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <img src="/logo.svg" alt="Grovance" className="h-6 w-auto opacity-80" />
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
          <Link to="/about" className="hover:text-brand-indigo">About</Link>
          <Link to="/services" className="hover:text-brand-indigo">Services</Link>
          <Link to="/pricing" className="hover:text-brand-indigo">Pricing</Link>
          <Link to="/contact" className="hover:text-brand-indigo">Contact</Link>
          <Link to="/terms" className="hover:text-brand-indigo">Terms</Link>
          <Link to="/privacy" className="hover:text-brand-indigo">Privacy</Link>
        </div>
        <p className="text-xs text-slate-400">© {new Date().getFullYear()} Grovance</p>
      </div>
    </footer>
  );
}
