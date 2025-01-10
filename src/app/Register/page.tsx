"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Importa useRouter
import { toast } from "react-hot-toast"; // Importa react-hot-toast
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importa los íconos

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false); // Estado para contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para confirmar contraseña

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error("Todos los campos son obligatorios.", {
        duration: 3000,
      });
      return;
    }

    if (!email.includes("@")) {
      toast.error("El email debe contener '@'.", {
        duration: 3000,
      });
      return;
    }

    if (!validatePassword(password)) {
      toast.error(
        "La contraseña debe tener entre 8 y 15 caracteres, al menos una mayúscula y una minúscula.",
        {
          duration: 3000,
        }
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.", {
        duration: 3000,
      });
      return;
    }

    try {
      const response = await fetch(
        "https://valkiriasback.onrender.com/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstname: firstName,
            lastname: lastName,
            email: email,
            password: password,
            confirmPassword: password,
          }),
        }
      );

      const contentType = response.headers.get("Content-Type");

      if (!response.ok) {
        if (contentType?.includes("application/json")) {
          const errorData = await response.json();
          toast.error(errorData.message || "Error al registrarse.", {
            duration: 3000,
          });
        } else {
          const errorText = await response.text();
          toast.error(errorText || "Error al registrarse.", {
            duration: 3000,
          });
        }
        return;
      }

      toast.success(
        "Registro exitoso. Redirigiendo a la página de inicio de sesión...",
        {
          duration: 3000,
        }
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
    } catch (err) {
      toast.error("Hubo un problema al conectar con el servidor.", {
        duration: 3000,
      });
      console.error(err);
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
            <div className="relative mb-2">
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
                className="absolute right-2 top-3"
              >
                {showPassword ? (
                  <FaEye className="text-purple-900" />
                ) : (
                  <FaEyeSlash className="text-purple-900" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-300 mb-2">
              Debe contener entre 8 y 15 caracteres, una mayúscula y una
              minúscula.
            </p>
            <div className="relative mb-6">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Repetir contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
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
