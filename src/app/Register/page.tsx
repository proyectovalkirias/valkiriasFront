"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    const { firstName, lastName, email, password, confirmPassword } = formData;
  
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios.");
      return;
    }
  
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: firstName, // Asegúrate de que los nombres de los campos coincidan con el backend
          lastname: lastName,
          email: email,
          password: password,
          confirmPassword: confirmPassword, // Agrega confirmPassword para enviar la confirmación de la contraseña
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Error al registrarse.");
        return;
      }
  
      setSuccess("Registro exitoso. ¡Ahora puedes iniciar sesión!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError("Hubo un problema al conectar con el servidor.");
      console.error(err);
    }
  };
  

  return (
    <div className="flex h-screen items-center justify-center bg-[#7b548b]">
      <div className="flex w-3/4 max-w-4xl rounded-lg bg-[#7b548b]">
        <div className="w-1/2 p-8 flex flex-col items-center justify-center text-center text-white">
          <Image
            src="/images/valkiriaslogo.jpg"
            alt="Valkirias Logo"
            width={150}
            height={150}
            className="mb-6"
          />
          <h2 className="text-2xl font-bold">¡Bienvenido!</h2>
          <p className="mt-4">
            Sé parte de Valkirias y crea prendas tan únicas como vos.
          </p>
        </div>

        <div className="w-1/2 p-8 bg-[#7b548b] flex flex-col justify-center">
          <h2 className="mb-6 text-3xl font-bold text-white text-center">
            Registro
          </h2>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <input
              type="text"
              name="firstName"
              placeholder="Nombre"
              value={formData.firstName}
              onChange={handleChange}
              className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Apellido"
              value={formData.lastName}
              onChange={handleChange}
              className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none"
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Repetir contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mb-6 border-b-2 border-white bg-transparent p-2 text-white outline-none"
            />

            <button
              type="submit"
              className="rounded-md bg-purple-300 px-4 py-2 text-white hover:bg-purple-400"
            >
              Registrarse
            </button>
          </form>
          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          {success && <p className="mt-4 text-sm text-green-500">{success}</p>}

          <p className="mt-4 text-sm text-white">
            ¿Ya tienes cuenta?{" "}
            <Link href="/Login" className="font-medium text-purple-300 hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
