import { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { api } from "../lib/api";
import TrustBadge from "../components/TrustBadge";

interface Message {
  role: "user" | "assistant";
  content: string;
}

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

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.sendChatMessage(userMsg.content);
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "(Backend/AI not connected yet — once the API server is running with an Anthropic key set, I'll answer live here.)",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">AI Assistant</h1>
          <p className="text-sm text-slate-500">Trained on this brand's own data.</p>
        </div>
        <TrustBadge kind="ai" label="Powered by Claude" />
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-xl border border-slate-200 bg-white p-5">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                m.role === "user" ? "bg-slate-200" : "bg-brand/10"
              }`}
            >
              {m.role === "user" ? <User size={16} /> : <Bot size={16} className="text-brand" />}
            </div>
            <div
              className={`max-w-[75%] rounded-xl px-4 py-2 text-sm ${
                m.role === "user" ? "bg-brand text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && <p className="text-xs text-slate-400">Thinking…</p>}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask something a customer might ask…"
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-brand focus:outline-none"
        />
        <button
          onClick={send}
          className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          <Send size={16} />
          Send
        </button>
      </div>
    </div>
  );
}
