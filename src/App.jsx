import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Context
import { AuthProvider, useAuth } from "./Context/AuthContext";

// Route configuration
import { Routhpath } from "./Components/Routh/Routhpath";

// Layout
import CustomerLayout from "./Components/CustomerLayout/CustomerLayout";

// Pages
import Shop from "./Pages/Shop";
import ShopCategory from "./Pages/ShopCategory";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import Signup from "./Pages/Signup";
import LoginSignup from "./Pages/LoginSignup";
import Checkout from "./Pages/Checkout";

import AdminDashboard from "./Pages/Dashboard/AdminDashboard";
import CustomerDashboard from "./Pages/Dashboard/CustomerDashboard";

// Route protection
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

// Category banners
import men_banner from "./Components/Assets/banner_mens.png";
import women_banner from "./Components/Assets/banner_women.png";
import kid_banner from "./Components/Assets/banner_kids.png";
import MyOrders from "./Pages/MyOrders/MyOrders";
import Wishlist from "./Pages/Wishlist/Wishlist";
import Profile from "./Pages/Profile/Profile";
import Addresses from "./Pages/Addresses/Addresses";

function AppContent() {
  const { isLoggedIn, role } = useAuth();

  const defaultPath = isLoggedIn
    ? role === "ADMIN"
      ? Routhpath.adminDashboard
      : Routhpath.customerDashboard
    : Routhpath.login;

  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to={defaultPath} replace />} />

      {/* Authentication routes */}
      <Route
        path={Routhpath.login}
        element={
          isLoggedIn ? <Navigate to={defaultPath} replace /> : <LoginSignup />
        }
      />

      <Route
        path="/signup"
        element={
          isLoggedIn ? <Navigate to={defaultPath} replace /> : <Signup />
        }
      />

      {/* Customer routes with shared layout */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        {/* Customer dashboard */}
        <Route
          path={Routhpath.customerDashboard}
          element={<CustomerDashboard />}
        />

        {/* Shop */}
        <Route path={Routhpath.shop} element={<Shop />} />

        {/* Men category */}
        <Route
          path={Routhpath.men}
          element={<ShopCategory banner={men_banner} category="men" />}
        />

        {/* Women category */}
        <Route
          path={Routhpath.women}
          element={<ShopCategory banner={women_banner} category="women" />}
        />

        {/* Kids category */}
        <Route
          path={Routhpath.kids}
          element={<ShopCategory banner={kid_banner} category="kid" />}
        />

        {/* Product details */}
        <Route path="/product/:productId" element={<Product />} />

        {/* Cart */}
        <Route path={Routhpath.cart} element={<Cart />} />

        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addresses" element={<Addresses />} />

        {/* Checkout */}
        <Route path="/checkout" element={<Checkout />} />
      </Route>

      {/* Admin routes - separate from customer layout */}
      <Route
        path={Routhpath.adminDashboard}
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Unknown routes */}
      <Route path="*" element={<Navigate to={defaultPath} replace />} />
    </Routes>
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
