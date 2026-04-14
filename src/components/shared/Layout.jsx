import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ links, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

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
    </div>
  );
}
