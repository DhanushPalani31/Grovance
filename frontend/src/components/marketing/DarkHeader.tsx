import { motion } from "framer-motion";
import type { ReactNode } from "react";
import HeroBackground from "./HeroBackground";

export default function DarkHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-ink pb-12 pt-16 text-center">
      <HeroBackground />
      <div className="relative mx-auto max-w-3xl px-6">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent"
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="text-3xl font-bold text-white md:text-4xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="mt-3 text-slate-300"
          >
            {subtitle}
          </motion.p>
        )}
        {children}
      </div>
    </section>
  );
}
