import Layout from "../shared/Layout";

const links = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Manage Users", path: "/admin/manage-users" },
  { label: "Register User", path: "/admin/register-user" },
  { label: "System Settings", path: "#" },
];

const activities = [
  { label: "Student registered", time: "Today, 9:30 AM" },
  { label: "Teacher account updated", time: "Today, 10:45 AM" },
  { label: "Course catalog synced", time: "Today, 11:20 AM" },
  { label: "Attendance report viewed", time: "Today, 12:15 PM" },
  { label: "User role changed", time: "Today, 1:05 PM" },
];

export default function AdminDashboard() {
  return (
    <Layout links={links}>
      <section className="glass-panel p-5">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Platform overview, quick stats, and recent activity.</p>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-3">
        {[
          { label: "Total Students", value: 250 },
          { label: "Total Teachers", value: 45 },
          { label: "Total Courses", value: 120 },
        ].map((item) => (
          <article key={item.label} className="stat-card">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6683a2]">{item.label}</p>
            <p className="mt-2 text-4xl font-extrabold text-[var(--color-primary)]">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="glass-panel mt-4 p-5">
        <h2 className="text-xl font-bold text-[#16314f]">Recent Activity</h2>
        <div className="mt-3 space-y-2">
          {activities.map((activity) => (
            <div
              key={`${activity.label}-${activity.time}`}
              className="flex items-center justify-between rounded-xl border border-white/70 bg-white/65 px-3 py-2.5 backdrop-blur-xl"
            >
              <p className="font-medium text-[#264665]">{activity.label}</p>
              <p className="text-sm text-[#6c83a0]">{activity.time}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
