"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

// FUNCIÓN PARA OBTENER LOS DATOS DEL USUARIO DESDE EL BACKEND
const fetchUserDataFromBackend = async (userId: string) => {
  try {
    const response = await axios.get(`http://localhost:3000/users/${userId}`);
    console.log("Fetched user data from backend:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data from backend:", error);
    return null;
  }
};

const AccountForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    dni: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    dni: "",
    phone: "",
  });

  const [isDniPhoneMissing, setIsDniPhoneMissing] = useState(false);

  // OBTIENE LOS DATOS DEL USUARIO AL MONTAR EL COMPONENTE
  useEffect(() => {
    const fetchData = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      // Verifica si el usuario ha iniciado sesión con Google
      if (storedUser?.user?.google) {
        // Datos del usuario de Google
        setFormData({
          email: storedUser.user.email || "",
          firstname: storedUser.user.firstName || "",
          lastname: storedUser.user.lastName || "",
          dni: "",  // No aplicable para usuarios de Google
          phone: "", // No aplicable para usuarios de Google
        });
        setIsDniPhoneMissing(false);  // No es necesario que falten estos datos
      } else {
        const userId = storedUser?.user?.id;

        if (userId) {
          const userData = await fetchUserDataFromBackend(userId);
          if (userData) {
            setFormData({
              email: userData.email || "",
              firstname: userData.firstname || "",
              lastname: userData.lastname || "",
              dni: userData.dni || "",
              phone: userData.phone || "",
            });

            if (!userData.dni || !userData.phone) {
              setIsDniPhoneMissing(true);
            }
          }
        } else {
          console.warn("No user ID found in localStorage.");
        }
      }
    };
    fetchData();
  }, []);

  // ACTUALIZA LOS VALORES DEL FORMULARIO
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Limpiamos cualquier error anterior para ese campo
    }));
  };

  // VALIDA Y ENVÍA LOS DATOS AL BACKEND
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      dni: formData.dni.trim() === "" ? "El campo N° de DNI es obligatorio" : "",
      phone: formData.phone.trim() === "" ? "El campo N° de Teléfono es obligatorio" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      return; // No enviamos los datos si hay errores
    }

    try {
      const updatedUserData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        dni: formData.dni ? Number(formData.dni) : null,
        phone: formData.phone ? Number(formData.phone) : null,
      };

      // Verifica si es un usuario local o de Google
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = storedUser?.user?.id;

      if (!userId) {
        throw new Error("User ID not found.");
      }

      const response = await axios.put(
        `http://localhost:3000/users/${userId}`,
        updatedUserData
      );
      console.log("PUT response:", response);

      if (response.status === 200) {
        alert("¡Datos actualizados correctamente!");
        setIsDniPhoneMissing(false);
      }
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      alert("Hubo un problema, intente nuevamente.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen items-center justify-center bg-[#7b548b] p-6">
      <div className="w-full md:w-1/3 flex justify-center mb-8 md:mb-0">
        <img
          src="/images/Gear1.png"
          alt="Imagen ajustes"
          className="w-full h-auto max-w-[200px] sm:max-w-[250px] md:max-w-[300px]"
        />
      </div>
      <div className="w-full max-w-lg rounded-lg bg-[#7b548b] p-6 sm:p-8 md:p-10">
        <div className="w-full flex flex-col justify-center text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center justify-center mb-6">
            Datos de la Cuenta
          </h2>
          {isDniPhoneMissing ? (
            // Si faltan los datos de DNI o Teléfono, muestra el formulario para ingresarlos
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <input
                type="text"
                name="dni"
                placeholder="N° de DNI"
                value={formData.dni}
                onChange={handleChange}
                className="mb-2 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
              />
              {errors.dni && <p className="text-red-500 text-sm">{errors.dni}</p>}
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
            // Si no faltan datos, muestra el formulario de edición de datos generales
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
