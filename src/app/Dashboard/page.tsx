"use client"
import React from "react";

const Profile: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Título */}
      <h1 className="text-4xl md:text-6xl text-[#e5ded3] mb-6">Mi perfil</h1>
      
      {/* Imagen */}
      <img
        src="/images/Homevalkirias.jpg"
        alt="Profile emoji"
        className="rounded-full border-4 border-white w-full max-w-[150px] md:max-w-[200px] lg:max-w-[250px] xl:max-w-[300px]"
      />

      {/* Información personal */}
      <div className="text-lg md:text-2xl">
        <h2 className="font-semibold mb-4">Info personal</h2>
        <p className="mb-2">Nombre: <span className="font-light">Nombre</span></p>
        <p className="mb-2">Apellido: <span className="font-light">Apellido</span></p>
        <p className="mb-2">Email: <span className="font-light">Email@mail.com</span></p>
        <p>DNI: <span className="font-light">4.007.952</span></p>
      </div>
    </div>
  );
};

export default Profile;

