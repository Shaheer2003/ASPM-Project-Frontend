import { useMemo, useState } from "react";
import Layout from "../shared/Layout";
import mockTeacher from "../../data/mockTeacher";

const links = [
  { label: "Dashboard", path: "/teacher/dashboard" },
  { label: "Mark Attendance", path: "/teacher/attendance" },
  { label: "Manage Marks", path: "/teacher/marks" },
];

const initialRows = [
  { id: "22K-4169", name: "Tameema Rehman", total: 100, obtained: 80 },
  { id: "22K-4389", name: "Shaheer Mumtaz", total: 100, obtained: 71 },
  { id: "22K-4396", name: "Ahmed Yoshay", total: 100, obtained: 74 },
  { id: "22L-6754", name: "Taha Tahir", total: 100, obtained: 67 },
  { id: "22K-4200", name: "Ayesha Tariq", total: 100, obtained: 91 },
];

export default function ManageMarks() {
  const [selectedClass, setSelectedClass] = useState("");
  const [assessment, setAssessment] = useState("");
  const [rows, setRows] = useState(initialRows);

  const selectedClassObj = useMemo(
    () => mockTeacher.classes.find((course) => course.code === selectedClass),
    [selectedClass]
  );

  const handleMarksChange = (id, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, obtained: Math.max(0, Math.min(100, Number(value) || 0)) }
          : row
      )
    );
  };

  const handleSave = () => {
    if (!selectedClassObj || !assessment) {
      return;
    }

    alert(`Marks saved for ${assessment} in ${selectedClassObj.name}`);
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
            {mockTeacher.classes.map((course) => (
              <option key={course.code} value={course.code}>
                {course.code} - {course.name}
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
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const percentage = ((row.obtained / row.total) * 100).toFixed(0);

                  return (
                    <tr key={row.id} className={index % 2 === 0 ? "bg-white/35" : "bg-white/10"}>
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button type="button" onClick={handleSave} className="btn-primary mt-4">
            Save Marks
          </button>
        </section>
      ) : null}
    </Layout>
  );
}
