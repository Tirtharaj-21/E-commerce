import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { useAuth } from "../../Context/AuthContext";
import { api, ApiError } from "../../api/apiClient";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const result = await api.customerDashboard();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "Failed to load your dashboard."
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
        <h1>My Dashboard</h1>
        <p>Welcome back, {user?.name || "there"}.</p>
      </div>

      {loading && <p className="dashboard-status">Loading...</p>}
      {error && <p className="dashboard-error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="dashboard-stats">
            <div className="dashboard-card">
              <span className="dashboard-card-label">Total Orders</span>
              <span className="dashboard-card-value">
                {data?.totalOrders ?? "-"}
              </span>
            </div>
            <div className="dashboard-card">
              <span className="dashboard-card-label">Wishlist Items</span>
              <span className="dashboard-card-value">
                {data?.wishlistCount ?? "-"}
              </span>
            </div>
          </div>

          <div className="dashboard-section">
            <h2>Recent Orders</h2>
            {data?.recentOrders?.length ? (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.date}</td>
                      <td>{order.status}</td>
                      <td>${order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="dashboard-empty">
                You haven't placed any orders yet.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
