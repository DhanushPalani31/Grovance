import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Bot, ShieldCheck, Code2, ArrowRight, Sparkles } from "lucide-react";
import Navbar from "../../components/marketing/Navbar";
import Footer from "../../components/marketing/Footer";
import ChatWidget from "../../components/marketing/ChatWidget";
import Projects from "../../components/marketing/Projects";
import ScrollProgressBar from "../../components/marketing/ScrollProgressBar";
import HeroBackground from "../../components/marketing/HeroBackground";
import FloatingStatCard from "../../components/marketing/FloatingStatCard";
import { api, type DashboardStats, type HealthStatus } from "../../lib/api";

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
  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    api.getStats().then(setStats).catch(() => setStats(null));
    api.getHealth().then(setHealth).catch(() => setHealth(null));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <ScrollProgressBar />
      <Navbar />

      {/* Bold dark hero — the marketing "wow", proven with real live numbers instead of decoration */}
      <section className="relative overflow-hidden bg-ink pb-16 pt-20 text-center">
        <HeroBackground />

        <div className="relative mx-auto max-w-4xl px-6">
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-accent"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Live demo — everything below is real
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl font-bold text-white md:text-6xl"
          >
            Automation, AI, and maintenance —{" "}
            <span className="bg-gradient-to-r from-accent to-white bg-clip-text text-transparent">
              built for growing brands
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-slate-300"
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
              className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-105"
            >
              Explore the Live Demo <ArrowRight size={16} />
            </Link>
            <Link
              to="/audit"
              className="flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent/20"
            >
              <Sparkles size={16} /> Get a Free Audit
            </Link>
            <Link
              to="/contact"
              className="rounded-lg border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Talk to us
            </Link>
          </motion.div>
        </div>

        {/* Floating proof cards — real numbers from the live backend, not decoration */}
        {stats && (
          <>
            <FloatingStatCard
              icon={Zap}
              label="Automation events today"
              value={stats.automationEventsToday}
              className="left-[8%] top-[58%]"
              delay={0.5}
            />
            <FloatingStatCard
              icon={Bot}
              label="Active automation rules"
              value={stats.activeAutomationRules}
              className="right-[10%] top-[30%]"
              delay={0.65}
            />
          </>
        )}
        {health && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            whileHover={{ y: -4 }}
            className="absolute right-[6%] top-[62%] hidden rounded-xl border border-white/10 bg-white/95 p-3.5 shadow-xl backdrop-blur lg:block"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10 text-success">
                <ShieldCheck size={15} />
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">System status</p>
                <p className="text-sm font-bold text-ink">
                  {health.status === "ok" ? "All operational" : "Checking…"}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Pillar cards */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ icon: Icon, title, copy }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
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
