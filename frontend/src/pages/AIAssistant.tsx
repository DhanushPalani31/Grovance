import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import { api } from "../lib/api";
import TrustBadge from "../components/TrustBadge";
import TypewriterText from "../components/TypewriterText";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const quickReplies = [
  "What are your business hours?",
  "Do you take custom orders?",
  "How do I track my order?",
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm the Grovance AI Assistant for Aurora & Co.. Ask me about business hours, products, or orders.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastAssistantIndex, setLastAssistantIndex] = useState<number | null>(null);

  const send = async (overrideText?: string) => {
    const text = overrideText ?? input;
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.sendChatMessage(userMsg.content);
      setMessages((m) => {
        const next = [...m, { role: "assistant" as const, content: res.reply }];
        setLastAssistantIndex(next.length - 1);
        return next;
      });
    } catch {
      setMessages((m) => {
        const next = [
          ...m,
          {
            role: "assistant" as const,
            content:
              "(Backend/AI not connected yet — once the API server is running with an Anthropic key set, I'll answer live here.)",
          },
        ];
        setLastAssistantIndex(next.length - 1);
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex h-full flex-col"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">AI Assistant</h1>
          <p className="text-sm text-slate-500">Trained on this brand's own data.</p>
        </div>
        <TrustBadge kind="ai" label="Powered by Claude" />
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  m.role === "user" ? "bg-slate-200" : "bg-brand/10"
                }`}
              >
                {m.role === "user" ? <User size={16} /> : <Bot size={16} className="text-brand" />}
                {m.role === "assistant" && loading && i === messages.length - 1 && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-brand/30" />
                )}
              </div>
              <div
                className={`max-w-[75%] rounded-xl px-4 py-2 text-sm shadow-sm ${
                  m.role === "user" ? "bg-brand text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {m.role === "assistant" && i === lastAssistantIndex ? (
                  <TypewriterText text={m.content} />
                ) : (
                  m.content
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand/50 [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand/50 [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand/50" />
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {quickReplies.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 transition-colors hover:border-brand/30 hover:bg-brand/5 hover:text-brand"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask something a customer might ask…"
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm shadow-sm focus:border-brand focus:outline-none"
        />
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => send()}
          className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-dark"
        >
          <Send size={16} />
          Send
        </motion.button>
      </div>
    </motion.div>
  );
}
