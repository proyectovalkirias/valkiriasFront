"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

interface UserData {
  id?: string;
  address: string;
  city: string;
  state: string;
  type: "local" | "google";
}

const AddressesLocal = () => {
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
      const storedGoogleUser = localStorage.getItem("user_info");

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

  // Maneja la eliminación de la dirección
  const handleDeleteAddress = async () => {
    const user = getUserData();
    if (user?.type === "local" && user.id) {
      try {
        // Eliminar la dirección de la base de datos
        await axios.put(`http://localhost:3000/users/${user.id}`, {
          address: "", city: "", state: ""
        });

        // Actualiza el localStorage con los datos de dirección eliminados
        if (user?.type === "local") {
          const updatedUser = { ...user, address: "", city: "", state: "" };
          localStorage.setItem("user", JSON.stringify({ user: updatedUser }));
        } else if (user?.type === "google") {
          const updatedGoogleUser = { ...user, address: "", city: "", state: "" };
          localStorage.setItem("user_info", JSON.stringify(updatedGoogleUser));
        }

        // Actualiza el estado con la nueva dirección vacía
        setAddressData({
          ...addressData!,
          address: "",
          city: "",
          state: "",
        });
      } catch (error) {
        console.error("Error deleting address:", error);
      }
    }
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

      if (user?.type === "local") {
        const updatedUser = {
          ...user,
          address: formData.address,
          city: formData.city,
          state: formData.state,
        };

        try {
          // Guardar dirección en la base de datos
          await axios.put(`http://localhost:3000/users/${user.id}`, {
            address: formData.address,
            city: formData.city,
            state: formData.state,
          });

          // Guardar en el localStorage
          localStorage.setItem("user", JSON.stringify({ user: updatedUser }));
          setAddressData(updatedUser);
          setShowForm(false);
        } catch (error) {
          console.error("Error al guardar dirección:", error);
        }
      } else if (user?.type === "google") {
        const updatedGoogleUser = {
          ...user,
          address: formData.address,
          city: formData.city,
          state: formData.state,
        };

        try {
          // Guardar dirección en el localStorage para usuarios de Google
          localStorage.setItem("user_info", JSON.stringify(updatedGoogleUser));
          setAddressData(updatedGoogleUser);
          setShowForm(false);
        } catch (error) {
          console.error("Error al guardar dirección para Google:", error);
        }
      }
    }
  };

  useEffect(() => {
    const user = getUserData();
    if (user) {
      setAddressData(user);
      setFormData({
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
      });
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center bg-[#7b548b] min-h-screen p-6 space-y-6 md:space-y-0 md:space-x-6">
      <div className="w-full md:w-1/3 flex justify-center">
        <Image
          src="/images/Mundito.png"
          alt="Imagen ajustes"
          className="w-full h-auto max-w-[200px] sm:max-w-[250px] md:max-w-[300px]"
          width={150}
          height={150}
        />
      </div>

      <div className="flex flex-col items-center md:items-start w-full md:w-2/3">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center md:text-left">
          Mis Direcciones
        </h2>

        {addressData && addressData.address ? (
          <div className="w-full max-w-lg bg-purple-200 text-purple-900 rounded-lg p-4 shadow-md mb-6 relative">
            <div className="relative">
              <p className="font-bold">{addressData.address}</p>
              <p>{`${addressData.city}, ${addressData.state}`}</p>

              {/* Botón de eliminación */}
              <button
                onClick={handleDeleteAddress} 
                className="absolute top-0 right-0 text-red-500 hover:text-red-700 font-bold"
                aria-label="Eliminar dirección"
              >
                X
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-lg bg-purple-100 text-purple-900 rounded-lg p-4 shadow-md mb-6 text-center">
            <p className="font-bold">Sin direcciones</p>
          </div>
        )}

        <button
          onClick={() => setShowForm(true)}
          className="w-full max-w-lg bg-purple-300 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-400"
        >
          Editar Dirección
        </button>

        {showForm && (
          <div className="w-full max-w-lg bg-purple-100 p-6 rounded-lg mt-6 shadow-md">
            <h3 className="text-lg font-bold text-purple-900 mb-4">Editar Dirección</h3>
            <div className="space-y-4">
              <input
                type="text"
                name="address"
                placeholder="Dirección"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border-b-2 border-purple-500 bg-transparent outline-none text-purple-900"
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
              <input
                type="text"
                name="state"
                placeholder="Provincia"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full p-2 border-b-2 border-purple-500 bg-transparent outline-none text-purple-900"
              />
              {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
              <input
                type="text"
                name="city"
                placeholder="Ciudad"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full p-2 border-b-2 border-purple-500 bg-transparent outline-none text-purple-900"
              />
              {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
            </div>
            <button
              onClick={handleSaveAddress}
              className="w-full mt-4 bg-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600"
            >
              Guardar Dirección
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressesLocal;
