"use client";
import React, { useState, useEffect } from "react";
import { FaUser, FaShoppingCart, FaReceipt, FaTruck } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import Order from "@/interfaces/Order";
import Purchase from "@/interfaces/Purchase";
import dynamic from "next/dynamic";
import { Address } from "@/interfaces/User";

const AddressForm = dynamic(() => import("@/components/AddressForm"), {
  ssr: false,
});
const UserPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [user, setUser] = useState<{
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    photo: string;
    dni?: number;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
  }>({
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    photo: "/images/Avatar.png",
    dni: 0,
    phone: "",
    address: "",
    city: "",
    state: "",
  });
  const [data, setData] = useState<{ orders: Order[]; purchases: Purchase[] }>({
    orders: [],
    purchases: [],
  });

  const [, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalField, setModalField] = useState<{
    key: string;
    label: string;
    value: string | number;
  } | null>(null);

  // Obtener datos del usuario desde el almacenamiento local
  const getUserData = () => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedGoogleUser = localStorage.getItem("user_info");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        return {
          id: parsedUser.user.id,
          firstname: parsedUser.user.firstname || "",
          lastname: parsedUser.user.lastname || "",
          email: parsedUser.user.email || "",
          photo: parsedUser.user.photo || "/images/Avatar.png",
          isGoogleUser: false,
        };
      } else if (storedGoogleUser) {
        const googleUser = JSON.parse(storedGoogleUser);
        return {
          firstname: googleUser.given_name || "",
          lastname: googleUser.family_name || "",
          email: googleUser.email || "",
          photo: googleUser.picture || "/images/Avatar.png",
          dni: googleUser.dni || 0,
          phone: googleUser.phone || "",
          isGoogleUser: true,
        };
      }
      return null;
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      return null;
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const confirmation = window.confirm(
      "¿Estás seguro de que deseas eliminar esta orden? Esta acción no se puede deshacer."
    );
    if (confirmation) {
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

        const token = getToken();
        if (!token) {
          console.error("No se encontró el token.");
        }
        await axios.delete(
          `https://valkiriasback.onrender.com/order/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData((prevData) => ({
          ...prevData,
          orders: prevData.orders.filter((order) => order.id !== orderId),
        }));
        toast.success("Orden eliminada con éxito.");
      } catch (error) {
        console.error("Error eliminando la orden:", error);
        toast.error(
          "Hubo un problema al eliminar la orden. Inténtalo nuevamente."
        );
      }
    }
  };

  // Obtener detalles adicionales del usuario desde la API
  const fetchUserDetails = async (id: string) => {
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

      const token = getToken();
      if (!token) {
        console.error("No se encontró el token.");
      }
      const response = await axios.get(
        `https://valkiriasback.onrender.com/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener los detalles del usuario:", error);
      return null;
    }
  };

  // Obtener órdenes desde la API
  const fetchOrders = async () => {
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

      const token = getToken();
      if (!token) {
        console.error("No se encontró el token.");
      }
      const response = await axios.get(
        `https://valkiriasback.onrender.com/order/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData((prev) => ({ ...prev, orders: response.data }));
    } catch (error) {
      console.error("Error al obtener las órdenes:", error);
      toast.error("Error al obtener las órdenes.");
    }
  };

  // Obtener compras desde la API
  const fetchPurchases = async () => {
    try {
      const response = await axios.get(
        `https://valkiriasback.onrender.com/purchase/user/${user.id}`
      );
      setData((prev) => ({ ...prev, purchases: response.data }));
    } catch {
      toast.error("Error al obtener las compras.");
    }
  };
  const fetchAddresses = async () => {
    try {
      const response = await fetch(
        "https://valkiriasback.onrender.com/users/address/cf2bdb54-e854-42f7-88a7-5ec336a291af",
        {
          method: "GET",
          headers: {
            Accept: "*/*",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setAddresses(data); // Actualiza el estado con las direcciones
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("No se seleccionó un archivo válido.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file); // La clave 'photo' debe coincidir con la esperada en la API.

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

      const token = getToken();
      if (!token) {
        console.error("No se encontró el token.");
      }
      const response = await axios.put(
        `https://valkiriasback.onrender.com/users/updateProfileImg/${user?.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Imagen actualizada con éxito:", response.data);

        // Actualiza el estado del usuario con la nueva URL de la imagen
        setUser((prev) => ({
          ...prev,
          photo: response.data.photo || prev.photo, // Verifica que la API devuelva la URL actualizada
        }));

        toast.success("Imagen de perfil actualizada con éxito.");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Error al actualizar la imagen.");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      toast.error("Hubo un error al subir la imagen.");
    }
  };

  // Cargar datos iniciales del usuario
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = getUserData();
        if (userData) {
          setUser({
            id: userData.id,
            firstname: userData.firstname,
            lastname: userData.lastname,
            email: userData.email,
            photo: userData.photo,
            dni: userData.dni,
            phone: userData.phone,
          });

          // Si no es usuario de Google, obtener detalles adicionales
          if (!userData.isGoogleUser) {
            const details = await fetchUserDetails(userData.id);
            if (details) {
              setUser((prevState) => ({
                ...prevState,
                ...details, // Combina los detalles adicionales
              }));
            }
          }
        } else {
          toast.error("Por favor, inicie sesión para acceder a esta página.");
          window.location.href = "/Login";
        }
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
        toast.error("Hubo un problema al cargar los datos del usuario.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cargar órdenes o compras según la pestaña activa
  useEffect(() => {
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "purchases") fetchPurchases();
    if (activeTab === "profile") fetchAddresses();
  }, [activeTab]);
  const userFields: {
    label: string;
    value: string | number;
    key: string;
  }[] = [
    { label: "Nombre", value: `${user.firstname || "N/A"} `, key: "firstname" },
    { label: "Apellido", value: `${user.lastname || "N/A"}`, key: "lastname" },
    { label: "Email", value: user.email || "N/A", key: "email" },
    {
      label: "Teléfono",
      value: user.phone || "Agregar",
      key: "phone",
    },
    { label: "DNI", value: user.dni || "Agregar", key: "dni" },
  ];

  const handleEdit = (field: {
    key: string;
    label: string;
    value: string | number;
  }) => {
    setModalField(field);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const response = await axios.delete(
        `https://valkiriasback.onrender.com/users/address/${addressId}`
      );

      if (response.status === 200) {
        toast.success("Dirección eliminada con éxito.");
      } else {
        throw new Error("Error al eliminar la dirección");
      }
    } catch (error) {
      console.error("Error eliminando la dirección:", error);
      toast.error("No se pudo eliminar la dirección. Intenta nuevamente.");
    }
  };
  const handleSave = async () => {
    if (!modalField) {
      toast.error("No hay campo para guardar.");
      console.error("No hay campo modalField definido."); // Depuración
      return;
    }

    try {
      // Copia del estado actual del usuario
      const updatedUser = { ...user };
      console.log("Usuario antes de actualizar:", updatedUser); // Depuración

      // Validación de `modalField.key`
      if (!modalField.key) {
        throw new Error("El campo clave del modal no es válido.");
      }

      // Edición del DNI
      else if (modalField.key === "dni") {
        const dniValue = Number(modalField.value);

        if (isNaN(dniValue) || dniValue <= 0) {
          throw new Error("El DNI debe ser un número válido y positivo.");
        }
        updatedUser.dni = dniValue;
        console.log("DNI actualizado:", updatedUser.dni); // Depuración
      }
      // Actualización de otros campos
      else if (modalField.key in updatedUser) {
        // Garantizamos que `modalField.key` es una clave válida
        const key = modalField.key as keyof typeof updatedUser;
        updatedUser[key] = modalField.value as never; // Aseguramos que el valor sea del tipo correcto
        console.log(`Campo ${modalField.key} actualizado a:`, updatedUser[key]); // Depuración
      } else {
        throw new Error(`La clave ${modalField.key} no es válida.`);
      }

      console.log("Usuario actualizado:", updatedUser); // Depuración
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

      const token = getToken();
      if (!token) {
        console.error("No se encontró el token.");
      }
      // Enviar datos al back-end
      const response = await axios.put(
        `https://valkiriasback.onrender.com/users/${user.id}`,
        updatedUser,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUser(response.data); // Actualiza el estado local con los datos del servidor
        toast.success(`${modalField.label} actualizado correctamente.`);
        setIsModalOpen(false); // Cierra el modal
      } else {
        throw new Error("Error en la respuesta del servidor.");
      }
    } catch (error) {
      console.error("Error al guardar:", error); // Depuración
      toast.error("Hubo un problema al guardar los cambios.");
    }
  };
  console.log(user);
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="bg-white min-h-screen  p-6">
            <h1 className="text-3xl font-bold text-black mb-6 text-center">
              Mi Perfil
            </h1>
            {user ? (
              <div className="p-6 bg-gray-100 rounded-lg shadow-md flex flex-col items-center space-y-4 w-full">
                <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg relative group">
                  <img
                    src={user.photo || "/images/Avatar.png"}
                    alt={`${user.firstname} ${user.lastname}`}
                    className="w-full h-full object-cover"
                  />

                  <button
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                    className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    Editar
                  </button>

                  <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="text-center space-y-2">
                  {userFields.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-center"
                    >
                      <p className="text-lg text-gray-600">
                        <strong>{item.label}:</strong> {item.value}
                      </p>
                      {item.key !== "email" && (
                        <button
                          onClick={() => handleEdit(item)}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1}
                            stroke="purple"
                            className="w-3 h-3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.232 5.232l3.536 3.536m-2.036-6.036a2.5 2.5 0 013.536 3.536L7.5 21H3v-4.5L16.732 3.732z"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className=" flex flex-wrap gap-6 p-4 items-center w-full justify-center">
                  {addresses.length > 0 ? (
                    addresses.map((address) => (
                      <div
                        key={address.id}
                        className=" bg-white border border-gray-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 flex flex-col"
                      >
                        <p className="text-lg  text-gray-700">
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
                          onClick={() => handleDeleteAddress(address.id)}
                          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-200"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center w-full">
                      No hay direcciones registradas.
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <AddressForm userId={user?.id || ""} />
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-center">
                Cargando información...
              </p>
            )}
          </div>
        );
      case "traking":
        return (
          <div className="bg-white min-h-screen p-6">
            <h1 className="text-3xl font-bold text-black mb-6 text-center">
              Seguimiento de Pedidos
            </h1>

            <div className="max-w-4xl mx-auto bg-gray-100 p-6 rounded-lg shadow-lg">
              {/* Detalles del Pedido */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Detalles del Pedido
                </h2>
                <div className="text-lg text-gray-700 space-y-2">
                  <p>
                    <strong>ID del Pedido:</strong> #123456
                  </p>
                  <p>
                    <strong>Fecha de Pedido:</strong> 05 de Enero de 2025
                  </p>
                  <p>
                    <strong>Estado Actual:</strong> En Tránsito
                  </p>
                  <p>
                    <strong>Entrega Estimada:</strong> 10 de Enero de 2025
                  </p>
                </div>
              </div>

              {/* Línea de Tiempo */}
              <div className="relative border-l-4 border-purple-500">
                {/* Evento: Pedido Realizado */}
                <div className="mb-8 pl-6">
                  <div className="absolute -left-4 top-0 bg-purple-500 rounded-full h-8 w-8 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Pedido Realizado
                  </h3>
                  <p className="text-gray-600">05 de Enero de 2025</p>
                  <p className="text-gray-700">
                    Hemos recibido tu pedido y lo estamos procesando.
                  </p>
                </div>

                {/* Evento: Pedido Preparado */}
                <div className="mb-8 pl-6">
                  <div className="absolute -left-4 top-0 bg-purple-500 rounded-full h-8 w-8 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Pedido Preparado
                  </h3>
                  <p className="text-gray-600">06 de Enero de 2025</p>
                  <p className="text-gray-700">
                    Tu pedido está listo para ser enviado.
                  </p>
                </div>

                {/* Evento: En Tránsito */}
                <div className="mb-8 pl-6">
                  <div className="absolute -left-4 top-0 bg-purple-500 rounded-full h-8 w-8 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    En Tránsito
                  </h3>
                  <p className="text-gray-600">07 de Enero de 2025</p>
                  <p className="text-gray-700">
                    Tu pedido está en camino a la dirección indicada.
                  </p>
                </div>

                {/* Evento: Entregado */}
                <div className="pl-6">
                  <div className="absolute -left-4 top-0 bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center">
                    <span className="text-gray-500 font-bold text-lg">4</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Entregado</h3>
                  <p className="text-gray-600">
                    10 de Enero de 2025 (estimado)
                  </p>
                  <p className="text-gray-700">
                    Tu pedido será entregado pronto. ¡Gracias por tu paciencia!
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case "orders":
        return (
          <div className="bg-white min-h-screen p-6">
            <h1 className="text-3xl font-bold text-black mb-6 text-center">
              Mis Órdenes
            </h1>
            <div className="space-y-4">
              {data.orders.length > 0 ? (
                data.orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 bg-gray-100 rounded-lg shadow-md flex justify-between items-center"
                  >
                    <div>
                      <p className="text-lg text-gray-800">
                        <strong>ID:</strong> {order.id}
                      </p>
                      <p className="text-lg text-gray-800">
                        <strong>Fecha:</strong>{" "}
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                      <p className="text-lg text-gray-800">
                        <strong>Total:</strong> ${order.total}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No tienes órdenes registradas.</p>
              )}
            </div>
          </div>
        );
      case "purchases":
        // fetchPurchases();
        return (
          <div className="bg-white min-h-screen p-6">
            <h1 className="text-3xl font-bold text-black mb-6 text-center">
              Mis Compras
            </h1>
            <div className="space-y-4">
              {data.purchases.length > 0 ? (
                data.purchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="p-4 bg-gray-100 rounded-lg shadow-md"
                  >
                    <p className="text-lg text-gray-800">
                      <strong>Producto:</strong> {purchase.product}
                    </p>
                    <p className="text-lg text-gray-800">
                      <strong>Cantidad:</strong> {purchase.quantity}
                    </p>
                    <p className="text-lg text-gray-800">
                      <strong>Total:</strong> ${purchase.total}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No tienes compras registradas.</p>
              )}
            </div>
          </div>
        );
      default:
        return <p>Seleccione una pestaña para ver el contenido.</p>;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <header className="bg-valkyrie-purple p-4 text-white">
        <nav className="flex justify-around">
          <button
            className={`p-2 flex items-center cursor-pointer ${
              activeTab === "profile" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <FaUser className="mr-2" />
            Perfil
          </button>
          <button
            className={`p-2 flex items-center cursor-pointer ${
              activeTab === "orders" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => setActiveTab("orders")}
          >
            <FaShoppingCart className="mr-2" />
            Órdenes
          </button>
          <button
            className={`p-2 flex items-center cursor-pointer ${
              activeTab === "purchases" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => setActiveTab("purchases")}
          >
            <FaReceipt className="mr-2" />
            Compras
          </button>
          <button
            className={`p-2 flex items-center cursor-pointer ${
              activeTab === "traking" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => setActiveTab("traking")}
          >
            <FaTruck className="mr-2" />
            Seguimiento
          </button>
        </nav>
      </header>
      <main className="flex-1 bg-[#7b548b]">{renderContent()}</main>

      {isModalOpen && modalField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Editar {modalField.label}
            </h2>
            <input
              type="text"
              value={modalField.value}
              onChange={(e) =>
                setModalField(
                  (prev) => prev && { ...prev, value: e.target.value }
                )
              }
              className="w-full p-2 border text-gray-800 rounded-md"
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={handleSave}
                className="bg-valkyrie-purple px-4 py-2 bg-gray-300 rounded-md hover:bg-creativity-purple"
              >
                Guardar
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className=" bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
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

export default UserPanel;
