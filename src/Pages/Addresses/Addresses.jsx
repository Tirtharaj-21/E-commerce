import React, { useState } from "react";
import { getAddresses, saveAddresses } from "../../data/customerData";
import "./Addresses.css";

const emptyAddress = {
  label: "Home",
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

export default function Addresses() {
  const [addresses, setAddresses] = useState(getAddresses);
  const [formData, setFormData] = useState(emptyAddress);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const updateAddresses = (updated) => {
    setAddresses(updated);
    saveAddresses(updated);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let updated;

    if (editingId !== null) {
      updated = addresses.map((address) =>
        address.id === editingId ? { ...formData, id: editingId } : address,
      );
    } else {
      updated = [
        ...addresses,
        {
          ...formData,
          id: Date.now(),
        },
      ];
    }

    if (formData.isDefault) {
      updated = updated.map((address) => ({
        ...address,
        isDefault: address.id === (editingId ?? updated[updated.length - 1].id),
      }));
    } else if (!updated.some((address) => address.isDefault)) {
      updated[0] = { ...updated[0], isDefault: true };
    }

    updateAddresses(updated);
    resetForm();
  };

  const resetForm = () => {
    setFormData(emptyAddress);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (address) => {
    setFormData({ ...address });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    let updated = addresses.filter((address) => address.id !== id);

    if (updated.length > 0 && !updated.some((address) => address.isDefault)) {
      updated[0] = { ...updated[0], isDefault: true };
    }

    updateAddresses(updated);
  };

  const handleSetDefault = (id) => {
    const updated = addresses.map((address) => ({
      ...address,
      isDefault: address.id === id,
    }));

    updateAddresses(updated);
  };

  return (
    <div className="addresses-page">
      <div className="addresses-header">
        <div>
          <h1>My Addresses</h1>
          <p>Manage your delivery addresses.</p>
        </div>

        <button
          className="address-add-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add New Address
        </button>
      </div>

      {showForm && (
        <div className="address-form-card">
          <h2>{editingId !== null ? "Edit Address" : "Add New Address"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="address-form-grid">
              <div className="address-field">
                <label>Address Label</label>
                <select
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="address-field">
                <label>Full Name</label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                />
              </div>

              <div className="address-field">
                <label>Phone Number</label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  title="Enter a 10-digit phone number"
                  placeholder="10-digit mobile number"
                />
              </div>

              <div className="address-field">
                <label>Address</label>
                <input
                  name="addressLine"
                  value={formData.addressLine}
                  onChange={handleChange}
                  required
                  placeholder="House number, street, area"
                />
              </div>

              <div className="address-field">
                <label>City</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Enter city"
                />
              </div>

              <div className="address-field">
                <label>State</label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  placeholder="Enter state"
                />
              </div>

              <div className="address-field">
                <label>PIN Code</label>
                <input
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{6}"
                  title="Enter a 6-digit PIN code"
                  placeholder="6-digit PIN code"
                />
              </div>
            </div>

            <label className="address-default-checkbox">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isDefault: e.target.checked,
                  })
                }
              />
              Set as default address
            </label>

            <div className="address-form-actions">
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit">
                {editingId !== null ? "Update Address" : "Save Address"}
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="addresses-empty">
          <h2>No saved addresses</h2>
          <p>Add an address to make checkout easier.</p>
        </div>
      ) : (
        <div className="addresses-grid">
          {addresses.map((address) => (
            <div className="address-card" key={address.id}>
              <div className="address-card-header">
                <span className="address-label">{address.label}</span>

                {address.isDefault && (
                  <span className="address-default-badge">Default</span>
                )}
              </div>

              <h3>{address.fullName}</h3>
              <p>{address.addressLine}</p>
              <p>
                {address.city}, {address.state} - {address.pincode}
              </p>
              <p>Phone: {address.phone}</p>

              <div className="address-card-actions">
                <button onClick={() => handleEdit(address)}>Edit</button>

                <button onClick={() => handleDelete(address.id)}>Delete</button>

                {!address.isDefault && (
                  <button onClick={() => handleSetDefault(address.id)}>
                    Set Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
