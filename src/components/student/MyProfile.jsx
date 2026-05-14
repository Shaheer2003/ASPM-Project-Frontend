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

export default function MyProfile() {
  const { fetchStudentProfile, courses } = useAppData();
  const [overview, setOverview] = useState({ student: null, marks: [], attendance: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const result = await fetchStudentProfile();
      if (!result.ok) {
        setError(result.message);
        return;
      }

      setOverview(result.data);
    };

    loadProfile();
  }, [fetchStudentProfile]);

  const student = overview.student;

  const getCourseNameByCode = (courseCode) =>
    courses.find((course) => course.code === courseCode)?.name || "Unknown Course";

  const fields = [
    { label: "Full Name", value: student?.name || "-" },
    { label: "Student ID", value: student?.id || "-" },
    { label: "Email", value: student?.email || "-" },
    { label: "Phone", value: student?.phone || "-" },
    { label: "Department", value: student?.department || "-" },
    { label: "Batch", value: student?.batch || "-" },
  ];

  return (
    <Layout links={links}>
      <section className="glass-panel p-5">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Read-only personal and academic details.</p>
      </section>

      <section className="glass-panel mt-4 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <article key={field.label} className="surface-soft p-4">
              <p className="text-soft text-xs font-semibold uppercase tracking-wider">{field.label}</p>
              <p className="text-main mt-1 font-semibold">{field.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-panel mt-4 p-5">
        <h2 className="text-main text-lg font-bold">Academic Snapshot</h2>
        <div className="table-shell mt-3">
          <table className="table-glass min-w-[700px]">
            <thead>
              <tr>
                <th>Course</th>
                <th>Marks %</th>
                <th>Grade</th>
                <th>Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {overview.marks.map((row, index) => {
                const attendance = overview.attendance.find(
                  (entry) => entry.courseCode === row.courseCode
                );
                return (
                  <tr key={row.id} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                    <td>{row.courseCode} - {getCourseNameByCode(row.courseCode)}</td>
                    <td>{row.percentage}%</td>
                    <td>{row.grade}</td>
                    <td>{attendance?.percentage ?? 0}%</td>
                  </tr>
                );
              })}
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
