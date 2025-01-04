"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface UserData {
  id?: string;
  address: string;
  city: string;
  state: string;
  type: "local" | "google";
}

const Addresses = () => {
  const [addressData, setAddressData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
  });
  const [errors, setErrors] = useState({
    address: "",
    city: "",
    state: "",
  });
  const [showForm, setShowForm] = useState(false);

  // Verifica el tipo de usuario (local o Google) y obtiene datos
  const getUserData = (): UserData | null => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedGoogleUser = localStorage.getItem("user-info");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        return {
          id: parsedUser.user.id,
          address: parsedUser.user.address || "",
          city: parsedUser.user.city || "",
          state: parsedUser.user.state || "",
          type: "local",
        };
      } else if (storedGoogleUser) {
        const googleUser = JSON.parse(storedGoogleUser);
        return {
          address: googleUser.address || "",
          city: googleUser.city || "",
          state: googleUser.state || "",
          type: "google",
        };
      }
      return null;
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      return null;
    }
  };

  // Obtén los datos de dirección de la API para el usuario local
  const fetchUserAddress = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      setAddressData(response.data);
      setFormData({
        address: response.data.address || "",
        city: response.data.city || "",
        state: response.data.state || "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Maneja la edición de la dirección
  const handleEditAddress = () => {
    setShowForm(true);
  };

  // Maneja los cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Valida los campos del formulario
  const validateForm = () => {
    let formErrors = { ...errors };
    let isValid = true;

    if (!formData.address) {
      formErrors.address = "La dirección es obligatoria.";
      isValid = false;
    } else {
      formErrors.address = "";
    }

    if (!formData.state) {
      formErrors.state = "La provincia es obligatoria.";
      isValid = false;
    } else {
      formErrors.state = "";
    }

    if (!formData.city) {
      formErrors.city = "La ciudad es obligatoria.";
      isValid = false;
    } else {
      formErrors.city = "";
    }

    setErrors(formErrors);
    return isValid;
  };

  // Maneja la acción de guardar la dirección
  const handleSaveAddress = async () => {
    if (validateForm()) {
      const user = getUserData();
      if (user?.type === "local" && user.id) {
        try {
          const response = await axios.put(
            `http://localhost:3000/users/${user.id}`,
            {
              address: formData.address,
              city: formData.city,
              state: formData.state,
            }
          );

          const updatedUser = {
            ...user,
            address: formData.address,
            city: formData.city,
            state: formData.state,
          };
          localStorage.setItem("user", JSON.stringify({ user: updatedUser }));
          setAddressData(updatedUser);
          setShowForm(false);
        } catch (error) {
          console.error("Error updating address:", error);
        }
      } else if (user?.type === "google") {
        const updatedGoogleUser = {
          ...user,
          address: formData.address,
          city: formData.city,
          state: formData.state,
        };
        localStorage.setItem("user-info", JSON.stringify(updatedGoogleUser));
        setAddressData(updatedGoogleUser);
        setShowForm(false);
      }
    }
  };

  // Cargar la información al inicio
  useEffect(() => {
    const user = getUserData();
    if (user?.type === "local" && user.id) {
      fetchUserAddress(user.id);
    } else if (user?.type === "google") {
      setFormData({
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
      });
      setAddressData(user);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-[#7b548b] min-h-screen p-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
        Mis Direcciones
      </h2>

      {addressData && (
        <div className="w-full max-w-lg bg-purple-200 text-purple-900 rounded-lg p-4 shadow-md mb-6">
          <p className="font-bold">{addressData.address}</p>
          <p>{`${addressData.city}, ${addressData.state}`}</p>
        </div>
      )}

      <button
        onClick={handleEditAddress}
        className="w-full max-w-lg bg-purple-300 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-400"
      >
        Editar Dirección
      </button>

      {showForm && (
        <div className="w-full max-w-lg bg-purple-100 p-6 rounded-lg mt-6 shadow-md">
          <h3 className="text-lg font-bold text-purple-900 mb-4">
            Editar Dirección
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
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
            <input
              type="text"
              name="state"
              placeholder="Provincia"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full p-2 border-b-2 border-purple-500 bg-transparent outline-none text-purple-900"
            />
            {errors.state && (
              <p className="text-red-500 text-sm">{errors.state}</p>
            )}
            <input
              type="text"
              name="city"
              placeholder="Ciudad"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-2 border-b-2 border-purple-500 bg-transparent outline-none text-purple-900"
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city}</p>
            )}
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

export default Addresses;
