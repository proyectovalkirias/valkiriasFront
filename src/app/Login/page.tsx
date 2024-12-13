"use client"; // Esto asegura que el componente se ejecute en el cliente

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/dist/client/link";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    const { email, password } = formData;

    if (!email || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Error al iniciar sesión.");
        return;
      }

      const data = await response.json();
      setSuccess("Inicio de sesión exitoso.");
      console.log("Datos del usuario:", data);

      // Guardar datos del usuario en el localStorage
      localStorage.setItem("user", JSON.stringify({ id: data.id, ...data }));

      // Redirigir al Dashboard sin usar useRouter
      window.location.href = "/Dashboard"; // Redirige al dashboard en el cliente
    } catch (err) {
      setError("Hubo un problema al conectar con el servidor.");
      console.error(err);
    }
  };

  const handleGoogleLogin = () => {
    const clientID =
      "634423829747-32kn123g67grqggkm2v14f6agaiiu6hp.apps.googleusercontent.com";
    const redirectURI = "http://localhost:3000/google/redirect";
    const scope = "openid profile email";
    const responseType = "code";

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=${responseType}&scope=${scope}`;
  };

  const handleForgotPassword = async () => {
    setError(null);
    setSuccess(null);

    if (!formData.email) {
      setError("Por favor, ingresa tu correo electrónico.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/auth/${encodeURIComponent(formData.email)}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Error al recuperar la contraseña.");
        return;
      }

      setSuccess("Se envió un enlace de recuperación a tu correo.");
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
          <h2 className="text-2xl font-bold">¡Bienvenido de nuevo!</h2>
          <p className="mt-4">
            Inicia sesión para continuar creando prendas únicas con Valkirias.
          </p>
        </div>

        <div className="w-1/2 p-8 bg-[#7b548b] flex flex-col justify-center">
          <h2 className="mb-6 text-3xl font-bold text-white text-center">
            Iniciar Sesión
          </h2>
          <form className="flex flex-col" onSubmit={handleSubmit}>
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
              className="mb-6 border-b-2 border-white bg-transparent p-2 text-white outline-none"
            />
            <button
              type="submit"
              className="mb-4 rounded-md bg-purple-300 px-4 py-2 text-white hover:bg-purple-400"
            >
              Iniciar Sesión
            </button>
          </form>

          <button
            onClick={handleGoogleLogin}
            className="mb-4 rounded-md bg-white px-4 py-2 w-full"
          >
            <div className="flex items-center justify-center space-x-2">
              <Image
                src="/images/Googlelogo.jpg"
                alt="Google Logo"
                width={24}
                height={24}
              />
              <span className="text-black">Iniciar sesión con Google</span>
            </div>
          </button>

          <button
            onClick={handleForgotPassword}
            className="mt-4 text-sm text-white hover:underline"
          >
            ¿Olvidaste la contraseña?
          </button>

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          {success && <p className="mt-4 text-sm text-green-500">{success}</p>}

          <p className="mt-4 text-sm text-white">
            ¿No tienes cuenta?{" "}
            <Link
              href="/Register"
              className="font-medium text-purple-300 hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
