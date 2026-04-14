import Layout from "../shared/Layout";
import mockTeacher from "../../data/mockTeacher";

const links = [
  { label: "Dashboard", path: "/teacher/dashboard" },
  { label: "Mark Attendance", path: "/teacher/attendance" },
  { label: "Manage Marks", path: "/teacher/marks" },
];

export default function TeacherDashboard() {
  return (
    <Layout links={links}>
      <section className="glass-panel p-5">
        <h1 className="page-title">Teacher Dashboard</h1>
        <p className="page-subtitle">Track classes, students, and pending academic tasks.</p>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-3">
        {[
          { label: "Total Classes", value: mockTeacher.totalClasses },
          { label: "Total Students", value: mockTeacher.totalStudents },
          { label: "Pending Tasks", value: mockTeacher.pendingTasks },
        ].map((item) => (
          <article key={item.label} className="stat-card">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6683a2]">{item.label}</p>
            <p className="mt-2 text-4xl font-extrabold text-[var(--color-primary)]">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="glass-panel mt-4 p-5">
        <h2 className="text-xl font-bold text-[#16314f]">My Classes</h2>
        <div className="mt-3 space-y-3">
          {mockTeacher.classes.map((course) => (
            <article
              key={`${course.code}-${course.section}`}
              className="flex flex-col gap-3 rounded-xl border border-white/60 bg-white/60 p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-base font-bold text-[#1f3f61]">{course.code}</p>
                <p className="text-[#315172]">{course.name}</p>
                <p className="text-sm text-[#6b84a0]">
                  Section {course.section} | Students: {course.students}
                </p>
              </div>
              <button
                type="button"
                onClick={() => alert(`Viewing ${course.name}`)}
                className="btn-ghost self-start"
              >
                View
              </button>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
