import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2, Info } from "lucide-react";
import Navbar from "../../components/marketing/Navbar";
import Footer from "../../components/marketing/Footer";
import ChatWidget from "../../components/marketing/ChatWidget";
import DarkHeader from "../../components/marketing/DarkHeader";
import { api, type AuditResult } from "../../lib/api";

const categories = [
  "Restaurant / Café",
  "Salon / Spa",
  "Retail Shop",
  "Service Business",
  "Clinic / Healthcare",
  "Other",
];

const setupOptions = [
  "I don't have a website",
  "I have a website but no online booking/ordering",
  "I answer customer questions manually",
  "I track orders/inventory manually",
  "I don't collect reviews systematically",
  "I don't send any automated follow-ups",
];

export default function AutomationAudit() {
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [currentSetup, setCurrentSetup] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);

  const toggleSetup = (option: string) => {
    setCurrentSetup((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.runAudit(businessName, category, currentSetup, email || undefined);
      setResult(res);
    } catch {
      setError("Couldn't generate your audit right now — make sure the backend is running with an GEMINI_API_KEY set.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setBusinessName("");
    setCurrentSetup([]);
    setEmail("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <DarkHeader
        eyebrow="Free & instant"
        title="Get your free Automation Audit"
        subtitle="Tell us about your business — get a personalized breakdown of what automation could do for you, generated live by the same AI Grovance actually runs on."
      />

      <section className="mx-auto w-full max-w-2xl flex-1 px-6 pt-14 pb-16">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onSubmit={submit}
              className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg"
            >
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Business name</label>
                <input
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Aroma Spice Kitchen"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Which of these describe your business? (select any)
                </label>
                <div className="space-y-2">
                  {setupOptions.map((option) => (
                    <label
                      key={option}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={currentSetup.includes(option)}
                        onChange={() => toggleSetup(option)}
                        className="accent-brand"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Email (optional — we'll also note this for a real follow-up)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@business.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                />
              </div>

              {error && <p className="mb-4 text-sm text-danger">{error}</p>}

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark disabled:opacity-50"
              >
                <Sparkles size={16} />
                {loading ? "Analyzing…" : "Generate my free audit"}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                  Audit for {businessName}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-ink">{result.tagline}</h2>

                <div className="mt-6">
                  <h3 className="mb-2 text-sm font-semibold text-ink">What we noticed</h3>
                  <ul className="space-y-2">
                    {result.painPoints.map((p, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                        {p}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold text-ink">Recommended for {businessName}</h3>
                  <div className="group relative">
                    <Info size={14} className="cursor-help text-slate-400" />
                    <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-56 -translate-x-1/2 rounded-lg bg-ink px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                      "When" is the trigger that starts the automation, and "Then" is what
                      happens automatically — no manual work needed.
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {result.tools.map((tool, i) => (
                    <motion.div
                      key={tool.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10 text-brand">
                          <Sparkles size={13} />
                        </div>
                        <h4 className="text-sm font-semibold text-ink">{tool.name}</h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <span className="rounded-full bg-slate-50 px-2.5 py-1">When: {tool.when}</span>
                        <ArrowRight size={12} className="text-slate-300" />
                        <span className="rounded-full bg-info/5 px-2.5 py-1 text-info">Then: {tool.then}</span>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">{tool.why}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {email && (
                <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-4 text-sm text-success">
                  <CheckCircle2 size={16} />
                  We've noted your email — expect a real follow-up from Grovance.
                </div>
              )}

              <div className="flex gap-3">
                <a
                  href="/contact"
                  className="flex-1 rounded-lg bg-brand py-3 text-center text-sm font-semibold text-white hover:bg-brand-dark"
                >
                  Talk to us about this
                </a>
                <button
                  onClick={reset}
                  className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-white"
                >
                  Run another audit
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
