"use client";

import Link from "next/link";
import { CartItem } from "../../interfaces/Product";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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
  };

  useEffect(() => {
    // Cargar los productos del carrito desde localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);
  }, []);

  const handleRemoveItem = (id: string, index: number) => {
    Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCart = cartItems.filter((_, i) => i !== index); // Usamos el índice para eliminar solo el seleccionado
        console.log("Índice a eliminar:", index);
        console.log("Carrito antes de eliminar:", cartItems);
        console.log("Carrito después de eliminar:", updatedCart);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        Swal.fire("Eliminado", "El producto ha sido eliminado.", "success");
      }
    });
  };

  const handleClearCart = () => {
    Swal.fire({
      title: "¿Vaciar carrito?",
      text: "Se eliminarán todos los productos del carrito.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, vaciar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setCartItems([]);
        localStorage.removeItem("cart");
        Swal.fire("Carrito vacío", "Se ha vaciado el carrito.", "success");
      }
    });
  };

  const handlePurchase = () => {
    Swal.fire({
      title: "Procesando compra...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setTimeout(() => {
      Swal.close();
      Swal.fire("¡Compra exitosa!", "Gracias por tu compra.", "success");
      setCartItems([]);
      localStorage.removeItem("cart");
    }, 2000); // Simulación de tiempo de procesamiento
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div className="min-h-screen bg-purple-200 py-8 px-4 text-black">
      <h1 className="text-3xl lg:text-4xl font-bold text-purple-dark mb-4">
        Carrito de Compras
      </h1>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-24 h-24 text-gray-400 mb-6"
          >
            <path d="M4.5 2a.75.75 0 00-.75.75v.75h-.75a.75.75 0 000 1.5h.757l.835 11.594c.035.489.224.94.535 1.285.31.345.735.596 1.198.646l.293.035c.274 1.055 1.238 1.835 2.404 1.835 1.166 0 2.13-.78 2.403-1.835h2.188c.274 1.055 1.238 1.835 2.403 1.835 1.166 0 2.13-.78 2.404-1.835l.293-.035c.462-.05.887-.3 1.198-.646.311-.345.5-.796.535-1.285l.835-11.594H20a.75.75 0 000-1.5h-.75V2.75a.75.75 0 00-1.5 0v.75H5.25V2.75a.75.75 0 00-.75-.75zm12.045 3.75l-.803 11.14c-.01.148-.087.283-.211.389a.603.603 0 01-.383.156H8.852c-.147 0-.288-.057-.383-.156a.566.566 0 01-.21-.389l-.804-11.14h9.09zM9.75 18a.75.75 0 01.75.75c0 .413-.337.75-.75.75a.75.75 0 010-1.5zm6.75 0a.75.75 0 01.75.75c0 .413-.337.75-.75.75a.75.75 0 010-1.5z" />
          </svg>
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
              <div className="flex-shrink-0">
                <img
                  src={item.product.photos[0] || "/placeholder.png"}
                  alt={`Imagen de ${item.name}`}
                  className="w-32 h-32  rounded"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">{item.name}</h2>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Tamaño:</strong> {item.selectedSize}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Color:</strong> {colorNameMap[item.selectedColor]}
                </p>
                <div className="flex items-center gap-4 mb-2">
                  <div>
                    <p className="text-sm text-gray-700">
                      <strong>Estampado pequeño:</strong>
                    </p>
                    <img
                      src={item.selectedSmallPrint}
                      alt={`Estampado pequeño de ${item.name}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">
                      <strong>Estampado grande:</strong>
                    </p>
                    <img
                      src={item.selectedLargePrint}
                      alt={`Estampado grande de ${item.name}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Cantidad:</strong> {item.quantity}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  Total: ${item.totalPrice}
                </p>
              </div>
              <div>
                <button
                  onClick={() => handleRemoveItem(item.id, index)}
                  className="flex items-center gap-2 bg-purple-300 text-white py-2 px-4 rounded hover:bg-purple-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 4a1 1 0 011-1h8a1 1 0 011 1v1h3a1 1 0 110 2h-1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7H2a1 1 0 110-2h3V4zm2 3a1 1 0 10-2 0v7a1 1 0 102 0V7zm7 0a1 1 0 10-2 0v7a1 1 0 102 0V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          <p className="text-xl font-semibold mt-4">
            Subtotal: ${subtotal.toFixed(2)}
          </p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleClearCart}
              className="bg-purple-300 text-white py-2 px-4 rounded hover:bg-purple-400"
            >
              Vaciar Carrito
            </button>
            <button
              onClick={handlePurchase}
              className="bg-purple-300 text-white py-2 px-4 rounded hover:bg-purple-400"
            >
              Realizar Compra
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
