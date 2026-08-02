import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PageTitle from "./components/PageTitle";
import NotFound from "./pages/NotFound";
import Landing from "./pages/marketing/Landing";
import Services from "./pages/marketing/Services";
import Pricing from "./pages/marketing/Pricing";
import Contact from "./pages/marketing/Contact";
import AutomationAudit from "./pages/marketing/AutomationAudit";
import About from "./pages/marketing/About";
import Careers from "./pages/marketing/Careers";
import Terms from "./pages/marketing/Terms";
import Privacy from "./pages/marketing/Privacy";

export default function App() {
  const location = useLocation();

  return (
    <>
      <PageTitle />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/audit" element={<AutomationAudit />} />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
