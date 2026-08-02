import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Navbar from "../../components/marketing/Navbar";
import Footer from "../../components/marketing/Footer";
import ChatWidget from "../../components/marketing/ChatWidget";
import DarkHeader from "../../components/marketing/DarkHeader";

const tiers = [
  {
    name: "Starter",
    price: "Custom",
    tagline: "For a single brand getting automation basics in place.",
    features: ["Core automation rules", "Maintenance & support", "Monthly check-ins"],
  },
  {
    name: "Growth",
    price: "Custom",
    tagline: "Automation + AI, scoped to your specific requirements.",
    features: [
      "Everything in Starter",
      "AI Assistant for customers",
      "Content Studio",
      "Weekly AI insights",
    ],
    highlighted: true,
  },
  {
    name: "Partner",
    price: "Custom",
    tagline: "Full end-to-end build, hosting, and ongoing maintenance.",
    features: [
      "Everything in Growth",
      "Dedicated infrastructure",
      "Priority support SLA",
      "Custom integrations",
    ],
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <DarkHeader
        eyebrow="Simple, scoped pricing"
        title="Pricing"
        subtitle="Every engagement is scoped around what your brand actually needs — these are starting points for a conversation, not a fixed menu."
      />

      <section className="mx-auto max-w-5xl px-6 pt-14 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={`rounded-xl border p-6 transition-shadow hover:shadow-lg ${
                tier.highlighted
                  ? "border-brand bg-white shadow-lg shadow-brand/10"
                  : "border-slate-200 bg-white shadow-sm"
              }`}
            >
              <h2 className="font-semibold text-ink">{tier.name}</h2>
              <p className="mt-1 text-2xl font-bold text-ink">{tier.price}</p>
              <p className="mt-2 text-sm text-slate-500">{tier.tagline}</p>
              <ul className="mt-4 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check size={14} className="text-success" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className={`mt-6 block rounded-lg px-4 py-2 text-center text-sm font-medium ${
                  tier.highlighted
                    ? "bg-brand text-white hover:bg-brand-dark"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Get in touch
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
      <ChatWidget />
    </div>
  );
}
