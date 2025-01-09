"use client";
import React, { useState, useEffect } from "react";
import { FaUser, FaShoppingCart, FaReceipt, FaTruck } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import Order from "@/interfaces/Order";
import Purchase from "@/interfaces/Purchase";

const UserPanel: React.FC = () => {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || `https://valkiriasback.onrender.com`;
  const LOCAL_URL =
    process.env.NEXT_PUBLIC_LOCAL_URL || `http://localhost:3000`;
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [user, setUser] = useState<{
    id?: string;
    firstname: string;
    lastname: string;
    email: string;
    photoUrl: string;
    dni?: number;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
  }>({
    firstname: "",
    lastname: "",
    email: "",
    photoUrl: "/images/Avatar.png",
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
          photoUrl: parsedUser.user.photo || "/images/Avatar.png",
          isGoogleUser: false,
        };
      } else if (storedGoogleUser) {
        const googleUser = JSON.parse(storedGoogleUser);
        return {
          firstname: googleUser.given_name || "",
          lastname: googleUser.family_name || "",
          email: googleUser.email || "",
          photoUrl: googleUser.picture || "/images/Avatar.png",
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

  // Obtener detalles adicionales del usuario desde la API
  const fetchUserDetails = async (id: string) => {
    try {
      const response = await axios.get(`${API_URL || LOCAL_URL}/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener los detalles del usuario:", error);
      return null;
    }
  };

  // Obtener órdenes desde la API
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL || LOCAL_URL}/order/orders`);
      setData((prev) => ({ ...prev, orders: response.data }));
    } catch (error) {
      console.error("Error al obtener las órdenes:", error);
      toast.error("Error al obtener las órdenes.");
    }
  };

  // Obtener compras desde la API
  const fetchPurchases = async () => {
    try {
      const response = await axios.get("http://localhost:3000/purchases");
      setData((prev) => ({ ...prev, purchases: response.data }));
    } catch (error) {
      console.error("Error al obtener las compras:", error);
      toast.error("Error al obtener las compras.");
    }
  };

  // Cargar datos iniciales del usuario
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = getUserData();
        if (userData) {
          setUser({
            firstname: userData.firstname,
            lastname: userData.lastname,
            email: userData.email,
            photoUrl: userData.photoUrl,
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
  }, [activeTab]);
  type UserField =
    | "id"
    | "Foto"
    | "Nombre"
    | "Apellido"
    | "Email"
    | "Telefono"
    | "Dni"
    | "Direccion"
    | "Provincia"
    | "Ciudad";
  const userFields: {
    label: string;
    value: string | number;
    key: UserField;
  }[] = [
    { label: "Email", value: user.email || "N/A", key: "Email" },
    {
      label: "Nombre",
      value: `${user.firstname || "N/A"} `,
      key: "Nombre",
    },
    { label: "Apellido", value: `${user.lastname || "N/A"}`, key: "Apellido" },
    { label: "Teléfono", value: user.phone || "N/A", key: "Telefono" },
    { label: "DNI", value: user.dni || "N/A", key: "Dni" },
    { label: "Dirección", value: user.address || "N/A", key: "Direccion" },
    { label: "Ciudad", value: user.city || "N/A", key: "Provincia" },
    { label: "Estado", value: user.state || "N/A", key: "Ciudad" },
    // { label: "Foto", value: user.photoUrl || "N/A", key: "Foto" },
  ];
  function isUserField(key: string): key is UserField {
    return [
      "Nombre",
      "Apellido",
      "Email",
      "Telefono",
      "Dni",
      "Direccion",
      "Provincia",
      "Ciudad",
      "Foto",
    ].includes(key);
  }

  async function handleEdit(key: string): Promise<void> {
    if (!isUserField(key)) {
      console.error(`Campo inválido: ${key}`);
      toast.error(`Campo inválido: ${key}`);
      return;
    }
    if (key === "Email") {
      toast.error("El correo no se puede editar.");
      return;
    }
    
    const newValue = prompt(`Ingrese el nuevo valor para ${key}:`);
    if (!newValue) return;

    // Intentar convertir a número si es necesario
    let formattedValue: string | number = newValue;

    // Validar si el campo requiere un número, como "dni"
    if (key === "Dni") {
      const parsedNumber = Number(newValue);
      if (isNaN(parsedNumber)) {
        toast.error(`${key} debe ser un número válido.`);
        return;
      }
      formattedValue = parsedNumber;
    }

    try {
      const response = await axios.put(
        `${API_URL || LOCAL_URL}/users/${user.id}`,
        { [key]: formattedValue },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        setUser(response.data);
        toast.success(`${key} actualizado correctamente.`);
      } else {
        throw new Error("No se pudo actualizar el dato.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Hubo un problema al actualizar el dato.");
    }
  }
  const handleDeleteOrder = async (orderId: string) => {
    const confirmation = window.confirm(
      "¿Estás seguro de que deseas eliminar esta orden? Esta acción no se puede deshacer."
    );
    if (confirmation) {
      try {
        // Realiza la solicitud DELETE al backend
        await axios.delete(`${API_URL || LOCAL_URL}/order/${orderId}`);

        // Actualiza el estado eliminando la orden
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

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
            <div className="p-6 w-full max-w-md">
              <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                Mi Perfil
              </h1>
              {user ? (
                <div className="bg-white border-2 rounded-lg p-6 flex flex-col items-center space-y-4">
                  {/* Foto de perfil con botón de edición al lado */}
                  <div className="flex items-center space-x-4 ml-11">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 shadow-md">
                      <img
                        src={user.photoUrl || "/images/Avatar.png"}
                        alt={`${user.firstname} ${user.lastname}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Botón de edición */}
                    <button
                      onClick={() => handleEdit("photoUrl")}
                      className="p-1 rounded-md text-blue-500 hover:bg-gray-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.232 5.232l3.536 3.536m-2.036-6.036a2.5 2.5 0 013.536 3.536L7.5 21H3v-4.5L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  </div>
  
                  {/* Información del usuario */}
                  <div className="w-full space-y-3 mt-4">
                    {userFields.map((item) => (
                      <div
                        key={item.key}
                        className="flex justify-between items-center text-gray-600"
                      >
                        <p className="text-sm">
                          <strong className="text-gray-800">{item.label}:</strong>{" "}
                          {item.value}
                        </p>
                        {item.key !== "Email" && (
                          <button
                            onClick={() => handleEdit(item.key)}
                            className="p-1 rounded-md hover:bg-gray-100"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 text-blue-500"
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
                </div>
              ) : (
                <p className="text-gray-600 text-center">Cargando información...</p>
              )}
            </div>
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
        fetchOrders();
        const handleDeleteOrder = async (orderId: string) => {
          const confirmation = window.confirm(
            "¿Estás seguro de que deseas eliminar esta orden? Esta acción no se puede deshacer."
          );
          if (confirmation) {
            try {
              // Realiza la solicitud DELETE al backend
              await axios.delete(`${API_URL || LOCAL_URL}/order/${orderId}`);

              // Actualiza el estado eliminando la orden
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
    <div className=" flex flex-col h-screen">
      <header className="bg-valkyrie-purple  text-white flex justify-between items-center p-4 border-b-2 border-white">
        <div className="text-xl font-bold">Panel de Usuario</div>
        <nav className="flex space-x-4">
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
    </div>
  );
};

export default UserPanel;
