"use client";

import React, { useEffect, useState, useRef } from "react";
import { TbHomeHeart } from "react-icons/tb";
import { IoShirtOutline } from "react-icons/io5";
import { CiLogin } from "react-icons/ci";
import { fetchCategories } from "@/api/productAPI";
import { useRouter } from "next/navigation";
import { FiUser, FiUsers } from "react-icons/fi";

const getUserData = () => {
  try {
    const storedUser = localStorage.getItem("user");
    const storedGoogleUser = localStorage.getItem("user_info");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      return {
        firstname: parsedUser.user.firstname || "",
        lastname: parsedUser.user.lastname || "",
        email: parsedUser.user.email || "",
        photoUrl: parsedUser.user.photo || "/images/Avatar.png",
      };
    } else if (storedGoogleUser) {
      const googleUser = JSON.parse(storedGoogleUser);
      return {
        firstname: googleUser.given_name || "",
        lastname: googleUser.family_name || "",
        email: googleUser.email || "",
        photoUrl: googleUser.picture || "/images/Avatar.png",
      };
    }

    return null;
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    return null;
  }
};

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const [isProfileAccordionOpen, setIsProfileAccordionOpen] = useState(false);

  const [user, setUser] = useState<{
    firstname: string;
    lastname: string;
    email: string;
    photoUrl: string;
  } | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null); // Referencia para la Sidebar

  useEffect(() => {
    const userData = getUserData();
    if (userData) setUser(userData);
  }, []);

  const handleNavigation = (path: string) => router.push(path);

  const toggleProfileAccordion = () => {
    if (isOpen) {
      setIsProfileAccordionOpen(!isProfileAccordionOpen);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    setIsProfileAccordionOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_info");
    setUser(null);
    handleNavigation("/Login");
  };

  // Detectar clics fuera de la Sidebar para cerrarla
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false); // Cerrar Sidebar si el clic es fuera de ella
        // Cerrar los acordeones cuando se cierre la sidebar

        setIsProfileAccordionOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={sidebarRef} // Asignamos la referencia a la Sidebar
      className={`${
        isOpen ? "w-64" : "w-16 closed"
      } h-screen bg-purple-dark text-white flex flex-col justify-between transition-all duration-300`}
    >
      {/* LOGO */}
      <div
        className="p-4 text-center font-bold text-xl cursor-pointer flex justify-center items-center"
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <img
            src="/images/valkiriaslogo.jpg"
            alt="Logo Valkirias"
            style={{ width: isOpen ? "150px" : "40px", objectFit: "contain" }}
          />
        ) : (
          <img
            src="/images/LogCircular.jpg"
            alt="Logo Circular"
            className="rounded-full"
            style={{ width: "40px", objectFit: "contain" }}
          />
        )}
      </div>

      {/* NAVEGACIÓN */}
      <nav className="mt-4 flex-grow">
        <ul>
          <li
            className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => handleNavigation("/")}
          >
            <TbHomeHeart size={24} />
            {isOpen && <span>Inicio</span>}
          </li>

          {/* BOTÓN PRODUCTOS */}
          <li onClick={() => handleNavigation("/Products")}>
            <div className="flex items-center justify-between py-2 px-4 hover:bg-gray-700 cursor-pointer">
              <div className="flex items-center gap-4">
                <IoShirtOutline size={24} />
                {isOpen && <span>Productos</span>}
              </div>
            </div>
          </li>

          {/* BOTÓN MI PERFIL */}
          <li>
            <div className="flex items-center justify-between py-2 px-4 hover:bg-gray-700 cursor-pointer">
              <div
                className="flex items-center gap-4"
                onClick={() => handleNavigation("/Dashboard")}
              >
                <FiUser size={24} />
                {isOpen && <span>Mi Perfil</span>}
              </div>
              {isOpen && (
                <span
                  onClick={toggleProfileAccordion}
                  className="cursor-pointer"
                >
                  {isProfileAccordionOpen ? "▼" : "▶"}
                </span>
              )}
            </div>

            {isProfileAccordionOpen && (
              <ul className="ml-8">
                <li
                  className="py-1 hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleNavigation("/ProfileConfiguration")}
                >
                  Configuración
                </li>
                <li
                  className="py-1 hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleNavigation("/Addresses")}
                >
                  Direcciones
                </li>
                <li
                  className="py-1 hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleNavigation("/Orders")}
                >
                  Mis Compras
                </li>
                <li
                  className="py-1 hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleNavigation("/ChangePassword")}
                >
                  Cambiar Contraseña
                </li>
              </ul>
            )}
          </li>

          <li
            className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => handleNavigation("/About")}
          >
            <FiUsers size={24} />
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

      {/* PERFIL DEL USUARIO */}
      {user && (
        <div className="p-4 flex items-center gap-4">
          <img
            src={user.photoUrl}
            alt="Foto de perfil"
            className="rounded-full border-2 border-gray-500"
            style={{ width: isOpen ? "48px" : "32px" }}
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
