import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import AnimatedNumber from "../AnimatedNumber";

export default function FloatingStatCard({
  icon: Icon,
  label,
  value,
  prefix = "",
  suffix = "",
  className = "",
  delay = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className={`absolute hidden rounded-xl border border-white/10 bg-white/95 p-3.5 shadow-xl backdrop-blur lg:block ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <Icon size={15} />
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
          <p className="text-sm font-bold text-ink">
            {prefix}
            <AnimatedNumber value={value} />
            {suffix}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
