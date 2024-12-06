"use client";
import React, { useEffect, useState } from "react";

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Recuperamos los datos del usuario desde localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData)); // Establecemos los datos del usuario
    }
  }, []);

  // Si no hay datos de usuario, mostramos un mensaje
  if (!user) {
    return <div>Usuario no autenticado.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-16 md:mt-0">
      <h1 className="text-4xl md:text-5xl text-[#e5ded3] mb-6">Mi perfil</h1>

      {/* Imagen con foto de Google o predeterminada */}
      <img
        src={user.photoUrl || "/images/Homevalkirias.jpg"}  // Foto de Google o predeterminada
        alt="Profile emoji"
        className="rounded-full border-4 border-white w-[140px] md:w-[170px] lg:w-[200px]"
      />

      <div className="text-base md:text-xl mt-6">
        <h2 className="font-semibold mb-3">Info personal</h2>
        <p className="mb-2">Nombre: <span className="font-light">{user.name}</span></p>
        <p className="mb-2">Email: <span className="font-light">{user.email}</span></p>
      </div>
    </div>
  );
};

export default Profile;
