import { motion, AnimatePresence } from "framer-motion";

const COLORS = ["#1B2A6B", "#0EA5A4", "#10B981", "#F59E0B"];

export default function ConfettiBurst({ show }: { show: boolean }) {
  if (!show) return null;
  const pieces = Array.from({ length: 14 });

  return (
    <AnimatePresence>
      <div className="pointer-events-none absolute inset-0 z-10 overflow-visible">
        {pieces.map((_, i) => {
          const angle = (i / pieces.length) * Math.PI * 2;
          const distance = 40 + Math.random() * 30;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          return (
            <motion.span
              key={i}
              initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              animate={{ opacity: 0, x, y, scale: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
          );
        })}
      </div>
    </AnimatePresence>
  );
}
