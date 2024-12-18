"use client";

import React, { useEffect, useState } from "react";
import { TbHomeHeart } from "react-icons/tb";
import { IoShirtOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import { useRouter, usePathname } from "next/navigation";

const getUserData = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      return {
        firstname: parsedUser.user?.firstname || parsedUser?.firstname || "",
        lastname: parsedUser.user?.lastname || parsedUser?.lastname || "",
        email: parsedUser.user?.email || parsedUser?.email || "",
        photoUrl: parsedUser.user?.photo || parsedUser?.photo || "/images/Avatar.png",
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
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // La barra comienza cerrada por defecto
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [user, setUser] = useState<{
    firstname: string;
    lastname: string;
    email: string;
    photoUrl: string;
  } | null>(null);

  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/products");
        const data = await response.json();
        const uniqueCategories = Array.from(
          new Set(data.map((product: { category: string }) => product.category))
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const toggleProductMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProductMenuOpen(!isProductMenuOpen);
  };

  const toggleProfileMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    handleNavigation("/Login");
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-purple-dark text-white transition-all duration-300 z-50 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Logo */}
      <div
        className="p-4 text-center font-bold text-xl cursor-pointer flex justify-center items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src={isOpen ? "/images/valkiriaslogo.jpg" : "/images/LogCircular.jpg"}
          alt="Logo Valkirias"
          style={{ width: isOpen ? "150px" : "40px" }}
        />
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

          <li>
            <div className="flex items-center justify-between py-2 px-4 hover:bg-gray-700 cursor-pointer">
              <div className="flex items-center gap-4" onClick={() => handleNavigation("/Products")}>
                <IoShirtOutline size={24} />
                {isOpen && <span>Productos</span>}
              </div>
            </div>
          </li>

          <li>
            <div className="flex items-center justify-between py-2 px-4 hover:bg-gray-700 cursor-pointer">
              <div className="flex items-center gap-4" onClick={() => handleNavigation("/Dashboard")}>
                <FaRegUser size={24} />
                {isOpen && <span>Mi Perfil</span>}
              </div>
              {isOpen && (
                <span onClick={toggleProfileMenu}>
                  {isProfileMenuOpen ? "▼" : "▶"}
                </span>
              )}
            </div>
            {isProfileMenuOpen && (
              <ul className="ml-8">
                {["ProfileConfiguration", "Directions", "Orders", "ChangePassword"].map((path, index) => (
                  <li
                    key={path}
                    className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleNavigation(`/${path}`)}
                  >
                    {isOpen && <span>{["Configuración", "Direcciones", "Mis Compras", "Cambiar Contraseña"][index]}</span>}
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer" onClick={handleLogout}>
            <CiLogin size={24} />
            {isOpen && <span>Cerrar Sesión</span>}
          </li>
        </ul>
      </nav>

      {user && (
        <div className="p-4 flex items-center gap-4">
          <img
            src={user.photoUrl}
            alt="Foto de perfil"
            className="rounded-full w-12 h-12"
          />
          {isOpen && (
            <div>
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
