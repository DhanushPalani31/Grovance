import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Bot, ShieldCheck, Code2, ArrowRight } from "lucide-react";
import Navbar from "../../components/marketing/Navbar";
import Footer from "../../components/marketing/Footer";
import ChatWidget from "../../components/marketing/ChatWidget";
import Projects from "../../components/marketing/Projects";
import ScrollProgressBar from "../../components/marketing/ScrollProgressBar";
import HeroBackground from "../../components/marketing/HeroBackground";
import AnimatedNumber from "../../components/AnimatedNumber";
import { api, type DashboardStats } from "../../lib/api";

const pillars = [
  {
    icon: Code2,
    title: "Custom app development",
    copy: "Need something beyond the standard modules? We design and build bespoke applications around your exact requirements — with Claude integrated wherever it genuinely helps.",
  },
  {
    icon: Zap,
    title: "Automation",
    copy: "Order confirmations, low-stock alerts, daily summaries — rules that run themselves, tailored to how your brand actually works.",
  },
  {
    icon: Bot,
    title: "AI, built around your requirements",
    copy: "A customer-facing assistant, content generation, and plain-language insights — scoped to what you actually need, not a generic bolt-on.",
  },
  {
    icon: ShieldCheck,
    title: "End-to-end maintenance",
    copy: "We built it, we watch it, we fix it. Live uptime, support tickets, and a changelog you can see for yourself.",
  },
];

export default function Landing() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    api.getStats().then(setStats).catch(() => setStats(null));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <ScrollProgressBar />
      <Navbar />

      <section className="relative mx-auto max-w-4xl px-6 py-24 text-center">
        <HeroBackground />
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-ink md:text-5xl"
        >
          Automation, AI, and maintenance —{" "}
          <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
            built for growing brands
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-5 max-w-2xl text-lg text-slate-600"
        >
          Grovance builds it around what your business actually needs — and this whole
          site is proof, not a promise. Chat with the assistant in the corner, or step
          into the live client portal below.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          <Link
            to="/portal"
            className="flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105 hover:bg-brand-dark"
          >
            Explore the Live Demo <ArrowRight size={16} />
          </Link>
          <Link
            to="/contact"
            className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-white"
          >
            Talk to us
          </Link>
        </motion.div>

        {stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            <AnimatedNumber value={stats.automationEventsToday} /> automation events fired today, live
          </motion.div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ icon: Icon, title, copy }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{copy}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Projects />
      <Footer />
      <ChatWidget />
    </div>
  );
}
