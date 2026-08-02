import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Bot, ShieldCheck, X } from "lucide-react";

const STORAGE_KEY = "grovance_tour_seen";

const steps = [
  {
    icon: Zap,
    title: "This dashboard is real",
    body: "Every stat and activity item you'll see is coming from a live backend, not placeholder numbers.",
  },
  {
    icon: Zap,
    title: "Try the Automation Center",
    body: "Click 'Run now' on any rule and watch it appear in the Activity Feed seconds later — that's proof, not a demo trick.",
    link: "/portal/automation",
    linkLabel: "Go there now",
  },
  {
    icon: Bot,
    title: "Talk to the AI Assistant",
    body: "It's genuinely powered by Gemini — ask it something and see a real response.",
    link: "/portal/ai-assistant",
    linkLabel: "Try it",
  },
  {
    icon: ShieldCheck,
    title: "Check Maintenance, anytime",
    body: "Live uptime, a real ticket system, and a changelog pulled from our actual GitHub commits.",
    link: "/portal/maintenance",
    linkLabel: "See it",
  },
];

export default function GuidedTour() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  const current = steps[step];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            className="relative w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <button
              onClick={dismiss}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
              aria-label="Close tour"
            >
              <X size={16} />
            </button>

            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <current.icon size={20} />
            </div>
            <h2 className="font-semibold text-ink">{current.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{current.body}</p>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      i === step ? "bg-brand" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                {current.link && (
                  <button
                    onClick={() => {
                      dismiss();
                      navigate(current.link!);
                    }}
                    className="rounded-lg border border-brand/30 px-3 py-1.5 text-xs font-medium text-brand hover:bg-brand/5"
                  >
                    {current.linkLabel}
                  </button>
                )}
                <button
                  onClick={() => (step < steps.length - 1 ? setStep(step + 1) : dismiss())}
                  className="rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark"
                >
                  {step < steps.length - 1 ? "Next" : "Done"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
