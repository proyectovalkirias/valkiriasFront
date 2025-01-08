"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast"; // Importar toast
import Swal from "sweetalert2";

const AddressesGoogle: React.FC = () => {
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
  });

  const [originalData, setOriginalData] = useState({
    address: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState({
    address: "",
    city: "",
    state: "",
  });

  const [isMounted, setIsMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Cargar los datos del localStorage si existen
    const storedGoogleData = localStorage.getItem("google_address");
    if (storedGoogleData) {
      const googleData = JSON.parse(storedGoogleData);
      setFormData({
        address: googleData.address || "",
        city: googleData.city || "",
        state: googleData.state || "",
      });
      setOriginalData({
        address: googleData.address || "",
        city: googleData.city || "",
        state: googleData.state || "",
      });
    }
  }, [isMounted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSaveAddress = () => {
    const newErrors = {
      address: formData.address.trim() === "" ? "El campo Dirección es obligatorio" : "",
      city: formData.city.trim() === "" ? "El campo Ciudad es obligatorio" : "",
      state: formData.state.trim() === "" ? "El campo Provincia es obligatorio" : "",
    };
  
    // Filtrar los errores que no están vacíos
    const errorsArray = Object.values(newErrors).filter((error) => error !== "");
  
    // Mostrar notificaciones de Toast en lugar de errores en rojo
    if (errorsArray.length > 1) {
      toast.error("Todos los campos son obligatorios.");
    } else if (errorsArray.length === 1) {
      toast.error(errorsArray[0]);
    } else {
      try {
        localStorage.setItem("google_address", JSON.stringify(formData));
        toast.success("¡Dirección registrada correctamente!");
        setOriginalData(formData); // Guardar los datos actuales como los originales
        setShowForm(false); // Cerrar el formulario de edición
      } catch (error) {
        console.error("Error al guardar los datos:", error);
        toast.error("Hubo un problema al guardar los datos. Intenta nuevamente.");
      }
    }
  };
  
  
  

  const handleEditAddress = () => {
    setShowForm(true); // Abrir el formulario de edición
  };

  const handleCancel = () => {
    setFormData(originalData); // Volver a los datos originales
    setShowForm(false); // Cerrar el formulario de edición
  };



  const handleDeleteAddress = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminarla",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData({
          address: "",
          city: "",
          state: "",
        });
        setOriginalData({
          address: "",
          city: "",
          state: "",
        });
        localStorage.removeItem("google_address");
        toast.success("¡Dirección eliminada correctamente!"); // Mensaje de éxito
      }
    });
  };
  

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center bg-[#7b548b] min-h-screen p-6 space-y-6 md:space-y-0 md:space-x-6">
      {/* Contenedor de la imagen */}
      <div className="w-full md:w-1/3 flex justify-center">
        <Image
          src="/images/Mundito.png"
          alt="Imagen ajustes"
          className="w-full h-auto max-w-[200px] sm:max-w-[250px] md:max-w-[300px]"
          width={150}
          height={150}
        />
      </div>

      {/* Contenedor del contenido */}
      <div className="flex flex-col items-center md:items-start w-full md:w-2/3">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center md:text-left">
          Mis Direcciones
        </h2>

        {/* Mostrar la dirección si existe, si no, mostrar "Sin direcciones" */}
        {formData.address ? (
          <div className="w-full max-w-lg bg-purple-200 text-purple-900 rounded-lg p-4 shadow-md mb-6 relative">
            <button
              onClick={handleDeleteAddress}
              className="absolute top-2 right-2 bg-red-500 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
              aria-label="Eliminar dirección"
            >
              ✕
            </button>
            <p className="font-bold">{formData.address}</p>
            <p>{`${formData.state}, ${formData.city}`}</p>
          </div>
        ) : (
          <div className="w-full max-w-lg bg-purple-100 text-purple-900 rounded-lg p-4 shadow-md mb-6 text-center">
            <p className="font-bold">Sin direcciones</p>
          </div>
        )}

        {/* Botón para editar dirección */}
        <button
          onClick={handleEditAddress}
          className="w-full max-w-lg bg-purple-300 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-400"
        >
          Editar Dirección
        </button>

        {/* Formulario para editar la dirección */}
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
                onClick={handleCancel}
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
    </div>
  );
};

export default AddressesGoogle;
