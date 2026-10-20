import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";

import { AuthProvider, useAuth } from "./Context/AuthContext";
import { Routhpath } from "./Components/Routh/Routhpath";

import Shop from "./Pages/Shop";
import ShopCategory from "./Pages/ShopCategory";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import Signup from "./Pages/Signup";
import LoginSignup from "./Pages/LoginSignup";

import AdminDashboard from "./Pages/Dashboard/AdminDashboard";
import CustomerDashboard from "./Pages/Dashboard/CustomerDashboard";

import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

import men_banner from "./Components/Assets/banner_mens.png";
import women_banner from "./Components/Assets/banner_women.png";
import kid_banner from "./Components/Assets/banner_kids.png";

function AppContent() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  const isLoginPage =
    location.pathname === Routhpath.login || location.pathname === "/login";

  const isSignupPage = location.pathname === "/signup";
  const isAuthPage = isLoginPage || isSignupPage;

  return (
    <>
      {!isAuthPage && isLoggedIn && <Navbar />}

      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to={Routhpath.shop} replace />
            ) : (
              <Navigate to={Routhpath.login} replace />
            )
          }
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to={Routhpath.shop} replace />
            ) : (
              <LoginSignup />
            )
          }
        />

        <Route
          path="/signup"
          element={
            isLoggedIn ? <Navigate to={Routhpath.shop} replace /> : <Signup />
          }
        />

        {/* Shop */}
        <Route
          path={Routhpath.shop}
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <Shop />
            </ProtectedRoute>
          }
        />

        {/* Men */}
        <Route
          path={Routhpath.men}
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <ShopCategory banner={men_banner} category="men" />
            </ProtectedRoute>
          }
        />

        {/* Women */}
        <Route
          path={Routhpath.women}
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <ShopCategory banner={women_banner} category="women" />
            </ProtectedRoute>
          }
        />

        {/* Kids */}
        <Route
          path={Routhpath.kids}
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <ShopCategory banner={kid_banner} category="kid" />
            </ProtectedRoute>
          }
        />

        {/* Product details */}
        <Route
          path="/product/:productId"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <Product />
            </ProtectedRoute>
          }
        />

        {/* Cart */}
        <Route
          path={Routhpath.cart}
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* Customer dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={
            <Navigate
              to={isLoggedIn ? Routhpath.shop : Routhpath.login}
              replace
            />
          }
        />
      </Routes>

      {!isAuthPage && isLoggedIn && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
