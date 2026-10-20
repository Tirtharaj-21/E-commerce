import all_product from "../Components/Assets/all_product";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const AUTH_KEY = "ecom_auth";
const USERS_KEY = "ecom_users";
const ORDERS_KEY = "ecom_orders";

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(auth) {
  try {
    if (auth) localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    else localStorage.removeItem(AUTH_KEY);
  } catch {
    // storage blocked: session just won't persist
  }
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const stored = getStoredAuth();
    if (stored?.token) headers.Authorization = `Bearer ${stored.token}`;
  }
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Could not reach the server.", 0, null);
  }
  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : null;
  if (!response.ok) {
    throw new ApiError(
      data?.message || data?.error || `Request failed (${response.status})`,
      response.status,
      data,
    );
  }
  return data;
}

const remoteApi = {
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),
  signup: (name, email, password) =>
    request("/auth/signup", {
      method: "POST",
      body: { name, email, password },
    }),
  adminDashboard: () => request("/admin/dashboard", { auth: true }),
  adminUsers: () => request("/admin/users", { auth: true }),
  customerDashboard: () => request("/customer/dashboard", { auth: true }),
};

// ---------- Local mode: data is kept in the browser (demo only) ----------

function readList(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    throw new ApiError(
      "Browser storage is blocked, cannot save account.",
      0,
      null,
    );
  }
}

async function hashPassword(password) {
  try {
    if (globalThis.crypto?.subtle) {
      const bytes = new TextEncoder().encode(password);
      const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
      return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
  } catch {
    // use fallback below
  }
  return `plain:${password}`;
}

const newId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const newToken = () =>
  globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : newId() + newId();

const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
});

const cleanEmail = (email) =>
  String(email || "")
    .trim()
    .toLowerCase();

// Demo admin:  admin@shopper.com / admin123
async function ensureAdmin() {
  const users = readList(USERS_KEY);
  if (!users.some((u) => u.email === "admin@shopper.com")) {
    users.push({
      id: newId(),
      name: "Admin",
      email: "admin@shopper.com",
      passwordHash: await hashPassword("admin123"),
      role: "ADMIN",
    });
    writeList(USERS_KEY, users);
  }
}

function requireSession(role) {
  const stored = getStoredAuth();
  if (!stored?.token || !stored?.user) {
    throw new ApiError("Please log in again.", 401, null);
  }
  if (role && stored.user.role !== role) {
    throw new ApiError("You do not have access to this page.", 403, null);
  }
  return stored.user;
}

const localApi = {
  async login(email, password) {
    await ensureAdmin();
    const user = readList(USERS_KEY).find((u) => u.email === cleanEmail(email));
    const hash = await hashPassword(password || "");
    if (!user || user.passwordHash !== hash) {
      throw new ApiError("Invalid email or password.", 401, null);
    }
    return { token: newToken(), user: publicUser(user) };
  },

  async signup(name, email, password) {
    await ensureAdmin();
    const fullName = String(name || "").trim();
    const mail = cleanEmail(email);
    if (!fullName) throw new ApiError("Please enter your name.", 400, null);
    if (!/^\S+@\S+\.\S+$/.test(mail)) {
      throw new ApiError("Please enter a valid email address.", 400, null);
    }
    if (String(password || "").length < 6) {
      throw new ApiError("Password must be at least 6 characters.", 400, null);
    }
    const users = readList(USERS_KEY);
    if (users.some((u) => u.email === mail)) {
      throw new ApiError(
        "An account with this email already exists.",
        409,
        null,
      );
    }
    const user = {
      id: newId(),
      name: fullName,
      email: mail,
      passwordHash: await hashPassword(password),
      role: "CUSTOMER",
    };
    users.push(user);
    writeList(USERS_KEY, users);
    return { token: newToken(), user: publicUser(user) };
  },

  async adminDashboard() {
    requireSession("ADMIN");
    await ensureAdmin();
    const users = readList(USERS_KEY);
    const orders = readList(ORDERS_KEY);
    return {
      totalUsers: users.length,
      totalOrders: orders.length,
      totalProducts: all_product.length,
      totalRevenue: orders
        .reduce((sum, o) => sum + Number(o.total || 0), 0)
        .toFixed(2),
      recentOrders: orders
        .slice(-5)
        .reverse()
        .map((o) => ({
          id: o.id,
          customerName:
            users.find((u) => u.id === o.userId)?.name || "Customer",
          status: o.status || "PLACED",
          total: o.total,
        })),
    };
  },

  async adminUsers() {
    requireSession("ADMIN");
    await ensureAdmin();
    return readList(USERS_KEY).map(publicUser);
  },

  async customerDashboard() {
    const me = requireSession("CUSTOMER");
    const orders = readList(ORDERS_KEY).filter((o) => o.userId === me.id);
    return {
      totalOrders: orders.length,
      wishlistCount: 0,
      recentOrders: orders
        .slice(-5)
        .reverse()
        .map((o) => ({
          id: o.id,
          date: o.date,
          status: o.status || "PLACED",
          total: o.total,
        })),
    };
  },
};

export const api = BASE_URL ? remoteApi : localApi;
