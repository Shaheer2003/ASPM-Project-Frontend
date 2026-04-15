import { useMemo, useState } from "react";
import Layout from "../shared/Layout";
import { useAppData } from "../../context/AppDataContext";
import { useAuth } from "../../context/AuthContext";

const links = [
  { label: "Dashboard", path: "/teacher/dashboard" },
  { label: "Student Profiles", path: "/teacher/students" },
  { label: "Mark Attendance", path: "/teacher/attendance" },
  { label: "Manage Marks", path: "/teacher/marks" },
  { label: "Reports", path: "/teacher/reports" },
];

export default function MarkAttendance() {
  const { user } = useAuth();
  const {
    studentsByClass,
    attendanceRecords,
    markAttendance,
    updateAttendanceRecord,
    getTeacherById,
    courses,
  } = useAppData();

  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState("");
  const [session, setSession] = useState("");
  const [attendance, setAttendance] = useState({});
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const teacher = getTeacherById(user.id);
  const classOptions = teacher?.assignedClasses || [];
  const selectedStudents = studentsByClass[selectedClass] || [];

  const getClassLabel = (classCode) => {
    const course = courses.find((entry) => entry.classCode === classCode);
    return course ? `${classCode} - ${course.name}` : classCode;
  };

  const existingRows = useMemo(
    () =>
      attendanceRecords.filter(
        (record) =>
          record.classCode === selectedClass &&
          record.date === date &&
          record.teacherId === user.id
      ),
    [attendanceRecords, selectedClass, date, user.id]
  );

  const updateAttendance = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = () => {
    if (!selectedClass || !date || !session) {
      setFeedback({ type: "error", message: "Please select class, date and session." });
      return;
    }

    const entries = selectedStudents
      .filter((student) => attendance[student.id])
      .map((student) => ({ studentId: student.id, status: attendance[student.id] }));

    if (entries.length === 0) {
      setFeedback({ type: "error", message: "Please mark attendance before submitting." });
      return;
    }

    const result = markAttendance({
      teacherId: user.id,
      classCode: selectedClass,
      date,
      session,
      entries,
    });

    setFeedback({ type: result.ok ? "success" : "error", message: result.message });
  };

  const handleUpdateExisting = (recordId, status) => {
    const result = updateAttendanceRecord(recordId, status);
    setFeedback({ type: result.ok ? "success" : "error", message: result.message });
  };

  return (
    <Layout links={links}>
      <section className="glass-panel p-5">
        <h1 className="page-title">Mark Attendance</h1>
        <p className="page-subtitle">Select class, date, and session to submit attendance records.</p>
      </section>

      <section className="glass-panel mt-4 p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="input-glass"
          >
            <option value="">Select Class</option>
            {classOptions.map((classCode) => (
              <option key={classCode} value={classCode}>
                {getClassLabel(classCode)}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-glass"
          />

          <select
            value={session}
            onChange={(e) => setSession(e.target.value)}
            className="input-glass"
          >
            <option value="">Session</option>
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
          </select>
        </div>
      </section>

      {selectedClass ? (
        <section className="glass-panel mt-4 p-5">
          <div className="table-shell">
            <table className="table-glass min-w-[700px]">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Present</th>
                  <th>Absent</th>
                </tr>
              </thead>
              <tbody>
                {selectedStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}
                  >
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        checked={attendance[student.id] === "Present"}
                        onChange={() => updateAttendance(student.id, "Present")}
                      />
                    </td>
                    <td>
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        checked={attendance[student.id] === "Absent"}
                        onChange={() => updateAttendance(student.id, "Absent")}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button type="button" onClick={handleSubmit} className="btn-primary mt-4">
            Submit Attendance
          </button>

          {feedback.message ? (
            <p
              className={[
                "mt-3 text-sm font-semibold",
                feedback.type === "error" ? "text-[var(--color-danger)]" : "text-emerald-700",
              ].join(" ")}
            >
              {feedback.message}
            </p>
          ) : null}

          <h2 className="text-main text-lg font-bold mt-6">Update Existing Records</h2>
          <div className="table-shell mt-3">
            <table className="table-glass min-w-[700px]">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Date</th>
                  <th>Session</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {existingRows.map((record, index) => (
                  <tr key={record.id} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                    <td>{record.studentId}</td>
                    <td>{record.date}</td>
                    <td>{record.session}</td>
                    <td>{record.status}</td>
                    <td>
                      <div className="flex gap-2">
                        <button type="button" className="btn-ghost px-3 py-1.5 text-xs" onClick={() => handleUpdateExisting(record.id, "Present")}>
                          Mark Present
                        </button>
                        <button type="button" className="btn-danger" onClick={() => handleUpdateExisting(record.id, "Absent")}>
                          Mark Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </Layout>
  );
}
