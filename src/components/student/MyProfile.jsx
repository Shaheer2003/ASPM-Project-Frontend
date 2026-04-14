import Layout from "../shared/Layout";
import mockStudents from "../../data/mockStudents";

const links = [
  { label: "Dashboard", path: "/student/dashboard" },
  { label: "My Profile", path: "/student/profile" },
  { label: "Attendance", path: "/student/attendance" },
  { label: "My Marks", path: "/student/marks" },
];

export default function MyProfile() {
  const fields = [
    { label: "Full Name", value: mockStudents.name },
    { label: "Student ID", value: mockStudents.studentId },
    { label: "Email", value: mockStudents.email },
    { label: "Phone", value: mockStudents.phone },
    { label: "Department", value: mockStudents.department },
    { label: "Batch", value: mockStudents.batch },
  ];

  return (
    <Layout links={links}>
      <section className="glass-panel p-5">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Read-only personal and academic details.</p>
      </section>

      <section className="glass-panel mt-4 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <article key={field.label} className="rounded-xl border border-white/70 bg-white/60 p-4 backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6f87a1]">{field.label}</p>
              <p className="mt-1 font-semibold text-[#1f3f61]">{field.value}</p>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
