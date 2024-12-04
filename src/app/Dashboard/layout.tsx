import React from "react";
import Profile from "./profile";
import Orders from "./orders";

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-custom-purple">
      {/* Sección de Perfil */}
      <div className="md:w-1/3 p-4">
        <Profile />
      </div>

      {/* Separador visible solo en dispositivos pequeños */}
      <div className="h-1 bg-gray-300 md:hidden"></div>

      {/* Sección de Historial de Compras */}
      <div className="md:w-2/3 p-4">
        <Orders />
      </div>
    </div>
  );
};

export default Dashboard;
