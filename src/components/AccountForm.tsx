"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AccountFormDniPhone from "./AccountFormDniPhone";

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
  });

  const [isDniPhoneMissing, setIsDniPhoneMissing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const storedUserInfo = JSON.parse(localStorage.getItem("user_info") || "{}");

      // Si los datos de Google están disponibles
      if (storedUserInfo?.email) {
        setFormData({
          email: storedUserInfo.email || "",
          firstname: storedUserInfo.given_name || "",
          lastname: storedUserInfo.family_name || "",
        });

        // Verificar si el usuario de Google necesita ingresar el DNI o teléfono
        setIsDniPhoneMissing(true); // Si el usuario es de Google, se asume que faltan estos datos
      } else if (storedUser?.user) {
        // Si el usuario está registrado localmente
        const userId = storedUser.user.id;
        setUserId(userId);

        const userData = await fetchUserDataFromBackend(userId);
        if (userData) {
          setFormData({
            email: userData.email || "",
            firstname: userData.firstname || "",
            lastname: userData.lastname || "",
          });

          // Verificar si faltan DNI o teléfono para el usuario local
          setIsDniPhoneMissing(!userData.dni || !userData.phone);
        }
      } else {
        console.warn("No user data found in localStorage.");
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
      };

      const response = await axios.put(
        `http://localhost:3000/users/${userId}`,
        updatedUserData
      );

      if (response.status === 200) {
        alert("¡Datos actualizados correctamente!");
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
          {isDniPhoneMissing && userId ? (
            <AccountFormDniPhone
              userId={userId}
              onSuccess={() => setIsDniPhoneMissing(false)}
            />
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
