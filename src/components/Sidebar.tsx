"use client";

import React, { useEffect, useState, useRef } from "react";
import { TbHomeHeart } from "react-icons/tb";
import { IoShirtOutline } from "react-icons/io5";
import { CiLogin } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { FiUser, FiUsers } from "react-icons/fi";
import { HiChevronDown } from "react-icons/hi";
import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";

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
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = getUserData();
    if (userData) setUser(userData);
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsProfileAccordionOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleProfileAccordion = () => {
    setIsProfileAccordionOpen(!isProfileAccordionOpen);
  };

  return (
    <div
      ref={sidebarRef}
      className={`${
        isOpen ? "w-64" : "w-16"
      } h-screen bg-purple-dark text-white flex flex-col justify-between transition-all duration-300 overflow-hidden`}
    >
      {/* LOGO */}
      <div
        className="p-4 text-center font-bold text-xl cursor-pointer flex justify-center items-center"
        onClick={toggleSidebar}
      >
        <img
          src={isOpen ? "/images/valkiriaslogo.jpg" : "/images/LogCircular.jpg"}
          alt="Logo"
          className={isOpen ? "" : "rounded-full"}
          style={{ width: isOpen ? "150px" : "40px", objectFit: "contain" }}
        />
      </div>

      {/* NAVEGACIÓN */}
      <nav className="mt-4 flex-grow overflow-y-auto max-h-screen">
        <ul>
          <li
            className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => handleNavigation("/")}
          >
            <TbHomeHeart size={24} />
            {isOpen && <span>Inicio</span>}
          </li>

          <li
            className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => handleNavigation("/Products")}
          >
            <IoShirtOutline size={24} />
            {isOpen && <span>Productos</span>}
          </li>

          {user && (
            <li>
              <div
                className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleNavigation("/Dashboard")}
              >
                <FiUser size={24} />
                {isOpen && (
                  <>
                    <span>Mi Perfil</span>
                    <HiChevronDown
                      size={20}
                      className={`transition-transform duration-300 ${
                        isProfileAccordionOpen ? "transform rotate-180" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleProfileAccordion();
                      }}
                      style={{ marginLeft: "auto" }}
                    />
                  </>
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
          )}

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

      <Link href="/Cart">
        <div className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer">
          <FaShoppingCart size={24} />
          {isOpen && <span>Mi carrito</span>}
        </div>
      </Link>

      {user && (
        <div className="p-4 flex items-center gap-4">
          <img
            src={user.photoUrl}
            alt="Foto de perfil"
            className="rounded-full border-2 border-gray-500"
            style={{
              width: isOpen ? "48px" : "32px",
              height: isOpen ? "48px" : "32px",
              objectFit: "cover",
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
