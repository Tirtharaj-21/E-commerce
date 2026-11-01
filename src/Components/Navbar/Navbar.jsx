import React, { useContext } from "react";
import "./Navbar.css";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { Routhpath } from "../Routh/Routhpath";
import { ShopContext } from "../../Context/ShopContext";

import logo from "../Assets/logo.png";
import cart from "../Assets/cart_icon.png";

export default function Navbar() {
  const { getTotalCartItems } = useContext(ShopContext);
  const { isAuthenticated, user, role, logout } = useAuth();

  const navigate = useNavigate();

  const isCustomer = isAuthenticated && role === "CUSTOMER";

  const handleLogout = async () => {
    try {
      await logout();
      navigate(Routhpath.login, { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const dashboardPath =
    role === "ADMIN" ? Routhpath.adminDashboard : Routhpath.customerDashboard;

  return (
    <header className="navbar">
      <Link to={Routhpath.home} className="nav-logo">
        <img src={logo} alt="SHOPPER logo" />
        <p>SHOPPER</p>
      </Link>

      {/* Customer shopping links are already in the sidebar */}
      {!isCustomer && (
        <nav className="nav-menu">
          <Link to={Routhpath.home}>Shop</Link>
          <Link to={Routhpath.men}>Men</Link>
          <Link to={Routhpath.women}>Women</Link>
          <Link to={Routhpath.kids}>Kids</Link>
        </nav>
      )}

      <div className="nav-login-cart">
        {isAuthenticated ? (
          <div className="nav-auth">
            <Link to={dashboardPath} className="nav-account-link">
              Hi, {user?.name?.split(" ")[0] || "Account"}
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="nav-logout-btn"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to={Routhpath.login} className="nav-login-link">
            Login
          </Link>
        )}

        <button
          type="button"
          className="nav-cart-button"
          onClick={() => navigate(Routhpath.cart)}
          aria-label="Open shopping cart"
        >
          <img src={cart} alt="" />
          <span>{getTotalCartItems()}</span>
        </button>
      </div>
    </header>
  );
}
