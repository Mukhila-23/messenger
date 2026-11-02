import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Users,Search,Shield,Trash2,LogOut,LoaderCircle,RefreshCw} from "lucide-react";

import {getAllUsers,findUser,updateUserRole,deleteUser,} from "../service/adminService";

import "../styles/admin.css";

function Admin() {
const navigate = useNavigate();

const [users, setUsers] = useState([]);
const [searchEmail, setSearchEmail] = useState("");
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [message, setMessage] = useState("");

const currentUser = JSON.parse(
localStorage.getItem("user") || "null"
);

// Load all users
async function loadUsers() {
try {
setLoading(true);
setError("");
  const response = await getAllUsers();

  setUsers(response.users || []);
} catch (error) {
  setError(
    error.response?.data?.message || "Failed to load users"
  );
} finally {
  setLoading(false);
}

}

useEffect(() => {
loadUsers();
}, []);

// Search user by email
async function handleSearch(event) {
event.preventDefault();
const email = searchEmail.trim();

if (!email) {
  loadUsers();
  return;
}

try {
  setLoading(true);
  setError("");
  setMessage("");

  const response = await findUser(email);

  setUsers(response.user ? [response.user] : []);
} catch (error) {
  setUsers([]);

  setError(
    error.response?.data?.message || "User not found"
  );
} finally {
  setLoading(false);
}


}

// Change user role
async function handleRoleChange(email, role) {
try {
setError("");
setMessage("");
  await updateUserRole(email, role);

  setMessage("User role updated successfully");

  await loadUsers();
} catch (error) {
  setError(
    error.response?.data?.message || "Failed to update role"
  );
}


}

// Delete user
async function handleDelete(email) {
const confirmed = window.confirm(
`Are you sure you want to delete ${email}?`
);


if (!confirmed) {
  return;
}

try {
  setError("");
  setMessage("");

  await deleteUser(email);

  setMessage("User deleted successfully");

  await loadUsers();
} catch (error) {
  setError(
    error.response?.data?.message || "Failed to delete user"
  );
}

}

// Logout
function handleLogout() {
localStorage.removeItem("token");
localStorage.removeItem("user");
navigate("/login");
}

const adminCount = users.filter(
(user) => user.role === "admin"
).length;

const regularUserCount = users.filter(
(user) => user.role === "user"
).length;

return ( <div className="admin-page">
{/* Header */} <header className="admin-header"> <div className="admin-brand"> <div className="admin-brand-icon"> <Shield size={24} /> </div>

      <div>
        <h1>Messenger Admin</h1>
        <p>Manage users and their roles</p>
      </div>
    </div>

    <button
      className="admin-logout"
      onClick={handleLogout}
    >
      <LogOut size={18} />
      Logout
    </button>
  </header>

  {/* Main content */}
  <main className="admin-main">
    <section className="admin-welcome">
      <div>
        <h2>Welcome, Admin</h2>

        <p>
          Manage registered users and control their access.
        </p>

        {currentUser?.email && (
          <span className="admin-email">
            {currentUser.email}
          </span>
        )}
      </div>

      <div className="admin-welcome-icon">
        <Users size={36} />
      </div>
    </section>

    {/* Statistics */}
    <section className="admin-stats">
      <div className="admin-stat-card">
        <div className="admin-stat-icon">
          <Users size={22} />
        </div>

        <div>
          <p>Total Users</p>
          <h3>{users.length}</h3>
        </div>
      </div>

      <div className="admin-stat-card">
        <div className="admin-stat-icon">
          <Shield size={22} />
        </div>

        <div>
          <p>Admins</p>
          <h3>{adminCount}</h3>
        </div>
      </div>

      <div className="admin-stat-card">
        <div className="admin-stat-icon">
          <Users size={22} />
        </div>

        <div>
          <p>Regular Users</p>
          <h3>{regularUserCount}</h3>
        </div>
      </div>
    </section>

    {/* User management */}
    <section className="admin-users-section">
      <div className="admin-section-heading">
        <div>
          <h2>User Management</h2>

          <p>
            View, search, update roles, and delete users.
          </p>
        </div>

        <button
          className="admin-refresh"
          onClick={loadUsers}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <form
        className="admin-search"
        onSubmit={handleSearch}
      >
        <Search size={19} />

        <input
          type="email"
          placeholder="Search user by email..."
          value={searchEmail}
          onChange={(event) =>
            setSearchEmail(event.target.value)
          }
        />

        <button type="submit">
          Search
        </button>

        <button
          type="button"
          className="admin-clear"
          onClick={() => {
            setSearchEmail("");
            loadUsers();
          }}
        >
          Clear
        </button>
      </form>

      {/* Messages */}
      {message && (
        <div className="admin-success">
          {message}
        </div>
      )}

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {/* Users table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  className="admin-loading"
                >
                  <LoaderCircle size={22} />

                  <span>Loading users...</span>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="admin-empty"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="admin-user-name">
                      {user.name ||
                        user.full_name ||
                        "User"}
                    </div>
                  </td>

                  <td>
                    <span className="admin-user-email">
                      {user.email}
                    </span>
                  </td>

                  <td>
                    <select
                      className="admin-role-select"
                      value={user.role}
                      onChange={(event) =>
                        handleRoleChange(
                          user.email,
                          event.target.value
                        )
                      }
                    >
                      <option value="user">
                        User
                      </option>

                      <option value="admin">
                        Admin
                      </option>
                    </select>
                  </td>

                  <td>
                    <button
                      className="admin-delete"
                      onClick={() =>
                        handleDelete(user.email)
                      }
                      title="Delete user"
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-table-footer">
        Showing {users.length} user
        {users.length !== 1 ? "s" : ""}
      </div>
    </section>
  </main>
</div>
);
}

export default Admin;
