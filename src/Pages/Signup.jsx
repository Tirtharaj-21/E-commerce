import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "./CSS/LoginSignup.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = (event) => {
    event.preventDefault();
    setError("");

    const result = signup(name, email, password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    // Signup succeeded. Ask the user to log in.
    navigate("/login", {
      replace: true,
      state: { email: email.trim() },
    });
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

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit">Create Account</button>
        </form>

        <p className="loginsignup-login">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
