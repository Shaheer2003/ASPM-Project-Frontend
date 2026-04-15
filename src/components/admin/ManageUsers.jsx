import { useMemo, useState } from "react";
import Layout from "../shared/Layout";
import { useAppData } from "../../context/AppDataContext";

const links = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Manage Users", path: "/admin/manage-users" },
  { label: "Register User", path: "/admin/register-user" },
  { label: "Attendance Reports", path: "/admin/attendance-reports" },
];

const PAGE_SIZE = 5;

export default function ManageUsers() {
  const { users, assignUserRole, updateStudent, deleteOrArchiveStudent } = useAppData();
  const [activeTab, setActiveTab] = useState("Student");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const filteredUsers = useMemo(() => {
    const lowered = search.toLowerCase();
    return users.filter(
      (user) =>
        user.role === activeTab &&
        (user.name.toLowerCase().includes(lowered) || user.id.toLowerCase().includes(lowered))
    );
  }, [users, activeTab, search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleRoleChange = (id, role) => {
    const result = assignUserRole(id, role);
    setFeedback({ type: result.ok ? "success" : "error", message: result.message });
  };

  const handleQuickUpdate = (user) => {
    if (user.role !== "Student") {
      setFeedback({ type: "success", message: "No additional fields required for this role." });
      return;
    }

    const nextName = window.prompt("Update student name", user.name);
    if (nextName === null) {
      return;
    }

    const nextEmail = window.prompt("Update student email", user.email);
    if (nextEmail === null) {
      return;
    }

    const result = updateStudent(user.id, { name: nextName, email: nextEmail });
    setFeedback({ type: result.ok ? "success" : "error", message: result.message });
  };

  const handleDelete = (id, mode) => {
    const result = deleteOrArchiveStudent(id, mode);
    setFeedback({ type: result.ok ? "success" : "error", message: result.message });
  };

  return (
    <Layout links={links}>
      <section className="glass-panel p-5">
        <h1 className="page-title">Manage Users</h1>
        <p className="page-subtitle">Search, filter, and maintain student and teacher accounts.</p>
      </section>

      <section className="glass-panel mt-4 p-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or ID..."
            className="input-glass"
          />
          <button type="button" className="btn-primary whitespace-nowrap">
            Search
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          {["Student", "Teacher"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
              className={[
                "tab-chip",
                activeTab === tab ? "tab-chip-active" : "hover:brightness-105",
              ].join(" ")}
            >
              {tab}s
            </button>
          ))}
        </div>
      </section>

      <section className="glass-panel mt-4 p-5">
        <div className="table-shell">
          <table className="table-glass min-w-[800px]">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="table-row-odd">
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.department}</td>
                  <td>
                    <span className="status-pill-positive">
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <select
                        className="input-glass w-28 px-2 py-1.5 text-xs"
                        value={user.role}
                        onChange={(event) => handleRoleChange(user.id, event.target.value)}
                      >
                        <option value="Student">Student</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Admin">Admin</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleQuickUpdate(user)}
                        className="btn-ghost px-3 py-1.5 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user.id, "archive")}
                        className="btn-ghost px-3 py-1.5 text-xs"
                      >
                        Archive
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user.id, "delete")}
                        className="btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="btn-ghost px-3 py-1.5 text-xs"
          >
            Previous
          </button>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(Math.min(n, totalPages))}
              className={[
                "rounded-xl px-3 py-1.5 text-xs font-semibold transition",
                currentPage === n
                  ? "bg-[var(--color-primary)] text-white"
                  : "btn-ghost",
              ].join(" ")}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            className="btn-ghost px-3 py-1.5 text-xs"
          >
            Next
          </button>
        </div>

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
    </Layout>
  );
}
