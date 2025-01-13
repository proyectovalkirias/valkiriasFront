"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { TbHomeHeart } from "react-icons/tb";
import { IoShirtOutline } from "react-icons/io5";
import { CiLogin } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { FiUser, FiUsers } from "react-icons/fi";
import { FaShoppingCart, FaCog } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-toastify";
import axios from "axios";

const getUserData = () => {
  try {
    const storedUser = localStorage.getItem("user");
    const storedGoogleUser = localStorage.getItem("user_info");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      return {
        id: parsedUser.user.id,
        firstname: parsedUser.user.firstname || "",
        lastname: parsedUser.user.lastname || "",
        email: parsedUser.user.email || "",
        photoUrl: parsedUser.user.photo || "/images/Avatar.png",
        isAdmin: parsedUser.user.isAdmin || false,
        isGoogleUser: false,
      };
    } else if (storedGoogleUser) {
      const googleUser = JSON.parse(storedGoogleUser);
      return {
        firstname: googleUser.given_name || "",
        lastname: googleUser.family_name || "",
        email: googleUser.email || "",
        photoUrl: googleUser.picture || "/images/Avatar.png",
        isGoogleUser: true,
        dni: googleUser.dni || null,
        phone: googleUser.phone || null,
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
  const [user, setUser] = useState<{
    id?: string;
    firstname: string;
    lastname: string;
    email: string;
    photoUrl: string;
    isGoogleUser: boolean;
    dni?: string | null;
    phone?: string | null;
    isAdmin?: boolean;
  } | null>(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleNavigation = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  const toggleSidebar = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("access_token");

      if (accessToken) {
        const response = await fetch("https://oauth2.googleapis.com/revoke", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `token=${accessToken}`,
        });

        if (response.ok) {
          toast.success("Sesión cerrada correctamente en Google");
        } else {
          console.error(
            "Error al revocar el token de Google:",
            response.statusText
          );
          toast.error("No se pudo cerrar sesión en Google correctamente");
        }
      }
      setIsModalOpen(false);
      localStorage.removeItem("user");
      setUser(null);
      setIsLoggedOut(true);
      handleNavigation("/Login");
    } catch (error) {
      console.error("Error durante el logout:", error);
      toast.error("Ocurrió un error al cerrar sesión");
    }
  }, [handleNavigation]);

  useEffect(() => {
    const loadUserData = async () => {
      const userData = getUserData();

      if (userData?.id) {
        const userDetails = await fetchUserDetails(userData.id);

        if (userDetails) {
          setUser({
            ...userData,
            photoUrl: userDetails.photo || "/images/Avatar.png",
          });
        } else {
          console.error("Error al obtener los detalles del usuario.");
          setUser(userData); // Usa los datos locales si falla el fetch
        }
      } else {
        setUser(userData);
      }
    };

    loadUserData();
  }, [isLoggedOut]);

  const fetchUserDetails = async (id: string) => {
    try {
      const getToken = () => {
        const user = localStorage.getItem("user");

        if (!user) {
          console.error("No hay datos del usuario en localStorage");
          return null;
        }

        try {
          const parsedUser = JSON.parse(user);
          return parsedUser.token || null; // Retorna el token si existe
        } catch (err) {
          console.error("Error al parsear los datos del usuario:", err);
          return null;
        }
      };

      const token = getToken();
      if (!token) {
        console.error("No se encontró el token.");
      }
      const response = await axios.get(
        `https://valkiriasback.onrender.com/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener los detalles del usuario:", error);
      return null;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={sidebarRef}
      className={`${
        isOpen ? "w-64" : "w-16"
      } h-screen bg-purple-dark text-white flex flex-col justify-between transition-all duration-300 overflow-hidden`}
    >
      <div
        className="p-4 text-center font-bold text-xl cursor-pointer flex justify-center items-center"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <img
          src={isOpen ? "/images/valkiriaslogo.jpg" : "/images/LogCircular.jpg"}
          alt="Logo"
          className={isOpen ? "" : "rounded-full"}
          style={{ width: isOpen ? "150px" : "40px", objectFit: "contain" }}
        />
      </div>

      <nav className="mt-4 flex-grow overflow-y-auto max-h-screen">
        <ul>
          <li
            className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => handleNavigation("/")}
            aria-label="Inicio"
          >
            <TbHomeHeart size={24} />
            {isOpen && <span>Inicio</span>}
          </li>

          <li
            className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => handleNavigation("/Products")}
            aria-label="Productos"
          >
            <IoShirtOutline size={24} />
            {isOpen && <span>Productos</span>}
          </li>

          <li
            className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => handleNavigation("/About")}
            aria-label="Sobre Nosotros"
          >
            <FiUsers size={24} />
            {isOpen && <span>Sobre Nosotros</span>}
          </li>

          {user && !isLoggedOut ? (
            <>
              <li
                className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleNavigation("/User")}
                aria-label="Mi Perfil"
              >
                <FiUser size={24} />
                {isOpen && <span>Mi perfil</span>}
              </li>
              <li
                className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
                aria-label="Cerrar Sesión"
              >
                <CiLogin size={24} />
                {isOpen && <span>Cerrar Sesión</span>}
              </li>
            </>
          ) : (
            <li
              className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
              onClick={() => handleNavigation("/Login")}
              aria-label="Iniciar Sesión"
            >
              <CiLogin size={24} />
              {isOpen && <span>Iniciar Sesión</span>}
            </li>
          )}
        </ul>
      </nav>

      {user && !isLoggedOut && (
        <>
          {user.isAdmin && (
            <Link href="/Admin" aria-label="Administrador">
              <div className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer">
                <FaCog size={24} />
                {isOpen && <span>Administrador</span>}
              </div>
            </Link>
          )}
          <Link href="/Cart" aria-label="Mi Carrito">
            <div className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer">
              <FaShoppingCart size={24} />
              {isOpen && <span>Mi carrito</span>}
            </div>
          </Link>
          <div className="p-4 flex items-center gap-4">
            <img
              src={user?.photoUrl || "/images/Avatar.png"}
              alt="Foto de perfil"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/Avatar.png";
              }}
              className="rounded-full border-2 border-gray-500"
              style={{
                width: isOpen ? "48px" : "32px",
                height: isOpen ? "48px" : "32px",
              }}
            />
            {isOpen && (
              <div className="flex flex-col">
                <span className="font-medium">
                  {user.firstname} {user.lastname}
                </span>
                <span className="text-sm">{user.email}</span>
              </div>
            )}
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg text-gray-800 font-bold mb-4">
              Cerrar Sesión
            </h2>
            <p className="mb-4 text-gray-600">
              ¿Estás seguro de que deseas cerrar sesión?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="bg-valkyrie-purple px-4 py-2 rounded-md hover:bg-creativity-purple"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
