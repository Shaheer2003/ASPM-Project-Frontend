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

export default function AttendancePage() {
  const { fetchStudentAttendance } = useAppData();
  const [courseRows, setCourseRows] = useState([]);
  const [datedRows, setDatedRows] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAttendance = async () => {
      const result = await fetchStudentAttendance();
      if (!result.ok) {
        setError(result.message);
        return;
      }

      setCourseRows(result.data.courses || []);
      setDatedRows((result.data.dated_records || []).sort((a, b) => b.date.localeCompare(a.date)));
      setCourses(result.data.course_list || []);
    };

    loadAttendance();
  }, [fetchStudentAttendance]);

  const getCourseNameByCode = (courseCode) =>
    courses.find((course) => course.code === courseCode)?.name || "Unknown Course";

  return (
    <Layout links={links}>
      <section className="glass-panel p-5">
        <h1 className="page-title">My Attendance</h1>
        <p className="page-subtitle">Course-wise attendance performance and trends.</p>
      </section>

      <section className="mt-4 space-y-3">
        {courseRows.map((course) => {
          const isGood = course.percentage >= 75;

          return (
            <article
              key={course.courseCode}
              className="glass-panel p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-main font-bold">{course.courseCode}</p>
                  <p className="text-soft">{getCourseNameByCode(course.courseCode)}</p>
                  <p className="text-soft">Class: {course.classCode}</p>
                </div>
                <span
                  className={[
                    "rounded-full px-3 py-1 text-sm font-semibold",
                    isGood ? "bg-emerald-100/90 text-emerald-700" : "bg-red-100/90 text-red-700",
                  ].join(" ")}
                >
                  {course.percentage}%
                </span>
              </div>

              <div className="text-soft mt-2 flex flex-wrap gap-4 text-sm">
                <p>Present: {course.present}</p>
                <p>Absent: {course.absent}</p>
                <p>Total: {course.total}</p>
              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full" style={{ background: "var(--surface-soft-bg)" }}>
                <div
                  style={{ width: `${course.percentage}%` }}
                  className={[
                    "h-full",
                    isGood ? "bg-emerald-500" : "bg-red-500",
                  ].join(" ")}
                />
              </div>
            </article>
          );
        })}
      </section>

      <section className="glass-panel mt-4 p-5">
        <h2 className="text-main text-lg font-bold">Attendance By Date</h2>
        <div className="table-shell mt-3">
          <table className="table-glass min-w-[700px]">
            <thead>
              <tr>
                <th>Date</th>
                <th>Course</th>
                <th>Session</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {datedRows.map((row, index) => (
                <tr key={row.id} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                  <td>{row.date}</td>
                  <td>{row.courseCode} - {getCourseNameByCode(row.courseCode)}</td>
                  <td>{row.session}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
