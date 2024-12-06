"use client";
import { useState, useEffect } from "react";
import {
  FaBars,
  FaSearch,
  FaSignInAlt,
  FaTshirt,
  FaPhone,
  FaInfoCircle,
} from "react-icons/fa";
import { MdOutlineHome } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import { IoShirtOutline } from "react-icons/io5";
import { SlScreenSmartphone } from "react-icons/sl";
import { CgWebsite } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import Link from "next/dist/client/link";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null); // Guardamos el usuario en el estado

  // Verificamos si hay un usuario logueado en localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    // Aquí no eliminamos el usuario de localStorage
    // Solo actualizamos el estado para que la UI cambie
    setUser(null); // Limpiamos el estado del usuario

  };

  return (
    <nav id="navbar" className="flex justify-end items-center p-6">
      {/* Right Section (Search Bar and Hamburger Menu) */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar..."
            className="outline-none bg-transparent border-2 border-black rounded-full pl-10 pr-4 py-2 w-64 text-sm text-black placeholder-black"
          />
          <CiSearch className="absolute left-3 top-2 text-black" size={18} />
        </div>

        {/* Hamburger Menu */}
        <button className="text-black" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars size={20} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 right-0 w-64 shadow-lg rounded-l-md py-4 bg-valkyrie-purple bg-opacity-60">
          <ul className="flex flex-col space-y-4 px-6">
            <li className="flex items-center space-x-3">
              <MdOutlineHome className="text-black" />
              <a href="/" className="text-gray-800 hover:text-purple-600">
                Inicio
              </a>
            </li>
            {user ? (
              <>
                <li className="flex items-center space-x-3">
                  <VscAccount className="text-black" />
                  <a href="/Dashboard" className="text-gray-800 hover:text-purple-600">
                    Mi cuenta
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <FaSignInAlt className="text-black" />
                  <button
                    onClick={handleLogout}
                    className="text-gray-800 hover:text-purple-600"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <li className="flex items-center space-x-3">
                <FaSignInAlt className="text-black" />
                <a href="/Login" className="text-gray-800 hover:text-purple-600">
                  Iniciar sesión
                </a>
              </li>
            )}
            <li className="flex items-center space-x-3">
              <IoShirtOutline className="text-black" />
              <a href="/Products" className="text-gray-800 hover:text-purple-600">
                Productos
              </a>
            </li>
            <li className="flex items-center space-x-3">
              <SlScreenSmartphone className="text-black" />
              <a href="#" className="text-gray-800 hover:text-purple-600">
                Contáctanos
              </a>
            </li>
            <li className="flex items-center space-x-3">
              <CgWebsite className="text-black" />
              <a href="Aboutus" className="text-gray-800 hover:text-purple-600">
                ¿Quiénes somos?
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
