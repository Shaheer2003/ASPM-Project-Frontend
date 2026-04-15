import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute -left-32 -top-20 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl" />

      <div className="glass-panel-strong w-full max-w-md p-8 text-center">
        <p className="text-6xl font-extrabold text-[var(--color-primary)]">404</p>
        <h1 className="text-main mt-2 text-2xl font-semibold">Page Not Found</h1>
        <p className="text-soft mt-2">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/login"
          className="btn-primary mt-6 inline-block"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
