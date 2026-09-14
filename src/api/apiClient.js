// Central API client for talking to the Spring Boot backend.
//
// Set VITE_API_BASE_URL in a .env file at the project root, e.g.:
//   VITE_API_BASE_URL=http://localhost:8080/api
//
// Expected Spring Boot contract (adjust backend to match, or tell me your
// real shapes and I'll update this file):
//
//   POST /auth/login   { email, password } -> { token, user: { id, name, email, role } }
//   POST /auth/signup  { name, email, password } -> { token, user: { id, name, email, role } }
//   GET  /admin/dashboard   (Bearer token, role=ADMIN)    -> { totalUsers, totalOrders, totalProducts, totalRevenue, recentOrders: [] }
//   GET  /admin/users       (Bearer token, role=ADMIN)    -> [ { id, name, email, role } ]
//   GET  /customer/dashboard (Bearer token, role=CUSTOMER) -> { totalOrders, wishlistCount, recentOrders: [] }
//
// role is expected as the plain string "ADMIN" or "CUSTOMER".

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const AUTH_STORAGE_KEY = "ecom_auth";

export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(auth) {
  if (auth) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const stored = getStoredAuth();
    if (stored?.token) {
      headers.Authorization = `Bearer ${stored.token}`;
    }
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new ApiError(
      "Could not reach the server. Is the Spring Boot backend running?",
      0,
      null
    );
  }

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed (${response.status})`;
    throw new ApiError(message, response.status, data);
  }

  return data;
}

export const api = {
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),
  signup: (name, email, password) =>
    request("/auth/signup", { method: "POST", body: { name, email, password } }),
  adminDashboard: () => request("/admin/dashboard", { auth: true }),
  adminUsers: () => request("/admin/users", { auth: true }),
  customerDashboard: () => request("/customer/dashboard", { auth: true }),
};

export { ApiError };
