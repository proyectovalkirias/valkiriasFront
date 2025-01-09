"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/dist/client/link";
import { toast } from "react-hot-toast"; // Importa el hook de react-hot-toast

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.dismiss(); // Descartar cualquier notificación pendiente

    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await fetch("https://valkiriasback.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Error al iniciar sesión.");
        return;
      }

      const data = await response.json();
      toast.success("Inicio de sesión exitoso.");
      console.log("Datos del usuario:", data);

      // Guardar datos del usuario en el localStorage
      localStorage.setItem("user", JSON.stringify({ id: data.id, ...data }));

      window.location.href = "/"; // Redirige al dashboard en el cliente
    } catch (err) {
      toast.error("Hubo un problema al conectar con el servidor.");
      console.error(err);
    }
  };

  const handleGoogleLogin2 = () => {
    const clientID =
      "634423829747-32kn123g67grqggkm2v14f6agaiiu6hp.apps.googleusercontent.com";
    const redirectURI = "https://valkiriasfront.onrender.com/loginGoogle";
    const scope = "openid profile email";
    const responseType = "code";

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${clientID}` +
  `&redirect_uri=${encodeURIComponent(redirectURI)}` +
  `&response_type=${responseType}` +
  `&scope=${encodeURIComponent(scope)}`;

    window.location.href = googleAuthUrl;
  };

  const handleForgotPassword = async () => {
    toast.dismiss(); // Descartar cualquier notificación pendiente

    if (!formData.email) {
      toast.error("Por favor, ingresa tu correo electrónico.");
      return;
    }

    try {
      const response = await fetch(
        `https://valkiriasback.onrender.com/auth/${encodeURIComponent(formData.email)}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Error al recuperar la contraseña.");
        return;
      }

      toast.success("Se envió un enlace de recuperación a tu correo.");
    } catch (err) {
      toast.error("Hubo un problema al conectar con el servidor.");
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#7b548b] p-4">
      <div className="flex w-full max-w-4xl rounded-lg bg-[#7b548b] flex-col sm:flex-row">
        <div className="w-full sm:w-1/2 p-8 flex flex-col items-center justify-center text-center text-white">
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

        <div className="w-full sm:w-1/2 p-8 bg-[#7b548b] flex flex-col justify-center">
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
            onClick={handleGoogleLogin2}
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
