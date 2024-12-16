"use client";

import React, { useEffect, useState } from "react";
import { TbHomeHeart } from "react-icons/tb";
import { IoShirtOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import { useRouter } from "next/router";

// Función para obtener los datos del usuario desde localStorage
const getUserData = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      return {
        firstname: parsedUser.user.firstname || "",
        lastname: parsedUser.user.lastname || "",
        email: parsedUser.user.email || "",
        photoUrl: parsedUser.user.photo || "/images/Avatar.png",
      };
    }
    return null;
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    return null;
  }
};

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState<{
    firstname: string;
    lastname: string;
    email: string;
    photoUrl: string;
  } | null>(null);

  // Cargar los datos del usuario al montar el componente
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setUser(userData);
    }
  }, []);

  // Función para manejar la redirección
  const handleNavigation = (path: string) => {
    window.location.href = path;  // Redirige al path especificado
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("user"); // Eliminar los datos del usuario del localStorage
    setUser(null); // Limpiar el estado del usuario
    handleNavigation("/Login"); // Redirigir al login
  };

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-16 closed"
      } h-screen bg-purple-dark text-white flex flex-col justify-between transition-all duration-300`}
    >
      {/* Logo */}
      <div className="p-4 text-center font-bold text-xl cursor-pointer flex justify-center items-center" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <img
            src="/images/valkiriaslogo.jpg"
            alt="Logo Valkirias"
            className=""
            style={{
              width: isOpen ? "150px" : "40px", // Ajusta el tamaño del logo cuando la sidebar está abierta
              height: isOpen ? "auto" : "40px", // Ajusta el tamaño cuando la sidebar está cerrada
              objectFit: "contain", // No recorta la imagen
            }}
          />
        ) : (
          <img
            src="/images/LogCircular.jpg"  // Imagen cuando la sidebar está cerrada
            alt="Logo Circular"
            className="rounded-full"
            style={{
              width: "40px", // Tamaño cuando la sidebar está cerrada
              height: "40px", // Tamaño cuando la sidebar está cerrada
              objectFit: "contain", // No recorta la imagen
            }}
          />
        )}
      </div>

      {/* Navegación */}
      <nav className="mt-4 flex-grow">
        <ul>
          <li
            className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => handleNavigation("/")} // Redirige al Home
          >
            <TbHomeHeart size={24} />
            {isOpen && <span>Inicio</span>}
          </li>
          <li className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer">
            <IoShirtOutline size={24} />
            {isOpen && <span>Productos</span>}
          </li>
          <li className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer">
            <FaRegUser size={24} />
            {isOpen && <span>Sobre Nosotros</span>}
          </li>
          {/* Si el usuario no está logueado, mostrar "Iniciar Sesión" */}
          {!user ? (
            <li
              className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
              onClick={() => handleNavigation("/Login")} // Redirige al Login
            >
              <CiLogin size={24} />
              {isOpen && <span>Iniciar Sesión</span>}
            </li>
          ) : (
            // Si el usuario está logueado, mostrar los datos y el botón "Cerrar Sesión"
            <li
              className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
              onClick={handleLogout} // Cerrar sesión
            >
              <CiLogin size={24} />
              {isOpen && <span>Cerrar Sesión</span>}
            </li>
          )}
        </ul>
      </nav>

      {/* Información del usuario, solo si está logueado */}
      {user && (
        <div className="p-4 flex items-center gap-4">
          <img
            src={user.photoUrl}
            alt="Foto de perfil"
            className="rounded-full border-2 border-gray-500 transition-all duration-300"
            style={{
              objectFit: "contain", // No recorta la imagen
              width: isOpen ? "48px" : "32px", // Ajusta el tamaño cuando la sidebar está cerrada
              height: isOpen ? "48px" : "32px", // Ajusta el tamaño cuando la sidebar está cerrada
            }}
          />
          {isOpen && (
            <div className="text-sm">
              <p className="font-semibold">
                {user.firstname} {user.lastname}
              </p>
              <p className="text-gray-300 text-xs">{user.email}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
