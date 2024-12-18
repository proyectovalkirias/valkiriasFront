"use client"
import React, { useState } from "react";

const AccountForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    nombre: "",
    apellido: "",
    residencia: "Argentina",
    tipoDocumento: "DNI",
    documento: "",
    genero: "Masculino",
    fechaNacimiento: { dia: "7", mes: "Mar", anio: "2002" },
    telefonoPrefijo: "",
    telefonoNumero: "",
    comunicaciones: {
      sodimacAr: false,
      sodimacCom: false,
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement; // Casting explícito
  
    const { name, value, type, checked } = target;
  
    // Verificar si es un checkbox
    if (type === "checkbox") {
      const key = name.split(".")[1]; // Acceder a propiedades anidadas de 'comunicaciones'
      setFormData({
        ...formData,
        comunicaciones: {
          ...formData.comunicaciones,
          [key]: checked,
        },
      });
    } else {
      // Para otros inputs
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto "
    >
      {/* Sección Datos de la Cuenta */}
      <h2 className="text-lg font-bold mb-2">Datos de la cuenta</h2>
      <div className="mb-4">
        <label className="block mb-1">E-mail:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Sección Datos Personales */}
      <h2 className="text-lg font-bold mb-2">Datos personales</h2>

      {/* Nombre */}
      <div className="mb-4 flex gap-4">
        <div className="flex-1">
          <label className="block mb-1">Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1">Apellido:</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* País de residencia */}
      <div className="mb-4">
        <label className="block mb-1">País de Residencia:</label>
        <input
          type="text"
          value={formData.residencia}
          readOnly
          className="w-full border rounded p-2 bg-gray-100"
        />
      </div>

      {/* Tipo y Número de Documento */}
      <div className="mb-4">
        <label className="block mb-1">Tipo de Documento:</label>
        <input
          type="text"
          name="tipoDocumento"
          value={formData.tipoDocumento}
          readOnly
          className="w-full border rounded p-2 bg-gray-100"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Nº de Documento:</label>
        <input
          type="text"
          name="documento"
          value={formData.documento}
          onChange={handleChange}
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Género */}
      <div className="mb-4">
        <label className="block mb-1">Género:</label>
        <div className="flex gap-4">
          <label>
            <input
              type="radio"
              name="genero"
              value="Masculino"
              checked={formData.genero === "Masculino"}
              onChange={handleChange}
              className="mr-2"
            />
            Masculino
          </label>
          <label>
            <input
              type="radio"
              name="genero"
              value="Femenino"
              checked={formData.genero === "Femenino"}
              onChange={handleChange}
              className="mr-2"
            />
            Femenino
          </label>
        </div>
      </div>

      {/* Fecha de Nacimiento */}
      <div className="mb-4 flex gap-2">
        <div>
          <label className="block mb-1">Día:</label>
          <select
            name="fechaNacimiento.dia"
            value={formData.fechaNacimiento.dia}
            onChange={handleChange}
            className="border rounded p-2"
          >
            <option value="7">7</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Mes:</label>
          <select
            name="fechaNacimiento.mes"
            value={formData.fechaNacimiento.mes}
            onChange={handleChange}
            className="border rounded p-2"
          >
            <option value="Mar">Mar</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Año:</label>
          <select
            name="fechaNacimiento.anio"
            value={formData.fechaNacimiento.anio}
            onChange={handleChange}
            className="border rounded p-2"
          >
            <option value="2002">2002</option>
          </select>
        </div>
      </div>

      {/* Teléfono */}
      <div className="mb-4 flex gap-4">
        <div>
          <label className="block mb-1">Código:</label>
          <input
            type="text"
            name="telefonoPrefijo"
            value={formData.telefonoPrefijo}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1">Número:</label>
          <input
            type="text"
            name="telefonoNumero"
            value={formData.telefonoNumero}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      {/* Comunicados */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Comunicados</h3>
        <label className="block">
          <input
            type="checkbox"
            name="comunicaciones.sodimacAr"
            checked={formData.comunicaciones.sodimacAr}
            onChange={handleChange}
            className="mr-2"
          />
          Quiero recibir novedades y oportunidades de Sodimac.ar
        </label>
        <label className="block">
          <input
            type="checkbox"
            name="comunicaciones.sodimacCom"
            checked={formData.comunicaciones.sodimacCom}
            onChange={handleChange}
            className="mr-2"
          />
          Quiero recibir oportunidades de Sodimac.com.ar
        </label>
      </div>

      {/* Botón Guardar */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};

export default AccountForm;
