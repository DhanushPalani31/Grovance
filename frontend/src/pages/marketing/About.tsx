import { motion } from "framer-motion";
import Navbar from "../../components/marketing/Navbar";
import Footer from "../../components/marketing/Footer";
import ChatWidget from "../../components/marketing/ChatWidget";

export default function About() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl flex-1 px-6 py-16"
      >
        <h1 className="text-3xl font-bold text-brand-ink">About Grovance</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          Grovance was built on a simple idea: local shops deserve the same automation
          and AI tooling that large e-commerce brands take for granted, without the
          enterprise price tag or the black-box mystery. We build each engagement
          around what a specific business actually needs, then stay on to run and
          maintain it.
        </p>
        <p className="mt-4 text-slate-600 leading-relaxed">
          Everything in our demo portal is a real, working example of that philosophy —
          the automation rules, the AI assistant, the maintenance dashboard. We don't
          ask you to imagine what it would look like; we show you.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { label: "Founded", value: "2025" },
            { label: "Focus", value: "Local shops & brands" },
            { label: "Approach", value: "Automation + AI + Maintenance" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{item.label}</p>
              <p className="mt-2 font-semibold text-brand-ink">{item.value}</p>
            </div>
          ))}
        </div>
      </motion.section>
      <Footer />
      <ChatWidget />
    </div>
  );
}
