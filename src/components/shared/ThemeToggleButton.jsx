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
      className={["theme-toggle", className].join(" ")}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
