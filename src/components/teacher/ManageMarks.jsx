import { useEffect, useMemo, useState } from "react";
import Layout from "../shared/Layout";
import { useAppData } from "../../context/AppDataContext";

const links = [
  { label: "Dashboard", path: "/teacher/dashboard" },
  { label: "Student Profiles", path: "/teacher/students" },
  { label: "Mark Attendance", path: "/teacher/attendance" },
  { label: "Manage Marks", path: "/teacher/marks" },
  { label: "Reports", path: "/teacher/reports" },
];

export default function ManageMarks() {
  const {
    courses,
    fetchTeacherProfile,
    fetchTeacherStudents,
    fetchTeacherMarks,
    upsertMarksForClassAssessment,
  } = useAppData();

  const [selectedClass, setSelectedClass] = useState("");
  const [assessment, setAssessment] = useState("");
  const [draftMarks, setDraftMarks] = useState({});
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [classOptions, setClassOptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [marksRecords, setMarksRecords] = useState([]);

  useEffect(() => {
    const loadProfile = async () => {
      const result = await fetchTeacherProfile();
      if (!result.ok) {
        setFeedback({ type: "error", message: result.message });
        return;
      }

      setClassOptions(result.data.assignedClasses || []);
    };

    loadProfile();
  }, [fetchTeacherProfile]);

  useEffect(() => {
    const loadStudents = async () => {
      if (!selectedClass) {
        setStudents([]);
        return;
      }

      const result = await fetchTeacherStudents(selectedClass);
      if (!result.ok) {
        setFeedback({ type: "error", message: result.message });
        return;
      }

      setStudents(result.data);
    };

    loadStudents();
  }, [selectedClass, fetchTeacherStudents]);

  useEffect(() => {
    const loadMarks = async () => {
      if (!selectedClass || !selectedCourse) {
        setMarksRecords([]);
        return;
      }

      const result = await fetchTeacherMarks({
        classCode: selectedClass,
        courseCode: selectedCourse.code,
      });
      if (!result.ok) {
        setFeedback({ type: "error", message: result.message });
        return;
      }

      setMarksRecords(result.data);
    };

    loadMarks();
  }, [selectedClass, selectedCourse, fetchTeacherMarks]);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.classCode === selectedClass) || null,
    [courses, selectedClass]
  );

  const getClassLabel = (classCode) => {
    const course = courses.find((entry) => entry.classCode === classCode);
    return course ? `${classCode} - ${course.name}` : classCode;
  };

  const rows = useMemo(() => {
    return students.map((student) => {
      const mark = marksRecords.find(
        (entry) => entry.studentId === student.id && entry.courseCode === selectedCourse?.code
      );

      const current = draftMarks[student.id];
      const obtained =
        current ??
        (assessment === "Quiz 1"
          ? mark?.assessments.quiz
          : assessment === "Assignment 1"
            ? mark?.assessments.assignment
            : assessment === "Mid Term"
              ? mark?.assessments.mid
              : assessment === "Final"
                ? mark?.assessments.final
                : 0) ?? 0;

      return {
        id: student.id,
        name: student.name,
        total: 100,
        obtained,
        percentage: mark?.percentage ?? 0,
        grade: mark?.grade ?? "N/A",
      };
    });
  }, [students, marksRecords, selectedCourse, assessment, draftMarks]);

  const handleMarksChange = (id, value) => {
    setDraftMarks((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.min(100, Number(value) || 0)),
    }));
  };

  const handleSave = async () => {
    if (!selectedClass || !assessment || !selectedCourse) {
      setFeedback({ type: "error", message: "Please select class and assessment." });
      return;
    }

    const result = await upsertMarksForClassAssessment({
      classCode: selectedClass,
      courseCode: selectedCourse.code,
      assessment,
      rows: rows.map((row) => ({ studentId: row.id, obtained: row.obtained })),
    });

    setFeedback({ type: result.ok ? "success" : "error", message: result.message });
    if (result.ok) {
      setDraftMarks({});
    }
  };

  return (
    <Layout links={links}>
      <section className="glass-panel p-5">
        <h1 className="page-title">Manage Marks</h1>
        <p className="page-subtitle">Enter assessment scores and review percentage outcomes instantly.</p>
      </section>

      <section className="glass-panel mt-4 p-5">
        <div className="grid gap-3 md:grid-cols-2">
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

          <select
            value={assessment}
            onChange={(e) => setAssessment(e.target.value)}
            className="input-glass"
          >
            <option value="">Assessment Type</option>
            <option value="Quiz 1">Quiz 1</option>
            <option value="Assignment 1">Assignment 1</option>
            <option value="Mid Term">Mid Term</option>
            <option value="Final">Final</option>
          </select>
        </div>
      </section>

      {selectedClass && assessment ? (
        <section className="glass-panel mt-4 p-5">
          <div className="table-shell">
            <table className="table-glass min-w-[760px]">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Total Marks</th>
                  <th>Obtained Marks</th>
                  <th>Percentage</th>
                  <th>Final Grade</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const percentage = ((row.obtained / row.total) * 100).toFixed(0);

                  return (
                    <tr
                      key={row.id}
                      className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}
                    >
                      <td>{row.id}</td>
                      <td>{row.name}</td>
                      <td>{row.total}</td>
                      <td>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={row.obtained}
                          onChange={(e) => handleMarksChange(row.id, e.target.value)}
                          className="input-glass w-24 px-2"
                        />
                      </td>
                      <td>{percentage}%</td>
                      <td>{row.grade}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button type="button" onClick={handleSave} className="btn-primary mt-4">
            Save Marks
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
        </section>
      ) : null}
    </Layout>
  );
}
