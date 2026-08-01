import { useState } from "react";
import { Bot, Send, X, MessageCircle } from "lucide-react";
import { api } from "../../lib/api";

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

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.sendChatMessage(userMsg.content, "marketing");
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "(Demo backend isn't reachable right now — this widget calls the same live Grovance AI service shown in the portal.)",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-brand-indigo px-5 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700"
      >
        <MessageCircle size={18} />
        Try our AI
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 flex h-[28rem] w-80 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between bg-gradient-to-r from-brand-indigo to-brand-teal px-4 py-3 text-white">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Bot size={16} />
          Grovance Assistant
        </div>
        <button onClick={() => setOpen(false)} aria-label="Close">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
              m.role === "user" ? "ml-auto bg-brand-indigo text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && <p className="text-xs text-slate-400">Thinking…</p>}
      </div>

      <div className="flex gap-2 border-t border-slate-200 p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask a question…"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-brand-indigo focus:outline-none"
        />
        <button
          onClick={send}
          className="rounded-lg bg-brand-indigo px-3 py-1.5 text-white hover:bg-indigo-700"
          aria-label="Send"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
