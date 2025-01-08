"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface AccountFormDniPhoneProps {
  userId: string;
  onSuccess: () => void;
}

interface GoogleUserData {
  name: string;
  email: string;
  picture: string;
}

const AccountFormDniPhone: React.FC<AccountFormDniPhoneProps> = ({ userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    dni: "",
    phone: "",
  });

  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [googleUserData, setGoogleUserData] = useState<GoogleUserData | null>(null);

  const router = useRouter();

  // Verificar si el usuario está registrado con Google
  useEffect(() => {
    const storedGoogleUser = localStorage.getItem("user_info");
    if (storedGoogleUser) {
      setGoogleUserData(JSON.parse(storedGoogleUser));
      setIsGoogleUser(true);
    } else {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`https://valkiriasback.onrender.com/users/${userId}`);
      if (response.status === 200) {
        setFormData({
          dni: response.data.dni?.toString() || "",
          phone: response.data.phone || "",
        });
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      toast.error("Error al cargar los datos del usuario.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.dni.trim() || !formData.phone.trim()) {
      toast.error("Por favor, completa todos los campos obligatorios.");
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
        onSuccess();
        router.push("/"); // Redirigir a la página de inicio después de guardar
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          toast.error("Por favor, corrige los datos y vuelve a intentarlo.");
        } else {
          toast.error("Error al guardar los datos. Intenta nuevamente.");
        }
      } else {
        toast.error("Ocurrió un error inesperado. Intenta nuevamente.");
      }
    }
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      {!isGoogleUser && (
        <>
          <input
            type="text"
            name="dni"
            placeholder="N° de DNI"
            value={formData.dni}
            onChange={handleChange}
            className="mb-2 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
          />
          {/* Mensaje de error eliminado */}
        </>
      )}

      {!isGoogleUser && (
        <input
          type="text"
          name="phone"
          placeholder="N° de Teléfono"
          value={formData.phone}
          onChange={handleChange}
          className="mb-2 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
        />
      )}

      {isGoogleUser && googleUserData && (
        <div className="mb-4">
          <Image
            src={googleUserData.picture}
            alt={googleUserData.name}
            className="w-16 h-16 rounded-full"
            width={150}
            height={150}
          />
          <p className="text-white">{googleUserData.name}</p>
          <p className="text-white">{googleUserData.email}</p>
        </div>
      )}

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
