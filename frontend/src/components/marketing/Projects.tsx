import { motion } from "framer-motion";
import { ExternalLink, Hammer } from "lucide-react";

export default function Projects() {
  return (
    <section className="border-t border-slate-200 bg-slate-50 py-16">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-2xl font-bold text-ink">Our Work</h2>
        <p className="mt-2 text-sm text-slate-500">
          A completed client project, with more currently underway.
        </p>

        <motion.a
          href="https://www.nayabuilders.com"
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          whileHover={{ y: -3 }}
          className="mt-8 block rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Hammer size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-ink">Naya Builders</h3>
                <p className="mt-0.5 text-sm text-slate-500">
                  A builder application — website for a construction company in Chennai
                </p>
              </div>
            </div>
            <ExternalLink size={18} className="shrink-0 text-slate-400" />
          </div>
          <p className="mt-3 text-sm font-medium text-brand">nayabuilders.com</p>
          <p className="mt-2 text-xs text-slate-400">
            Delivered directly for the client.
          </p>
        </motion.a>
      </div>
    </section>
  );
}
