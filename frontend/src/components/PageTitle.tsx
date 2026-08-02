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
};

export default function PageTitle() {
  const location = useLocation();

  useEffect(() => {
    document.title = TITLES[location.pathname] || "Grovance";
  }, [location.pathname]);

  return null;
}
