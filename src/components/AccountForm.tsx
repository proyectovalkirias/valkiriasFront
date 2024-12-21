"use client";

import React, { useState, useEffect } from "react";
import axios from "axios"; // Para hacer solicitudes HTTP al back-end

// FUNCIÓN PARA OBTENER LOS DATOS DEL USUARIO 
const getUserData = async () => {
  try {
    const storedUser = localStorage.getItem("user");
    const storedGoogleUser = localStorage.getItem("user_info");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      return {
        id: parsedUser.user.id || "", // Identificador para la base de datos
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
        id: googleUser.id || "", // Identificador para la base de datos
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
    id: "",
    email: "",
    nombre: "",
    apellido: "",
    documento: "",
    telefonoNumero: "",
  });

  // 🔥 OBTIENE LOS DATOS DEL USUARIO AL MONTAR EL COMPONENTE 🔥
  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUserData();
      if (userData) {
        setFormData({
          id: userData.id || "",
          email: userData.email || "",
          nombre: userData.firstname || "",
          apellido: userData.lastname || "",
          documento: userData.documento || "",
          telefonoNumero: userData.telefonoNumero || "",
        });
      }
    };
    fetchData();
  }, []);

  // 🔥 ACTUALIZA LOS VALORES DEL FORMULARIO 🔥
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 🔥 ENVÍA LOS DATOS AL BACK-END Y ACTUALIZA LOCALSTORAGE 🔥
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updatedUserData = {
        id: formData.id, // Necesario para identificar al usuario en la base de datos
        firstname: formData.nombre,
        lastname: formData.apellido,
        email: formData.email,
        documento: formData.documento,
        telefonoNumero: formData.telefonoNumero,
        photo: "/images/Avatar.png", // Imagen predeterminada
      };

      //  ENVÍA LOS DATOS AL BACK-END 
      const response = await axios.put(
        `http://localhost:3000/users/${formData.id}`, // URL de la API
        updatedUserData
      );

      if (response.status === 200) {
        console.log("Información actualizada correctamente en la base de datos:", response.data);

        // ACTUALIZA EL LOCALSTORAGE CON LA NUEVA INFORMACIÓN
        const userLocalData = {
          user: updatedUserData,
        };

        localStorage.setItem("user", JSON.stringify(userLocalData));

        alert("¡Datos guardados correctamente!");
      } else {
        console.error("Error al actualizar los datos:", response);
        alert("Hubo un problema al actualizar los datos.");
      }
    } catch (error) {
      console.error("Error en la solicitud de actualización:", error);
      alert("Error al actualizar la información. Inténtalo nuevamente.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen items-center justify-center bg-[#7b548b] p-6">
      {/* Contenedor de la imagen */}
      <div className="w-full md:w-1/3 flex justify-center mb-8 md:mb-0">
        <img
          src="/images/Gear1.png"
          alt="Imagen ajustes"
          className="w-full h-auto max-w-[200px] sm:max-w-[250px] md:max-w-[300px]"
        />
      </div>

      {/* Contenedor del formulario */}
      <div className="w-full max-w-lg rounded-lg bg-[#7b548b] p-6 sm:p-8 md:p-10">
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
