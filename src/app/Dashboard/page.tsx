import React, { useState, useEffect } from "react";

interface DashboardProps {
  isOpen: boolean;
  closeDashboard: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ isOpen, closeDashboard }) => {
  const [user, setUser] = useState<{
    firstname: string;
    lastname: string;
    email: string;
    photoUrl: string;
  }>({
    firstname: "",
    lastname: "",
    email: "",
    photoUrl: "/images/Avatar.png", // Avatar predeterminado
  });

  // Función para obtener los datos del usuario (simulada)
  const getUserData = () => {
    // Simulación de obtener los datos de un usuario (puedes cambiar esta parte)
    return {
      firstname: "Juan",
      lastname: "Pérez",
      email: "juanperez@gmail.com",
      photoUrl: "/images/Avatar.png", // Cambiar por la URL real si hay una foto de perfil
    };
  };

  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setUser(userData);
    }
  }, []);

  return (
    <>
      {isOpen && (
        <div
          onClick={closeDashboard}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      <div
        className={`fixed right-0 top-0 
        w-full sm:w-[300px] 
        bg-[#66397c] shadow-lg z-50 h-screen 
        transform ${isOpen ? "translate-x-0" : "translate-x-full"} 
        transition-transform duration-300`}
      >
        <div className="relative flex flex-col justify-center items-center h-full p-4 sm:p-6">
          <button
            onClick={closeDashboard}
            className="absolute top-4 left-4 text-white font-bold text-xl sm:text-2xl"
          >
            ✕
          </button>

          <div className="absolute top-2 pt-8 sm:pt-10">
            <img
              src="/images/valkiriaslogo.jpg"
              alt="Logo de Valkirias"
              className="h-16 sm:h-20 w-auto object-contain"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl text-[#e5ded3] mb-4 sm:mb-6 mt-10 sm:mt-14">
            Mi perfil
          </h1>

          <img
            src={user.photoUrl}
            alt="Foto de perfil"
            className="w-24 h-24 sm:w-32 sm:h-32 mb-4 sm:mb-6 rounded-full border-b-2"
          />

          <div className="text-base sm:text-lg md:text-xl mt-4">
            <h2 className="font-semibold mb-4 sm:mb-6 text-lg sm:text-xl underline">Info personal:</h2>
          </div>

          <div className="text-sm sm:text-base md:text-lg">
            <p className="mb-2 sm:mb-3 text-center">
              <span className="font-semibold">Nombre:</span> 
              <span className="font-light block sm:inline">{user.firstname}</span>
            </p>
            <p className="mb-2 sm:mb-3 text-center">
              <span className="font-semibold">Apellido:</span> 
              <span className="font-light block sm:inline">{user.lastname}</span>
            </p>
            <p className="mb-2 sm:mb-3 text-center">
              <span className="font-semibold">Email:</span> 
              <span className="font-light block sm:inline">{user.email}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
