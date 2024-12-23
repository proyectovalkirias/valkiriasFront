"use client";

import React, { useEffect, useState } from "react";
import { TbHomeHeart } from "react-icons/tb";
import { IoShirtOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import { fetchCategories } from "@/api/productAPI"; // Asegúrate de que esta función esté configurada correctamente.
import { useRouter } from "next/navigation";
import { log } from "console";

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
  const router = useRouter(); // Usar useRouter para navegación en Next.js
  const [isOpen, setIsOpen] = useState(true);
  const [isProductsAccordionOpen, setIsProductsAccordionOpen] = useState(false);
  const [isProfileAccordionOpen, setIsProfileAccordionOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [user, setUser] = useState<{
    firstname: string;
    lastname: string;
    email: string;
    photoUrl: string;
  } | null>(null);

  useEffect(() => {
    const userData = getUserData();
    if (userData) setUser(userData);
  }, []);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      const categories = await fetchCategories();
      setCategories(categories);
    };
    fetchCategoriesData();
  }, []);

  const handleNavigation = (path: string) => router.push(path);

  const handleCategoryClick = (category: string) => {
    localStorage.setItem("selectedCategory", category); // Guardar categoría en localStorage
    handleNavigation("/Products");
    window.location.reload();
  };

  const toggleProductsAccordion = () =>
    setIsProductsAccordionOpen(!isProductsAccordionOpen);

  const toggleProfileAccordion = () =>
    setIsProfileAccordionOpen(!isProfileAccordionOpen);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_info");
    setUser(null);
    handleNavigation("/Login");
  };

  const handleProducts = () => {
    localStorage.removeItem("selectedCategory");
    handleNavigation("/Products");
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-16 closed"
      } h-screen bg-purple-dark text-white flex flex-col justify-between transition-all duration-300`}
    >
      {/* LOGO */}
      <div
        className="p-4 text-center font-bold text-xl cursor-pointer flex justify-center items-center"
        onClick={() => setIsOpen(!isOpen)}
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
                <FaRegUser size={24} />
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
