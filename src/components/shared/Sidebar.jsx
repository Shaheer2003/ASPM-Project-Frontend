import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ links = [], isOpen, onClose }) {
  const { user } = useAuth();

  const linkClass = ({ isActive }) =>
    [
      "block rounded-xl px-3 py-2.5 text-sm font-semibold transition",
      isActive
        ? "bg-[var(--color-active)] text-white shadow-[0_8px_20px_rgba(15,110,254,0.25)]"
        : "text-soft hover:brightness-105",
    ].join(" ");

  return (
    <>
      <aside
        className={[
          "fixed bottom-0 left-0 top-16 z-20 w-72 border-r p-4 backdrop-blur-xl transition-transform md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
        style={{ borderColor: "var(--glass-border)", background: "var(--sidebar-bg)" }}
      >
        <div className="glass-panel-strong p-4 text-center">
          <p className="text-soft mb-2 text-xs uppercase tracking-wider">Profile</p>
          <div
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl text-xl font-bold"
            style={{
              border: "1px solid var(--surface-soft-border)",
              background: "var(--surface-soft-bg)",
              color: "var(--text-main)",
            }}
          >
            {user?.name?.charAt(0) || "U"}
          </div>
          <p className="text-main mt-2 text-sm font-semibold">{user?.id}</p>
        </div>

        <nav className="mt-4 space-y-2">
          {links.map((link) =>
            link.path === "#" ? (
              <div
                key={link.label}
                className="text-soft rounded-xl px-3 py-2.5 text-sm font-medium"
              >
                {link.label}
              </div>
            ) : (
              <NavLink
                key={link.label}
                to={link.path}
                className={linkClass}
                onClick={onClose}
              >
                {link.label}
              </NavLink>
            )
          )}
        </nav>
      </aside>

      {isOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 top-16 z-10 bg-slate-900/35 md:hidden"
          onClick={onClose}
        />
      ) : null}
    </>
  );
}
