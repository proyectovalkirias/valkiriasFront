"use client";

import { CartItem } from "../../interfaces/Product";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

const Cart: React.FC = () => {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || `https://valkiriasback.onrender.com`;
  const LOCAL_URL =
    process.env.NEXT_PUBLIC_LOCAL_URL || `http://localhost:3000`;
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"clear" | "remove" | null>(null);
  const [itemToRemoveIndex, setItemToRemoveIndex] = useState<number | null>(
    null
  );
  const colorNameMap: Record<string, string> = {
    "#ff0000": "Rojo",
    "#00ff00": "Verde",
    "#0000ff": "Azul",
    "#ffffff": "Blanco",
    "#000000": "Negro",
    "#ffff00": "Amarillo",
    "#ff00ff": "Fucsia",
    "#00ffff": "Cian",
    "#a6a6a6": "Gris",
    "#f5f5ef": "Marfil",
    "#d80032": "Violeta",
    "#05299e": "Azul Marino",
    "#f7e90f": "Amarillo",
    "#00913f": "Verde Oliva",
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);
  }, []);

  const handleOpenModal = (type: "clear" | "remove", index?: number) => {
    setModalType(type);
    if (type === "remove" && index !== undefined) {
      setItemToRemoveIndex(index);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setItemToRemoveIndex(null);
  };

  const handleRemoveItem = () => {
    if (itemToRemoveIndex !== null) {
      const updatedCart = cartItems.filter((_, i) => i !== itemToRemoveIndex);
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      handleCloseModal();
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    handleCloseModal();
  };

  const handlePurchase = async () => {
    setIsModalOpen(true);
    setModalType(null);

    try {
      const products = cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.totalPrice,
        quantity: item.quantity,
      }));

      const response = await axios.post(`${API_URL}/order}`, products);

      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        console.error("No se pudo obtener la URL de pago");
      }
    } catch (error) {
      console.error("Error al procesar la compra:", error);
    } finally {
      handleCloseModal();
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div className="min-h-screen bg-purple-200 py-8 px-4 text-black">
      <h1 className="text-3xl lg:text-4xl font-bold text-purple-dark mb-4">
        Carrito de Compras
      </h1>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-600 mt-2">
            Agrega algunos productos y vuelve aquí para revisarlos.
          </p>
          <button
            className="mt-6 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700"
            onClick={() => (window.location.href = "/Products")}
          >
            Ir a la tienda
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item, index) => (
            <div
              key={item.id || `cart-item-${index}`}
              className="p-4 bg-white rounded-lg shadow-md flex flex-col md:flex-row items-center md:items-start gap-6"
            >
              {item.product?.photos?.[0] && (
                <div className="flex-shrink-0">
                  <img
                    src={item.product.photos[0]}
                    alt={`Imagen de ${item.name || "producto"}`}
                    className="w-32 h-32 rounded"
                  />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">{item.name}</h2>
                {item.selectedSize && (
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Tamaño:</strong> {item.selectedSize}
                  </p>
                )}
                {item.selectedColor && colorNameMap[item.selectedColor] && (
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Color:</strong> {colorNameMap[item.selectedColor]}
                  </p>
                )}
                {item.quantity && (
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Cantidad:</strong> {item.quantity}
                  </p>
                )}
                {item.totalPrice && (
                  <p className="text-lg font-bold text-gray-900">
                    Total: ${item.totalPrice}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleOpenModal("remove", index)}
                className="bg-valkyrie-purple text-white py-1 px-2 mr-2 rounded-lg  hover:bg-creativity-purple"
              >
                Eliminar
              </button>
            </div>
          ))}

          <p className="text-xl font-semibold mt-4">
            Subtotal: ${subtotal.toFixed(2)}
          </p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => handleOpenModal("clear")}
              className="bg-custom-orange text-white py-1 px-2 mr-2 rounded-lg hover:bg-orange-400"
            >
              Vaciar Carrito
            </button>
            <button
              onClick={handlePurchase}
              className="bg-valkyrie-purple text-white py-1 px-2 mr-2 rounded-lg  hover:bg-creativity-purple"
            >
              Realizar Compra
            </button>
          </div>
        </div>
      )}

      {isModalOpen && modalType === "clear" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800">
              ¿Vaciar carrito?
            </h2>
            <p className="text-gray-600 mt-2">
              Se eliminarán todos los productos del carrito.
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleClearCart}
                className="bg-valkyrie-purple text-white py-1 px-2 mr-2 rounded-lg  hover:bg-creativity-purple"
              >
                Sí, vaciar
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && modalType === "remove" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800">
              ¿Eliminar producto?
            </h2>
            <p className="text-gray-600 mt-2">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleRemoveItem}
                className="bg-valkyrie-purple text-white py-1 px-2 mr-2 rounded-lg  hover:bg-creativity-purple"
              >
                Sí, eliminar
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
