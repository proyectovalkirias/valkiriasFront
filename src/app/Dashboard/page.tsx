"use client";

import React, { useEffect, useState } from "react";

// Función para obtener los datos de usuario desde localStorage
const getUserData = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      return {
        firstname: parsedUser.user.firstname || "",
        lastname: parsedUser.user.lastname || "",
        email: parsedUser.user.email || "",
        photoUrl: parsedUser.user.photo || "/images/Avatar.png",
      };
    }
    return null;
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    return null;
  }
};

interface DashboardProps {
  isOpen: boolean; // Para controlar si el dashboard está abierto o cerrado
  closeDashboard: () => void; // Función para cerrar el dashboard
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

  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setUser(userData);
    }
  }, []);

  return (
    <>
      {/* Fondo oscuro de overlay cuando el dashboard está abierto */}
      {isOpen && (
        <div
          onClick={closeDashboard}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      <div
        className={`fixed right-0 top-0 w-full sm:w-[300px] bg-[#66397c] shadow-lg z-50 h-screen 
        transform ${isOpen ? "translate-x-0" : "translate-x-full"} 
        transition-transform duration-300`}
      >
        <div className="relative flex flex-col items-center h-full p-4 sm:p-6">
          
          {/* Botón para cerrar el dashboard */}
          <button
            onClick={closeDashboard}
            className="absolute top-2 right-2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white font-bold text-lg sm:text-xl"
          >
            ✕
          </button>

          {/* Logo de la marca */}
          <div className="absolute top-12">
            <img
              src="/images/valkiriaslogo.jpg"
              alt="Logo de Valkirias"
              className="h-16 sm:h-20 w-auto object-contain"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl text-[#e5ded3] mb-4 sm:mb-6 mt-24 sm:mt-32 text-center">
            Mi perfil
          </h1>

          <img
            src={user.photoUrl}
            alt="Foto de perfil"
            className="w-20 h-20 sm:w-32 sm:h-32 mb-4 sm:mb-6 rounded-full border-2 border-white object-cover"
          />

          <div className="mt-4 text-center">
            <h2 className="font-semibold text-lg sm:text-xl mb-4 underline">
              Info personal:
            </h2>

            <div className="space-y-3">
              <p className="text-sm sm:text-lg">
                <span className="font-semibold">Nombre:</span> {user.firstname || ""}
              </p>
              <p className="text-sm sm:text-lg">
                <span className="font-semibold">Apellido:</span> {user.lastname || ""}
              </p>
              <p className="text-sm sm:text-lg">
                <span className="font-semibold"></span> {user.email || ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
