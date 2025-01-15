"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";

const ChangePassword: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado para manejar la carga

  const togglePasswordVisibility = (field: "newPassword" | "confirmPassword") => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, newPassword, confirmPassword } = formData;

    // Validar campos obligatorios
    if (!email || !newPassword || !confirmPassword) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    // Validar formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor ingresa un email válido.");
      return;
    }

    // Validar coincidencia de contraseñas
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true); // Inicia la carga

    try {
      const response = await axios.put(
        `https://valkiriasback.onrender.com/auth/change-password`,
        {
          email,
          password: newPassword,
          confirmPassword,
        }
      );

      toast.success("Contraseña cambiada exitosamente.");
      router.push("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data;
        toast.error(errorData?.message || "Error al cambiar la contraseña.");
      } else {
        toast.error("Hubo un problema al conectar con el servidor.");
        console.error("Error inesperado:", err);
      }
    } finally {
      setIsLoading(false); // Detiene la carga
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#7b548b] p-4">
      <div className="w-full max-w-lg rounded-lg bg-[#7b548b] p-8 text-white">
        <h2 className="text-3xl font-bold text-center mb-6">Cambiar Contraseña</h2>
        {isLoading ? (
          <div className="text-center text-white">Recuperando contraseña...</div> // Muestra el mensaje de carga
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none"
            />
            <div className="relative mb-4">
              <input
                type={showPasswords.newPassword ? "text" : "password"}
                name="newPassword"
                placeholder="Nueva contraseña"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full border-b-2 border-white bg-transparent p-2 text-white outline-none"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("newPassword")}
                className="absolute right-2 top-3 text-white"
              >
                {showPasswords.newPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <div className="relative mb-6">
              <input
                type={showPasswords.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border-b-2 border-white bg-transparent p-2 text-white outline-none"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute right-2 top-3 text-white"
              >
                {showPasswords.confirmPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <button
              type="submit"
              className="rounded-md bg-purple-300 px-4 py-2 text-white hover:bg-purple-400"
            >
              Cambiar Contraseña
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
