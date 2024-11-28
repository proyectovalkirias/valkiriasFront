"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Validar el formulario
  const validateForm = (): boolean => {
    if (!username || !password) {
      setError("Usuario y contraseña son requeridos.");
      return false;
    }

    // Validación de formato del email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(username)) {
      setError("Por favor ingrese un correo electrónico válido.");
      return false;
    }

    // Validación de la contraseña (8-15 caracteres, al menos una mayúscula, una minúscula y un número)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,15}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "La contraseña debe tener entre 8 y 15 caracteres, incluyendo una mayúscula, una minúscula y un número."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:3000/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: username, password }),
        });

        if (!response.ok) {
          throw new Error("Usuario o contraseña incorrectos.");
        }

        const data = await response.json();
        const { token, user } = data;

        // Guardamos los datos en el localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Redirigimos a la página principal
        router.push("/");
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message || "Error en la autenticación.");
        }
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#7b548b]">
      <div className="flex w-3/4 max-w-4xl rounded-lg bg-[#7b548b]">
        {/* Sección de imagen y texto */}
        <div className="w-1/2 p-8 flex flex-col items-center justify-center text-center text-white">
          <Image
            src="/images/valkiriaslogo.jpg"
            alt="Valkirias Logo"
            width={150}
            height={150}
            className="mb-6"
          />
          <h2 className="text-2xl font-bold">¡Hola de nuevo!</h2>
          <p className="mt-4">
            ¿Tenés un diseño especial en mente? ¡Es el momento perfecto para
            hacer tu pedido!
          </p>
        </div>

        {/* Formulario de inicio de sesión */}
        <div className="w-1/2 p-8 bg-[#7b548b]">
          <h2 className="mb-6 text-3xl font-bold text-white">Iniciar sesión</h2>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <input
              id="username"
              type="email" // Cambié el tipo de campo a "email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingrese su correo electrónico"
              className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none"
            />
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"} // Agregar funcionalidad para mostrar/ocultar la contraseña
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                className="mb-6 border-b-2 border-white bg-transparent p-2 text-white outline-none"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <button
              type="submit"
              className="rounded-md bg-creativity-purple px-4 py-2 text-white"
            >
              Iniciar sesión
            </button>
          </form>

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

          <p className="mt-4 text-sm text-white">
            ¿No tenés cuenta?{" "}
            <Link
              href="/Register"
              className="font-medium text-purple-300 hover:underline"
            >
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
