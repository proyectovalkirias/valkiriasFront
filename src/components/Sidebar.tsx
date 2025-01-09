"use client";

import React, { useEffect, useState, useRef } from "react";
import { TbHomeHeart } from "react-icons/tb";
import { IoShirtOutline } from "react-icons/io5";
import { CiLogin } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { FiUser, FiUsers } from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-toastify";
import { FaCog } from "react-icons/fa";

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

    return {
      firstname: "",
      lastname: "",
      email: "",
      photoUrl: "/images/Avatar.png",
      isGoogleUser: false,
    };
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    return {
      firstname: "",
      lastname: "",
      email: "",
      photoUrl: "/images/Avatar.png",
      isGoogleUser: false,
    };
  }
};

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState<{
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
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = getUserData();
    setUser(null);
  }, [isLoggedOut]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    const confirmation = window.confirm(
      "¿Estás seguro de que deseas cerrar sesión?"
    );
    if (!confirmation) return;

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

      localStorage.clear();
      setUser(null);
      setIsLoggedOut(true);
      handleNavigation("/Login");
    } catch (error) {
      console.error("Error durante el logout:", error);
      toast.error("Ocurrió un error al cerrar sesión");
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

          <li
            className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => handleNavigation("/About")}
          >
            <FiUsers size={24} />
            {isOpen && <span>Sobre Nosotros</span>}
          </li>

          {user && !isLoggedOut ? (
            <>
              <li
                className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleNavigation("/User")}
              >
                <FiUser size={24} />
                {isOpen && <span>Mi perfil</span>}
              </li>
              <li
                className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
                onClick={handleLogout}
              >
                <CiLogin size={24} />
                {isOpen && <span>Cerrar Sesión</span>}
              </li>
            </>
          ) : (
            <li
              className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
              onClick={() => handleNavigation("/Login")}
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
            <Link href="/Admin">
              <div className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer">
                <FaCog size={24} color="white" />
                {isOpen && <span>Administrador</span>}
              </div>
            </Link>
          )}
          <Link href="/Cart">
            <div className="flex items-center gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer">
              <FaShoppingCart size={24} />
              {isOpen && <span>Mi carrito</span>}
            </div>
          </Link>
          <div className="p-4 flex items-center gap-4">
            <img
              src={user.photoUrl}
              alt="Foto de perfil"
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
    </div>
  );
};

export default Sidebar;
