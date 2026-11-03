import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "./CSS/LoginSignup.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const response = await signup(name, email, password);

      setSuccess(response?.message || "Registration successful!");

      // Registration does not automatically authenticate the user.
      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { message: "Account created successfully. Please log in." },
        });
      }, 1000);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>Create Account</h1>

        <form onSubmit={handleSignup}>
          <div className="loginsignup-fields">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password (minimum 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          {error && (
            <p style={{ color: "red" }} role="alert">
              {error}
            </p>
          )}

          {success && (
            <p style={{ color: "green" }} role="status">
              {success}
            </p>
          )}

          <button type="submit" disabled={submitting}>
            {submitting ? "Please wait..." : "Create Account"}
          </button>
        </form>

        <p className="loginsignup-login">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
