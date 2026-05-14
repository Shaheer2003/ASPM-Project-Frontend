import { useEffect, useMemo, useState } from "react";
import Layout from "../shared/Layout";
import { useAppData } from "../../context/AppDataContext";

const links = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Manage Users", path: "/admin/manage-users" },
  { label: "Register User", path: "/admin/register-user" },
  { label: "Attendance Reports", path: "/admin/attendance-reports" },
];

const PAGE_SIZE = 5;

// ── Validation helpers ────────────────────────────────────────────────────────
const NAME_RE = /^[A-Za-z\s'.`-]+$/;

function validateEditField(key, value) {
  const v = value.trim();
  if (key === "name") {
    if (!v) return "Name is required.";
    if (!NAME_RE.test(v)) return "Name must contain letters only (no numbers or special characters).";
  }
  if (key === "department") {
    if (!v) return "Department is required.";
  }
  return "";
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
function EditModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user.name || "");
  const [department, setDepartment] = useState(user.department || "");
  const [errors, setErrors] = useState({ name: "", department: "" });
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const nextErrors = {
      name: validateEditField("name", name),
      department: validateEditField("department", department),
    };
    setErrors(nextErrors);
    return !nextErrors.name && !nextErrors.department;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await onSave(user.id, { name: name.trim(), department: department.trim() });
    setSaving(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="glass-panel w-full max-w-md p-6 shadow-2xl">
        <h2 className="mb-1 text-lg font-bold">
          Edit {user.role === "Student" ? "Student" : "Teacher"}
        </h2>
        <p className="text-soft mb-5 text-sm">
          ID: <span className="font-semibold">{user.id}</span>
        </p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {/* Name */}
          <label>
            <span className="text-soft mb-1 block text-sm font-medium">
              Full Name <span className="text-red-500">*</span>
            </span>
            <input
              className={[
                "input-glass",
                errors.name ? "border-red-500 focus:border-red-500" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: validateEditField("name", e.target.value) }));
              }}
            />
            {errors.name && (
              <span className="mt-1 block text-xs text-red-500">{errors.name}</span>
            )}
          </label>

          {/* Department */}
          <label>
            <span className="text-soft mb-1 block text-sm font-medium">
              Department <span className="text-red-500">*</span>
            </span>
            <input
              className={[
                "input-glass",
                errors.department ? "border-red-500 focus:border-red-500" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  department: validateEditField("department", e.target.value),
                }));
              }}
            />
            {errors.department && (
              <span className="mt-1 block text-xs text-red-500">{errors.department}</span>
            )}
          </label>

          <div className="mt-2 flex gap-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ManageUsers() {
  const {
    users,
    loadUsers,
    assignUserRole,
    updateStudent,
    updateTeacher,
    deleteOrArchiveStudent,
  } = useAppData();

  const [activeTab, setActiveTab] = useState("Student");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers().then((result) => {
      if (!result.ok) setFeedback({ type: "error", message: result.message });
    });
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const lowered = search.toLowerCase();
    return users.filter(
      (user) =>
        user.role === activeTab &&
        (user.name?.toLowerCase().includes(lowered) ||
          user.id?.toLowerCase().includes(lowered))
    );
  }, [users, activeTab, search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Role change – only Teachers can become Admin (or back to Teacher)
  const handleRoleChange = async (id, role) => {
    const result = await assignUserRole(id, role);
    setFeedback({ type: result.ok ? "success" : "error", message: result.message });
  };

  const handleSaveEdit = async (id, payload) => {
    const user = users.find((u) => u.id === id);
    const fn = user?.role === "Student" ? updateStudent : updateTeacher;
    const result = await fn(id, payload);
    setFeedback({ type: result.ok ? "success" : "error", message: result.message });
    await loadUsers();
  };

  const handleDelete = async (id, mode) => {
    const result = await deleteOrArchiveStudent(id, mode);
    setFeedback({ type: result.ok ? "success" : "error", message: result.message });
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5);

  return (
    <Layout links={links}>
      {/* Edit modal */}
      {editingUser && (
        <EditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveEdit}
        />
      )}

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
            placeholder="Search by name or ID…"
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
          <table className="table-glass min-w-[700px]">
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
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm opacity-60">
                    No {activeTab.toLowerCase()}s found.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="table-row-odd">
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.department ?? "—"}</td>
                    <td>
                      <span className="status-pill-positive">{user.status}</span>
                    </td>
                    <td>
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Role control – Teachers only can be promoted to Admin */}
                        {activeTab === "Teacher" && (
                          <select
                            className="input-glass w-28 px-2 py-1.5 text-xs"
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          >
                            <option value="Teacher">Teacher</option>
                            <option value="Admin">Admin</option>
                          </select>
                        )}

                        {/* Edit button – opens modal */}
                        <button
                          type="button"
                          onClick={() => setEditingUser(user)}
                          className="btn-ghost px-3 py-1.5 text-xs"
                        >
                          Edit
                        </button>

                        {/* Archive / Delete – students only for now */}
                        {activeTab === "Student" && (
                          <>
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
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="btn-ghost px-3 py-1.5 text-xs"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {pages.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
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
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        {feedback.message ? (
          <p
            className={[
              "mt-3 text-sm font-semibold",
              feedback.type === "error"
                ? "text-[var(--color-danger)]"
                : "text-emerald-600",
            ].join(" ")}
          >
            {feedback.message}
          </p>
        ) : null}
      </section>
    </Layout>
  );
}
