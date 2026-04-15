import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

export default function MyMarks() {
  const { user } = useAuth();
  const { marksWithComputed, courses } = useAppData();

  const getCourseNameByCode = (courseCode) =>
    courses.find((course) => course.code === courseCode)?.name || "Unknown Course";

  const studentMarks = marksWithComputed.filter((row) => row.studentId === user.id);
  const trendData = studentMarks.map((row) => ({
    course: `${row.courseCode} - ${getCourseNameByCode(row.courseCode)}`,
    percentage: row.percentage,
  }));

  const axisColor = "var(--text-soft)";

  return (
    <Layout links={links}>
      <section className="glass-panel p-5">
        <h1 className="page-title">My Marks</h1>
        <p className="page-subtitle">Assessment breakdown, percentages, and grade outcomes.</p>
      </section>

      <section className="glass-panel mt-4 p-5">
        <h2 className="text-main text-lg font-bold">Performance Trend</h2>
        <div className="mt-2 h-64 w-full">
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.28)" />
              <XAxis dataKey="course" tick={{ fill: axisColor }} />
              <YAxis domain={[0, 100]} tick={{ fill: axisColor }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="percentage"
                stroke="#0f6efe"
                strokeWidth={3}
                dot={{ fill: "#0f6efe", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-4 space-y-4">
        {studentMarks.map((course) => (
          <article key={course.id} className="glass-panel p-5">
            <h2 className="text-main text-lg font-bold">
              {course.courseCode} - {getCourseNameByCode(course.courseCode)}
            </h2>

            <div className="table-shell mt-3">
              <table className="table-glass min-w-[700px]">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Total</th>
                    <th>Obtained</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: "Quiz 1",
                      total: course.totals.quiz,
                      obtained: course.assessments.quiz,
                    },
                    {
                      name: "Assignment 1",
                      total: course.totals.assignment,
                      obtained: course.assessments.assignment,
                    },
                    {
                      name: "Mid Term",
                      total: course.totals.mid,
                      obtained: course.assessments.mid,
                    },
                    {
                      name: "Final",
                      total: course.totals.final,
                      obtained: course.assessments.final,
                    },
                    {
                      name: "Total",
                      total: course.total,
                      obtained: course.obtained,
                    },
                  ].map((row, index) => {
                    const percentage = row.total > 0 ? Math.round((row.obtained / row.total) * 100) : 0;
                    return (
                      <tr key={`${course.id}-${row.name}`} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                        <td className={row.name === "Total" ? "font-bold" : ""}>{row.name}</td>
                        <td>{row.total}</td>
                        <td>{row.obtained}</td>
                        <td>{percentage}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-3 text-right">
              <span className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-sm font-semibold text-white">
                Grade: {course.grade}
              </span>
            </div>
          </article>
        ))}
      </section>
    </Layout>
  );
}
