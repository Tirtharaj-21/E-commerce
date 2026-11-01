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

  const changeMode = (newMode) => {
    setError("");
    setMode(newMode);
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <div className="loginsignup-header">
          <span className="loginsignup-label">WELCOME TO SHOPPER</span>

          <h1>{mode === "login" ? "Welcome back!" : "Create your account"}</h1>

          <p>
            {mode === "login"
              ? "Enter your details to access your account."
              : "Join us and discover your favourite products."}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="loginsignup-fields">
            {mode === "signup" && (
              <div className="loginsignup-field">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            )}

            <div className="loginsignup-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="loginsignup-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                minLength={6}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                required
              />
            </div>
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
                I agree to the terms of use and privacy policy.
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="loginsignup-submit"
          >
            {submitting
              ? "Please wait..."
              : mode === "login"
                ? "Login to Account"
                : "Create Account"}
          </button>
        </form>

        <div className="loginsignup-footer">
          {mode === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                className="loginsignup-switch"
                onClick={() => changeMode("signup")}
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="loginsignup-switch"
                onClick={() => changeMode("login")}
              >
                Login
              </button>
            </p>
          )}

          <Link to="/signup" className="loginsignup-separate-link">
            Open separate signup page
          </Link>
        </div>
      </div>
    </div>
  );
}
