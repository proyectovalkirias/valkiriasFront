"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AccountFormDniPhone from "./AccountFormDniPhone";
import Image from "next/image";
import { toast } from "react-hot-toast";

// FUNCIÓN PARA OBTENER LOS DATOS DEL USUARIO DESDE EL BACKEND
const fetchUserDataFromBackend = async (userId: string) => {
  try {
    const response = await axios.get(`http://localhost:3000/users/${userId}`);
    console.log("Fetched user data from backend:", response.data);
    return response.data;
  } catch (error) {
    toast.error("Error al obtener los datos del usuario desde el backend.");
    console.error("Error fetching user data from backend:", error);
    return null;
  }
};

const AccountForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
    dni: "",
  });

  const [isDniPhoneMissing, setIsDniPhoneMissing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [isEditable, setIsEditable] = useState({
    firstname: false,
    lastname: false,
    phone: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const storedUserInfo = JSON.parse(localStorage.getItem("user_info") || "{}");

        if (storedUserInfo?.email) {
          setFormData({
            email: storedUserInfo.email || "",
            firstname: storedUserInfo.given_name || "",
            lastname: storedUserInfo.family_name || "",
            phone: storedUserInfo.phone || "",
            dni: storedUserInfo.dni || "",
          });

          const googleUserData = await fetchUserDataFromBackend(storedUserInfo.email);
          if (!googleUserData?.dni || !googleUserData?.phone) {
            setIsDniPhoneMissing(true);
          }
        } else if (storedUser?.user) {
          const userId = storedUser.user.id;
          setUserId(userId);

          const userData = await fetchUserDataFromBackend(userId);
          if (userData) {
            setFormData({
              email: userData.email || "",
              firstname: userData.firstname || "",
              lastname: userData.lastname || "",
              phone: userData.phone || "",
              dni: userData.dni || "",
            });
            setIsDniPhoneMissing(!userData.dni || !userData.phone);
          }
        } else {
          toast.error("No se encontró información del usuario en localStorage.");
          console.warn("No user data found in localStorage.");
        }
      } catch (error) {
        toast.error("Error al cargar los datos del usuario.");
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!userId) {
        throw new Error("User ID not found.");
      }

      const updatedUserData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phone: formData.phone,
        dni: formData.dni,
      };

      const response = await axios.put(
        `http://localhost:3000/users/${userId}`,
        updatedUserData
      );

      if (response.status === 200) {
        toast.success("¡Datos actualizados correctamente!");
      }
    } catch (error) {
      toast.error("Hubo un problema, intente nuevamente.");
      console.error("Error al procesar la solicitud:", error);
    }
  };

  const handleEdit = (field: string) => {
    setIsEditable((prevState) => ({
      ...prevState,
      [field]: true,
    }));

    // Borra el texto cuando se edita
    setFormData((prevData) => ({
      ...prevData,
      [field]: "",
    }));
    toast(
      `Ahora puedes editar el campo ${field}.`,
      {
        duration: 6000,
      }
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen items-center justify-center bg-[#7b548b] p-6">
      <div className="w-full md:w-1/3 flex justify-center mb-8 md:mb-0">
        <Image
          src="/images/Gear1.png"
          alt="Imagen ajustes"
          className="w-full h-auto max-w-[200px] sm:max-w-[250px] md:max-w-[300px]"
          width={150}
          height={150}
        />
      </div>
      <div className="w-full max-w-lg rounded-lg bg-[#7b548b] p-6 sm:p-8 md:p-10">
        <div className="w-full flex flex-col justify-center text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center justify-center mb-6">
            Datos de la Cuenta
          </h2>
          {isDniPhoneMissing && userId ? (
            <AccountFormDniPhone
              userId={userId}
              onSuccess={() => {
                setIsDniPhoneMissing(false);
                toast.success("¡Datos de DNI y Teléfono completados correctamente!");
              }}
            />
          ) : (
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Correo Electrónico"
                value={formData.email}
                onChange={handleChange}
                readOnly
                className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
              />
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  name="firstname"
                  placeholder="Nombre"
                  value={formData.firstname}
                  onChange={handleChange}
                  readOnly={!isEditable.firstname}
                  className="border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
                />
                <button
                  type="button"
                  className="ml-2 text-purple-300 hover:text-purple-400"
                  onClick={() => handleEdit("firstname")}
                >
                  Editar
                </button>
              </div>
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  name="lastname"
                  placeholder="Apellido"
                  value={formData.lastname}
                  onChange={handleChange}
                  readOnly={!isEditable.lastname}
                  className="border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
                />
                <button
                  type="button"
                  className="ml-2 text-purple-300 hover:text-purple-400"
                  onClick={() => handleEdit("lastname")}
                >
                  Editar
                </button>
              </div>
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  name="phone"
                  placeholder="Teléfono"
                  value={formData.phone}
                  onChange={handleChange}
                  readOnly={!isEditable.phone}
                  className="border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
                />
                <button
                  type="button"
                  className="ml-2 text-purple-300 hover:text-purple-400"
                  onClick={() => handleEdit("phone")}
                >
                  Editar
                </button>
              </div>
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  name="dni"
                  placeholder="DNI"
                  value={formData.dni}
                  onChange={handleChange}
                  readOnly
                  className="border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
                />
              </div>
              <button
                type="submit"
                className="mb-4 rounded-md bg-purple-300 px-4 py-2 text-white hover:bg-purple-400 w-full"
              >
                Guardar Cambios
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountForm;
