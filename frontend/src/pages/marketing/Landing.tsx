import { Link } from "react-router-dom";
import { Zap, Bot, ShieldCheck, ArrowRight } from "lucide-react";
import Navbar from "../../components/marketing/Navbar";
import ChatWidget from "../../components/marketing/ChatWidget";

const pillars = [
  {
    icon: Zap,
    title: "Automation",
    copy: "Order confirmations, low-stock alerts, daily summaries — rules that run themselves, tailored to how your shop actually works.",
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
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="text-4xl font-bold text-brand-ink md:text-5xl">
          Automation, AI, and maintenance —{" "}
          <span className="bg-gradient-to-r from-brand-indigo to-brand-teal bg-clip-text text-transparent">
            built for local shops
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          Grovance builds it around what your business actually needs — and this whole
          site is proof, not a promise. Chat with the assistant in the corner, or step
          into the live client portal below.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            to="/portal"
            className="flex items-center gap-2 rounded-lg bg-brand-indigo px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Explore the Live Demo <ArrowRight size={16} />
          </Link>
          <Link
            to="/contact"
            className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-white"
          >
            Talk to us
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-indigo/10 text-brand-indigo">
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-brand-ink">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold text-brand-ink">This isn't a mockup</h2>
          <p className="mt-3 text-slate-600">
            The chat widget on this page, the demo portal's automation rules, the
            AI-generated content, the live status page — every one of them is calling a
            real Grovance backend right now. What you try here is what you get.
          </p>
        </div>
      </section>

      <ChatWidget />
    </div>
  );
}
