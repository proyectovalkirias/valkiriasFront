"use client";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface UserInfo {
  given_name: string;  // Primer nombre
  family_name: string; // Apellido
  picture: string;     // Foto de perfil
  email: string;       // Email del usuario
}

const Landingoogle: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      exchangeCodeForToken(code);
    }
  }, []);

  const exchangeCodeForToken = async (code: string) => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!;
    const tokenUrl = process.env.TOKEN_URL!;
    const body = new URLSearchParams();
    body.append("code", code);
    body.append("client_id", clientId);
    body.append("client_secret", clientSecret);
    body.append("redirect_uri", redirectUri);
    body.append("grant_type", "authorization_code");

    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      const data = await response.json();
      if (data.access_token) {
        fetchUserInfo(data.access_token);
      } else {
        toast.error("No se pudo obtener el token de Google");
        router.push("/Login");
      }
    } catch (error) {
      console.error("Error exchanging code:", error);
      toast.error("Error al procesar el inicio de sesión con Google");
      router.push("/Login");
    }
  };

  const fetchUserInfo = async (accessToken: string) => {
    const userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";

    try {
      const response = await fetch(userInfoUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userInfo: UserInfo = await response.json();

      // Console log para ver todos los datos de Google
      console.log("Datos recibidos de Google:", userInfo);

      sendUserDataToBackend(userInfo, accessToken);
    } catch (error) {
      console.error("Error fetching user info:", error);
      toast.error("Error al obtener información del usuario");
      router.push("/Login");
    }
  };

  const sendUserDataToBackend = async (userInfo: UserInfo, accessToken: string) => {
    try {
      const response = await fetch(`https://valkiriasback.onrender.com/auth/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: userInfo.given_name, // Primer nombre
          lastname: userInfo.family_name, // Apellido
          photo: userInfo.picture,       // Foto de perfil
          email: userInfo.email,         // Email del usuario
          accessToken: accessToken,      // Token de acceso de Google
        }),
      });

      const data = await response.json();

      if (data.isRegistered) {
        // Guardar los datos SOLO si el usuario está registrado
        localStorage.setItem("user_info", JSON.stringify(userInfo));
        localStorage.setItem("access_token", data.token); // Si el backend retorna un token
        toast.success("Bienvenido de nuevo");
        router.push("/");
      } else {
        // Si no está registrado, limpiar datos y redirigir
        toast.error(
          "Usuario no registrado en la base de datos, por favor regístrate para seguir comprando"
        );
        router.push("/Register");
      }
    } catch (error) {
      console.error("Error verificando el correo:", error);
      toast.error("Error verificando el correo en la base de datos");
      router.push("/Login");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Procesando Inicio de Sesión...</h1>
      <p>Por favor, espera mientras procesamos tu inicio de sesión con Google.</p>
    </div>
  );
};

export default Landingoogle;
