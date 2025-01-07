"use client";
import React, { useState, useEffect } from "react";
import { FaUsers, FaChartBar, FaHome } from "react-icons/fa";
import axios from "axios";
import Link from "next/link";
import ProductList from "@/components/ProductList";
import { User } from "@/interfaces/User";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

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

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>("http://localhost:3000/users");
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const toggleUserStatus = async (id: number, activate: boolean) => {
    try {
      const url = activate
        ? `http://localhost:3000/users/${id}/activate`
        : `http://localhost:3000/users/${id}/deactivate`;
      await axios.put(url);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className=" bg-white min-h-screen p-6">
            {/* Enlace para crear productos */}
            <div className="w-full text-center">
              <Link href="/CreateProduct" aria-label="Crear Productos">
                <button className="text-3xl font-bold text-gray-800 hover:text-purple-200  transition">
                  Crear Productos
                </button>
              </Link>
            </div>

            {/* Lista de productos */}
            <div className="w-full mt-6">
              <ProductList />
            </div>
          </div>
        );
      case "users":
        return (
          <div className="bg-white min-h-screen p-6">
            {/* Título */}
            <h1 className="text-3xl font-bold text-black mb-6 text-center">
              Administrar Usuarios
            </h1>

            {/* Campo de búsqueda */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Buscar por ID o Email"
                className="p-3 border border-gray-300 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Tabla de usuarios */}
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
                      <td className="border border-gray-300 p-3 text-black flex space-x-2">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded-lg shadow hover:bg-green-600 transition"
                          onClick={() => toggleUserStatus(user.id, true)}
                        >
                          Activar
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition"
                          onClick={() => toggleUserStatus(user.id, false)}
                        >
                          Desactivar
                        </button>
                      </td>
                      <td className="border border-gray-300 p-3 text-black">
                        <span
                          className={`px-2 py-1 rounded-full text-white text-sm ${
                            user.active ? "bg-green-500" : "bg-red-500"
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
        return (
          <div className="bg-white min-h-screen p-6">
            <h1 className="text-3xl font-bold text-black text-center">
              Reportes
            </h1>
            <p className="mt-4 text-black">Estos son los reportes...</p>
          </div>
        );
      default:
        return <p>Seleccione una pestaña para ver el contenido.</p>;
    }
  };

  return (
    <div className="flex flex-col h-screen ">
      <header className="bg-purple-300 text-white flex justify-between items-center p-4 border-b-2 border-white ">
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
        </nav>
      </header>
      <main className="flex-1 bg-[#7b548b]">{renderContent()}</main>
    </div>
  );
};

export default Admin;
