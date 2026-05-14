import { useEffect, useState } from "react";
import Layout from "../shared/Layout";
import { useAppData } from "../../context/AppDataContext";

const links = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Manage Users", path: "/admin/manage-users" },
  { label: "Register User", path: "/admin/register-user" },
  { label: "Attendance Reports", path: "/admin/attendance-reports" },
];

export default function AdminDashboard() {
  const { fetchAdminDashboard, courses } = useAppData();
  const [stats, setStats] = useState({
    total_students: 0,
    total_teachers: 0,
    total_courses: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      const result = await fetchAdminDashboard();
      if (!result.ok) {
        setError(result.message);
        return;
      }

      setStats({
        total_students: result.data.total_students ?? 0,
        total_teachers: result.data.total_teachers ?? 0,
        total_courses: courses.length,
      });
    };

    loadDashboard();
  }, [fetchAdminDashboard, courses.length]);

  return (
    <Layout links={links}>
      <section className="glass-panel p-5">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Platform overview, quick stats, and recent activity.</p>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-3">
        {[
          { label: "Total Students", value: stats.total_students },
          { label: "Total Teachers", value: stats.total_teachers },
          { label: "Total Courses", value: stats.total_courses },
        ].map((item) => (
          <article key={item.label} className="stat-card">
            <p className="text-soft text-xs font-semibold uppercase tracking-wider">{item.label}</p>
            <p className="mt-2 text-4xl font-extrabold text-[var(--color-primary)]">{item.value}</p>
          </article>
        ))}
      </section>

      {error ? (
        <section className="glass-panel mt-4 p-5">
          <p className="text-sm font-semibold text-[var(--color-danger)]">{error}</p>
        </section>
      ) : null}
    </Layout>
  );
}
