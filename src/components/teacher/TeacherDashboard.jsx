import { useEffect, useState } from "react";
import Layout from "../shared/Layout";
import { useAppData } from "../../context/AppDataContext";

const links = [
  { label: "Dashboard", path: "/teacher/dashboard" },
  { label: "Student Profiles", path: "/teacher/students" },
  { label: "Mark Attendance", path: "/teacher/attendance" },
  { label: "Manage Marks", path: "/teacher/marks" },
  { label: "Reports", path: "/teacher/reports" },
];

export default function TeacherDashboard() {
  const { fetchTeacherProfile, fetchTeacherStudents, courses } = useAppData();
  const [selectedClassCode, setSelectedClassCode] = useState("");
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [classStudents, setClassStudents] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTeacher = async () => {
      const result = await fetchTeacherProfile();
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setAssignedClasses(result.data.assignedClasses || []);
    };

    loadTeacher();
  }, [fetchTeacherProfile]);

  useEffect(() => {
    if (!selectedClassCode || classStudents[selectedClassCode]) {
      return;
    }

    const loadStudents = async () => {
      const result = await fetchTeacherStudents(selectedClassCode);
      if (!result.ok) {
        setError(result.message);
        return;
      }

      setClassStudents((prev) => ({ ...prev, [selectedClassCode]: result.data }));
    };

    loadStudents();
  }, [selectedClassCode, classStudents, fetchTeacherStudents]);

  const totalStudents = assignedClasses.reduce(
    (sum, classCode) => sum + (classStudents[classCode]?.length || 0),
    0
  );
  const selectedStudents = selectedClassCode ? classStudents[selectedClassCode] || [] : [];

  const getClassLabel = (classCode) => {
    const course = courses.find((entry) => entry.classCode === classCode);
    return course ? `${classCode} - ${course.name}` : classCode;
  };

  const handleViewClass = (classCode) => {
    setSelectedClassCode((current) => (current === classCode ? "" : classCode));
  };

  return (
    <Layout links={links}>
      <section className="glass-panel p-5">
        <h1 className="page-title">Teacher Dashboard</h1>
        <p className="page-subtitle">Track classes, students, and pending academic tasks.</p>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-3">
        {[
          { label: "Total Classes", value: assignedClasses.length },
          { label: "Total Students", value: totalStudents },
          { label: "Pending Tasks", value: 5 },
        ].map((item) => (
          <article key={item.label} className="stat-card">
            <p className="text-soft text-xs font-semibold uppercase tracking-wider">{item.label}</p>
            <p className="mt-2 text-4xl font-extrabold text-[var(--color-primary)]">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="glass-panel mt-4 p-5">
        <h2 className="text-main text-xl font-bold">My Classes</h2>
        <div className="mt-3 space-y-3">
          {assignedClasses.map((classCode) => (
            <article
              key={classCode}
              className="surface-soft flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-main text-base font-bold">{getClassLabel(classCode)}</p>
                <p className="text-main">Assigned Class</p>
                <p className="text-soft text-sm">
                  Students: {classStudents[classCode]?.length || 0}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleViewClass(classCode)}
                className="btn-ghost self-start"
              >
                {selectedClassCode === classCode ? "Hide" : "View"}
              </button>
            </article>
          ))}
        </div>
      </section>

      {selectedClassCode ? (
        <section className="glass-panel mt-4 p-5">
          <h2 className="text-main text-xl font-bold">Students in {getClassLabel(selectedClassCode)}</h2>

          {selectedStudents.length === 0 ? (
            <p className="text-soft mt-3">No students found for this class.</p>
          ) : (
            <div className="table-shell mt-3">
              <table className="table-glass min-w-[760px]">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStudents.map((student) => (
                    <tr key={student.id} className="table-row-odd">
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}

      {error ? (
        <section className="glass-panel mt-4 p-5">
          <p className="text-sm font-semibold text-[var(--color-danger)]">{error}</p>
        </section>
      ) : null}
    </Layout>
  );
}
