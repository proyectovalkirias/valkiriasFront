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
        photo: "/images/Avatar.png", // Imagen predeterminada (puedes cambiarla)
      },
    };

    // Guarda los datos actualizados en localStorage
    localStorage.setItem("user", JSON.stringify(updatedUserData));
    localStorage.setItem("updated_user", JSON.stringify(updatedUserData));

    console.log("Información guardada:", updatedUserData);
    alert("¡Datos guardados correctamente!");
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen px-4 md:px-16">
      {/* Imagen a la izquierda */}
      <div className="w-full md:w-1/3 flex justify-center mb-8 md:mb-0">
        <img
          src="/images/Gear1.png"
          alt="Imagen izquierda"
          className="w-full h-auto max-w-[250px] md:max-w-[300px]" 
        />
      </div>

      {/* Formulario */}
      <div className="w-full md:w-2/3 md:pl-8">
        <form
          onSubmit={handleSubmit}
          className="p-6 md:p-10"
        >
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
            Datos de la cuenta
          </h2>

          {/* E-mail */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">E-mail:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
          </div>

          <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
            Datos personales
          </h2>

          {/* Nombre y Apellido */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-gray-700 mb-1">Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 text-gray-800" 
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 mb-1">Apellido:</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
            </div>
          </div>

          {/* Documento y Teléfono */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-gray-700 mb-1">N° de DNI:</label>
              <input
                type="text"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 mb-1">
                N° de teléfono:
              </label>
              <input
                type="text"
                name="telefonoNumero"
                value={formData.telefonoNumero}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
            </div>
          </div>

          {/* Botón Guardar */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountForm;
