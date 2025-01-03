"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Importar useRouter

interface AccountFormDniPhoneProps {
  userId: string;
  onSuccess: () => void;
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

  const router = useRouter(); // Inicializar useRouter

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      if (response.status === 200) {
        setFormData({
          dni: response.data.dni?.toString() || "",
          phone: response.data.phone || "",
        });
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "dni" && !/^\d*$/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        dni: "El DNI debe contener solo números.",
      }));
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
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
      return;
    }

    try {
      const updatedData = {
        dni: parseInt(formData.dni, 10),
        phone: formData.phone,
      };

      console.log("Datos enviados al backend:", updatedData);
      const response = await axios.put(`http://localhost:3000/users/${userId}`, updatedData);

      if (response.status === 200) {
        alert("¡DNI y Teléfono registrados correctamente!");
        onSuccess();
        router.push("/"); // Redirigir a la página de inicio después de guardar
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          const serverErrors = error.response.data.errors || {};
          setErrors((prevErrors) => ({
            ...prevErrors,
            ...serverErrors,
          }));
          alert("Por favor, corrige los errores indicados.");
        } else {
          console.error("Error al actualizar DNI y Teléfono:", error.response?.data || error.message);
        }
      } else {
        console.error("Error inesperado:", error);
      }
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
        Guardar
      </button>
    </form>
  );
};

export default AccountFormDniPhone;
