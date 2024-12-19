"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/interfaces/Product";

const Cart = () => {
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartProducts(cart);
  }, []);

  const handleRemoveFromCart = (productId: number) => {
    const updatedCart = cartProducts.filter(
      (product) => product.id !== productId
    );
    setCartProducts(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const productIds = cartProducts.map((product) => product.id);

      const response = await fetch("http://localhost:3001/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({ products: productIds }),
      });

      if (response.ok) {
        const newOrder = await response.json();
        const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        existingOrders.push(newOrder);
        localStorage.setItem("orders", JSON.stringify(existingOrders));

        setMessage("Compra despachada");
        setCartProducts([]);
        localStorage.removeItem("cart");

        router.push("/Paymentform");
      } else {
        setMessage("Hubo un error al procesar la compra. Inténtalo nuevamente.");
      }
    } catch (error) {
      setMessage("Ocurrió un error. Inténtalo nuevamente.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">Carrito de compras</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b-2 py-2">Producto</th>
            <th className="border-b-2 py-2">Cantidad</th>
            <th className="border-b-2 py-2">Precio</th>
            <th className="border-b-2 py-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {cartProducts.map((product) => (
            <tr key={product.id} className="border-b">
              <td className="py-4">
                <div className="flex items-center">
                  <img
                    src={product.photos[0]}
                    alt={product.name}
                    className="w-20 h-20 object-cover mr-4 rounded-lg"
                  />
                  <div>
                    <p className="font-bold text-purple-700">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.description}</p>
                  </div>
                </div>
              </td>
              <td className="py-4">
                <input
                  type="number"
                  value={1}
                  readOnly
                  className="w-12 text-center border rounded-md"
                />
              </td>
              <td className="py-4">${product.price}</td>
              <td className="py-4">
                <button
                  onClick={() => handleRemoveFromCart(product.id)}
                  className="bg-purple-200 hover:bg-purple-300 text-purple-700 font-semibold py-1 px-4 rounded-md"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {cartProducts.length > 0 ? (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className={`bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-6 rounded-md transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Procesando..." : "Ir a pagar"}
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">No tienes productos en el carrito.</p>
      )}

      {message && <p className="mt-4 text-center text-yellow-600">{message}</p>}
    </div>
  );
};

export default Cart;
