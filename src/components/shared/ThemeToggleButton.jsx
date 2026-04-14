import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggleButton({ className = "" }) {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className={[
        "inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/70 px-3 py-2 text-sm font-semibold text-[#1f3552] backdrop-blur-xl transition hover:bg-white",
        "theme-dark:border-slate-700 theme-dark:bg-slate-900/70 theme-dark:text-slate-100",
        className,
      ].join(" ")}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
