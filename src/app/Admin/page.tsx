"use client"
import React, { useState } from "react";
import { FaUsers, FaChartBar, FaHome } from "react-icons/fa";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="text-black">
            <h1 className="text-2xl font-bold">Welcome to the Admin Dashboard</h1>
            <p className="mt-4">Here is an overview of the system metrics...</p>
          </div>
        );
      case "users":
        return (
          <div>
            <h1 className="text-2xl font-bold text-black">Manage Users</h1>
            <table className="mt-4 w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 text-black">ID</th>
                  <th className="border border-gray-300 p-2 text-black">Name</th>
                  <th className="border border-gray-300 p-2 text-black">Email</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 text-black">1</td>
                  <td className="border border-gray-300 p-2 text-black">John Doe</td>
                  <td className="border border-gray-300 p-2 text-black">john@example.com</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-black">2</td>
                  <td className="border border-gray-300 p-2 text-black">Jane Smith</td>
                  <td className="border border-gray-300 p-2 text-black">jane@example.com</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case "reports":
        return (
          <div>
            <h1 className="text-2xl font-bold text-black">Reports</h1>
            <p className="mt-4 text-black">Here you can view reports...</p>
          </div>
        );
      default:
        return <p>Select a tab to view content.</p>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4 text-xl font-bold">Admin Dashboard</div>
        <nav>
          <ul>
            <li
              className={`p-4 hover:bg-gray-700 flex items-center cursor-pointer ${
                activeTab === "dashboard" ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <FaHome className="mr-2" />
              Dashboard
            </li>
            <li
              className={`p-4 hover:bg-gray-700 flex items-center cursor-pointer ${
                activeTab === "users" ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveTab("users")}
            >
              <FaUsers className="mr-2" />
              Users
            </li>
            <li
              className={`p-4 hover:bg-gray-700 flex items-center cursor-pointer ${
                activeTab === "reports" ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveTab("reports")}
            >
              <FaChartBar className="mr-2" />
              Reports
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8">{renderContent()}</main>
    </div>
  );
};

export default Admin;
