"use client";

import React, { useEffect, useState } from "react";

// Función para obtener los datos de usuario desde localStorage
const getUserData = () => {
  try {
    const storedUser = localStorage.getItem("user");
    const storedGoogleUser = localStorage.getItem("user_info");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      return {
        firstname: parsedUser.user.firstname || "",
        lastname: parsedUser.user.lastname || "",
        email: parsedUser.user.email || "",
        photoUrl: parsedUser.user.photo || "/images/Avatar.png",
      };
    } else if (storedGoogleUser) {
      const googleUser = JSON.parse(storedGoogleUser);
      return {
        firstname: googleUser.given_name || "",
        lastname: googleUser.family_name || "",
        email: googleUser.email || "",
        photoUrl: googleUser.picture || "/images/Avatar.png",
      };
    }

    return null;
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    return null;
  }
};

const Dashboard: React.FC = () => {
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

  // Se ejecuta al cargar la página para obtener los datos de usuario
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setUser(userData);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#66397c] p-6">
      {/* Logo de la marca */}
      <div className="mb-8">
        <img
          src="/images/valkiriaslogo.jpg"
          alt="Logo de Valkirias"
          className="h-20 w-auto object-contain"
        />
      </div>

      <h1 className="text-3xl sm:text-4xl text-[#e5ded3] mb-6 text-center font-bold">
        Mi perfil
      </h1>

      {/* Foto de perfil */}
      <img
        src={user.photoUrl}
        alt="Foto de perfil"
        className="w-24 h-24 sm:w-32 sm:h-32 mb-6 rounded-full border-4 border-white object-cover"
      />

      <div className="w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-center underline">
          Info personal:
        </h2>

        <div className="space-y-4 text-center">
          <p className="text-lg">
            <span className="font-semibold">Nombre:</span> {user.firstname || "No disponible"}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Apellido:</span> {user.lastname || "No disponible"}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Email:</span> {user.email || "No disponible"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
