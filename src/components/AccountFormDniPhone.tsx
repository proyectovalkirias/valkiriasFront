"use client";

import React, { useState } from "react";
import axios from "axios";

interface AccountFormDniPhoneProps {
  userId: string;
  onSuccess: () => void; // Callback para notificar al componente principal que los datos se guardaron correctamente
}

const AccountFormDniPhone: React.FC<AccountFormDniPhoneProps> = ({ userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    dni: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    dni: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Limpiar errores del campo
    }));
  };

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
      const updatedData = {
        dni: formData.dni, // Mantener como string (no convertir a número)
        phone: formData.phone, // Mantener como string
      };

      const response = await axios.put(
        `http://localhost:3000/users/${userId}`,
        updatedData
      );

      if (response.status === 200) {
        console.log("Datos actualizados en el backend:", response.data); // Mostrar datos en consola
        alert("¡DNI y Teléfono registrados correctamente!");
        onSuccess(); // Notificar éxito al componente principal
      }
    } catch (error) {
      console.error("Error al actualizar DNI y Teléfono:", error);
      alert("Hubo un problema, intente nuevamente.");
    }
  };

  return (
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
  );
};

export default AccountFormDniPhone;
