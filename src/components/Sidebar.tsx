"use client";

import React, { useState } from "react";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-16"
      } h-full bg-gray-800 text-white flex flex-col justify-between transition-width duration-300`}
    >
      <div>
        <div
          className="p-4 text-center font-bold text-xl cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "LOGO" : "L"}
        </div>
        <nav className="mt-4">
          <ul>
            <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer">
              {isOpen && "Home"}
            </li>
            <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer">
              {isOpen && "Products"}
            </li>
            <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer">
              {isOpen && "Iniciar Sesión"}
            </li>
            <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer">
              {isOpen && "About Us"}
            </li>
          </ul>
        </nav>
      </div>
      <div className="p-4">
        {isOpen && (
          <div>
            <div className="text-sm">Usuario:</div>
            <div className="font-bold">John Doe</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
