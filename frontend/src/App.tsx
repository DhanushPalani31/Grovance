import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import AutomationCenter from "./pages/AutomationCenter";
import AIAssistant from "./pages/AIAssistant";
import ContentStudio from "./pages/ContentStudio";
import Insights from "./pages/Insights";
import Maintenance from "./pages/Maintenance";
import Landing from "./pages/marketing/Landing";
import Services from "./pages/marketing/Services";
import Pricing from "./pages/marketing/Pricing";
import Contact from "./pages/marketing/Contact";

export default function App() {
  return (
    <Routes>
      {/* Public marketing site */}
      <Route path="/" element={<Landing />} />
      <Route path="/services" element={<Services />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/contact" element={<Contact />} />

      {/* Client portal (the live demo) */}
      <Route
        path="/portal/*"
        element={
          <Layout>
            <Routes>
              <Route path="" element={<Dashboard />} />
              <Route path="automation" element={<AutomationCenter />} />
              <Route path="ai-assistant" element={<AIAssistant />} />
              <Route path="content-studio" element={<ContentStudio />} />
              <Route path="insights" element={<Insights />} />
              <Route path="maintenance" element={<Maintenance />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}
