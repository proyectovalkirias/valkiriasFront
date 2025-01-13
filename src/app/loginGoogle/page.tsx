"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface UserInfo {
  picture: string;
  name: string;
  email: string;
}

const Landingoogle: React.FC = () => {
  const [isClient, setIsClient] = useState(false); // Estado para verificar si estamos en el cliente

  useEffect(() => {
    setIsClient(true); // Indicar que ahora estamos en el cliente

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    console.log("code:", code);

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
      console.log("Data fetch Token URL:", data);

      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);

        // Llamamos a la función para obtener los datos del usuario en segundo plano
        fetchUserInfo(data.access_token);
      }
    } catch (error) {
      console.error("Error exchanging code:", error);
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
      localStorage.setItem("user_info", JSON.stringify(userInfo));

      console.log("UserInfo:", userInfo);

      // Mostrar un toast de bienvenida
      toast.success(`¡Bienvenido, ${userInfo.name}!`, { duration: 3000 });

      // Redirigir al home después de mostrar el toast
      if (isClient) {
        setTimeout(() => {
          window.location.href = "/"; // Redirigir al home utilizando window.location
        }, 3000); // 3 segundos de espera
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
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
