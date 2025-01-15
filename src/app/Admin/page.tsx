"use client";
import React, { useState, useEffect } from "react";
import { FaUsers, FaChartBar, FaHome, FaInbox } from "react-icons/fa";
import axios from "axios";
import Link from "next/link";
import { User } from "@/interfaces/User";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Product } from "@/interfaces/Product";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";

const Reports = dynamic(() => import("@/components/Reports"), {
  ssr: false,
});
function Admin() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    setFilteredUsers(
      users.filter(
        (user) =>
          user.email.toLowerCase().includes(lowerSearchTerm) ||
          user.id.toString().includes(lowerSearchTerm)
      )
    );
  }, [searchTerm, users]);

  const getUserTokenId = (): { id: string; token: string } => {
    const user = localStorage.getItem("user");

    if (!user) {
      console.error("No hay datos del usuario en localStorage");
      return { id: "", token: "" };
    }

    try {
      const parsedUser = JSON.parse(user);
      const id = parsedUser.id || parsedUser.user?.id || ""; // Acceso seguro
      const token = parsedUser.token || parsedUser.accessToken || ""; // Token prioritario

      if (!id) console.warn("El ID del usuario no está disponible.");
      if (!token) console.warn("El token del usuario no está disponible.");

      console.log("ID:", id, "Token:", token);
      return { id, token };
    } catch (err) {
      console.error("Error al parsear los datos del usuario:", err);
      return { id: "", token: "" };
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `https://valkiriasback.onrender.com/products`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los productos");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      toast.error("Error al obtener los productos.");
    } finally {
      setLoading(false);
    }
  };
  const fetchUserAddress = async (userId: string, token: string) => {
    try {
      const response = await axios.get(
        `https://valkiriasback.onrender.com/users/address/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error al obtener la dirección del usuario ${userId}:`,
        error
      );
      return "Sin dirección"; // Devuelve un valor predeterminado en caso de error
    }
  };

  const fetchUsers = async () => {
    const { id, token } = getUserTokenId(); // Obtén el token y el ID del usuario autenticado
    console.log("Token e ID obtenidos:", { id, token });

    if (!token) {
      console.error("No se encontró el token del usuario.");
      toast.error(
        "Error de autenticación. Por favor, inicia sesión nuevamente."
      );
      return;
    }

    try {
      // Realiza la solicitud GET a la API
      const response = await axios.get(
        "https://valkiriasback.onrender.com/users",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
          },
        }
      );

      // Verifica si la respuesta es válida
      if (response.status === 200 && Array.isArray(response.data)) {
        // Procesa las direcciones de cada usuario
        const usersWithAddresses = await Promise.all(
          response.data.map(async (user: User) => {
            try {
              const address = await fetchUserAddress(user.id, token);
              return { ...user, address };
            } catch (error) {
              console.warn(
                `No se pudo obtener la dirección para el usuario ${user.id}:`,
                error
              );
              return { ...user, address: "Sin dirección" };
            }
          })
        );

        setUsers(usersWithAddresses);
        setFilteredUsers(usersWithAddresses);
        toast.success("Usuarios cargados correctamente.");
      } else {
        throw new Error(
          `Respuesta inesperada de la API: ${response.status} ${response.statusText}`
        );
      }
    } catch (error: any) {
      console.error("Error al obtener los usuarios:", error.message || error);
      if (error.response) {
        console.error("Detalles del error:", error.response.data);
        toast.error(
          `Error ${error.response.status}: ${
            error.response.data.message || "al obtener los usuarios"
          }`
        );
      } else {
        toast.error(
          "Error al obtener los usuarios. Por favor, intenta nuevamente."
        );
      }
    }
  };

  const toggleUserStatus = async (id: string, activate: boolean) => {
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
    try {
      const url = activate
        ? `https://valkiriasback.onrender.com/users/${id}/activate`
        : `https://valkiriasback.onrender.com/users/${id}/deactivate`;

      await axios.put(url, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUsers();
      toast.success(
        activate
          ? "Usuario activado con éxito"
          : "Usuario desactivado con éxito"
      );
    } catch {
      toast.error("Error al actualizar el estado del usuario");
    }
  };

  const handleToggleAdmin = async (id: string, newIsAdmin: boolean) => {
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
    try {
      const response = await axios.put(
        `https://valkiriasback.onrender.com/users/changeIsAdmin/${id}`,
        {
          isAdmin: newIsAdmin,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data;
      toast.success("Estado de administrador cambiado con éxito");

      // Actualiza el estado local con la respuesta del servidor
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id ? { ...user, isAdmin: updatedUser.isAdmin } : user
        )
      );
    } catch (error) {
      console.error("Error al cambiar el estado de administrador:", error);
      toast.error("Error al cambiar el estado de administrador.");
    }
  };
  const handleDeleteUser = async (id: string) => {
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
    try {
      const response = await axios.delete(
        `https://valkiriasback.onrender.com/users/${id}/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();
      toast.success("Usuario eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      toast.error("Error al eliminar el usuario.");
    }
  };

  const handleDelete = async (productId: string) => {
    if (!productId) {
      toast.error("Por favor, selecciona un producto válido.");
      return;
    }

    try {
      const response = await axios.delete(
        `https://valkiriasback.onrender.com/products/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${getUserTokenId().token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("El producto ha sido eliminado exitosamente.");
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      } else {
        throw new Error("Error al eliminar el producto");
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      toast.error("Error al eliminar el producto.");
    }
  };

  const handleEdit = (productId: string) => {
    if (!productId) {
      toast.error("Por favor, selecciona un producto válido.");
      return;
    }

    router.push(`/UpdateProduct/${productId}`);
  };

  const filteredProducts = searchTerm
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.id.toString().includes(searchTerm)
      )
    : products;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="bg-white min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Lista de Productos
            </h1>
            <div className="mb-6 max-w-lg mx-auto">
              <Link href="/CreateProduct" aria-label="Crear Productos">
                <button className=" mr-8 bg-valkyrie-purple text-white p-3   rounded-lg hover:bg-creativity-purple">
                  Crear Productos
                </button>
              </Link>

              <input
                type="text"
                placeholder="Buscar por nombre o ID"
                className="p-3 border border-gray-300 rounded-lg w-1/2 text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-valkyrie-purple"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-center text-sm">
              <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 text-left">
                    <th className="p-4">ID</th>
                    <th className="p-4">Nombre</th>
                    <th className="p-4">Precio</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-100">
                      <td className="p-2 border-t text-gray-700">
                        {product.id}
                      </td>
                      <td className="p-2 border-t text-gray-700">
                        {product.name}
                      </td>
                      <td className="p-2 border-t text-gray-700">
                        {product.prices[0]?.price}
                      </td>
                      <td className="p-2 border-t text-gray-700">
                        {product.stock}
                      </td>
                      <td className="p-2 border-t text-center flex justify-center items-center align-middle text-gray-700">
                        <button
                          onClick={() => handleEdit(product.id)}
                          className="bg-custom-orange text-white py-1 px-2 mr-2 rounded-lg hover:bg-orange-400"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-valkyrie-purple text-white py-1 px-2 mr-2 rounded-lg hover:bg-creativity-purple"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "users":
        return (
          <div className="bg-white min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Administrar Usuarios
            </h1>
            <div className="mb-6 max-w-lg mx-auto">
              <input
                type="text"
                placeholder="Buscar por ID o Email"
                className="p-3 border border-gray-300 rounded-lg w-full text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-valkyrie-purple"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-center text-sm">
              <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 text-left">
                    <th className="p-4">ID</th>
                    <th className="p-4">Nombre</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Dirección</th>
                    <th className="p-4">Teléfono</th>
                    <th className="p-4">Activo</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Admin</th>
                    <th className="p-4">Acciones</th>
                    <th className="p-4">Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100 transition`}
                    >
                      <td className="p-2 border-t text-gray-700">{user.id}</td>
                      <td className="p-2 border-t text-gray-700">
                        {user.firstname}
                      </td>
                      <td className="  border-t text-gray-700">{user.email}</td>
                      <td className="p-2 border-t text-gray-700 whitespace-normal break-words w-1/3">
                        Calle: {user.address[0]?.street}
                        <br />
                        Provincia: {user.address[0]?.state}
                        <br />
                        CP: {user.address[0]?.postalCode}
                      </td>

                      <td className="p-2 border-t text-gray-700">
                        {user.phone}
                      </td>
                      <td className="p-2 border-t text-center text-gray-700">
                        {user.active ? "Sí" : "No"}
                      </td>
                      <td className="p-2 border-t text-center">
                        <button
                          onClick={() =>
                            toggleUserStatus(user.id, !user.active)
                          }
                          className={`${
                            user.active
                              ? "bg-custom-orange hover:bg-orange-400"
                              : "bg-valkyrie-purple hover:bg-creativity-purple"
                          } text-white py-1 px-3 rounded-md`}
                        >
                          {user.active ? "Desactivar" : "Activar"}
                        </button>
                      </td>
                      <td className="p-2 border-t text-center text-gray-700">
                        {user.isAdmin ? "Sí" : "No"}
                      </td>
                      <td className="p-2 border-t space-y-2 text-center">
                        <button
                          onClick={() =>
                            handleToggleAdmin(user.id, !user.isAdmin)
                          }
                          className={`${
                            user.isAdmin
                              ? "bg-custom-orange hover:bg-orange-400"
                              : "bg-valkyrie-purple hover:bg-creativity-purple"
                          } text-white py-1 px-3 rounded-md`}
                        >
                          {user.isAdmin ? "Desactivar" : "Activar"}
                        </button>
                      </td>
                      <td className="p-2 border-t text-center">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-valkyrie-purple text-white py-1 px-3 rounded-md hover:bg-creativity-purple"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "reports":
        return <Reports />;

      default:
        return <div>Selecciona una opción</div>;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <header className="bg-valkyrie-purple p-4 text-white">
        <nav>
          <ul className="flex justify-around">
            <li
              onClick={() => setActiveTab("dashboard")}
              className={`cursor-pointer ${
                activeTab === "dashboard" ? "border-b-2 border-white" : ""
              }`}
            >
              <FaHome size={24} className="inline-block mr-2 mb-2" />
              Dashboard
            </li>
            <li
              onClick={() => setActiveTab("users")}
              className={`cursor-pointer ${
                activeTab === "users" ? "border-b-2 border-whitek" : ""
              }`}
            >
              <FaUsers size={24} className="inline-block mr-2 mb-2" />
              Usuarios
            </li>
            <li
              onClick={() => setActiveTab("reports")}
              className={`cursor-pointer ${
                activeTab === "reports" ? "border-b-2 border-white" : ""
              }`}
            >
              <FaChartBar size={24} className="inline-block mr-2 mb-2" />
              Reportes
            </li>
          </ul>
        </nav>
      </header>
      <main className="p-6 bg-white flex-grow">
        {renderContent()}
        <ToastContainer />
      </main>
    </div>
  );
}

export default Admin;
