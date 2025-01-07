"use client";


import React, { useEffect, useState } from "react";

// Función para obtener los datos de usuario desde localStorage o desde la API
const getUserData = () => {
  try {
    const storedUser = localStorage.getItem("user");
    const storedGoogleUser = localStorage.getItem("user_info");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      return {
        id: parsedUser.user.id, // Agregar ID del usuario
        firstname: parsedUser.user.firstname || "",
        lastname: parsedUser.user.lastname || "",
        email: parsedUser.user.email || "",
        photoUrl: parsedUser.user.photo || "/images/Avatar.png",
        isGoogleUser: false,
      };
    } else if (storedGoogleUser) {
      const googleUser = JSON.parse(storedGoogleUser);
      return {
        firstname: googleUser.given_name || "",
        lastname: googleUser.family_name || "",
        email: googleUser.email || "",
        photoUrl: googleUser.picture || "/images/Avatar.png",
        dni: googleUser.dni || "",
        phone: googleUser.phone || "",
        isGoogleUser: true,
      };
    }

    return null;
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    return null;
  }
};

// Función para obtener los detalles adicionales desde el back-end
const fetchUserDetails = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:3000/users/${id}`);
    if (!response.ok) {
      throw new Error("Error al obtener los detalles del usuario");
    }
    const data = await response.json();
    return data; // Debería incluir dni y phone
  } catch (error) {
    console.error(error);
    return null;
  }
};

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<{
    firstname: string;
    lastname: string;
    email: string;
    photoUrl: string;
    dni?: string;
    phone?: string;
  }>({
    firstname: "",
    lastname: "",
    email: "",
    photoUrl: "/images/Avatar.png", // Avatar predeterminado
    dni: "",
    phone: "",
  });

  // Cargar los datos del usuario
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setUser({
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        photoUrl: userData.photoUrl,
        dni: userData.dni,
        phone: userData.phone,
      });

      // Si el usuario está logueado localmente, traer detalles adicionales
      if (!userData.isGoogleUser) {
        fetchUserDetails(userData.id).then((details) => {
          if (details) {
            setUser((prevState) => ({
              ...prevState,
              dni: details.dni,
              phone: details.phone,
              firstname: details.firstname,
              lastname: details.lastname,
              email: details.email,
            }));
          }
        });
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#66397c] p-6">
      <h1 className="text-3xl sm:text-4xl text-[#e5ded3] mb-6 text-center font-bold">
        Mi perfil
      </h1>

      {/* Foto de perfil */}

      <img
        src={user.photoUrl}
        alt="Foto de perfil"
        className="w-24 h-24 sm:w-32 sm:h-32 mb-6 rounded-full border-4 border-white object-cover"
        width={100}
        height={100}
      ></img>

      <div className="w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-center underline">
          Info personal:
        </h2>

        <div className="space-y-4 text-center">
          <p className="text-lg">
            <span className="font-semibold">Nombre:</span>{" "}
            {user.firstname || "No disponible"}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Apellido:</span>{" "}
            {user.lastname || "No disponible"}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Email:</span>{" "}
            {user.email || "No disponible"}
          </p>
          <p className="text-lg">
            <span className="font-semibold">DNI:</span>{" "}
            {user.dni || "No disponible"}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Teléfono:</span>{" "}
            {user.phone || "No disponible"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
