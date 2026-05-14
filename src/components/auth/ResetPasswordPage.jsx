import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../../context/AppDataContext";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword } = useAppData();

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const result = await resetPassword({ token, newPassword });
    if (!result.ok) {
      setError(result.message);
      return;
    }

    setMessage(result.message);
    setToken("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <form onSubmit={handleSubmit} className="glass-panel-strong w-full max-w-md p-6 space-y-4">
        <div>
          <h1 className="page-title">Set New Password</h1>
          <p className="page-subtitle">Use your reset token to set a new password.</p>
        </div>

        <input
          value={token}
          onChange={(event) => setToken(event.target.value)}
          className="input-glass"
          placeholder="Reset token"
          required
        />
        <input
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          className="input-glass"
          placeholder="New password"
          type="password"
          required
        />
        <input
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="input-glass"
          placeholder="Confirm new password"
          type="password"
          required
        />

        <button type="submit" className="btn-primary w-full">
          Save New Password
        </button>

        {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
        {error ? <p className="text-sm font-semibold text-[var(--color-danger)]">{error}</p> : null}

        <button type="button" onClick={() => navigate("/login")} className="btn-ghost w-full">
          Back To Login
        </button>
      </form>
    </div>
  );
}
