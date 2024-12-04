import React from "react";
import Profile from "./Profile";
import Orders from "./Orders";

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-custom-purple py-10 md:py-20">
      {/* Sección de Perfil */}
      <div className="md:w-1/3 p-4 md:p-8">
        <Profile />
      </div>

      {/* Separador visible solo en pantallas pequeñas */}
      <div className="h-1 bg-gray-300 md:hidden"></div>

      {/* Sección de Historial de Compras */}
      <div className="flex justify-center md:w-2/3 p-6">
        <div className="w-full max-w-3xl">
          <Orders />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
