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
  const [isAccordionOpen, setIsAccordionOpen] = useState(false); // Estado para el acordeón
  const [categories, setCategories] = useState<string[]>([]); // Categorías dinámicas
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

  // Cargar las categorías dinámicamente desde la API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/products");
        const data = await response.json();

        // Asegúrate de tipar los datos correctamente
        const uniqueCategories = Array.from(
          new Set(
            (data as { category: string }[]).map((product) => product.category)
          )
        );

        setCategories(uniqueCategories); // Ahora no habrá error
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    fetchCategories();
  }, []);

  // Función para manejar la redirección
  const handleNavigation = (path: string) => {
    window.location.href = path; // Redirige al path especificado
  };

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
    handleNavigation("/Products");

    // Alternar el estado del acordeón
  };

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
      <div
        className="p-4 text-center font-bold text-xl cursor-pointer flex justify-center items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <img
            src="/images/valkiriaslogo.jpg"
            alt="Logo Valkirias"
            style={{
              width: isOpen ? "150px" : "40px",
              height: isOpen ? "auto" : "40px",
              objectFit: "contain",
            }}
          />
        ) : (
          <img
            src="/images/LogCircular.jpg"
            alt="Logo Circular"
            className="rounded-full"
            style={{
              width: "40px",
              height: "40px",
              objectFit: "contain",
            }}
          />
        )}
      </div>

      {/* Navegación */}
      <nav className="mt-4 flex-grow">
        <ul>
          <li
            className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => handleNavigation("/")}
          >
            <TbHomeHeart size={24} />
            {isOpen && <span>Inicio</span>}
          </li>
          {/* Acordeón para Productos */}
          <li>
            <div
              className="flex items-center justify-between py-2 px-4 hover:bg-gray-700 cursor-pointer"
              onClick={toggleAccordion}
            >
              <div className="flex items-center gap-4 ">
                <IoShirtOutline size={24} />
                {isOpen && <span>Productos</span>}
              </div>
              {isOpen && <span>{isAccordionOpen ? "▼" : "▶"}</span>}
            </div>
            {isAccordionOpen && (
              <ul className="ml-8">
                {categories.map((category) => (
                  <li
                    key={category}
                    className="py-1 hover:text-gray-300 cursor-pointer"
                    onClick={() => handleNavigation(`/products/${category}`)}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li
            className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => handleNavigation("/About")}
          >
            <FaRegUser size={24} />
            {isOpen && <span>Sobre Nosotros</span>}
          </li>
          {!user ? (
            <li
              className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
              onClick={() => handleNavigation("/Login")}
            >
              <CiLogin size={24} />
              {isOpen && <span>Iniciar Sesión</span>}
            </li>
          ) : (
            <li
              className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
              onClick={handleLogout}
            >
              <CiLogin size={24} />
              {isOpen && <span>Cerrar Sesión</span>}
            </li>
          )}
        </ul>
      </nav>

      {/* Información del usuario */}
      {user && (
        <div className="p-4 flex items-center gap-4">
          <img
            src={user.photoUrl}
            alt="Foto de perfil"
            className="rounded-full border-2 border-gray-500 transition-all duration-300"
            style={{
              objectFit: "contain",
              width: isOpen ? "48px" : "32px",
              height: isOpen ? "48px" : "32px",
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
