import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import Dashboard from "./pages/Dashboard";
import AutomationCenter from "./pages/AutomationCenter";
import AIAssistant from "./pages/AIAssistant";
import ContentStudio from "./pages/ContentStudio";
import Insights from "./pages/Insights";
import Maintenance from "./pages/Maintenance";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Landing from "./pages/marketing/Landing";
import Services from "./pages/marketing/Services";
import Pricing from "./pages/marketing/Pricing";
import Contact from "./pages/marketing/Contact";
import About from "./pages/marketing/About";
import Terms from "./pages/marketing/Terms";
import Privacy from "./pages/marketing/Privacy";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

export default function App() {
  return (
    <Routes>
      {/* Public marketing site */}
      <Route path="/" element={<Landing />} />
      <Route path="/services" element={<Services />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Client portal (the live demo) — requires login */}
      <Route
        path="/portal/*"
        element={
          <RequireAuth>
            <Layout>
              <Routes>
                <Route path="" element={<Dashboard />} />
                <Route path="automation" element={<AutomationCenter />} />
                <Route path="ai-assistant" element={<AIAssistant />} />
                <Route path="content-studio" element={<ContentStudio />} />
                <Route path="insights" element={<Insights />} />
                <Route path="maintenance" element={<Maintenance />} />
                <Route path="settings" element={<Settings />} />
              </Routes>
            </Layout>
          </RequireAuth>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
