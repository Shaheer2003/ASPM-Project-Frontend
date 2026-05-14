import { useEffect, useState } from "react";
import Layout from "../shared/Layout";
import { useAppData } from "../../context/AppDataContext";

const links = [
  { label: "Dashboard", path: "/student/dashboard" },
  { label: "My Profile", path: "/student/profile" },
  { label: "Attendance", path: "/student/attendance" },
  { label: "My Marks", path: "/student/marks" },
  { label: "Insights", path: "/student/insights" },
];

export default function StudentDashboard() {
  const { fetchStudentDashboard, courses } = useAppData();
  const [overview, setOverview] = useState({
    marks: [],
    attendance: [],
    statistics: { total_courses: 0, average_attendance: 0, average_marks: 0, cgpa: 0 },
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      const result = await fetchStudentDashboard();
      if (!result.ok) {
        setError(result.message);
        return;
      }

      setOverview(result.data);
    };

    loadDashboard();
  }, [fetchStudentDashboard]);

  const averageAttendance = overview.statistics?.average_attendance ?? 0;
  const averageMarks = overview.statistics?.average_marks ?? 0;

  const getCourseNameByCode = (courseCode) =>
    courses.find((course) => course.code === courseCode)?.name || "Unknown Course";

  return (
    <Layout links={links}>
      <section className="glass-panel p-5">
        <h1 className="page-title">Student Dashboard</h1>
        <p className="page-subtitle">Your semester snapshot, attendance health, and enrolled courses.</p>
      </section>

      <section className="glass-panel mt-4 p-6 text-center">
        <p className="text-soft text-xs font-semibold uppercase tracking-[0.2em]">CGPA Display</p>
        <p className="mt-1 text-5xl font-extrabold text-[var(--color-primary)]">
          {(averageMarks / 25).toFixed(2)}
        </p>
        <p className="text-soft mt-2">Estimated GPA from current marks</p>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-3">
        {[
          { label: "Total Courses", value: overview.marks.length },
          { label: "Avg. Attendance", value: `${averageAttendance}%` },
          { label: "Avg. Marks", value: `${averageMarks}%` },
        ].map((item) => (
          <article key={item.label} className="stat-card">
            <p className="text-soft text-xs font-semibold uppercase tracking-wider">{item.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-[var(--color-primary)]">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="glass-panel mt-4 p-5">
        <h2 className="text-main text-xl font-bold">Enrolled Courses</h2>
        <div className="mt-3 space-y-2">
          {overview.marks.map((course) => (
            <div
              key={course.courseCode}
              className="surface-soft flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-main font-bold">{course.courseCode}</p>
                <p className="text-soft">{getCourseNameByCode(course.courseCode)}</p>
                <p className="text-soft">Current grade: {course.grade}</p>
              </div>
              <span className="self-start rounded-full border border-[var(--color-primary)] bg-[var(--color-primary)] px-3 py-1 text-sm font-bold text-white shadow-sm sm:self-auto">
                {course.percentage}%
              </span>
            </div>
          ))}
        </div>
      </section>

      {error ? (
        <section className="glass-panel mt-4 p-5">
          <p className="text-sm font-semibold text-[var(--color-danger)]">{error}</p>
        </section>
      ) : null}
    </Layout>
  );
}
