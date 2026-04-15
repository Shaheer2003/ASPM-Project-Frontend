import { LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggleButton from "./ThemeToggleButton";

export default function Navbar({ onMenuToggle }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-30 border-b backdrop-blur-xl" style={{ borderColor: "var(--glass-border)", background: "var(--nav-bg)", color: "var(--text-main)" }}>
      <div className="flex h-16 w-full items-center justify-between px-4 md:px-8 lg:px-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="btn-ghost rounded-lg p-1.5 md:hidden"
            onClick={onMenuToggle}
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <div>
            <p className="text-soft text-xs font-semibold uppercase tracking-[0.22em]">
              Mini-Flex
            </p>
            <p className="text-main text-base font-extrabold tracking-tight">
              Student Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <ThemeToggleButton className="px-2.5 py-1.5" />
          <span className="surface-soft text-main hidden px-3 py-1.5 font-semibold shadow-sm sm:inline">
            {user?.name}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1 rounded-xl bg-[var(--color-primary)] px-3 py-2 font-semibold text-white shadow-[0_10px_24px_rgba(15,110,254,0.25)] transition hover:bg-[var(--color-primary-hover)]"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
