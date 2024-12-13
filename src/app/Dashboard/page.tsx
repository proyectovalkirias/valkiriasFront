"use client";

import React, { useEffect, useState } from "react";

const getUserData = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Verifica si existe la propiedad user en los datos
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
    return null;
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

  // UseEffect para cargar los datos del usuario cuando el componente se monta
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setUser(userData);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-5xl text-[#e5ded3] mb-6">Mi perfil</h1>

      {/* Imagen de perfil del usuario */}
      <img
        src={user.photoUrl}
        alt="Foto de perfil"
        className="border-b-2 w-[140px] md:w-[170px] lg:w-[200px] mb-2 rounded-full"
      />

      <div className="text-base md:text-xl mt-6">
        <h2 className="font-semibold mb-6">Info personal</h2>
      </div>

      {/* Información personal del usuario */}
      <div className="text-base md:text-xl">
        <p className="mb-2">
          Nombre: <span className="font-light">{user.firstname}</span>
        </p>
        <p className="mb-2">
          Apellido: <span className="font-light">{user.lastname}</span>
        </p>
        <p className="mb-2">
          Email: <span className="font-light">{user.email}</span>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;