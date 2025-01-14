"use client";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

interface UserInfo {
  picture: string;
  name: string;
  email: string;
}

const Landingoogle: React.FC = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    console.log("code:" + code);

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
      console.log("UserInfo:", userInfo);

      // Verificar si el email existe en la base de datos
      const checkEmailResponse = await fetch(
        `https://valkiriasback.onrender.com/users/email/${userInfo.email}`
      );

      if (checkEmailResponse.ok) {
        // El usuario está registrado, guardar datos en localStorage
        localStorage.setItem("user_info", JSON.stringify(userInfo));
        localStorage.setItem("access_token", accessToken);

        // Mostrar el toast de bienvenida
        toast.success(`Bienvenido, ${userInfo.name}!`);

        // Redirigir al home
        window.location.href = "/";
      } else {
        // El usuario no está registrado, mostrar mensaje de error y redirigir al registro
        toast.error("Usuario no registrado en la base de datos, por favor regístrate.");
        window.location.href = "/Register";
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Procesando Inicio de Sesión...</h1>
      <p>
        Por favor, espera mientras procesamos tu inicio de sesión con Google.
      </p>
    </div>
  );
};

export default Landingoogle;
