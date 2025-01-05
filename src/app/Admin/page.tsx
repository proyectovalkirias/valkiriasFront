"use client";
import React, { useState, useEffect } from "react";
import { FaUsers, FaChartBar, FaHome } from "react-icons/fa";
import axios from "axios";
import Link from "next/link";
import ProductList from "@/components/ProductList";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  // Fetch users from the backend
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
      const response = await axios.get("http://localhost:3000/users");
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const toggleUserStatus = async (id: string, activate: boolean) => {
    try {
      const url = activate
        ? `http://localhost:3000/users/${id}/activate`
        : `http://localhost:3000/users/${id}/deactivate`;
      await axios.put(url);
      fetchUsers(); // Refresh the users list after the update
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="flex flex-col items-center  min-h-screen ">
            <Link
              href="/CreateProduct"
              className="mb-4 border-b-2 border-black  p-2 mt-4 w-full"
            >
              {" "}
              <button className="text-2xl font-bold mb-6 text-gray-800 ">
                Crear Productos
              </button>
            </Link>
            <ProductList />
          </div>
        );
      case "users":
        return (
          <div>
            <h1 className="text-2xl font-bold text-black">
              Administrar Usuarios
            </h1>
            <table className="mt-4 w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 text-black">ID</th>
                  <th className="border border-gray-300 p-2 text-black">
                    Nombre
                  </th>
                  <th className="border border-gray-300 p-2 text-black">
                    Email
                  </th>
                  <th className="border border-gray-300 p-2 text-black">
                    Direccion
                  </th>
                  <th className="border border-gray-300 p-2 text-black">
                    Telefono
                  </th>
                  <th className="border border-gray-300 p-2 text-black">
                    Acciones
                  </th>
                  <th className="border border-gray-300 p-2 text-black">
                    Estado
                  </th>
                  <th className="border border-gray-300 p-2 text-black">
                    Admin?
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="border border-gray-300 p-2 text-black ">
                      {user.id}
                    </td>
                    <td className="border border-gray-300 p-2 text-black">
                      {user.firstname} {user.lastname}
                    </td>
                    <td className="border border-gray-300 p-2 text-black">
                      {user.email}
                    </td>
                    <td className="border border-gray-300 p-2 text-black">
                      {user.address}
                    </td>
                    <td className="border border-gray-300 p-2 text-black">
                      {user.phone}
                    </td>
                    <td className="border border-gray-300  p-2 flex text-black">
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                        onClick={() => toggleUserStatus(user.id, true)}
                      >
                        Activar
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => toggleUserStatus(user.id, false)}
                      >
                        Desactivar
                      </button>
                    </td>
                    <td className="border border-gray-300 p-2 text-black">
                      {user.active ? "Active" : "Inactive"}
                    </td>
                    <td className="border border-gray-300 p-2 text-black">
                      {user.isAdmin ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Buscar por ID o Email"
                className="p-2 border border-gray-300 rounded w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        );
      case "reports":
        return (
          <div>
            <h1 className="text-2xl font-bold text-black">Reportes</h1>
            <p className="mt-4 text-black">Estos son los reportes...</p>
          </div>
        );
      default:
        return <p>Select a tab to view content.</p>;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Topbar */}
      <header className="bg-purple-dark text-white flex justify-between items-center p-4">
        <div className="text-xl font-bold">Panel de Administración</div>
        <nav className="flex space-x-4">
          <button
            className={`p-2  flex items-center cursor-pointer ${
              activeTab === "dashboard" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <FaHome className="mr-2" />
            Administracion
          </button>
          <button
            className={`p-2  flex items-center cursor-pointer ${
              activeTab === "users" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            <FaUsers className="mr-2" />
            Usuarios
          </button>
          <button
            className={`  flex items-center cursor-pointer ${
              activeTab === "reports" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => setActiveTab("reports")}
          >
            <FaChartBar className="mr-2" />
            Reportes
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 bg-[#7b548b]">{renderContent()}</main>
    </div>
  );
};

export default Admin;
