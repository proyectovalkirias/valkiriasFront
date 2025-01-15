"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/dist/client/link";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";

const Login: React.FC = () => {
  const API_URL =
    process.env.REACT_APP_API_URL || "https://valkiriasback.onrender.com";

  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.dismiss();

    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("El correo electrónico no es válido.");
      return;
    }

    setLoading(true);

    try {
      const getToken = () => {
        const user = localStorage.getItem("user");

        if (!user) {
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

      const response = await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      toast.success("Inicio de sesión exitoso.");
      console.log("Datos del usuario:", data);

      localStorage.setItem("user", JSON.stringify({ id: data.id, ...data }));

      router.push("/");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data;
        if (err.response?.status === 400) {
          toast.error(errorData?.message || "Credenciales inválidas.");
        } else if (err.response?.status === 500) {
          console.log("Error en el servidor:", err);
          toast.error("Error en el servidor. Inténtalo más tarde.");
        } else {
          toast.error(errorData?.message || "Error al iniciar sesión.");
          console.error("Error inesperado:", err);
        }
      } else {
        toast.error("Hubo un problema al conectar con el servidor.");
        console.error("Error inesperado:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin2 = () => {
    const clientID =
      "634423829747-32kn123g67grqggkm2v14f6agaiiu6hp.apps.googleusercontent.com";
    const redirectURI =
      process.env.REACT_APP_GOOGLE_REDIRECT_URI ||
      `https://valkiriasfront.onrender.com/loginGoogle`;
    console.log(process.env.REACT_APP_GOOGLE_REDIRECT_URI);
    const scope = "openid profile email";
    const responseType = "code";

    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientID}` +
      `&redirect_uri=${encodeURIComponent(redirectURI)}` +
      `&response_type=${responseType}` +
      `&scope=${encodeURIComponent(scope)}`;

    window.location.href = googleAuthUrl;
  };

  const handleForgotPassword = async () => {
    toast.dismiss();

    if (!formData.email) {
      toast.error("Por favor, ingresa tu correo electrónico.");
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/auth/${encodeURIComponent(formData.email)}`
      );

      toast.success("Se envió un enlace de recuperación a tu correo.");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data;
        toast.error(errorData?.message || "Error al recuperar la contraseña.");
      } else {
        toast.error("Hubo un problema al conectar con el servidor.");
        console.error("Error inesperado:", err);
      }
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
            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-b-2 border-white bg-transparent p-2 text-white outline-none"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-3 text-white"
              >
                {showPassword ? (
                  <FaEye className="text-white" />
                ) : (
                  <FaEyeSlash className="text-white" />
                )}
              </button>
            </div>
            <button
              type="submit"
              className="mb-4 rounded-md bg-purple-300 px-4 py-2 text-white hover:bg-purple-400 flex items-center justify-center"
              disabled={loading}
            >
              {loading && <FaSpinner className="animate-spin mr-2" />}
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
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
