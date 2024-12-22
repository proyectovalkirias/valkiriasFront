"use client";

import React, { useState, useEffect } from "react";
import { TbHomeHeart } from "react-icons/tb";
import { IoShirtOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";

const SidebarMini: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simula el estado de autenticación

  // Cierra el menú cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar-mini");
      if (sidebar && !sidebar.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (menu: string) => {
    setActiveMenu((prevMenu) => (prevMenu === menu ? null : menu));
  };

  const handleNavigation = (path: string) => {
    setActiveMenu(null);
    window.location.href = path;
  };

  const handleAuthAction = () => {
    if (isLoggedIn) {
      // Lógica para cerrar sesión (aquí simulado)
      setIsLoggedIn(false);
      alert("Sesión cerrada");
    } else {
      // Redirigir a iniciar sesión
      handleNavigation("/Login");
    }
  };

  return (
    <div
      id="sidebar-mini"
      className="fixed bottom-0 left-0 w-full bg-purple-dark text-white flex justify-around items-center py-2 shadow-lg z-50"
    >
      {/* Verifica si hay un menú activo */}
      {activeMenu ? (
        <div className="flex flex-col items-start w-full h-full bg-purple-dark relative px-4">
          <button
            className="text-left text-gray-300 py-2 w-full hover:text-white"
            onClick={() => setActiveMenu(null)} // Regresa al estado base
          >
            ← Volver
          </button>

          {activeMenu === "products" && (
            <div className="flex flex-col gap-2">
              <button
                className="py-2 px-4 text-left hover:bg-gray-700"
                onClick={() => handleNavigation("/Products")}
              >
                Todos los productos
              </button>
              <button
                className="py-2 px-4 text-left hover:bg-gray-700"
                onClick={() => handleNavigation("/Category1")}
              >
                Categoría 1
              </button>
              <button
                className="py-2 px-4 text-left hover:bg-gray-700"
                onClick={() => handleNavigation("/Category2")}
              >
                Categoría 2
              </button>
            </div>
          )}

          {activeMenu === "profile" && (
            <div className="flex flex-col gap-2">
              <button
                className="py-2 px-4 text-left hover:bg-gray-700"
                onClick={() => handleNavigation("/ProfileConfiguration")}
              >
                Configuración
              </button>
              <button
                className="py-2 px-4 text-left hover:bg-gray-700"
                onClick={() => handleNavigation("/Addresses")}
              >
                Direcciones
              </button>
              <button
                className="py-2 px-4 text-left hover:bg-gray-700"
                onClick={() => handleNavigation("/Orders")}
              >
                Mis Compras
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-around w-full">
          <button
            className="flex flex-col items-center text-gray-300 hover:text-white"
            onClick={() => handleNavigation("/")}
          >
            <TbHomeHeart size={24} />
            <span className="text-xs">Inicio</span>
          </button>

          <button
            className="flex flex-col items-center text-gray-300 hover:text-white"
            onClick={() => toggleMenu("products")}
          >
            <IoShirtOutline size={24} />
            <span className="text-xs">Productos</span>
          </button>

          <button
            className="flex flex-col items-center text-gray-300 hover:text-white"
            onClick={() => toggleMenu("profile")}
          >
            <FaRegUser size={24} />
            <span className="text-xs">Perfil</span>
          </button>

          <button
            className="flex flex-col items-center text-gray-300 hover:text-white"
            onClick={handleAuthAction}
          >
            <CiLogin size={24} />
            <span className="text-xs">{isLoggedIn ? "Cerrar Sesión" : "Iniciar Sesión"}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SidebarMini;
