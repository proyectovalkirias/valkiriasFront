"use client";

import React, { useState, useEffect, useRef } from "react";
import { TbHomeHeart } from "react-icons/tb";
import { IoShirtOutline } from "react-icons/io5";
import { CiLogin } from "react-icons/ci";
import { FiUser, FiUsers } from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa"; // Agregado ícono de carrito

const SidebarMini: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado de autenticación
  const [isLocalUser, setIsLocalUser] = useState(false); // Indica si el usuario es local
  const [isGoogleUser, setIsGoogleUser] = useState(false); // Indica si el usuario es de Google
  const [needsMoreInfo, setNeedsMoreInfo] = useState(false); // Si necesita agregar información

  const sidebarRef = useRef<HTMLDivElement | null>(null); // Ref para la barra lateral

  useEffect(() => {
    const checkUserLoggedIn = () => {
      const user = localStorage.getItem("user");
      const googleUser = localStorage.getItem("user_info");

      setIsLoggedIn(!!user || !!googleUser);
      setIsLocalUser(!!user && !googleUser);
      setIsGoogleUser(!!googleUser && !user);

      if (googleUser) {
        try {
          const parsedUser = JSON.parse(googleUser);
          setNeedsMoreInfo(!parsedUser.dni || !parsedUser.phone);
        } catch (error) {
          console.error("Error al analizar user_info:", error);
          setNeedsMoreInfo(true);
        }
      } else {
        setNeedsMoreInfo(false);
      }
    };
    checkUserLoggedIn();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setActiveMenu(null); // Cierra el menú si se hace clic fuera
      }
    };

    if (activeMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenu]);

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
        <div
          ref={sidebarRef}
          className="w-full h-10 bg-purple-dark relative px-4 flex justify-center"
        >
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
              {isLocalUser && (
                <button
                  className="py-1 px-2 hover:bg-gray-600 rounded"
                  onClick={() => handleNavigation("/ProfileConfiguration")}
                >
                  Configuración
                </button>
              )}
              {isGoogleUser && needsMoreInfo && (
                <button
                  className="py-1 px-2 hover:bg-gray-600 rounded"
                  onClick={() => handleNavigation("/GoogleDniPhone")}
                >
                  Agregar información
                </button>
              )}
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

          {/* Botón de carrito */}
          <button
            className="flex flex-col items-center text-gray-300 hover:text-white"
            onClick={() => handleNavigation("/Cart")}
          >
            <FaShoppingCart size={24} />
            <span className="text-xs">Carrito</span>
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
