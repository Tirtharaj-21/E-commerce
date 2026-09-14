import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { useAuth } from "../../Context/AuthContext";
import { api, ApiError } from "../../api/apiClient";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [dashboardData, usersData] = await Promise.all([
          api.adminDashboard(),
          api.adminUsers(),
        ]);
        if (!cancelled) {
          setStats(dashboardData);
          setUsers(usersData || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "Failed to load dashboard data."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.name || "Admin"}.</p>
      </div>

      {loading && <p className="dashboard-status">Loading...</p>}
      {error && <p className="dashboard-error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="dashboard-stats">
            <div className="dashboard-card">
              <span className="dashboard-card-label">Total Users</span>
              <span className="dashboard-card-value">
                {stats?.totalUsers ?? "-"}
              </span>
            </div>
            <div className="dashboard-card">
              <span className="dashboard-card-label">Total Orders</span>
              <span className="dashboard-card-value">
                {stats?.totalOrders ?? "-"}
              </span>
            </div>
            <div className="dashboard-card">
              <span className="dashboard-card-label">Total Products</span>
              <span className="dashboard-card-value">
                {stats?.totalProducts ?? "-"}
              </span>
            </div>
            <div className="dashboard-card">
              <span className="dashboard-card-label">Revenue</span>
              <span className="dashboard-card-value">
                ${stats?.totalRevenue ?? "-"}
              </span>
            </div>
          </div>

          <div className="dashboard-section">
            <h2>Recent Orders</h2>
            {stats?.recentOrders?.length ? (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customerName}</td>
                      <td>{order.status}</td>
                      <td>${order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="dashboard-empty">No recent orders.</p>
            )}
          </div>

          <div className="dashboard-section">
            <h2>Users</h2>
            {users.length ? (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="dashboard-empty">No users found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
