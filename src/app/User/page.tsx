"use client";
import React, { useState, useEffect } from "react";
import { FaUser, FaShoppingCart, FaReceipt, FaTruck } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import Order from "@/interfaces/Order";
import Purchase from "@/interfaces/Purchase";
import { getAuthHeaders } from "@/helpers/tokenHelper";

const UserPanel: React.FC = () => {

  const [activeTab, setActiveTab] = useState<string>("profile");
  const [user, setUser] = useState<{
    id?: string;
    firstname: string;
    lastname: string;
    email: string;
    photo: string;
    dni?: number;
    phone?: string;
    addresses: {
      id: string;
      street: string;
      number: number;
      postalCode: string;
      city: string;
      state: string;
    }[];
  } & { [key: string]: any }>({
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    photo: "/images/Avatar.png",
    dni: 0,
    phone: "",
    addresses: [
      {
        id: "",
        street: "",
        number: 0,
        postalCode: "",
        city: "",
        state: "",
      },
    ],
  });
  
  const [data, setData] = useState<{ orders: Order[]; purchases: Purchase[] }>({
    orders: [],
    purchases: [],
  });

  const [, setLoading] = useState<boolean>(true);
  const [modalField, setModalField] = useState<{
    key: string;
    label: string;
    value: string | number;
    addressIndex?: number; // Para indicar el índice de la dirección si es necesario
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Obtener datos del usuario desde el almacenamiento local
  const getUserData = () => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedGoogleUser = localStorage.getItem("user_info");
      console.log("Datos obtenidos de localStorage:", { storedUser, storedGoogleUser });

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("Usuario (local):", parsedUser);
        return {
          ...parsedUser.user,
          isGoogleUser: false,
        };
      } else if (storedGoogleUser) {
        const googleUser = JSON.parse(storedGoogleUser);
        console.log("Usuario (Google):", googleUser);
        return {
          firstname: googleUser.given_name || "",
          lastname: googleUser.family_name || "",
          email: googleUser.email || "",
          photo: googleUser.picture || "/images/Avatar.png",
          addresses: googleUser.addresses || [],
          isGoogleUser: true,
        };
      }
      console.warn("No se encontró información del usuario en localStorage.");
      return null;
    } catch (error) {
      console.error("Error al procesar los datos del usuario desde localStorage:", error);
      return null;
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const confirmation = window.confirm(
      "¿Estás seguro de que deseas eliminar esta orden? Esta acción no se puede deshacer."
    );
    if (confirmation) {
      try {
        await axios.delete(`https://valkiriasback.onrender.com/order/${orderId}`, {
          headers: getAuthHeaders(), // Autenticación con el token
        });

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
      console.log(`Obteniendo detalles para el usuario con ID: ${id}`);
      const response = await axios.get(`https://valkiriasback.onrender.com/users/${id}`, {
        headers: getAuthHeaders(), // Autenticación con el token
      });
      console.log("Detalles del usuario obtenidos:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener los detalles del usuario:", error);
      return null;
    }
  };

// Corregido para asegurar que user.addresses siempre es un arreglo
const fetchUserAddresses = async (id: string) => {
  try {
    console.log(`Obteniendo direcciones para el usuario con ID: ${id}`);
    const response = await axios.get(`https://valkiriasback.onrender.com/users/address/${id}`, {
      headers: getAuthHeaders(),
    });
    console.log("Direcciones obtenidas:", response.data);
    
    // Asegúrate de que sea un arreglo
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener las direcciones:", error);
    return [];
  }
};


  // // Obtener órdenes desde la API
  // const fetchOrders = async () => {
  //   try {
  //     console.log(`Obteniendo órdenes para el usuario con ID: ${user.id}`);
  //     const response = await axios.get(
  //       `https://valkiriasback.onrender.com/order/user/${user.id}`,
  //       { headers: getAuthHeaders() } // Autenticación con el token
  //     );
  //     console.log("Órdenes obtenidas:", response.data);
  //     setData((prev) => ({ ...prev, orders: response.data }));
  //   } catch (error) {
  //     console.error("Error al obtener las órdenes:", error);
  //     toast.error("Error al obtener las órdenes.");
  //   }
  // };

  // // Obtener compras desde la API
  // const fetchPurchases = async () => {
  //   try {
  //     console.log(`Obteniendo compras para el usuario con ID: ${user.id}`);
  //     const response = await axios.get(
  //       `https://valkiriasback.onrender.com/purchase/user/${user.id}`,
  //       { headers: getAuthHeaders() } // Autenticación con el token
  //     );
  //     console.log("Compras obtenidas:", response.data);
  //     setData((prev) => ({ ...prev, purchases: response.data }));
  //   } catch (error) {
  //     console.error("Error al obtener las compras:", error);
  //     toast.error("Error al obtener las compras.");
  //   }
  // };

// Cargar datos iniciales del usuario
useEffect(() => {
  const fetchData = async () => {
    try {
      const userData = getUserData(); // Obtiene datos básicos del usuario desde localStorage o sesión
      if (userData) {
        // Configura los datos básicos del usuario
        setUser({
          id: userData.id,
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          photo: userData.photo || "/images/Avatar.png",
          dni: userData.dni || 0,
          phone: userData.phone || "",
          addresses: [
            {
              id: "",
              street: "",
              number: 0,
              postalCode: "",
              city: "",
              state: "",
            },
          ], // Valor inicial de direcciones vacío
        });

        // Si no es un usuario de Google, obtener detalles adicionales
        if (!userData.isGoogleUser) {
          const details = await fetchUserDetails(userData.id);
          if (details) {
            setUser((prevState) => ({
              ...prevState,
              ...details,
            }));
          }
        }

        // Obtener direcciones del usuario desde el endpoint correspondiente
        const addresses = await fetchUserAddresses(userData.id);
        if (addresses) {
          setUser((prevState) => ({
            ...prevState,
            addresses: Array.isArray(addresses) && addresses.length > 0
              ? addresses
              : [
                  {
                    id: "",
                    street: "",
                    number: 0,
                    postalCode: "",
                    city: "",
                    state: "",
                  },
                ],
          }));
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
    // Aquí agregarías tu lógica para obtener los datos del usuario si es necesario
  }, []);
  
  const userFields: {
    label: string;
    value: string | number;
    key: string;
    addressIndex?: number;
  }[] = [
    { label: "Email", value: user.email || "N/A", key: "email" },
    { label: "Nombre", value: user.firstname || "N/A", key: "firstname" },
    { label: "Apellido", value: user.lastname || "N/A", key: "lastname" },
    { label: "Teléfono", value: user.phone || "Agregar", key: "phone" },
    { label: "DNI", value: user.dni || "Agregar", key: "dni" },
    // Agregamos las direcciones
    ...user.addresses.map((address, index) => [
      {
        label: `Calle (${index + 1})`,
        value: address.street || "Agregar",
        key: `street-${address.id || index}`,
        addressIndex: index,
      },
      {
        label: `Número (${index + 1})`,
        value: address.number || "Agregar",
        key: `number-${address.id || index}`,
        addressIndex: index,
      },
      {
        label: `Código Postal (${index + 1})`,
        value: address.postalCode || "Agregar",
        key: `postalCode-${address.id || index}`,
        addressIndex: index,
      },
      {
        label: `Ciudad (${index + 1})`,
        value: address.city || "Agregar",
        key: `city-${address.id || index}`,
        addressIndex: index,
      },
      {
        label: `Provincia (${index + 1})`,
        value: address.state || "Agregar",
        key: `state-${address.id || index}`,
        addressIndex: index,
      },
    ]).flat(), // Asegura que todas las direcciones se combinen en un solo arreglo
  ];
  
  
// Función para editar los campos del usuario
const handleEdit = (field: { key: string; label: string; value: string | number; addressIndex?: number }) => {
  console.log("handleEdit llamado con:", field); // Depuración
  setModalField(field);
  setIsModalOpen(true);
};

// Guardar los datos (mejorado)
const handleSave = async () => {
  if (!modalField) {
    toast.error("No hay campo para guardar.");
    return;
  }

  try {
    const token = getToken();
    if (!token) {
      throw new Error("No se encontró el token.");
    }

    // Lógica para actualizar una dirección
    if (modalField.addressIndex !== undefined) {
      const addressId = user.addresses?.[modalField.addressIndex]?.id; // Asegúrate de tener el ID de la dirección
      if (!addressId) {
        throw new Error("No se encontró la dirección para actualizar.");
      }

      const updatedAddress = {
        ...user.addresses[modalField.addressIndex],
        [modalField.key]: modalField.value,
      };

      console.log("Dirección actualizada:", updatedAddress);

      // Actualizar la dirección en el servidor
      const response = await axios.put(
        `https://valkiriasback.onrender.com/addresses/${addressId}`,
        updatedAddress,
        { headers: getAuthHeaders() }
      );

      if (response.status === 200) {
        // Actualiza la dirección localmente
        const updatedAddresses = [...user.addresses];
        updatedAddresses[modalField.addressIndex] = response.data;

        setUser({ ...user, addresses: updatedAddresses });
        toast.success("Dirección actualizada correctamente.");
        setIsModalOpen(false);
      } else {
        throw new Error("Error al actualizar la dirección.");
      }

      return;
    }

    // Lógica para actualizar otros datos del usuario
    const updatedUser = { ...user };
    if (modalField.key === "dni") {
      const dniValue = Number(modalField.value);
      if (isNaN(dniValue) || dniValue <= 0) {
        throw new Error("El DNI debe ser un número válido y positivo.");
      }
      updatedUser.dni = dniValue;
    } else if (modalField.key in updatedUser) {
      const key = modalField.key as keyof typeof updatedUser;
      updatedUser[key] = modalField.value as never;
    } else {
      throw new Error(`La clave ${modalField.key} no es válida.`);
    }

    console.log("Usuario actualizado:", updatedUser);

    const response = await axios.put(
      `https://valkiriasback.onrender.com/users/${user.id}`,
      updatedUser,
      { headers: getAuthHeaders() }
    );

    if (response.status === 200) {
      setUser(response.data); // Actualiza el estado local
      toast.success(`${modalField.label} actualizado correctamente.`);
      setIsModalOpen(false);
    } else {
      throw new Error("Error al actualizar los datos del usuario.");
    }
  } catch (error) {
    toast.error("Hubo un problema al guardar los cambios.");
    console.error("Error al guardar:", error);
  }
};

// Función para obtener el token desde el localStorage
const getToken = () => {
  const user = localStorage.getItem("user");
  console.log("Datos del usuario en localStorage:", user); // Depuración
  if (!user) {
    console.error("No hay datos del usuario en localStorage");
    return null;
  }

  try {
    const parsedUser = JSON.parse(user);
    console.log("Usuario parseado:", parsedUser); // Depuración
    return parsedUser.token || null;
  } catch (err) {
    console.error("Error al parsear los datos del usuario:", err);
    return null;
  }
};

const handleImageUpload = async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
      toast.error("No se seleccionó ningún archivo.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("El archivo es demasiado grande (máx. 2 MB).");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const headers = getAuthHeaders();
      if (!headers) {
        toast.error("No se encontró el token.");
        return;
      }
      
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
        `https://valkiriasback.onrender.com/users/updateProfileImg/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData, // Enviar el archivo como FormData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error de servidor:", errorData);
        throw new Error(errorData.message || "Error al actualizar la imagen.");
      }

      const data = await response.json();
      setUser((prevUser) => ({
        ...prevUser,
        photo: data.photo,
      }));
      toast.success("Foto de perfil actualizada exitosamente.");
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      toast.error("Ocurrió un error al subir la imagen.");
    }
  };

  input.click();
};

const renderContent = () => {
  switch (activeTab) {
    case "profile":
      return (
        <div className="bg-purple-200 min-h-screen p-6">
          <h1 className="text-3xl font-bold text-black mb-6 text-center">
            Mi Perfil
          </h1>
          {user ? (
            <div className="p-6 bg-white rounded-lg shadow-md flex flex-col md:flex-row md:space-x-6">
              {/* Columna izquierda: Foto de perfil y datos del usuario */}
              <div className="flex flex-col items-center space-y-6 md:w-1/2">
                {/* Foto de perfil */}
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 shadow-md">
                    <img
                      src={user.photo || "/images/Avatar.png"} // Si no hay foto, se usa la predeterminada
                      alt={`${user.firstname} ${user.lastname}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Botón de edición de la foto */}
                  <button
                    onClick={handleImageUpload}
                    className="p-1 rounded-md text-purple-500 hover:bg-gray-100"
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

                {/* Datos del usuario (sin foto) */}
                <div className="w-full space-y-3">
                  {userFields
                    .filter(
                      (item) =>
                        !["Foto"].includes(item.label)
                    )
                    .map((item) => (
                      <div key={item.key} className="flex justify-between items-center text-gray-600">
                        <p className="text-lg">
                          <strong className="text-gray-800">{item.label}:</strong> {item.value}
                        </p>
                        {/* Botón de editar */}
                        {item.key !== "email" && (
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1 rounded-md hover:bg-gray-100"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1}
                              stroke="purple"
                              className="w-4 h-4"
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

              {/* Columna derecha: Datos de dirección y mapa */}
              <div className="md:w-1/2 space-y-6">
                {/* Datos de dirección */}
                <div className="bg-purple-200 p-6 rounded-lg shadow-md ">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                    Dirección
                  </h2>
                  <div className="space-y-4">
                    {user?.addresses?.length === 0 || user?.addresses?.some(address => !address.street || !address.number || !address.postalCode || !address.city) ? (
                      <p className="text-center text-gray-600">No hay ninguna dirección registrada.</p>
                    ) : (
                      user?.addresses?.map((address, index) => (
                        <div key={index} className="text-sm text-gray-600 p-2 bg-white">
                          <p className="text-lg text-center">
                            {address.street}, {address.number}, {address.postalCode}, {address.city}
                          </p>
                          {/* <p className="text-gray-500 text-xs">
                            Coordenadas: {address.latitude}, {address.longitude}
                          </p> */}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                {/* Espacio para el mapa */}
                <div className="bg-purple-200 p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                    Mapa de Dirección
                  </h2>
                  <div className="h-64 bg-white rounded-lg">
                    {/* Aquí iría el mapa con las coordenadas */}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-center">Cargando información...</p>
          )}
        </div>
      );

    case "traking":
      return (
        <div className="bg-purple-200 min-h-screen p-6">
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
  <div className="flex flex-col h-screen">
    <header className="bg-valkyrie-purple text-white flex justify-between items-center p-4 border-b-2 border-white">
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
              className="bg-valkyrie-purple px-4 py-2 rounded-md hover:bg-creativity-purple"
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