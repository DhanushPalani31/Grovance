import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Code2,
  Zap,
  Bot,
  ShieldCheck,
  MessageSquareReply,
  PackageCheck,
  ShoppingBag,
  Star,
  BellRing,
  RefreshCcw,
  ExternalLink,
} from "lucide-react";
import Navbar from "../../components/marketing/Navbar";
import Footer from "../../components/marketing/Footer";
import ChatWidget from "../../components/marketing/ChatWidget";

// Custom App Development listed first, per how we lead with clients — a bespoke
// build is the entry point, with automation/AI/maintenance layered in as needed.
const services = [
  {
    icon: Code2,
    title: "Custom app development",
    description:
      "We design and build a bespoke application around your exact requirements — web, internal tools, integrations. Claude is brought in for AI-assisted features only where it adds real, measurable value, not as a default.",
    demoLabel: "Start a custom project →",
    demoLink: "/contact",
  },
  {
    icon: Zap,
    title: "Automation",
    description:
      "We map your brand's repetitive work into simple if-this-then-that rules you can see and toggle yourself.",
    demoLabel: "See it live in the Automation Center →",
    demoLink: "/portal/automation",
  },
  {
    icon: Bot,
    title: "AI, scoped to your requirements",
    description:
      "A customer-facing assistant trained on your brand's own information, a content studio for product descriptions and captions, and weekly insights written in plain language.",
    demoLabel: "Chat with the AI Assistant →",
    demoLink: "/portal/ai-assistant",
  },
  {
    icon: ShieldCheck,
    title: "End-to-end maintenance",
    description:
      "We don't disappear after launch. Live uptime, a real support ticket queue, and a changelog of what we shipped for you — all visible, all the time.",
    demoLabel: "View the Maintenance page →",
    demoLink: "/portal/maintenance",
  },
];

// Named automation "tools" — the specific, widely-used building blocks we assemble
// into a brand's automation rules, not a vague "automation" catch-all.
const automationTools = [
  {
    icon: MessageSquareReply,
    name: "Auto-Reply",
    copy: "Instantly responds to common customer messages and inquiries, day or night.",
  },
  {
    icon: PackageCheck,
    name: "Order Taken",
    copy: "Automatically confirms new orders and kicks off fulfillment the moment they're placed.",
  },
  {
    icon: ShoppingBag,
    name: "Abandoned Cart Recovery",
    copy: "Nudges customers who added items but didn't check out.",
  },
  {
    icon: BellRing,
    name: "Low-Stock Alerts",
    copy: "Notifies the right person the moment inventory runs low.",
  },
  {
    icon: Star,
    name: "Review Requests",
    copy: "Follows up after a purchase to ask for a review, automatically.",
  },
  {
    icon: RefreshCcw,
    name: "Daily/Weekly Summaries",
    copy: "Delivers a plain-language recap of what happened, on a schedule.",
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-ink">Services</h1>
        <p className="mt-3 text-slate-600">
          Four services, working together — and every one is running live in the demo
          portal, not just described here.
        </p>
      </section>

      <section className="mx-auto max-w-4xl space-y-6 px-6 pb-16">
        {services.map(({ icon: Icon, title, description, demoLabel, demoLink }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Icon size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-ink">{title}</h2>
                <p className="mt-2 text-sm text-slate-600">{description}</p>
                <Link to={demoLink} className="mt-3 inline-block text-sm font-medium text-brand hover:underline">
                  {demoLabel}
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-bold text-ink">Automation tools we're building</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-500">
            Widely-used building blocks we assemble into rules for your brand — not a
            vague promise, specific tools.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {automationTools.map(({ icon: Icon, name, copy }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="rounded-xl border border-slate-200 p-5"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-info/10 text-info">
                  <Icon size={16} />
                </div>
                <h3 className="text-sm font-semibold text-ink">{name}</h3>
                <p className="mt-1 text-xs text-slate-500">{copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold text-ink">Projects completed</h2>
          <p className="mt-2 text-sm text-slate-500">One delivered so far — more in progress.</p>
          <motion.a
            href="https://www.nayabuilders.com"
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mt-6 block rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-ink">Naya Builders</h3>
                <p className="mt-1 text-sm text-slate-500">
                  A builder application — website for a construction company in Chennai
                </p>
              </div>
              <ExternalLink size={18} className="shrink-0 text-slate-400" />
            </div>
            <p className="mt-3 text-sm font-medium text-brand">nayabuilders.com</p>
            <p className="mt-2 text-xs text-slate-400">Delivered as a freelance project.</p>
          </motion.a>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
