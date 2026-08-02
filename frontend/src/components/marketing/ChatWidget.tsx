import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, MessageCircle } from "lucide-react";
import { api } from "../../lib/api";
import TypewriterText from "../TypewriterText";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm the Grovance assistant — ask me anything about our automation, AI, or maintenance services.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastAssistantIndex, setLastAssistantIndex] = useState<number | null>(null);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.sendChatMessage(userMsg.content, "marketing");
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
              "(Demo backend isn't reachable right now — this widget calls the same live Grovance AI service used across the site.)",
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
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="launcher"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-medium text-white shadow-lg shadow-brand/30 hover:bg-brand-dark"
          >
            <MessageCircle size={18} />
            Try our AI
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-30 flex h-[28rem] w-80 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between bg-ink px-4 py-3 text-white">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                  <Bot size={14} />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-ink bg-success" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight">Grovance Assistant</p>
                  <p className="text-[10px] text-slate-300">Online now · powered by Gemini</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-white/70 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-3">
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                      m.role === "user" ? "ml-auto bg-brand text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {m.role === "assistant" && i === lastAssistantIndex ? (
                      <TypewriterText text={m.content} />
                    ) : (
                      m.content
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && (
                <div className="flex items-center gap-1.5 pl-1 text-xs text-slate-400">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand/50 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand/50 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand/50" />
                </div>
              )}
            </div>

            <div className="flex gap-2 border-t border-slate-200 p-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask a question…"
                className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-brand focus:outline-none"
              />
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={send}
                className="rounded-lg bg-brand px-3 py-1.5 text-white hover:bg-brand-dark"
                aria-label="Send"
              >
                <Send size={14} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
