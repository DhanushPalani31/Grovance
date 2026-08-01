import { motion } from "framer-motion";
import { Star } from "lucide-react";

// NOTE: These are illustrative placeholder quotes for the demo, not real customers.
// Replace with real, consented customer testimonials before using this commercially.
const testimonials = [
  {
    quote:
      "The automation rules alone saved us hours every week — order confirmations just happen now.",
    name: "Priya M.",
    role: "Owner, a home goods shop",
  },
  {
    quote:
      "Our customers get instant answers from the AI assistant even after we've closed for the day.",
    name: "Daniel R.",
    role: "Owner, a specialty foods store",
  },
  {
    quote:
      "What sold me was being able to see the automation and maintenance working live, not just hear about it.",
    name: "Aisha K.",
    role: "Owner, a boutique clothing brand",
  },
];

export default function Testimonials() {
  return (
    <section className="border-t border-slate-200 bg-slate-50 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-2xl font-bold text-brand-ink">
          What shop owners are saying
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <div className="mb-3 flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm text-slate-600">"{t.quote}"</p>
              <p className="mt-4 text-sm font-medium text-brand-ink">{t.name}</p>
              <p className="text-xs text-slate-400">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
