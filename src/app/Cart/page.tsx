"use client";
import { Product } from "@/interfaces/Product";
import { useState, useEffect } from "react";

const Cart = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    // Cargar los productos del carrito desde localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);
  }, []);

  const handleRemoveItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div className="min-h-screen bg-purple-200 py-8 px-4 text-black">
      <h1 className="text-3xl font-bold mb-6">Carrito de Compras</h1>

      {cartItems.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white rounded-lg shadow-md mb-4"
            >
              {/* Imagen */}
              <img
                src={
                  item.photos && item.photos.length > 0
                    ? item.photos[0]
                    : "/default-image.jpg"
                }
                alt={`Imagen de ${item.name}`}
                className="w-24 h-24 object-cover rounded"
              />
              <h2 className="text-xl font-bold">{item.name}</h2>
              <p>Tamaño: {item.selectedSize}</p>
              <p>Color: {item.selectedColor}</p>
              <p>Estampado pequeño: {item.selectedSmallPrint}</p>
              <p>Estampado grande: {item.selectedLargePrint}</p>
              <p>Cantidad: {item.quantity}</p>
              <p>Total: ${item.totalPrice}</p>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="mt-4 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
