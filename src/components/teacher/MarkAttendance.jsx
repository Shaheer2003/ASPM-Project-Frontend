import { useMemo, useState } from "react";
import Layout from "../shared/Layout";
import mockTeacher from "../../data/mockTeacher";

const links = [
  { label: "Dashboard", path: "/teacher/dashboard" },
  { label: "Mark Attendance", path: "/teacher/attendance" },
  { label: "Manage Marks", path: "/teacher/marks" },
];

const students = [
  { id: "22K-4169", name: "Tameema Rehman" },
  { id: "22K-4389", name: "Shaheer Mumtaz" },
  { id: "22K-4396", name: "Ahmed Yoshay" },
  { id: "22L-6754", name: "Taha Tahir" },
  { id: "22K-4200", name: "Ayesha Tariq" },
];

export default function MarkAttendance() {
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState("");
  const [session, setSession] = useState("");
  const [attendance, setAttendance] = useState({});

  const selectedClassObj = useMemo(
    () => mockTeacher.classes.find((course) => course.code === selectedClass),
    [selectedClass]
  );

  const updateAttendance = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = () => {
    if (!selectedClassObj || !date) {
      return;
    }

    alert(`Attendance saved for ${selectedClassObj.name} on ${date}`);
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
            {mockTeacher.classes.map((course) => (
              <option key={course.code} value={course.code}>
                {course.code} - {course.name}
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
                {students.map((student, index) => (
                  <tr key={student.id} className={index % 2 === 0 ? "bg-white/35" : "bg-white/10"}>
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
        </section>
      ) : null}
    </Layout>
  );
}
