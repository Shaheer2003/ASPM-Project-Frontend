import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggleButton from "../shared/ThemeToggleButton";

const roleToPath = {
  Admin: "/admin/dashboard",
  Teacher: "/teacher/dashboard",
  Student: "/student/dashboard",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const inferRole = (value) => {
    const normalized = value.trim().toLowerCase();

    if (normalized.includes("admin")) {
      return "Admin";
    }

    if (normalized.includes("teacher") || normalized.includes("faculty")) {
      return "Teacher";
    }

    return "Student";
  };

  const handleLogin = (event) => {
    event.preventDefault();

    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }

    const selectedRole = inferRole(username);

    setError("");

    login(selectedRole, username || "Demo User");
    navigate(roleToPath[selectedRole]);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      <div className="absolute right-6 top-6 z-10">
        <ThemeToggleButton />
      </div>
      <div className="pointer-events-none absolute -left-20 top-8 h-72 w-72 rounded-full bg-cyan-300/35 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-indigo-300/25 blur-3xl" />

      <form
        onSubmit={handleLogin}
        className="glass-panel-strong grid w-full max-w-5xl gap-8 p-6 lg:grid-cols-[1.15fr_1fr] lg:p-8"
      >
        <div className="rounded-2xl border border-white/70 bg-gradient-to-br from-[#0f6efe] to-[#4a88ff] p-6 text-white shadow-[0_20px_45px_rgba(15,110,254,0.35)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
            Mini-Flex
          </p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight">
            Academic Operations,
            <br />
            Reimagined.
          </h1>
          <p className="mt-4 max-w-md text-sm text-white/90">
            A modern student management dashboard for admins, teachers, and students.
            Fast navigation, clear data, and role-based workflows.
          </p>

          <div className="mt-6 space-y-3 text-sm">
            <div className="rounded-xl border border-white/25 bg-white/15 px-4 py-2">
              Unified Role-Based Portal
            </div>
            <div className="rounded-xl border border-white/25 bg-white/15 px-4 py-2">
              Attendance + Marks + Profiles
            </div>
            <div className="rounded-xl border border-white/25 bg-white/15 px-4 py-2">
              Lightweight, Responsive UX
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d84a0]">
              Welcome Back
            </p>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-[#10243f]">
              Sign In
            </h2>
          </div>

          <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            placeholder="Username"
            className="input-glass"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="input-glass"
          />

          <button type="submit" className="btn-primary w-full py-3 text-base">
            LOGIN TO DASHBOARD
          </button>
        </div>

        {error ? (
          <p className="text-sm font-semibold text-[var(--color-danger)]">{error}</p>
        ) : null}
      </form>
    </div>
  );
}
