"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Importa useRouter
import { toast } from "react-toastify"; // Importa react-hot-toast
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importa los íconos
import axios from "axios";

const Register: React.FC = () => {
  const API_URL =
    process.env.REACT_APP_API_URL || "https://valkiriasback.onrender.com";
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false); // Estado para contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para confirmar contraseña
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const [showPasswordHint1, setShowPasswordHint1] = useState(false);
  const [passwordError, setPasswordError] = useState(""); // Estado para mensaje de error de contraseña

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,15}$/; // Al menos 1 minúscula, 1 mayúscula, 8-15 caracteres
    return passwordRegex.test(password);
  };
  // Suponiendo que usas toast para mostrar mensajes

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error("Todos los campos son obligatorios.", {});
      return;
    }

    if (!email.includes("@")) {
      toast.error("El email debe contener '@'.", {});
      return;
    }

    if (!validatePassword(password)) {
      toast.error(
        "La contraseña debe tener entre 8 y 15 caracteres, al menos una mayúscula y una minúscula.",
        {}
      );
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    } else {
      setPasswordError(""); // Limpiar el error si coinciden
    }

    try {
      const response = await axios.post(
        `${API_URL}/auth/signup`,
        {
          firstname: firstName,
          lastname: lastName,
          email: email,
          password: password,
          confirmPassword: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Respuesta de la API:", response.data);
      toast.success(
        "Registro exitoso. Redirigiendo a la página de inicio de sesión...",
        {}
      );

      // Redirigir al usuario a la página de login
      setTimeout(() => {
        router.push("/Login");
      }, 2000);

      // Limpiar el formulario
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      if (error.response) {
        // Errores de respuesta del servidor
        const errorMessage =
          error.response.data?.message || "Error al registrarse.";
        toast.error(errorMessage);
      } else {
        // Errores de conexión u otros
        toast.error("Hubo un problema al conectar con el servidor.", {});
      }
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#7b548b]">
      <div className="w-full max-w-4xl rounded-lg bg-[#7b548b] flex flex-col md:flex-row">
        {/* Sección de la imagen */}
        <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-start text-center text-white">
          <Image
            src="/images/valkiriaslogo.jpg"
            alt="Valkirias Logo"
            width={150}
            height={150}
            className="sm:mt-6 xl:pt-24 md:pt-24"
          />
          <h2 className="text-2xl font-bold">¡Bienvenido!</h2>
          <p className="mt-4">
            Sé parte de Valkirias y crea prendas tan únicas como vos.
          </p>
        </div>

        {/* Sección del formulario */}
        <div className="w-full md:w-1/2 p-8 bg-[#7b548b] flex flex-col justify-center">
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

            {/* Campo de contraseña */}
            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setShowPasswordHint(true)}
                onBlur={() => setShowPasswordHint(false)}
                className="w-full border-b-2 border-white bg-transparent p-2 text-white outline-none"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-3"
              >
                {showPassword ? (
                  <FaEye className="text-purple-900" />
                ) : (
                  <FaEyeSlash className="text-purple-900" />
                )}
              </button>
            </div>

            {/* Cláusula de la contraseña */}
            {showPasswordHint && (
              <p className="text-xs text-gray-300 mb-2">
                Debe contener entre 8 y 15 caracteres, una mayúscula y una
                minúscula.
              </p>
            )}

            <div className="relative mb-6">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Repetir contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setShowPasswordHint1(true)}
                onBlur={() => setShowPasswordHint1(false)}
                className="w-full border-b-2 border-white bg-transparent p-2 text-white outline-none"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-2 top-3"
              >
                {showConfirmPassword ? (
                  <FaEye className="text-purple-900" />
                ) : (
                  <FaEyeSlash className="text-purple-900" />
                )}
              </button>
            </div>
            {showPasswordHint1 && (
              <p className="text-xs text-gray-300 mb-2">
                Debe contener entre 8 y 15 caracteres, una mayúscula y una
                minúscula.
              </p>
            )}
            {passwordError && (
              <p className="text-xs text-red-500">{passwordError}</p>
            )}

            <button
              type="submit"
              className="rounded-md bg-purple-300 px-4 py-2 text-white hover:bg-purple-400"
            >
              Registrarse
            </button>
          </form>
          <p className="mt-4 text-sm text-white">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/Login"
              className="font-medium text-purple-300 hover:underline"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
