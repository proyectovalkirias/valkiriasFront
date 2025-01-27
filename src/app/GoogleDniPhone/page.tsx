"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast"; // Importar toast

const DniPhoneGoogle: React.FC = () => {
  const [formData, setFormData] = useState({
    dni: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    dni: "",
    phone: "",
  });

  const [isMounted, setIsMounted] = useState(false); // Estado para verificar si el componente está montado

  // Asegurarse de que el componente esté montado antes de usar el navegador
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Guardar datos en localStorage
  const saveToLocalStorage = (data: { dni: string; phone: string }) => {
    const userInfo = localStorage.getItem("user_info");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      const updatedUser = { ...user, dni: data.dni, phone: data.phone };
      localStorage.setItem("user_info", JSON.stringify(updatedUser));
    } else {
      localStorage.setItem("google_dni_phone", JSON.stringify(data));
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      dni: formData.dni.trim() === "" ? "El campo N° de DNI es obligatorio" : "",
      phone: formData.phone.trim() === "" ? "El campo N° de Teléfono es obligatorio" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    try {
      saveToLocalStorage(formData);
      toast.success("¡DNI y Teléfono registrados correctamente!"); // Notificación de éxito
      setFormData({ dni: "", phone: "" });

      // Verificar que el componente esté montado antes de intentar redirigir
      if (isMounted) {
        window.location.href = "/"; // Redirigir a la página principal usando window.location
      }
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      toast.error("Hubo un problema al guardar los datos. Intenta nuevamente."); // Notificación de error
    }
  };

  // Si el componente no está montado, no renderizamos el contenido que depende de useRouter
  if (!isMounted) {
    return null; // No renderizar nada mientras el componente no esté montado
  }

  return (
    <div className="flex h-screen items-center justify-center bg-[#7b548b]">
      <div className="flex w-full max-w-md rounded-lg bg-[#7b548b] p-8 sm:p-6 md:p-8 lg:p-10">
        <div className="w-full flex flex-col justify-center text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center justify-center mb-6">
            Registrar Datos
          </h2>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <input
              type="text"
              name="dni"
              placeholder="N° de DNI"
              value={formData.dni}
              onChange={handleChange}
              className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
            />
            {errors.dni && <p className="text-red-500 text-sm">{errors.dni}</p>}
            <input
              type="text"
              name="phone"
              placeholder="N° de Teléfono"
              value={formData.phone}
              onChange={handleChange}
              className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
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

export default DniPhoneGoogle;
