// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import ShopContextProvider from "./Context/ShopContext.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </AuthProvider>
);
