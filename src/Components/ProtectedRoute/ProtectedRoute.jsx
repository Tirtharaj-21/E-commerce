import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

// Wrap any route element:
//   <ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>
// Omit allowedRoles to just require "logged in, any role".
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null; // avoid flicker/redirect while session is being restored
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Logged in, but wrong role — send them to their own dashboard instead of a dead end
    const fallback = role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
    return <Navigate to={fallback} replace />;
  }

  return children;
}
