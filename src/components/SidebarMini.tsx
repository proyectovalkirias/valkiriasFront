"use client";

import React, { useState, useEffect } from "react";
import { TbHomeHeart } from "react-icons/tb";
import { IoShirtOutline } from "react-icons/io5";
import { CiLogin } from "react-icons/ci";
import { FiUser, FiUsers } from "react-icons/fi";

const SidebarMini: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado de autenticación

  // Verifica si el usuario está logueado leyendo del localStorage
  useEffect(() => {
    const checkUserLoggedIn = () => {
      const user = localStorage.getItem("user");
      const googleUser = localStorage.getItem("user_info");
      setIsLoggedIn(!!user || !!googleUser); // Actualiza el estado según la existencia de datos de usuario
    };
    checkUserLoggedIn();
  }, []);

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
      localStorage.removeItem("user");
      localStorage.removeItem("user_info");
      setIsLoggedIn(false);
      alert("Sesión cerrada");
    } else {
      handleNavigation("/Login");
    }
  };

  return (
    <div
      id="sidebar-mini"
      className="fixed bottom-0 left-0 w-full bg-purple-dark text-white flex justify-around items-center py-2 shadow-lg z-50"
    >
      {activeMenu ? (
        <div className="w-full h-10 bg-purple-dark relative px-4 flex justify-center">
          {activeMenu === "products" && (
            <div className="flex gap-4 text-xs">
              <button
                className="py-1 px-2 hover:bg-gray-600 rounded"
                onClick={() => handleNavigation("/Products")}
              >
                Todos los productos
              </button>
              <button
                className="py-1 px-2 hover:bg-gray-600 rounded"
                onClick={() => handleNavigation("/Category1")}
              >
                Categoría 1
              </button>
              <button
                className="py-1 px-2 hover:bg-gray-600 rounded"
                onClick={() => handleNavigation("/Category2")}
              >
                Categoría 2
              </button>
            </div>
          )}

          {activeMenu === "profile" && (
            <div className="flex gap-1 text-xs">
              <button
                className="py-1 px-2 hover:bg-gray-600 rounded"
                onClick={() => handleNavigation("/Dashboard")}
              >
                Mi Perfil
              </button>
              <button
                className="py-1 px-2 hover:bg-gray-600 rounded"
                onClick={() => handleNavigation("/ProfileConfiguration")}
              >
                Configuración
              </button>
              <button
                className="py-1 px-2 hover:bg-gray-600 rounded"
                onClick={() => handleNavigation("/Addresses")}
              >
                Direcciones
              </button>
              <button
                className="py-1 px-2 hover:bg-gray-600 rounded"
                onClick={() => handleNavigation("/Orders")}
              >
                Mis Compras
              </button>
              <button
                className="py-1 px-2 hover:bg-gray-600 rounded"
                onClick={() => handleNavigation("/ChangePassword")}
              >
                Cambiar contraseña
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

          {/* Mostrar el botón de perfil solo si el usuario está logueado */}
          {isLoggedIn && (
            <button
              className="flex flex-col items-center text-gray-300 hover:text-white"
              onClick={() => toggleMenu("profile")}
            >
              <FiUser size={24} />
              <span className="text-xs">Perfil</span>
            </button>
          )}

          <button
            className="flex flex-col items-center text-gray-300 hover:text-white"
            onClick={() => handleNavigation("/About")}
          >
            <FiUsers size={24} />
            <span className="text-xs">Nosotros</span>
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
