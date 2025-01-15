"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const [showPasswordHint1, setShowPasswordHint1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true); // Estado para la validación de contraseñas

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };
      // Validar si las contraseñas coinciden mientras se escriben
      if (name === "confirmPassword") {
        setPasswordsMatch(value === formData.password);
      }
      return newData;
    });
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    if (!email.includes("@")) {
      toast.error("El email debe contener '@'.");
      return;
    }

    if (!validatePassword(password)) {
      toast.error(
        "La contraseña debe tener entre 8 y 15 caracteres, al menos una mayúscula y una minúscula."
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

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
        "Registro exitoso. Redirigiendo a la página de inicio de sesión..."
      );

      setTimeout(() => {
        router.push("/Login");
      }, 2000);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message || "Error al registrarse.";
        toast.error(errorMessage);
      } else {
        toast.error("Hubo un problema al conectar con el servidor.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#7b548b]">
      <div className="w-full max-w-4xl rounded-lg bg-[#7b548b] flex flex-col md:flex-row">
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
                  <FaEye className="text-white" />
                ) : (
                  <FaEyeSlash className="text-white" />
                )}
              </button>
            </div>

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
                  <FaEye className="text-white" />
                ) : (
                  <FaEyeSlash className="text-white" />
                )}
              </button>
            </div>

            {showPasswordHint1 && (
              <p className="text-xs text-gray-300 mb-2">
                Debe contener entre 8 y 15 caracteres, una mayúscula y una
                minúscula.
              </p>
            )}

            {/* Mostrar mensaje de error si las contraseñas no coinciden */}
            {!passwordsMatch && (
              <p className="text-xs text-red-200 mb-2">
                Las contraseñas no coinciden.
              </p>
            )}

            <button
              type="submit"
              className="rounded-md bg-purple-300 px-4 py-2 text-white hover:bg-purple-400"
              disabled={loading}
            >
              {loading && <FaSpinner className="animate-spin mr-2" />}
              {loading ? "Guardando datos..." : "Registrarse"}
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
