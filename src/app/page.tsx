"use client"

import { useState } from "react"; 

export default function Home() {
  // Estado para el menú desplegable
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
    
      <header className="w-full flex justify-between items-center px-4 py-2 bg-transparent">
        <button onClick={toggleMenu} className="flex flex-col gap-1">
          <span className="block w-6 h-1 bg-purple-600"></span>
          <span className="block w-6 h-1 bg-purple-600"></span>
          <span className="block w-6 h-1 bg-purple-600"></span>
        </button>
      </header>

     
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-purple-600 text-white rounded-lg p-4">
          <ul className="space-y-4">
            <li>Inicio</li>
            <li>Productos</li>
            <li>Contacto</li>
          </ul>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center text-center">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-custom-orange">
            VALK<span className="text-custom-purple">IRIAS</span>
          </h1>
          <p className="text-lg text-purple-700 mt-2">
            Tu creatividad en tus prendas
          </p>
        </div>
      </main>
    </div>
  );
}
