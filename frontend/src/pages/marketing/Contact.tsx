import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Navbar from "../../components/marketing/Navbar";
import Footer from "../../components/marketing/Footer";
import ChatWidget from "../../components/marketing/ChatWidget";
import { api } from "../../lib/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.submitLead(form.name, form.email, form.message);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="mx-auto max-w-xl px-6 py-16">
        <h1 className="text-3xl font-bold text-brand-ink">Get in touch</h1>
        <p className="mt-3 text-slate-600">
          Tell us about your shop and what you'd like automated. Submitting this form is
          itself an automation — it's logged instantly in the same Activity Feed you'll
          see in the demo portal.
        </p>

        {status === "sent" ? (
          <div className="mt-8 flex items-center gap-3 rounded-xl border border-teal-200 bg-teal-50 p-5 text-brand-teal">
            <CheckCircle2 size={20} />
            <p className="text-sm">
              Thanks, {form.name}! Your message was received and logged automatically —
              we'll be in touch soon.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-indigo focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-indigo focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Message</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-indigo focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-lg bg-brand-indigo px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
            {status === "error" && (
              <p className="text-sm text-red-500">
                Couldn't reach the backend — make sure the API server is running.
              </p>
            )}
          </form>
        )}
      </section>
      <Footer />
      <ChatWidget />
    </div>
  );
}
