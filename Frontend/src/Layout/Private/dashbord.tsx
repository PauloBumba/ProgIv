import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "../../Components/Painel/Header/header";
import Sidebar from "../../Components/Painel/Sidebar/sidebar";
import { Footer } from "../../Components/Painel/Footer/footer";
import "./dashbord.css";


export const Main = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true); // clique
  const [isSidebarHovered, setSidebarHovered] = useState(false);   // hover

  const isSidebarExpanded = !isSidebarCollapsed || isSidebarHovered;

  return (
    <div className="flex flex-column min-h-screen body">
      <div className="">
        <Header onToggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}  />
      </div>

      <div className="flex flex-1">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setCollapsed={setSidebarCollapsed }
          setHovered={setSidebarHovered}
        />

        {/* Conteúdo e footer juntos */}
        <div
          className={`flex flex-column flex-1 content-transition  ${
            isSidebarExpanded ? "content-expanded" : "content-collapsed"
          }`}
        >
          <main className="flex-1 p-4 main-painel">
            <Outlet />
          </main>

          <div className="footer-painel">
              <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};
