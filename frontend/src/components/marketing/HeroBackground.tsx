import { motion } from "framer-motion";

// Glow accents for a dark navy hero. Deliberately brand + accent only —
// no extra colors, and never amber/red/green since those are reserved
// for real success/warning/danger states elsewhere in the app.
export default function HeroBackground() {
  return (
    <div className="hero-grid pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-accent/25 blur-[100px]"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-0 top-0 h-96 w-96 rounded-full bg-brand/40 blur-[100px]"
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent/15 blur-[100px]"
      />
    </div>
  );
}
