import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./CSS/LoginSignup.css";
import { useAuth } from "../Context/AuthContext";
import { ApiError } from "../api/apiClient";

export default function LoginSignup() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const redirectAfterAuth = (user) => {
    const destination = location.state?.from?.pathname;

    if (destination) {
      navigate(destination, { replace: true });
      return;
    }

    navigate(user?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard", {
      replace: true,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (mode === "signup" && !agreed) {
      setError("Please agree to the terms of use and privacy policy.");
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
      setError(
        err instanceof ApiError
          ? err.message
          : err?.message || "Something went wrong. Please try again.",
      );
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
                placeholder="Your name"
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

          {error && (
            <p className="loginsignup-error" role="alert">
              {error}
            </p>
          )}

          {mode === "signup" && (
            <div className="loginsignup-agree">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
              />
              <label htmlFor="agree">
                By continuing, I agree to the terms of use and privacy policy.
              </label>
            </div>
          )}

          <button type="submit" disabled={submitting}>
            {submitting
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Create Account"}
          </button>
        </form>

        <p className="loginsignup-login">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <span
                onClick={() => {
                  setError("");
                  setMode("signup");
                }}
              >
                Sign up here
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setError("");
                  setMode("login");
                }}
              >
                Login here
              </span>
            </>
          )}
        </p>

        <p>
          <Link to="/signup">Open the separate signup page</Link>
        </p>
      </div>
    </div>
  );
}
