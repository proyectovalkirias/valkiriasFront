"use client";

import React, { useEffect, useState } from "react";

// Función para obtener los datos del usuario almacenados en localStorage
const getUserData = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      return {
        firstname: parsedUser.firstname || "",
        lastname: parsedUser.lastname || "",
        email: parsedUser.email || "",
        photoUrl: parsedUser.photo || "/images/Avatar.png", // Avatar por defecto
      };
    }
    return null;
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    return null;
  }
};

// Función para obtener los datos del usuario desde la API de Google
const fetchGoogleUserData = async (accessToken: string) => {
  try {
    const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los datos del usuario");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los datos de Google:", error);
    throw error;
  }
};

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<{
    firstname: string;
    lastname: string;
    email: string;
    photoUrl: string;
  }>({
    firstname: "",
    lastname: "",
    email: "",
    photoUrl: "/images/Avatar.png", // Avatar por defecto
  });

  const [accessToken, setAccessToken] = useState<string | null>(null); // Token de acceso de Google

  useEffect(() => {
    const storedToken = localStorage.getItem("googleAccessToken"); // Obtenemos el token de Google
    if (storedToken) {
      setAccessToken(storedToken);
    }

    const userData = getUserData(); // Intentamos obtener los datos del usuario desde localStorage
    if (userData) {
      setUser(userData); // Si se encuentran datos, los usamos
    }

    // Si tenemos un token de Google, obtenemos los datos de Google
    if (accessToken) {
      fetchGoogleUserData(accessToken)
        .then((googleData) => {
          setUser({
            firstname: googleData.given_name || "",
            lastname: googleData.family_name || "",
            email: googleData.email || "",
            photoUrl: googleData.picture || "/images/Avatar.png", // Foto de perfil de Google
          });
        })
        .catch((err) => {
          console.error("Error al obtener los datos de Google:", err);
        });
    }
  }, [accessToken]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-5xl text-[#e5ded3] mb-6">Mi perfil</h1>

      <img
        src={user.photoUrl} // Foto de perfil
        alt="Foto de perfil"
        className="border-b-2 w-[140px] md:w-[170px] lg:w-[200px] mb-2 rounded-full"
      />

      <div className="text-base md:text-xl mt-6">
        <h2 className="font-semibold mb-6">Info personal</h2>
      </div>

      {/* Información personal */}
      <div className="text-base md:text-xl">
        <p className="mb-2">
          Nombre: <span className="font-light">{user.firstname}</span>
        </p>
        <p className="mb-2">
          Apellido: <span className="font-light">{user.lastname}</span>
        </p>
        <p className="mb-2">
          Email: <span className="font-light">{user.email}</span>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
