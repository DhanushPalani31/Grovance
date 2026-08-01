import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import Navbar from "../../components/marketing/Navbar";
import Footer from "../../components/marketing/Footer";
import ChatWidget from "../../components/marketing/ChatWidget";

const tiers = [
  {
    name: "Starter",
    price: "Custom",
    tagline: "For a single shop getting automation basics in place.",
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
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-brand-ink">Pricing</h1>
        <p className="mt-3 text-slate-600">
          Every engagement is scoped around what your shop actually needs — these are
          starting points for a conversation, not a fixed menu.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl border p-6 ${
                tier.highlighted
                  ? "border-brand-indigo bg-white shadow-lg shadow-indigo-100"
                  : "border-slate-200 bg-white"
              }`}
            >
              <h2 className="font-semibold text-brand-ink">{tier.name}</h2>
              <p className="mt-1 text-2xl font-bold text-brand-ink">{tier.price}</p>
              <p className="mt-2 text-sm text-slate-500">{tier.tagline}</p>
              <ul className="mt-4 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check size={14} className="text-brand-teal" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className={`mt-6 block rounded-lg px-4 py-2 text-center text-sm font-medium ${
                  tier.highlighted
                    ? "bg-brand-indigo text-white hover:bg-indigo-700"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Get in touch
              </Link>
            </div>
          ))}
        </div>
      </section>
      <Footer />
      <ChatWidget />
    </div>
  );
}
