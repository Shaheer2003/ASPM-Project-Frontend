import { useMemo, useState } from "react";
import Layout from "../shared/Layout";
import mockUsers from "../../data/mockUsers";

const links = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Manage Users", path: "/admin/manage-users" },
  { label: "Register User", path: "/admin/register-user" },
  { label: "System Settings", path: "#" },
];

const PAGE_SIZE = 5;

export default function ManageUsers() {
  const [users, setUsers] = useState(mockUsers);
  const [activeTab, setActiveTab] = useState("Student");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

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

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
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
                activeTab === tab ? "tab-chip-active" : "hover:border-white hover:bg-white",
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
              {paginatedUsers.map((user, index) => (
                <tr key={user.id} className={index % 2 === 0 ? "bg-white/35" : "bg-white/10"}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.department}</td>
                  <td>
                    <span className="rounded-full border border-emerald-200 bg-emerald-100/80 px-2 py-1 text-xs font-semibold text-emerald-700">
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => alert(`Edit user ${user.name}`)}
                        className="btn-ghost px-3 py-1.5 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user.id)}
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
                  : "border border-white/70 bg-white/70 text-[#365577]",
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
      </section>
    </Layout>
  );
}
