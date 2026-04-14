import Layout from "../shared/Layout";
import mockAttendance from "../../data/mockAttendance";

const links = [
  { label: "Dashboard", path: "/student/dashboard" },
  { label: "My Profile", path: "/student/profile" },
  { label: "Attendance", path: "/student/attendance" },
  { label: "My Marks", path: "/student/marks" },
];

export default function AttendancePage() {
  return (
    <Layout links={links}>
      <section className="glass-panel p-5">
        <h1 className="page-title">My Attendance</h1>
        <p className="page-subtitle">Course-wise attendance performance and trends.</p>
      </section>

      <section className="mt-4 space-y-3">
        {mockAttendance.map((course) => {
          const isGood = course.percentage >= 75;

          return (
            <article
              key={course.courseCode}
              className="glass-panel p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-[#1f3f61]">{course.courseCode}</p>
                  <p className="text-[#4f6c8a]">{course.courseName}</p>
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

              <div className="mt-2 flex flex-wrap gap-4 text-sm text-[#6d84a0]">
                <p>Present: {course.present}</p>
                <p>Absent: {course.absent}</p>
                <p>Total: {course.total}</p>
              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/70">
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
    </Layout>
  );
}
