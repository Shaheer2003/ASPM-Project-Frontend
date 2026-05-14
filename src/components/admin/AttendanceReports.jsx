import { useEffect, useMemo, useState } from "react";
import Layout from "../shared/Layout";
import { useAppData } from "../../context/AppDataContext";
import { exportCsv, exportPdfTable } from "../../utils/exporters";

const links = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Manage Users", path: "/admin/manage-users" },
  { label: "Register User", path: "/admin/register-user" },
  { label: "Attendance Reports", path: "/admin/attendance-reports" },
];

export default function AttendanceReports() {
  const { students, fetchAdminAttendanceReports } = useAppData();

  const [studentId, setStudentId] = useState("ALL");
  const [classCode, setClassCode] = useState("ALL");
  const [date, setDate] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({ total: 0, present: 0, absent: 0, percentage: 0 });
  const [error, setError] = useState("");

  const classOptions = useMemo(
    () => [...new Set(students.map((student) => student.classCode))],
    [students]
  );

  useEffect(() => {
    const loadReports = async () => {
      setError("");
      const result = await fetchAdminAttendanceReports({
        studentId,
        classCode,
        date,
      });

      if (!result.ok) {
        setError(result.message);
        setRows([]);
        setSummary({ total: 0, present: 0, absent: 0, percentage: 0 });
        return;
      }

      setRows(result.data.records || []);
      setSummary(result.data.summary || { total: 0, present: 0, absent: 0, percentage: 0 });
    };

    loadReports();
  }, [studentId, classCode, date, fetchAdminAttendanceReports]);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToastMessage(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const hasRows = rows.length > 0;

  const handleExportCsv = () => {
    if (!hasRows) {
      return;
    }

    exportCsv(
      "admin-attendance-report.csv",
      ["Student ID", "Class", "Date", "Session", "Status"],
      rows.map((row) => [
        row.studentId,
        row.classCode,
        row.date ?? row.attendanceDate
          ? `="${row.date ?? row.attendanceDate}"`
          : "",
        row.session,
        row.status,
      ])
    );
    setToastMessage("Attendance CSV exported successfully.");
  };

  const handleExportPdf = () => {
    if (!hasRows) {
      return;
    }

    exportPdfTable(
      "admin-attendance-report.pdf",
      "Attendance Report",
      ["Student ID", "Class", "Date", "Session", "Status"],
      rows.map(
        (row) => [
          row.studentId,
          row.classCode,
          row.date ?? row.attendanceDate ?? "",
          row.session,
          row.status,
        ]
      )
    );
    setToastMessage("Attendance PDF exported successfully.");
  };

  return (
    <Layout links={links}>
      <section className="glass-panel p-5">
        <h1 className="page-title">Attendance Reports</h1>
        <p className="page-subtitle">Generate attendance reports by student, class, or date.</p>
      </section>

      <section className="glass-panel mt-4 p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <select className="input-glass" value={studentId} onChange={(event) => setStudentId(event.target.value)}>
            <option value="ALL">All Students</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.id} - {student.name}
              </option>
            ))}
          </select>

          <select className="input-glass" value={classCode} onChange={(event) => setClassCode(event.target.value)}>
            <option value="ALL">All Classes</option>
            {classOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <input type="date" className="input-glass" value={date} onChange={(event) => setDate(event.target.value)} />
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

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <article className="surface-soft p-4">
            <p className="text-soft text-xs uppercase font-semibold tracking-wider">Total Records</p>
            <p className="text-main text-2xl font-bold mt-1">{summary.total}</p>
          </article>
          <article className="surface-soft p-4">
            <p className="text-soft text-xs uppercase font-semibold tracking-wider">Present</p>
            <p className="text-main text-2xl font-bold mt-1">{summary.present}</p>
          </article>
          <article className="surface-soft p-4">
            <p className="text-soft text-xs uppercase font-semibold tracking-wider">Attendance %</p>
            <p className="text-main text-2xl font-bold mt-1">{summary.percentage}%</p>
          </article>
        </div>
      </section>

      <section className="glass-panel mt-4 p-5">
        <div className="table-shell">
          <table className="table-glass min-w-[760px]">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Date</th>
                <th>Session</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                  <td>{row.studentId}</td>
                  <td>{row.classCode}</td>
                  <td>{row.date}</td>
                  <td>{row.session}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {error ? (
        <p className="text-sm font-semibold text-[var(--color-danger)]">{error}</p>
      ) : null}

      {toastMessage ? (
        <div className="fixed right-4 top-20 z-40 rounded-xl border border-emerald-300/40 bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-200 backdrop-blur-xl">
          {toastMessage}
        </div>
      ) : null}
    </Layout>
  );
}
