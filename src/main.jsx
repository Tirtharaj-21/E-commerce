// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import ShopContextProvider from "./Context/ShopContext.jsx";

// AuthProvider is already added inside <App />, so it is not repeated here
// (two providers would create two separate login states).
createRoot(document.getElementById("root")).render(
  <ShopContextProvider>
    <App />
  </ShopContextProvider>,
);
