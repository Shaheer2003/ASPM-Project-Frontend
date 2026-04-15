import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Layout from "../shared/Layout";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";

const links = [
  { label: "Dashboard", path: "/student/dashboard" },
  { label: "My Profile", path: "/student/profile" },
  { label: "Attendance", path: "/student/attendance" },
  { label: "My Marks", path: "/student/marks" },
  { label: "Insights", path: "/student/insights" },
];

export default function PerformanceInsights() {
  const { user } = useAuth();
  const { getStudentOverview, courses } = useAppData();

  const overview = getStudentOverview(user.id);
  const getCourseNameByCode = (courseCode) =>
    courses.find((course) => course.code === courseCode)?.name || "Unknown Course";

  const chartRows = overview.markRows.map((row) => ({
    course: `${row.courseCode} - ${getCourseNameByCode(row.courseCode)}`,
    percentage: row.percentage,
    grade: row.grade,
  }));

  return (
    <Layout links={links}>
      <section className="glass-panel p-5">
        <h1 className="page-title">Performance Insights</h1>
        <p className="page-subtitle">Auto-updated course trends and grade distribution.</p>
      </section>

      <section className="glass-panel mt-4 p-5">
        <h2 className="text-main text-lg font-bold">Performance Trend</h2>
        <div className="h-72 mt-3">
          <ResponsiveContainer>
            <BarChart data={chartRows}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.26)" />
              <XAxis dataKey="course" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="percentage" fill="var(--color-primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="glass-panel mt-4 p-5">
        <div className="table-shell">
          <table className="table-glass min-w-[700px]">
            <thead>
              <tr>
                <th>Course</th>
                <th>Percentage</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {chartRows.map((row, index) => (
                <tr key={row.course} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                  <td>{row.course}</td>
                  <td>{row.percentage}%</td>
                  <td>{row.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
