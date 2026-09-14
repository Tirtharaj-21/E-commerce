import React, { useContext, useState } from "react";
import "./Navbar.css";
import logo from "../Assets/logo.png";
import cart from "../Assets/cart_icon.png";
import { Link, useNavigate } from "react-router-dom";
import { Routhpath } from "../Routh/Routhpath";
import { ShopContext } from "../../Context/ShopContext";
import { useAuth } from "../../Context/AuthContext";
export default function Navbar() {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems } = useContext(ShopContext);
  const { isAuthenticated, user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(Routhpath.home);
  };

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="home-logo" />
        <p>SHOPPER</p>
      </div>
      <ul className="nav-menu">
        <li
          onClick={() => {
            setMenu("Shop");
          }}
        >
          <Link style={{ textDecoration: "none" }} to={Routhpath.home}>
            Shop
          </Link>
          {menu === "Shop" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setMenu("Men");
          }}
        >
          <Link style={{ textDecoration: "none" }} to={Routhpath.men}>
            Men
          </Link>
          {menu === "Men" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setMenu("Women");
          }}
        >
          <Link style={{ textDecoration: "none" }} to={Routhpath.women}>
            Women
          </Link>
          {menu === "Women" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setMenu("Kids");
          }}
        >
          <Link style={{ textDecoration: "none" }} to={Routhpath.kids}>
            Kids
          </Link>

          {menu === "Kids" ? <hr /> : <></>}
        </li>
      </ul>
      <div className="nav-login-cart">
        {isAuthenticated ? (
          <div className="nav-auth">
            <Link
              style={{ textDecoration: "none" }}
              to={role === "ADMIN" ? Routhpath.adminDashboard : Routhpath.customerDashboard}
            >
              <button>Hi, {user?.name?.split(" ")[0] || "Account"}</button>
            </Link>
            <button onClick={handleLogout} className="nav-logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <Link style={{ textDecoration: "none" }} to={Routhpath.login}>
            <button>Login</button>
          </Link>
        )}
        <div id="nav-cart">
          <Link style={{ textDecoration: "none" }} to={Routhpath.cart}>
            <img src={cart} alt="cart" />
          </Link>
          <div className="nav-cart-count">{getTotalCartItems()}</div>
        </div>
      </div>
    </div>
  );
}
