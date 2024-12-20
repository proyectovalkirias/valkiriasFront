"use client";
import React, { useState, useEffect } from "react";

const Cart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);

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
    <div className="min-h-screen bg-purple-100 py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Carrito de Compras</h1>

      {cartItems.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <div>
          {cartItems.map((item: any) => (
            <div key={item.id} className="p-4 bg-white rounded-lg shadow-md mb-4">
              {/* Verificar si 'photos' está definido y tiene al menos un elemento */}
              <img
                src={item.photos && item.photos.length > 0 ? item.photos[0] : "/default-image.jpg"}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <h2 className="text-xl font-bold">{item.name}</h2>
              <p>Tamaño: {item.size}</p>
              <p>Color: {item.color}</p>
              <p>Cantidad: {item.quantity}</p>
              <p>Precio unitario: ${item.price}</p>
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
