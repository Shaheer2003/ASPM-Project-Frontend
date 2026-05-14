import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../../context/AppDataContext";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { requestPasswordReset } = useAppData();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [tokenPreview, setTokenPreview] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setTokenPreview("");

    const result = await requestPasswordReset(email);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    setMessage(result.message);
    setTokenPreview(result.token);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <form onSubmit={handleSubmit} className="glass-panel-strong w-full max-w-md p-6 space-y-4">
        <div>
          <h1 className="page-title">Reset Password</h1>
          <p className="page-subtitle">Enter your registered email to request a password reset.</p>
        </div>

        <input
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError("");
          }}
          className="input-glass"
          placeholder="Registered email"
          type="email"
          required
        />

        <button type="submit" className="btn-primary w-full">
          Request Reset Link
        </button>

        {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
        {tokenPreview ? (
          <p className="text-sm text-soft">
            Demo reset token: <span className="font-semibold text-main">{tokenPreview}</span>
          </p>
        ) : null}
        {error ? <p className="text-sm font-semibold text-[var(--color-danger)]">{error}</p> : null}

        <div className="flex gap-2">
          <button type="button" onClick={() => navigate("/login")} className="btn-ghost w-full">
            Back To Login
          </button>
          <button type="button" onClick={() => navigate("/reset-password")} className="btn-ghost w-full">
            Go To Reset
          </button>
        </div>
      </form>
    </div>
  );
}
