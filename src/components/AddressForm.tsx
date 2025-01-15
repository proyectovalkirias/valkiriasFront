"use client";

import React, { useState } from "react";
import axios from "axios";
import Map from "./Map";
import toast from "react-hot-toast";

const AddressForm = ({
  userId,
  onSaveSuccess,
}: {
  userId: string;
  onSaveSuccess: () => void;
}) => {
  const [address, setAddress] = useState({
    street: "",
    number: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCoordinates = async () => {
    try {
      setError("");
      const { street, number, city, state, postalCode } = address;

      if (!street || !number || !city || !state || !postalCode) {
        setError("Por favor, completa todos los campos de la dirección.");
        return;
      }

      const query = `?street=${encodeURIComponent(
        street
      )}&number=${encodeURIComponent(number)}&city=${encodeURIComponent(
        city
      )}&state=${encodeURIComponent(state)}&postalCode=${encodeURIComponent(
        postalCode
      )}`;

      const response = await axios.get(
        `https://valkiriasback.onrender.com/geocoding${query}`
      );

      if (response.data) {
        setCoordinates(response.data);
      } else {
        throw new Error("Coordenadas no encontradas.");
      }
    } catch (error) {
      setError(
        "Error al obtener las coordenadas. Por favor, verifica los datos ingresados."
      );
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const saveAddress = async () => {
    if (!coordinates) {
      setError("Primero debes verificar la ubicación.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        addresses: [
          {
            street: address.street,
            number: address.number,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          },
        ],
      };
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
        `https://valkiriasback.onrender.com/users/${userId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Dirección guardada exitosamente.");
      onSaveSuccess();
      console.log("Dirección guardada: ", response.data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al guardar la dirección.";
      setError(errorMessage);
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full flex flex-col mx-auto p-6 rounded-lg max-w-4xl md:max-w-3xl sm:max-w-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Agregar Dirección
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchCoordinates();
        }}
        className="space-y-4 w-full"
      >
        <div>
          <input
            name="street"
            placeholder="Calle"
            value={address.street}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-gray-800 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <input
            name="number"
            placeholder="Número"
            value={address.number}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-gray-800 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <input
            name="city"
            placeholder="Ciudad"
            value={address.city}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-gray-800 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <input
            name="state"
            placeholder="Provincia"
            value={address.state}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-gray-800 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <input
            name="postalCode"
            placeholder="Código Postal"
            value={address.postalCode}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring-blue-500 text-gray-800 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-valkyrie-purple w-full text-white py-2 px-4 rounded-lg hover:bg-creativity-purple transition-colors duration-200"
        >
          Obtener Ubicación
        </button>
      </form>
      {coordinates && (
        <div className="mt-6">
          <Map
            latitude={coordinates.latitude}
            longitude={coordinates.longitude}
          />
          <button
            onClick={saveAddress}
            disabled={saving}
            className={`w-full mt-4 py-2 px-4 rounded-md transition ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-custom-orange hover:bg-orange-500"
            } text-white`}
          >
            {saving ? "Guardando..." : "Guardar Dirección"}
          </button>
        </div>
      )}
      {error && (
        <p className="mt-4 text-red-500 text-sm font-medium text-center">
          {error}
        </p>
      )}
    </div>
  );
};

export default AddressForm;
