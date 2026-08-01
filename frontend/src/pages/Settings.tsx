import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import TrustBadge from "../components/TrustBadge";

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Settings</h1>
          <p className="text-sm text-slate-500">Your account and workspace.</p>
        </div>
        <TrustBadge kind="maintenance" label="Account managed by Grovance" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-ink">Profile</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-500">Name</span>
            <span className="font-medium text-ink">{user?.name}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-500">Email</span>
            <span className="font-medium text-ink">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Workspace</span>
            <span className="font-medium text-ink">Aurora & Co. (demo)</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 font-semibold text-ink">Session</h2>
        <p className="mb-4 text-sm text-slate-500">Sign out of your Grovance workspace.</p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </motion.div>
  );
}
