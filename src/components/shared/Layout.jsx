import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAppData } from "../../context/AppDataContext";

export default function Layout({ links, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toast } = useAppData();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -left-32 -top-20 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />

      <div className="relative z-10">
        <Navbar onMenuToggle={() => setMobileOpen(true)} />
        <Sidebar
          links={links}
          isOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
        <main className="mx-auto max-w-7xl space-y-5 px-4 pb-8 pt-24 md:ml-72 md:px-6">
          {children}
        </main>
      </div>

      {toast ? (
        <div
          className={[
            "fixed right-4 top-20 z-40 rounded-xl border px-4 py-2 text-sm font-semibold backdrop-blur-xl",
            toast.type === "error"
              ? "border-red-300/40 bg-red-500/20 text-red-200"
              : "border-emerald-300/40 bg-emerald-500/20 text-emerald-200",
          ].join(" ")}
        >
          {toast.message}
        </div>
      ) : null}
    </div>
  );
}
