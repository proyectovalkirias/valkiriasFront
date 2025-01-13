// helpers/authHelper.ts

import { setToken } from "./tokenHelper";
import toast from "react-hot-toast";

export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    // Realiza la solicitud con fetch
    const response = await fetch("https://valkiriasback.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    // Maneja la respuesta
    if (!response.ok) {
      throw new Error("Credenciales incorrectas");
    }

    const { token } = await response.json();

    if (token) {
      setToken(token); // Guarda el token en donde corresponda
      toast.success("Inicio de sesión exitoso.");
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    toast.error("Credenciales incorrectas.");
    return false;
  }
};
