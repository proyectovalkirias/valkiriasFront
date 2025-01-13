"use client";

import { useState } from "react";

export default function CheckoutMp() {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);

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

      // Ejemplo de uso:
      const token = getToken();
      if (token) {
        console.log("Token extraído:", token);
      } else {
        console.log("No se encontró el token.");
      }

      const response = await fetch(
        "https://valkiriasback.onrender.com/payment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: [
              { title: "Producto 1", quantity: 1, price: 100 },
              { title: "Producto 2", quantity: 2, price: 200 },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo crear la preferencia de pago");
      }

      const data = await response.json();
      const { url } = data;

      window.location.href = url;
    } catch (error) {
      console.error("Error en el proceso de pago:", error);
      alert("Ocurrió un problema. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#7b548b]">
      <h1 className="text-3xl font-bold mb-6">Procesar Pago</h1>
      <p className="mb-4 text-gray-300">
        Selecciona los productos y continúa con el pago.
      </p>
      <button
        onClick={handlePayment}
        className={`px-6 py-3 text-white font-bold rounded ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Cargando..." : "Pagar Ahora"}
      </button>
    </div>
  );
}
