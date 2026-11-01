import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { getProfile, saveProfile } from "../../data/customerData";
import "./Profile.css";

export default function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(() => getProfile(user));
  const [formData, setFormData] = useState(profile);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    saveProfile(formData);
    setProfile(formData);
    setEditing(false);
    setMessage("Profile updated successfully!");

    setTimeout(() => setMessage(""), 3000);
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your personal information.</p>
      </div>

      {message && <div className="profile-success">{message}</div>}

      <div className="profile-card">
        <div className="profile-top">
          <div className="profile-avatar">
            {profile.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div>
            <h2>{profile.name || "Customer"}</h2>
            <p>{profile.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="profile-form-header">
            <h3>Personal Information</h3>

            {!editing && (
              <button
                type="button"
                className="profile-edit-btn"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="profile-form-grid">
            <div className="profile-field">
              <label>Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editing}
                required
              />
            </div>

            <div className="profile-field">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editing}
                required
              />
            </div>

            <div className="profile-field">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {editing && (
            <div className="profile-actions">
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit">Save Changes</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
