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
    <header className="fixed left-0 right-0 top-0 z-30 border-b border-white/60 bg-white/65 text-[#122949] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg border border-white/60 bg-white/60 p-1.5 text-[#17355a] md:hidden"
            onClick={onMenuToggle}
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6d84a0]">
              Mini-Flex
            </p>
            <p className="text-base font-extrabold tracking-tight text-[#10243f]">
              Student Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <ThemeToggleButton className="px-2.5 py-1.5" />
          <span className="hidden rounded-xl border border-white/70 bg-white/70 px-3 py-1.5 font-semibold text-[#20456e] shadow-sm sm:inline">
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
