import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TITLES: Record<string, string> = {
  "/": "Grovance — Automate. Intelligence. Grow.",
  "/services": "Services — Grovance",
  "/pricing": "Pricing — Grovance",
  "/contact": "Contact — Grovance",
  "/audit": "Free Automation Audit — Grovance",
  "/about": "About — Grovance",
  "/careers": "Careers — Grovance",
  "/terms": "Terms of Service — Grovance",
  "/privacy": "Privacy Policy — Grovance",
  "/login": "Log In — Grovance",
  "/signup": "Sign Up — Grovance",
  "/portal": "Dashboard — Grovance",
  "/portal/automation": "Automation Center — Grovance",
  "/portal/ai-assistant": "AI Assistant — Grovance",
  "/portal/content-studio": "Content Studio — Grovance",
  "/portal/insights": "Insights — Grovance",
  "/portal/maintenance": "Maintenance — Grovance",
  "/portal/settings": "Settings — Grovance",
};

export default function PageTitle() {
  const location = useLocation();

  useEffect(() => {
    document.title = TITLES[location.pathname] || "Grovance";
  }, [location.pathname]);

  return null;
}
