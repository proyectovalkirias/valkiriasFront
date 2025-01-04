"use client";

import React, { useState } from "react";

interface Address {
  id: number;
  address: string;
  province: string;
  city: string;
}

const GoogleAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    province: "",
    city: "",
  });
  const [userId, setUserId] = useState<string | null>(
    // Hardcodear un usuario local o de Google
    localStorage.getItem("user_info") ? "google_user_id" : "local_user_id"
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddAddress = () => {
    setShowForm(true);
    setFormData({ address: "", province: "", city: "" });
  };

  const handleSaveAddress = () => {
    if (formData.address && formData.province && formData.city) {
      // Agregar la nueva dirección a la lista
      setAddresses([
        ...addresses,
        { id: Date.now(), ...formData },
      ]);
      setShowForm(false);
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter((address) => address.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#7b548b] min-h-screen p-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
        Mis Direcciones
      </h2>

      {/* Lista de direcciones */}
      <div className="w-full max-w-lg space-y-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="flex items-center justify-between bg-purple-200 text-purple-900 rounded-lg p-4 shadow-md"
          >
            <div>
              <p className="font-bold">{address.address}</p>
              <p>{`${address.city}, ${address.province}`}</p>
            </div>
            <button
              onClick={() => handleDeleteAddress(address.id)}
              className="text-red-600 hover:text-red-800"
            >
              Eliminar
            </button>
          </div>
        ))}

        {/* Botón para agregar dirección */}
        <button
          onClick={handleAddAddress}
          className="w-full bg-purple-300 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-400"
        >
          Agregar Dirección
        </button>
      </div>

      {/* Formulario para agregar nueva dirección */}
      {showForm && (
        <div className="w-full max-w-lg bg-purple-100 p-6 rounded-lg mt-6 shadow-md">
          <h3 className="text-lg font-bold text-purple-900 mb-4">
            Nueva Dirección
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              name="address"
              placeholder="Dirección"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 border-b-2 border-purple-500 bg-transparent outline-none text-purple-900"
            />
            <input
              type="text"
              name="province"
              placeholder="Provincia"
              value={formData.province}
              onChange={handleInputChange}
              className="w-full p-2 border-b-2 border-purple-500 bg-transparent outline-none text-purple-900"
            />
            <input
              type="text"
              name="city"
              placeholder="Ciudad"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-2 border-b-2 border-purple-500 bg-transparent outline-none text-purple-900"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveAddress}
              className="bg-purple-300 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-400"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleAddresses;
