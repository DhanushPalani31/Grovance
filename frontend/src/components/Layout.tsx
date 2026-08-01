import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import GuidedTour from "./GuidedTour";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <GuidedTour />
      <Sidebar />
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
