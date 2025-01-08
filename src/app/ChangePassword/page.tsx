"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { TbEyeHeart } from "react-icons/tb";
import { toast } from "react-hot-toast";

const ChangePassword: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

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

    try {
      const response = await fetch(
        `https://valkiriasback.onrender.com/auth/change-password?email=${encodeURIComponent(
          email
        )}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: newPassword, confirmPassword }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Error al cambiar la contraseña.");
        return;
      }

      toast.success("Contraseña cambiada exitosamente.");
      setTimeout(() => router.push("/Login"), 2000);
    } catch {
      toast.error("Hubo un problema al conectar con el servidor.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#7b548b]">
      <div className="flex w-full max-w-md rounded-lg bg-[#7b548b] p-8 sm:p-6 md:p-8 lg:p-10">
        <div className="w-full flex flex-col justify-center text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center justify-center mb-6">
            Recuperar Contraseña{" "}
            <TbEyeHeart className="ml-2 text-white" size={24} />
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
              type="password"
              name="newPassword"
              placeholder="Nueva Contraseña"
              value={formData.newPassword}
              onChange={handleChange}
              className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar Contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mb-6 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
            />
            <button
              type="submit"
              className="mb-4 rounded-md bg-purple-300 px-4 py-2 text-white hover:bg-purple-400 w-full"
            >
              Cambiar Contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
