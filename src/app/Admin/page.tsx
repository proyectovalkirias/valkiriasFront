"use client";
import React, { useState, useEffect } from "react";
import { FaUsers, FaChartBar, FaHome, FaInbox } from "react-icons/fa";
import axios from "axios";
import Link from "next/link";
import { User } from "@/interfaces/User";
import { toast } from "react-toastify";
import Reports from "@/components/Reports";
import { useRouter } from "next/navigation";
import { Product } from "@/interfaces/Product";

const Admin = () => {
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
  const fetchProducts = async () => {
    try {
      const response = await fetch(`https://valkiriasback.onrender.com/products`);
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

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `https://valkiriasback.onrender.com/users`
      );
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch {
      {
        toast.error("Error al obtener los usuarios");
      }
    }
  };

  const toggleUserStatus = async (id: number, activate: boolean) => {
    try {
      const url = activate
        ? `https://valkiriasback.onrender.com/users/${id}/activate`
        : `https://valkiriasback.onrender.com/users/${id}/deactivate`;
      await axios.put(url);
      fetchUsers();
      {
        toast.success(
          activate
            ? "Usuario activado con éxito"
            : "Usuario desactivado con éxito"
        );
      }
    } catch {
      {
        toast.error("Error al actualizar el estado del usuario");
      }
    }
  };
  const handleDelete = async (productId: string) => {
    if (!productId) {
      toast.error("Por favor, selecciona un producto válido.");
      return;
    }

    try {
      const response = await fetch(
        `https://valkiriasback.onrender.com/products/delete/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }

      toast.success("El producto ha sido eliminado exitosamente.");
      setProducts(products.filter((product) => product.id !== productId));
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
          <div className="bg-white min-h-screen p-6">
            <div>
              <Link href="/CreateProduct" aria-label="Crear Productos">
                <button className="text-xl bg-valkyrie-purple text-white py-2 px-4 ml-6 mt-6 rounded-lg hover:bg-creativity-purple">
                  Crear Productos
                </button>
              </Link>
            </div>
            <div className="p-6 min-h-screen w-full">
              <h1 className="text-2xl font-bold mb-6 text-gray-800">
                Lista de Productos
              </h1>
              <input
                type="text"
                placeholder="Buscar por nombre o ID"
                className="mb-4 p-2 border border-gray-300 text-gray-800 rounded w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 text-gray-800">
                      ID
                    </th>
                    <th className="border border-gray-300 p-2 text-gray-800">
                      Nombre
                    </th>
                    <th className="border border-gray-300 p-2 text-gray-800">
                      Precio
                    </th>
                    <th className="border border-gray-300 p-2 text-gray-800">
                      Stock
                    </th>
                    <th className="border border-gray-300 p-2 text-gray-800">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 p-2 text-gray-800">
                        {product.id}
                      </td>
                      <td className="border border-gray-300 p-2 text-gray-800">
                        {product.name}
                      </td>
                      <td className="border border-gray-300 p-2 text-gray-800">
                        {product.prices[0]?.price}
                      </td>
                      <td className="border border-gray-300 p-2 text-gray-800">
                        {product.stock}
                      </td>
                      <td className="border border-gray-300 p-2">
                        <button
                          onClick={() => handleEdit(product.id)}
                          className="bg-custom-orange text-white py-1 px-2 mr-2 rounded-lg hover:bg-orange-400"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-valkyrie-purple text-white py-1 px-2 mr-2 rounded-lg  hover:bg-creativity-purple"
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
          <div className="bg-white min-h-screen p-6">
            <h1 className="text-3xl font-bold text-black mb-6 text-center">
              Administrar Usuarios
            </h1>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Buscar por ID o Email"
                className="p-3 border border-gray-300 rounded-lg w-full text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-left text-black">
                      ID
                    </th>
                    <th className="border border-gray-300 p-3 text-left text-black">
                      Nombre
                    </th>
                    <th className="border border-gray-300 p-3 text-left text-black">
                      Email
                    </th>
                    <th className="border border-gray-300 p-3 text-left text-black">
                      Dirección
                    </th>
                    <th className="border border-gray-300 p-3 text-left text-black">
                      Teléfono
                    </th>
                    <th className="border border-gray-300 p-3 text-left text-black">
                      Acciones
                    </th>
                    <th className="border border-gray-300 p-3 text-left text-black">
                      Estado
                    </th>
                    <th className="border border-gray-300 p-3 text-left text-black">
                      Admin?
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition duration-200"
                    >
                      <td className="border border-gray-300 p-3 text-black">
                        {user.id}
                      </td>
                      <td className="border border-gray-300 p-3 text-black">
                        {user.firstname} {user.lastname}
                      </td>
                      <td className="border border-gray-300 p-3 text-black">
                        {user.email}
                      </td>
                      <td className="border border-gray-300 p-3 text-black">
                        {user.address}
                      </td>
                      <td className="border border-gray-300 p-3 text-black">
                        {user.phone}
                      </td>
                      <td className="border border-gray-300 p-3 text-black flex flex-col gap-2">
                        <button
                          className="bg-custom-orange text-white py-1 px-2 mr-2 rounded-full hover:bg-orange-400"
                          onClick={() => toggleUserStatus(user.id, true)}
                        >
                          Activar
                        </button>
                        <button
                          className="bg-valkyrie-purple text-white py-1 px-2 mr-2 rounded-full hover:bg-creativity-purple"
                          onClick={() => toggleUserStatus(user.id, false)}
                        >
                          Desactivar
                        </button>
                      </td>
                      <td className="border border-gray-300 p-3 text-black">
                        <span
                          className={`px-2 py-1 rounded-full text-black text-sm ${
                            user.active ? "bg-gray-200" : "bg-gray-200"
                          }`}
                        >
                          {user.active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-3 text-black">
                        {user.isAdmin ? "Sí" : "No"}
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
        return <p>Seleccione una pestaña para ver el contenido.</p>;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-valkyrie-purple text-white flex justify-between items-center p-4 border-b-2 border-white">
        <div className="text-xl font-bold">Panel de Administración</div>
        <nav className="flex space-x-4">
          <button
            className={`p-2 flex items-center cursor-pointer ${
              activeTab === "dashboard" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <FaHome className="mr-2" />
            Administración
          </button>
          <button
            className={`p-2 flex items-center cursor-pointer ${
              activeTab === "users" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            <FaUsers className="mr-2" />
            Usuarios
          </button>
          <button
            className={`flex items-center cursor-pointer ${
              activeTab === "reports" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => setActiveTab("reports")}
          >
            <FaChartBar className="mr-2" />
            Reportes
          </button>
          <button
            className={`flex items-center cursor-pointer ${
              activeTab === "inbox" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => setActiveTab("inbox")}
          >
            <FaInbox className="mr-2" />
            Mensajes
          </button>
        </nav>
      </header>
      <main className="flex-1 bg-[#7b548b]">{renderContent()}</main>
    </div>
  );
};

export default Admin;