"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

// FUNCIÓN PARA OBTENER LOS DATOS DEL USUARIO 
const getUserData = async () => {
  try {
    const storedUser = localStorage.getItem("user");
    const storedGoogleUser = localStorage.getItem("user_info");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      return {
        id: parsedUser.user.id || "",
        firstname: parsedUser.user.firstname || "",
        lastname: parsedUser.user.lastname || "",
        email: parsedUser.user.email || "",
        DNI: parsedUser.user.DNI || "",
        phone: parsedUser.user.phone || "",
      };
    } else if (storedGoogleUser) {
      const googleUser = JSON.parse(storedGoogleUser);
      return {
        id: googleUser.id || "",
        firstname: googleUser.given_name || "",
        lastname: googleUser.family_name || "",
        email: googleUser.email || "",
        DNI: "",
        phone: "",
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
    firstname: "",
    lastname: "",
    DNI: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    DNI: "",
    phone: "",
  });

  const [isDniPhoneMissing, setIsDniPhoneMissing] = useState(false); // Para manejar la visualización del formulario

  // 🔥 OBTIENE LOS DATOS DEL USUARIO AL MONTAR EL COMPONENTE 🔥
  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUserData();
      if (userData) {
        setFormData({
          id: userData.id || "",
          email: userData.email || "",
          firstname: userData.firstname || "",
          lastname: userData.lastname || "",
          DNI: userData.DNI || "",
          phone: userData.phone || "",
        });

        // Verificamos si los campos DNI y teléfono están vacíos
        if (!userData.DNI || !userData.phone) {
          setIsDniPhoneMissing(true); // Si falta alguno, mostramos el formulario para ingresarlos
        }
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

    // Limpia el mensaje de error al escribir
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // 🔥 ENVÍA LOS DATOS AL BACK-END Y ACTUALIZA LOCALSTORAGE 🔥
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    const newErrors = {
      DNI: formData.DNI.trim() === "" ? "El campo N° de DNI es obligatorio" : "",
      phone: formData.phone.trim() === "" ? "El campo N° de Teléfono es obligatorio" : "",
    };

    setErrors(newErrors);

    // Si hay errores, no envía el formulario
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    try {
      const updatedUserData = {
        id: formData.id,
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        DNI: formData.DNI,
        phone: formData.phone,
      };

      if (isDniPhoneMissing) {
        // Si faltan DNI y teléfono, se hace un POST para registrarlos por primera vez
        const response = await axios.post(
          `http://localhost:3000/users/${formData.id}/register-phone-dni`, // Suponiendo que este endpoint es para registrar los datos por primera vez
          updatedUserData
        );
        if (response.status === 200) {
          alert("¡Datos registrados correctamente!");
          setIsDniPhoneMissing(false); // Ya no es necesario registrar esos datos
        }
      } else {
        // Si ya existen, actualizamos con PUT
        const response = await axios.put(
          `http://localhost:3000/users/${formData.id}`,
          updatedUserData
        );
        if (response.status === 200) {
          console.log("Información actualizada correctamente en la base de datos:", response.data);
          alert("¡Datos actualizados correctamente!");
        }
      }

      // ACTUALIZA EL LOCALSTORAGE CON LA NUEVA INFORMACIÓN
      const userLocalData = {
        user: updatedUserData,
      };
      localStorage.setItem("user", JSON.stringify(userLocalData));
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      alert("Hubo un problema, intente nuevamente.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen items-center justify-center bg-[#7b548b] p-6">
      {/* Contenedor de la imagen (modificada a Gear1.png) */}
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

          {/* Mostrar formulario solo si faltan DNI y teléfono */}
          {isDniPhoneMissing ? (
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <input
                type="text"
                name="DNI"
                placeholder="N° de DNI"
                value={formData.DNI}
                onChange={handleChange}
                className="mb-2 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
              />
              {errors.DNI && <p className="text-red-500 text-sm">{errors.DNI}</p>}
              <input
                type="text"
                name="phone"
                placeholder="N° de Teléfono"
                value={formData.phone}
                onChange={handleChange}
                className="mb-2 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              <button
                type="submit"
                className="mb-4 rounded-md bg-purple-300 px-4 py-2 text-white hover:bg-purple-400 w-full"
              >
                Registrar
              </button>
            </form>
          ) : (
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
                name="firstname"
                placeholder="Nombre"
                value={formData.firstname}
                onChange={handleChange}
                className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
              />
              <input
                type="text"
                name="lastname"
                placeholder="Apellido"
                value={formData.lastname}
                onChange={handleChange}
                className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
              />
              <button
                type="submit"
                className="mb-4 rounded-md bg-purple-300 px-4 py-2 text-white hover:bg-purple-400 w-full"
              >
                Guardar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountForm;
