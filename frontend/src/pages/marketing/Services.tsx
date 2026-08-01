import { Link } from "react-router-dom";
import { Zap, Bot, ShieldCheck } from "lucide-react";
import Navbar from "../../components/marketing/Navbar";
import ChatWidget from "../../components/marketing/ChatWidget";

const services = [
  {
    icon: Zap,
    title: "Automation",
    description:
      "We map your shop's repetitive work — order confirmations, stock alerts, daily/weekly reports, backups — into simple if-this-then-that rules you can see and toggle yourself.",
    demoLabel: "See it live in the Automation Center →",
    demoLink: "/portal/automation",
  },
  {
    icon: Bot,
    title: "AI, scoped to your requirements",
    description:
      "A customer-facing assistant trained on your shop's own information, a content studio for product descriptions and captions, and weekly insights written in plain language — each module is opt-in based on what you actually asked for.",
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

export default function Services() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-brand-ink">Services</h1>
        <p className="mt-3 text-slate-600">
          Three services, working together — and every one of them is running live in
          the demo portal, not just described here.
        </p>
      </section>

      <section className="mx-auto max-w-4xl space-y-6 px-6 pb-24">
        {services.map(({ icon: Icon, title, description, demoLabel, demoLink }) => (
          <div key={title} className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-indigo/10 text-brand-indigo">
                <Icon size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-brand-ink">{title}</h2>
                <p className="mt-2 text-sm text-slate-600">{description}</p>
                <Link to={demoLink} className="mt-3 inline-block text-sm font-medium text-brand-indigo hover:underline">
                  {demoLabel}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>
      <ChatWidget />
    </div>
  );
}
