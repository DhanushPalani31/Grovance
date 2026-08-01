import { motion } from "framer-motion";

export default function UptimeRing({ status }: { status: "ok" | "warning" | "danger" }) {
  const colors = { ok: "#10B981", warning: "#F59E0B", danger: "#EF4444" };
  const pct = status === "ok" ? 100 : status === "warning" ? 60 : 15;
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12 -rotate-90">
      <circle cx="24" cy="24" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="4" />
      <motion.circle
        cx="24"
        cy="24"
        r={radius}
        fill="none"
        stroke={colors[status]}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </svg>
  );
}
