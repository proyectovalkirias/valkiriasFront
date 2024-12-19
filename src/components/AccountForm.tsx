"use client";

import React, { useState, useEffect } from "react";

// Función para obtener los datos del usuario desde localStorage o Google
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
        documento: parsedUser.user.documento || "",
        telefonoNumero: parsedUser.user.telefonoNumero || "",
      };
    } else if (storedGoogleUser) {
      const googleUser = JSON.parse(storedGoogleUser);
      return {
        firstname: googleUser.given_name || "",
        lastname: googleUser.family_name || "",
        email: googleUser.email || "",
        photoUrl: googleUser.picture || "/images/Avatar.png",
        documento: "",
        telefonoNumero: "",
      };
    }
    return null;
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    return null;
  }
};

const AccountForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    nombre: "",
    apellido: "",
    documento: "",
    telefonoNumero: "",
  });

  // Se ejecuta cuando el componente se monta, recuperando los datos del usuario
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setFormData({
        email: userData.email || "",
        nombre: userData.firstname || "",
        apellido: userData.lastname || "",
        documento: userData.documento || "",
        telefonoNumero: userData.telefonoNumero || "",
      });
    }
  }, []);

  // Actualiza los valores de los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Guarda la información y actualiza la información principal del usuario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUserData = {
      user: {
        firstname: formData.nombre,
        lastname: formData.apellido,
        email: formData.email,
        documento: formData.documento,
        telefonoNumero: formData.telefonoNumero,
        photo: "/images/Avatar.png", // Imagen predeterminada
      },
    };

    // Guarda los datos actualizados en localStorage
    localStorage.setItem("user", JSON.stringify(updatedUserData));
    localStorage.setItem("updated_user", JSON.stringify(updatedUserData));

    console.log("Información guardada:", updatedUserData);
    alert("¡Datos guardados correctamente!");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#7b548b]">
      <div className="w-full md:w-1/3 flex justify-center mb-8 md:mb-0">
        <img
          src="/images/Gear1.png"
          alt="Imagen izquierda"
          className="w-full h-auto max-w-[250px] md:max-w-[300px]" 
        />
      </div>
      <div className="flex w-full max-w-lg rounded-lg bg-[#7b548b] p-8 sm:p-6 md:p-8 lg:p-10">
        <div className="w-full flex flex-col justify-center text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center justify-center mb-6">
            Datos de la Cuenta
          </h2>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={formData.email}
              onChange={handleChange}
              className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
            />
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
            />
            <input
              type="text"
              name="documento"
              placeholder="N° de DNI"
              value={formData.documento}
              onChange={handleChange}
              className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
            />
            <input
              type="text"
              name="telefonoNumero"
              placeholder="N° de Teléfono"
              value={formData.telefonoNumero}
              onChange={handleChange}
              className="mb-6 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
            />
            <button
              type="submit"
              className="mb-4 rounded-md bg-purple-300 px-4 py-2 text-white hover:bg-purple-400 w-full"
            >
              Guardar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountForm;
