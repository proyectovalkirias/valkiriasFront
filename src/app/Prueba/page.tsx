"use client"
import ChatComponent from "@/components/Valkibot";
import React from "react";

// Importa el componente que deseas probar


const TestPage = () => {
  // Aquí puedes pasar props o manejar estados si es necesario
  const mockData = {
    title: "Título de prueba",
    description: "Descripción de prueba para el componente.",
    sizes: ["S", "M", "L", "XL"],
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white"
    >
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-yellow-300">
          Página de Prueba de Componentes
        </h1>
        <p className="text-gray-400">
          Aquí puedes ver cómo se comporta tu componente.
        </p>
      </header>

      <main className="w-4/5 bg-gray-800 rounded-lg p-6 shadow-lg text-black">
        {/* Inserta tu componente aquí */}
        <ChatComponent/>

        <div className="mt-4 text-sm text-gray-400">
          <p>
            Si necesitas más pruebas, actualiza los datos en el archivo
            <code className="bg-gray-700 p-1 rounded mx-1">TestPage.jsx</code>.
          </p>
        </div>
      </main>
    </div>
  );
};

export default TestPage;
