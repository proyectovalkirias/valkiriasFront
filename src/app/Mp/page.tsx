"use client";

import { useState } from "react";

export default function CheckoutMp() {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true); // Mostrar indicador de carga

    try {
      const response = await fetch("http://localhost:3000/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Aquí puedes incluir productos seleccionados u otros datos
          items: [
            { title: "Producto 1", quantity: 1, price: 100 },
            { title: "Producto 2", quantity: 2, price: 200 },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo crear la preferencia de pago");
      }

      const data = await response.json();
      const { url } = data;

      // Redirigir al usuario a la URL de pago
      window.location.href = url;
    } catch (error) {
      console.error("Error en el proceso de pago:", error);
      alert("Ocurrió un problema. Intenta nuevamente.");
    } finally {
      setIsLoading(false); // Ocultar indicador de carga
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
          isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Cargando..." : "Pagar Ahora"}
      </button>
    </div>
  );
}
