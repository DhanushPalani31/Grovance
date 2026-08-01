import { motion } from "framer-motion";
import { Briefcase, MapPin } from "lucide-react";
import Navbar from "../../components/marketing/Navbar";
import Footer from "../../components/marketing/Footer";
import ChatWidget from "../../components/marketing/ChatWidget";

// NOTE: These are illustrative placeholder openings for the demo. Replace with
// real, currently-open roles before publishing this page for actual hiring.
const openings = [
  {
    title: "Full-Stack Engineer",
    type: "Full-time",
    location: "Chennai / Remote",
    blurb: "Build and ship the automation and AI features that power our client portal.",
  },
  {
    title: "AI/Automation Engineer",
    type: "Full-time",
    location: "Chennai / Remote",
    blurb: "Design workflow automation and Claude-powered features for real client requirements.",
  },
  {
    title: "Client Success / Maintenance",
    type: "Full-time",
    location: "Chennai",
    blurb: "Own the ongoing support relationship — tickets, uptime, and client communication.",
  },
];

export default function Careers() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl flex-1 px-6 py-16"
      >
        <h1 className="text-3xl font-bold text-ink">Careers at Grovance</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          We're a small team building automation, AI, and maintenance tooling for
          brands — and we build it the way we sell it: transparently, and proven on our
          own platform before we hand it to a client. If that approach appeals to you,
          we'd like to hear from you.
        </p>

        <div className="mt-10 space-y-4">
          {openings.map((job, i) => (
            <motion.div
              key={job.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold text-ink">{job.title}</h2>
                <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">
                  {job.type}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{job.blurb}</p>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                <MapPin size={12} />
                {job.location}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-6 text-center">
          <Briefcase className="mx-auto mb-2 text-slate-400" size={20} />
          <p className="text-sm text-slate-500">
            Don't see a fit but think you'd add value anyway? Reach out through the{" "}
            <a href="/contact" className="font-medium text-brand hover:underline">
              Contact page
            </a>
            .
          </p>
        </div>
      </motion.section>
      <Footer />
      <ChatWidget />
    </div>
  );
}
