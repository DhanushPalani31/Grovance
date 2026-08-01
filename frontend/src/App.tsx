import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import AutomationCenter from "./pages/AutomationCenter";
import AIAssistant from "./pages/AIAssistant";
import ContentStudio from "./pages/ContentStudio";
import Insights from "./pages/Insights";
import Maintenance from "./pages/Maintenance";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/automation" element={<AutomationCenter />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/content-studio" element={<ContentStudio />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/maintenance" element={<Maintenance />} />
      </Routes>
    </Layout>
  );
}
