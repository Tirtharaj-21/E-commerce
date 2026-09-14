import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CSS/LoginSignup.css";
import { useAuth } from "../Context/AuthContext";
import { ApiError } from "../api/apiClient";

const LoginSignup = () => {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const redirectAfterAuth = (user) => {
    const from = location.state?.from?.pathname;
    if (from) {
      navigate(from, { replace: true });
      return;
    }
    navigate(user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard", {
      replace: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "signup" && !agreed) {
      setError("Please agree to the terms of use & privacy policy.");
      return;
    }

    setSubmitting(true);
    try {
      const user =
        mode === "login"
          ? await login(form.email, form.password)
          : await signup(form.name, form.email, form.password);
      redirectAfterAuth(user);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{mode === "login" ? "Login" : "Sign up"}</h1>
        <form onSubmit={handleSubmit}>
          <div className="loginsignup-fields">
            {mode === "signup" && (
              <input
                type="text"
                name="name"
                placeholder="your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          {error && <p className="loginsignup-error">{error}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Please wait..." : "Continue"}
          </button>
        </form>

        <p className="loginsignup-login">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <span onClick={() => setMode("signup")}>Sign up here</span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setMode("login")}>Login here</span>
            </>
          )}
        </p>

        {mode === "signup" && (
          <div className="loginsignup-agree">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              id="agree"
            />
            <p>By continuing, i agree to the terms of use & privacy policy.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
