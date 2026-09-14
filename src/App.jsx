import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// Components
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";

// Pages
import Shop from "./Pages/Shop";
import ShopCategory from "./Pages/ShopCategory";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import LoginSignup from "./Pages/LoginSignup";

// Dashboard
import AdminDashboard from "./Pages/Dashboard/AdminDashboard";
import CustomerDashboard from "./Pages/Dashboard/CustomerDashboard";

// Authentication
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

// Assets
import men_banner from "./Components/Assets/banner_mens.png";
import women_banner from "./Components/Assets/banner_women.png";
import kid_banner from "./Components/Assets/banner_kids.png";

// Routes
import { Routhpath } from "./Components/Routh/Routhpath";

function AppContent() {
  const location = useLocation();

  // Login page should not show Navbar/Footer
  const isLoginPage = location.pathname === Routhpath.login;

  return (
    <>
      {/* Navbar will not appear on Login page */}
      {!isLoginPage && <Navbar />}

      <Routes>
        {/* =========================================
            APPLICATION ENTRY POINT
            "/" → "/login"
        ========================================== */}
        <Route path="/" element={<Navigate to={Routhpath.login} replace />} />

        {/* =========================================
            LOGIN
        ========================================== */}
        <Route path={Routhpath.login} element={<LoginSignup />} />

        {/* =========================================
            SHOP
        ========================================== */}
        <Route path={Routhpath.shop} element={<Shop />} />

        {/* =========================================
            MEN
        ========================================== */}
        <Route
          path={Routhpath.men}
          element={<ShopCategory banner={men_banner} category="men" />}
        />

        {/* =========================================
            WOMEN
        ========================================== */}
        <Route
          path={Routhpath.women}
          element={<ShopCategory banner={women_banner} category="women" />}
        />

        {/* =========================================
            KIDS
        ========================================== */}
        <Route
          path={Routhpath.kids}
          element={<ShopCategory banner={kid_banner} category="kid" />}
        />

        {/* =========================================
            PRODUCT DETAILS
        ========================================== */}
        <Route path="/product/:productId" element={<Product />} />

        {/* =========================================
            CART
        ========================================== */}
        <Route path={Routhpath.cart} element={<Cart />} />

        {/* =========================================
            CUSTOMER DASHBOARD
        ========================================== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* =========================================
            ADMIN DASHBOARD
        ========================================== */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* =========================================
            UNKNOWN URL
            Redirect to Login
        ========================================== */}
        <Route path="*" element={<Navigate to={Routhpath.login} replace />} />
      </Routes>

      {/* Footer will not appear on Login page */}
      {!isLoginPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
