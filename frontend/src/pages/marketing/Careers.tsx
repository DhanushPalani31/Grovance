import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import Navbar from "../../components/marketing/Navbar";
import Footer from "../../components/marketing/Footer";
import ChatWidget from "../../components/marketing/ChatWidget";
import DarkHeader from "../../components/marketing/DarkHeader";

export default function Careers() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <DarkHeader eyebrow="Join us" title="Careers at Grovance" />

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-2xl flex-1 flex-col items-center px-6 pt-14 pb-16 text-center"
      >
        <div className="w-full rounded-xl border border-slate-200 bg-white p-10 shadow-lg">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Briefcase size={24} />
          </div>
          <p className="text-slate-600 leading-relaxed">
            No open positions right now — we're a small team, and we'll post here as soon
            as that changes. Check back soon.
          </p>
          <a
            href="/contact"
            className="mt-6 inline-block rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Get in touch anyway
          </a>
        </div>
      </motion.section>
      <Footer />
      <ChatWidget />
    </div>
  );
}
