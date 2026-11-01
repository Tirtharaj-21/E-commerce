import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { Routhpath } from "../Routh/Routhpath";
import "./CustomerSidebar.css";

export default function CustomerSidebar() {
  const [shopOpen, setShopOpen] = useState(true);

  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Check whether the current page belongs to Shop
  const isShopActive = [
    Routhpath.shop,
    Routhpath.men,
    Routhpath.women,
    Routhpath.kids,
  ].includes(location.pathname);

  const linkClass = ({ isActive }) =>
    `sidebar-link ${isActive ? "active" : ""}`;

  // Logout customer
  const handleLogout = async () => {
    try {
      await logout();
      navigate(Routhpath.login, { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="customer-sidebar">
      {/* Customer information */}
      <div className="sidebar-user">
        <div className="sidebar-avatar">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>

        <div className="sidebar-user-info">
          <h3>{user?.name || "Customer"}</h3>
          <p>Customer Account</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-navigation">
        {/* Dashboard */}
        <NavLink to={Routhpath.customerDashboard} className={linkClass}>
          <span className="sidebar-icon">▦</span>
          <span>Dashboard</span>
        </NavLink>

        {/* Shop expandable menu */}
        <button
          type="button"
          className={`sidebar-link sidebar-shop-toggle ${
            isShopActive ? "active" : ""
          }`}
          onClick={() => setShopOpen((prev) => !prev)}
          aria-expanded={shopOpen}
        >
          <span className="sidebar-icon">▣</span>
          <span>Shop</span>

          <span className="sidebar-arrow">{shopOpen ? "⌄" : "›"}</span>
        </button>

        {/* Shop categories */}
        {shopOpen && (
          <div className="sidebar-submenu">
            <NavLink to={Routhpath.shop} className={linkClass}>
              All Products
            </NavLink>

            <NavLink to={Routhpath.men} className={linkClass}>
              Men
            </NavLink>

            <NavLink to={Routhpath.women} className={linkClass}>
              Women
            </NavLink>

            <NavLink to={Routhpath.kids} className={linkClass}>
              Kids
            </NavLink>
          </div>
        )}

        {/* Cart */}
        <NavLink to={Routhpath.cart} className={linkClass}>
          <span className="sidebar-icon">🛒</span>
          <span>My Cart</span>
        </NavLink>

        {/* Orders */}
        <NavLink to="/my-orders" className={linkClass}>
          <span className="sidebar-icon">▤</span>
          <span>My Orders</span>
        </NavLink>

        {/* Wishlist */}
        <NavLink to="/wishlist" className={linkClass}>
          <span className="sidebar-icon">♡</span>
          <span>Wishlist</span>
        </NavLink>

        {/* Profile */}
        <NavLink to="/profile" className={linkClass}>
          <span className="sidebar-icon">♙</span>
          <span>My Profile</span>
        </NavLink>

        {/* Addresses */}
        <NavLink to="/addresses" className={linkClass}>
          <span className="sidebar-icon">⌖</span>
          <span>My Addresses</span>
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="sidebar-bottom">
        <button type="button" className="sidebar-logout" onClick={handleLogout}>
          <span className="sidebar-icon">⇥</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
