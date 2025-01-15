"use client";

import { CartItem } from "../../interfaces/Product";
import { useState, useEffect } from "react";
import axios from "axios";
import { Address } from "@/interfaces/User";
import dynamic from "next/dynamic";
const AddressForm = dynamic(() => import("@/components/AddressForm"), {
  ssr: false,
});

const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {children}
        <button
          onClick={onClose}
          className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 mt-4"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "clear" | "remove" | null;
    index?: number | null;
  }>({
    isOpen: false,
    type: null,
    index: null,
  });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [addressUpdated, setAddressUpdated] = useState(false);
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
    console.log("Cart Items from localStorage:", storedCart);
    setCartItems(storedCart);
  }, []);

  const getTokenAndUserId = () => {
    const user = localStorage.getItem("user");
    if (!user) return null;

    try {
      const parsedUser = JSON.parse(user);
      return { token: parsedUser.token, id: parsedUser.user?.id };
    } catch (err) {
      console.error("Error al parsear los datos del usuario:", err);
      return null;
    }
  };
  const reloadAddresses = async () => {
    const userData = getTokenAndUserId();
    if (userData?.id) {
      await fetchAddresses(userData.id); // Ya existente
    }
  };
  useEffect(() => {
    if (addressUpdated) {
      reloadAddresses(); // Recarga las direcciones después de guardar
      setAddressUpdated(false); // Resetea el flag
    }
  }, [addressUpdated]);

  const handleOpenModal = (type: "clear" | "remove", index?: number) => {
    setModal({ isOpen: true, type, index });
  };

  const handleCloseModal = () => {
    setModal({ isOpen: false, type: null, index: null });
  };

  const handleRemoveItem = () => {
    if (modal.index !== null) {
      const updatedCart = cartItems.filter((_, i) => i !== modal.index);
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

  const fetchAddresses = async (id: string) => {
    try {
      const { token } = getTokenAndUserId() || {};
      if (!token) {
        console.error("No se encontró el token.");
        return;
      }

      const response = await axios.get(
        `https://valkiriasback.onrender.com/users/address/${id}`,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAddresses(response.data);
    } catch (error) {
      console.error("Error al obtener direcciones:", error);
    }
  };
  useEffect(() => {
    const userData = getTokenAndUserId();
    if (userData?.id) {
      fetchAddresses(userData.id);
    }
  }, []);

  const handlePurchase = async () => {
    try {
      const userData = getTokenAndUserId();
      if (!userData || !userData.token || !userData.id) {
        console.error("Datos del usuario incompletos.");
        return;
      }

      if (!selectedAddressId) {
        console.error("No se ha seleccionado una dirección.");
        return;
      }

      const products = cartItems.map((item) => ({
        id: item.product.id,
        size: item.selectedSize,
        quantity: item.quantity,
      }));
      console.log("Productos en la compra:", products);
      const payload = {
        userId: userData.id,
        products,
        addressId: selectedAddressId,
      };
      console.log("payload:", payload);
      const response = await axios.post(
        `https://valkiriasback.onrender.com/order`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        console.error("No se pudo obtener la URL de pago");
      }
    } catch (error) {
      console.error("Error al procesar la compra:", error);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div className="min-h-screen bg-purple-200 py-8 px-4 text-black">
      <h1 className="text-3xl lg:text-4xl font-bold text-purple-dark mb-4">
        Carrito de Compras
      </h1>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-6  text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-600 mt-2">
            Agrega algunos productos y vuelve aquí para revisarlos.
          </p>
          <button
            className="bg-valkyrie-purple text-white py-1 px-2 mr-2 mt-4 rounded-lg hover:bg-creativity-purple"
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
              className="p-4 bg-white rounded-lg shadow-md flex flex-col md:flex-row items-center md:items-start gap-6 relative"
            >
              {item.product?.photos?.[0] && (
                <img
                  src={item.product.photos[0]}
                  alt={`Imagen de ${item.name || "producto"}`}
                  className="w-32 h-32 rounded"
                />
              )}
              <div className="flex-1">
                <h2 className="text-2xl  font-semibold text-gray-900">
                  {item.product.name || "Producto"}
                </h2>
                {item.selectedSize && (
                  <p className="text-lg text-gray-900">
                    <strong>Tamaño: </strong> {item.selectedSize}
                  </p>
                )}
                {item.selectedColor && colorNameMap[item.selectedColor] && (
                  <p className="text-lg text-gray-900">
                    <strong>Color: </strong> {colorNameMap[item.selectedColor]}
                  </p>
                )}
                <p className="text-lg text-gray-900">
                  <strong>Cantidad:</strong> {item.quantity}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  Total: ${item.totalPrice}
                </p>
              </div>
              {item.clientIdeas && (
                <div className="flex-1">
                  <p className="text-lg text-gray-700">
                    <strong>Ideas: </strong> {item.clientIdeas}
                  </p>
                </div>
              )}

              <button
                onClick={() => handleOpenModal("remove", index)}
                className="absolute top-2 right-2 bg-valkyrie-purple text-white py-1 px-2 rounded-lg hover:bg-creativity-purple"
              >
                Eliminar
              </button>
            </div>
          ))}

          <p className="text-xl font-semibold">
            Subtotal: ${subtotal.toFixed(2)}
          </p>

          <div className=" flex flex-col gap-6  items-center w-full justify-center">
            <h2 className="text-2xl font-semibold">
              Selecciona una direccion o agrega una para tu envio
            </h2>
            <AddressForm
              userId={getTokenAndUserId()?.id}
              onSaveSuccess={() => reloadAddresses()} // Recargar direcciones después de guardar
            />
            <br />
            <h2 className="text-2xl font-semibold">Direcciones guardadas</h2>
            <div className="flex flex-wrap gap-4">
              {addresses.length > 0 ? (
                addresses.map((address) => (
                  <div
                    key={address.id}
                    className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 w-64"
                  >
                    <p className="text-lg text-gray-700">
                      <strong>Calle:</strong> {address.street}
                    </p>
                    <p className="text-lg text-gray-600">
                      <strong>Número:</strong> {address.number}
                    </p>
                    <p className="text-lg text-gray-600">
                      <strong>Código Postal:</strong> {address.postalCode}
                    </p>
                    <p className="text-lg text-gray-600">
                      <strong>Ciudad:</strong> {address.city}
                    </p>
                    <p className="text-lg text-gray-600">
                      <strong>Estado:</strong> {address.state}
                    </p>
                    <button
                      onClick={() => setSelectedAddressId(address.id)}
                      className={`mt-4 py-1 px-2 rounded-lg ${
                        selectedAddressId === address.id
                          ? "bg-custom-orange"
                          : "bg-valkyrie-purple"
                      } text-white hover:bg-creativity-purple`}
                    >
                      {selectedAddressId === address.id
                        ? "Seleccionado"
                        : "Seleccionar"}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center w-full">
                  No hay direcciones registradas.
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => handleOpenModal("clear")}
              className="bg-custom-orange text-white py-1 px-2 rounded-lg hover:bg-orange-400"
            >
              Vaciar Carrito
            </button>
            <button
              onClick={handlePurchase}
              className="bg-valkyrie-purple text-white py-1 px-2 rounded-lg hover:bg-creativity-purple"
            >
              Realizar Compra
            </button>
          </div>
        </div>
      )}

      <Modal isOpen={modal.isOpen} onClose={handleCloseModal}>
        {modal.type === "clear" && (
          <>
            <h2 className="text-lg font-semibold text-gray-800">
              ¿Vaciar carrito?
            </h2>
            <p className="text-gray-600 mt-2">
              Se eliminarán todos los productos del carrito.
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleClearCart}
                className="bg-valkyrie-purple text-white py-1 px-2 mr-2 rounded-lg hover:bg-creativity-purple"
              >
                Sí, vaciar
              </button>
            </div>
          </>
        )}
        {modal.type === "remove" && (
          <>
            <h2 className="text-lg font-semibold text-gray-800">
              ¿Eliminar producto?
            </h2>
            <p className="text-gray-600 mt-2">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleRemoveItem}
                className="bg-valkyrie-purple text-white py-1 px-2 mr-2 rounded-lg hover:bg-creativity-purple"
              >
                Sí, eliminar
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Cart;
