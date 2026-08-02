import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { api } from "../lib/api";
import TrustBadge from "../components/TrustBadge";
import TypewriterText from "../components/TypewriterText";

const kinds = [
  { id: "product-description", label: "Product Description" },
  { id: "social-caption", label: "Social Media Caption" },
  { id: "promo-offer", label: "Promo Offer" },
];

export default function ContentStudio() {
  const [kind, setKind] = useState(kinds[0].id);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const res = await api.generateContent(prompt, kind);
      setResult(res.result);
    } catch {
      setResult(
        "(Backend/AI not connected yet — once the API server is running with a Gemini key set, generated copy will appear here.)"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Content Studio</h1>
          <p className="text-sm text-slate-500">Marketing copy, generated in seconds.</p>
        </div>
        <TrustBadge kind="ai" label="Powered by Gemini" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="mb-2 block text-sm font-medium text-slate-700">Content type</label>
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        >
          {kinds.map((k) => (
            <option key={k.id} value={k.id}>
              {k.label}
            </option>
          ))}
        </select>

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Describe what you need
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="e.g. Handmade ceramic mug, blue glaze, $18"
          className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={generate}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          <Sparkles size={16} />
          {loading ? "Generating…" : "Generate"}
        </motion.button>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-5 overflow-hidden rounded-lg bg-slate-50 p-4 text-sm text-slate-700"
            >
              <TypewriterText text={result} speed={8} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
