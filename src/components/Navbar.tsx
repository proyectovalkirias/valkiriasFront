"use client";

import React, { useState } from "react";
import Dashboard from "@/app/Dashboard/page"; // Importamos el Dashboard

const Navbar: React.FC = () => {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false); // Estado para abrir/cerrar el dashboard

  // Función para abrir/cerrar el dashboard
  const toggleDashboard = () => {
    setIsDashboardOpen(!isDashboardOpen);
  };

  return (
    <nav className="w-full bg-purple-900 p-4 flex justify-between items-center">
      {/* Logo o nombre de la app */}
      <div className="flex space-x-4">
        <button
          onClick={toggleDashboard}
          className="text-white font-semibold hover:text-[#b093bf] transition"
        >
          Perfil
        </button>
      </div>

      {/* Botones de navegación */}

      {/* Dashboard, que se despliega desde la derecha */}
      <Dashboard isOpen={isDashboardOpen} closeDashboard={toggleDashboard} />
    </nav>
  );
};

export default Navbar;
