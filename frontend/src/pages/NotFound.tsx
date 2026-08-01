import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-sm font-semibold text-brand-indigo">404</p>
        <h1 className="mt-2 text-3xl font-bold text-brand-ink">Page not found</h1>
        <p className="mt-3 text-slate-600">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-brand-indigo px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Back to home
        </Link>
      </motion.div>
    </div>
  );
}
