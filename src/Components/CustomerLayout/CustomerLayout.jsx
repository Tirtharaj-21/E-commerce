// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";

// import Navbar from "../Navbar/Navbar";
// import Footer from "../Footer/Footer";
// import CustomerSidebar from "../CustomerSidebar/CustomerSidebar";

// import "./CustomerLayout.css";

// export default function CustomerLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   return (
//     <div className="customer-layout">
//       <Navbar />

//       <div className="customer-layout-body">
//         <button
//           type="button"
//           className="sidebar-toggle"
//           onClick={() => setSidebarOpen((previous) => !previous)}
//           aria-expanded={sidebarOpen}
//         >
//           <span>{sidebarOpen ? "☰ Hide Menu" : "☰ Show Menu"}</span>
//         </button>

//         <div className="customer-layout-content">
//           {sidebarOpen && <CustomerSidebar />}

//           <main className="customer-main-content">
//             <Outlet />
//           </main>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }

import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import CustomerSidebar from "../CustomerSidebar/CustomerSidebar";

import "./CustomerLayout.css";

export default function CustomerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="customer-layout">
      <Navbar />

      <div className="customer-layout-body">
        {sidebarOpen && (
          <aside className="customer-sidebar-area">
            <CustomerSidebar />
          </aside>
        )}

        <main className="customer-main-content">
          <div className="customer-content-toolbar">
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              type="button"
            >
              ☰ {sidebarOpen ? "Hide Menu" : "Show Menu"}
            </button>
          </div>

          <div className="customer-page-content">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
