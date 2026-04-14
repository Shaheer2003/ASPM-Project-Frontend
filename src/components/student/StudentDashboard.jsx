import Layout from "../shared/Layout";
import mockStudents from "../../data/mockStudents";

const links = [
  { label: "Dashboard", path: "/student/dashboard" },
  { label: "My Profile", path: "/student/profile" },
  { label: "Attendance", path: "/student/attendance" },
  { label: "My Marks", path: "/student/marks" },
];

export default function StudentDashboard() {
  return (
    <Layout links={links}>
      <section className="glass-panel p-5">
        <h1 className="page-title">Student Dashboard</h1>
        <p className="page-subtitle">Your semester snapshot, attendance health, and enrolled courses.</p>
      </section>

      <section className="glass-panel mt-4 p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d84a0]">CGPA Display</p>
        <p className="mt-1 text-5xl font-extrabold text-[var(--color-primary)]">{mockStudents.cgpa}</p>
        <p className="mt-2 text-[#5e7793]">Cumulative Grade Point Average</p>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-3">
        {[
          { label: "Total Courses", value: mockStudents.totalCourses },
          { label: "Avg. Attendance", value: `${mockStudents.avgAttendance}%` },
          { label: "Current Semester", value: mockStudents.currentSemester },
        ].map((item) => (
          <article key={item.label} className="stat-card">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6683a2]">{item.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-[var(--color-primary)]">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="glass-panel mt-4 p-5">
        <h2 className="text-xl font-bold text-[#16314f]">Enrolled Courses</h2>
        <div className="mt-3 space-y-2">
          {mockStudents.enrolledCourses.map((course) => (
            <div
              key={course.code}
              className="flex flex-col gap-2 rounded-xl border border-white/70 bg-white/60 px-3 py-3 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-bold text-[#1f3f61]">{course.code}</p>
                <p className="text-[#4b6787]">{course.name}</p>
              </div>
              <span className="self-start rounded-full border border-blue-200 bg-blue-100/75 px-3 py-1 text-sm font-semibold text-[#315f93] sm:self-auto">
                Credits: {course.credits}
              </span>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
