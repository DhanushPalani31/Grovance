import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="border-t border-slate-200 bg-slate-50 py-16">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-2xl font-bold text-ink">Our work</h2>
        <p className="mt-2 text-sm text-slate-500">One project completed so far — more in progress.</p>

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
            <div>
              <h3 className="font-semibold text-ink">Naya Builders</h3>
              <p className="mt-1 text-sm text-slate-500">Construction company website — Chennai, India</p>
            </div>
            <ExternalLink size={18} className="shrink-0 text-slate-400" />
          </div>
          <p className="mt-3 text-sm font-medium text-brand">nayabuilders.com</p>
        </motion.a>
      </div>
    </section>
  );
}
