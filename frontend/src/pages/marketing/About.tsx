import { motion } from "framer-motion";
import Navbar from "../../components/marketing/Navbar";
import Footer from "../../components/marketing/Footer";
import ChatWidget from "../../components/marketing/ChatWidget";
import DarkHeader from "../../components/marketing/DarkHeader";

export default function About() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <DarkHeader eyebrow="Who we are" title="About Grovance" />

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl flex-1 px-6 pt-14 pb-16"
      >
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
          <p className="text-slate-600 leading-relaxed">
            Grovance was built on a simple idea: brands deserve the same custom
            applications, automation, and AI tooling that large e-commerce brands take
            for granted, without the enterprise price tag or the black-box mystery. We
            build each engagement around what a specific business actually needs —
            whether that's a bespoke application, an automated workflow, or an AI
            feature — then stay on to run and maintain it.
          </p>
          <p className="mt-4 text-slate-600 leading-relaxed">
            The chat assistant on this site and the free Automation Audit are real,
            working examples of that philosophy. We don't ask you to imagine what a
            custom application, automation, or AI could do for your brand; we show you,
            live, before you've even talked to us.
          </p>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {[
            { label: "Founded", value: "2025" },
            { label: "Focus", value: "Brands & growing businesses" },
            { label: "Approach", value: "Custom Applications + Automation + AI + Maintenance" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-ink">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
      <Footer />
      <ChatWidget />
    </div>
  );
}
