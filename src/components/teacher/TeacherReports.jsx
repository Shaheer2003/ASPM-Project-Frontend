import { useEffect, useMemo, useState } from "react";
import Layout from "../shared/Layout";
import { useAppData } from "../../context/AppDataContext";
import { useAuth } from "../../context/AuthContext";
import { exportCsv, exportPdfTable } from "../../utils/exporters";

const links = [
  { label: "Dashboard", path: "/teacher/dashboard" },
  { label: "Student Profiles", path: "/teacher/students" },
  { label: "Mark Attendance", path: "/teacher/attendance" },
  { label: "Manage Marks", path: "/teacher/marks" },
  { label: "Reports", path: "/teacher/reports" },
];

export default function TeacherReports() {
  const { user } = useAuth();
  const { students, marksWithComputed, getTeacherById, courses } = useAppData();

  const teacher = getTeacherById(user.id);
  const classOptions = teacher?.assignedClasses || [];

  const [classCode, setClassCode] = useState(classOptions[0] || "");
  const [studentId, setStudentId] = useState("ALL");
  const [toastMessage, setToastMessage] = useState("");

  const classStudents = useMemo(
    () => students.filter((student) => student.classCode === classCode),
    [students, classCode]
  );

  const getCourseNameByCode = (courseCode) =>
    courses.find((course) => course.code === courseCode)?.name || "Unknown Course";

  const getClassLabel = (value) => {
    const course = courses.find((entry) => entry.classCode === value);
    return course ? `${value} - ${course.name}` : value;
  };

  const reportRows = useMemo(() => {
    const filtered = marksWithComputed.filter((row) => row.classCode === classCode);

    return filtered
      .filter((row) => studentId === "ALL" || row.studentId === studentId)
      .map((row) => {
        const student = students.find((entry) => entry.id === row.studentId);
        return {
          studentId: row.studentId,
          studentName: student?.name || "Unknown",
          courseCode: row.courseCode,
          courseName: getCourseNameByCode(row.courseCode),
          percentage: row.percentage,
          grade: row.grade,
          obtained: row.obtained,
          total: row.total,
        };
      });
  }, [marksWithComputed, classCode, studentId, students, courses]);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToastMessage(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const hasRows = reportRows.length > 0;

  const handleExportCsv = () => {
    if (!hasRows) {
      return;
    }

    const headers = ["Student ID", "Student Name", "Course", "Obtained", "Total", "Percentage", "Grade"];
    const rows = reportRows.map((row) => [
      row.studentId,
      row.studentName,
      `${row.courseCode} - ${row.courseName}`,
      row.obtained,
      row.total,
      `${row.percentage}%`,
      row.grade,
    ]);
    exportCsv("teacher-performance-report.csv", headers, rows);
    setToastMessage("Teacher report CSV exported successfully.");
  };

  const handleExportPdf = () => {
    if (!hasRows) {
      return;
    }

    exportPdfTable(
      "teacher-performance-report.pdf",
      "Teacher Performance Report",
      ["Student ID", "Name", "Course", "Obtained", "Percentage", "Grade"],
      reportRows.map((row) => [
        row.studentId,
        row.studentName,
        `${row.courseCode} - ${row.courseName}`,
        `${row.obtained}/${row.total}`,
        `${row.percentage}%`,
        row.grade,
      ])
    );
    setToastMessage("Teacher report PDF exported successfully.");
  };

  return (
    <Layout links={links}>
      <section className="glass-panel p-5">
        <h1 className="page-title">Performance Reports</h1>
        <p className="page-subtitle">Generate class/student performance reports with marks and grades.</p>
      </section>

      <section className="glass-panel mt-4 p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <select value={classCode} onChange={(event) => setClassCode(event.target.value)} className="input-glass">
            {classOptions.map((option) => (
              <option key={option} value={option}>
                {getClassLabel(option)}
              </option>
            ))}
          </select>

          <select value={studentId} onChange={(event) => setStudentId(event.target.value)} className="input-glass">
            <option value="ALL">All Students</option>
            {classStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {student.id} - {student.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleExportCsv}
            disabled={!hasRows}
          >
            Export CSV
          </button>
          <button
            type="button"
            className="btn-ghost disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleExportPdf}
            disabled={!hasRows}
          >
            Export PDF
          </button>
        </div>
        {!hasRows ? (
          <p className="text-soft mt-2 text-sm">No rows to export for the current filters.</p>
        ) : null}
      </section>

      <section className="glass-panel mt-4 p-5">
        <div className="table-shell">
          <table className="table-glass min-w-[760px]">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Course</th>
                <th>Obtained</th>
                <th>Percentage</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {reportRows.map((row, index) => (
                <tr key={`${row.studentId}-${row.courseCode}`} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                  <td>{row.studentId}</td>
                  <td>{row.studentName}</td>
                  <td>{row.courseCode} - {row.courseName}</td>
                  <td>{row.obtained}/{row.total}</td>
                  <td>{row.percentage}%</td>
                  <td>{row.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {toastMessage ? (
        <div className="fixed right-4 top-20 z-40 rounded-xl border border-emerald-300/40 bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-200 backdrop-blur-xl">
          {toastMessage}
        </div>
      ) : null}
    </Layout>
  );
}
