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
import mockMarks from "../../data/mockMarks";

const links = [
  { label: "Dashboard", path: "/student/dashboard" },
  { label: "My Profile", path: "/student/profile" },
  { label: "Attendance", path: "/student/attendance" },
  { label: "My Marks", path: "/student/marks" },
];

const trendData = mockMarks.map((course) => {
  const totalRow = course.assessments.find((item) => item.name === "Total");
  return {
    course: course.courseCode,
    percentage: totalRow?.percentage ?? 0,
  };
});

export default function MyMarks() {
  return (
    <Layout links={links}>
      <section className="glass-panel p-5">
        <h1 className="page-title">My Marks</h1>
        <p className="page-subtitle">Assessment breakdown, percentages, and grade outcomes.</p>
      </section>

      <section className="glass-panel mt-4 p-5">
        <h2 className="text-lg font-bold text-[#16314f]">Performance Trend</h2>
        <div className="mt-2 h-64 w-full">
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d8e4f2" />
              <XAxis dataKey="course" tick={{ fill: "#5f7793" }} />
              <YAxis domain={[0, 100]} tick={{ fill: "#5f7793" }} />
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
        {mockMarks.map((course) => (
          <article key={course.courseCode} className="glass-panel p-5">
            <h2 className="text-lg font-bold text-[#1f3f61]">
              {course.courseCode} - {course.courseName}
            </h2>

            <div className="table-shell mt-3">
              <table className="table-glass min-w-[700px]">
                <thead>
                  <tr>
                    <th>Assessment</th>
                    <th>Total Marks</th>
                    <th>Obtained</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {course.assessments.map((assessment, index) => (
                    <tr
                      key={`${course.courseCode}-${assessment.name}`}
                      className={index % 2 === 0 ? "bg-white/35" : "bg-white/10"}
                    >
                      <td
                        className={[
                          "text-sm",
                          assessment.name === "Total" ? "font-bold" : "",
                        ].join(" ")}
                      >
                        {assessment.name}
                      </td>
                      <td>{assessment.total}</td>
                      <td>{assessment.obtained}</td>
                      <td>{assessment.percentage}%</td>
                    </tr>
                  ))}
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
