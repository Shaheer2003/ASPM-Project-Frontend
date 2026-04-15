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

export default function StudentProfiles() {
  const { user } = useAuth();
  const { students, getTeacherById, getStudentOverview } = useAppData();

  const [query, setQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const teacher = getTeacherById(user.id);
  const allowedClasses = teacher?.assignedClasses || [];

  const teacherStudents = useMemo(
    () => students.filter((student) => allowedClasses.includes(student.classCode)),
    [students, allowedClasses]
  );

  const filtered = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    if (!lowered) {
      return teacherStudents;
    }

    return teacherStudents.filter(
      (student) =>
        student.id.toLowerCase().includes(lowered) ||
        student.name.toLowerCase().includes(lowered)
    );
  }, [query, teacherStudents]);

  const selectedStudent = filtered.find((student) => student.id === selectedStudentId) || null;
  const overview = selectedStudent ? getStudentOverview(selectedStudent.id) : null;

  return (
    <Layout links={links}>
      <section className="glass-panel p-5">
        <h1 className="page-title">Student Profiles</h1>
        <p className="page-subtitle">
          Search by student ID or name. You can only access your assigned classes.
        </p>
      </section>

      <section className="glass-panel mt-4 p-5">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="input-glass"
          placeholder="Search by student name or ID"
        />

        <div className="table-shell mt-4">
          <table className="table-glass min-w-[760px]">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Class</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, index) => (
                <tr key={student.id} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.classCode}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => setSelectedStudentId(student.id)}
                      className="btn-ghost px-3 py-1.5 text-xs"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedStudent && overview ? (
        <section className="glass-panel mt-4 p-5">
          <h2 className="text-main text-lg font-bold">{selectedStudent.name}</h2>
          <p className="text-soft text-sm">{selectedStudent.id} | {selectedStudent.classCode}</p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <article className="surface-soft p-4">
              <p className="text-soft text-xs uppercase font-semibold tracking-wider">Attendance</p>
              <p className="text-main mt-1 font-semibold">
                {overview.attendanceRows.length > 0
                  ? `${overview.attendanceRows[0].percentage}% (${overview.attendanceRows[0].present}/${overview.attendanceRows[0].total})`
                  : "No attendance yet"}
              </p>
            </article>
            <article className="surface-soft p-4">
              <p className="text-soft text-xs uppercase font-semibold tracking-wider">Current Grade</p>
              <p className="text-main mt-1 font-semibold">
                {overview.markRows.length > 0 ? overview.markRows[0].grade : "N/A"}
              </p>
            </article>
          </div>
        </section>
      ) : null}
    </Layout>
  );
}
