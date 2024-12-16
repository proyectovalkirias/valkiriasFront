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
        className={`fixed right-0 top-0 w-[300px] bg-[#66397c] shadow-lg z-50 h-screen 
        transform ${isOpen ? "translate-x-0" : "translate-x-full"} 
        transition-transform duration-300`}
      >
        <div className="relative flex flex-col justify-center items-center h-full p-6">
          
          {/* Botón para cerrar el dashboard - Posicionado en la esquina superior izquierda */}
          <button
            onClick={closeDashboard}
            className="absolute top-4 left-4 text-white font-bold text-xl"
          >
            ✕
          </button>
          <div className="absolute top-1 pt-10">
          <img
              src="/images/valkiriaslogo.jpg"
              alt="Logo de Valkirias"
              className="h-20 w-auto object-contain"
            />
            </div>
          <h1 className="text-3xl md:text-4xl text-[#e5ded3] mb-6 mt-10">Mi perfil</h1>

          <img
            src={user.photoUrl}
            alt="Foto de perfil"
            className="w-32 h-32 mb-6 rounded-full border-b-2"
          />

          <div className="text-lg md:text-xl mt-4">
            <h2 className="font-semibold mb-6 text-xl underline">Info personal:</h2>
          </div>

          <div className="text-lg md:text-xl">
            <p className="mb-3 text-center">
              <span className="font-semibold">Nombre:</span> <span className="font-light">{user.firstname}</span>
            </p>
            <p className="mb-3 text-center">
              <span className="font-semibold">Apellido:</span> <span className="font-light">{user.lastname}</span>
            </p>
            <p className="mb-3">
              <span className="font-semibold"></span> <span className="font-light">{user.email}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
