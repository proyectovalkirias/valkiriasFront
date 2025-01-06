"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const Landingoogle: React.FC = () => {
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
        localStorage.setItem("access_token", data.access_token);
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

      const userInfo = await response.json();
      localStorage.setItem("user_info", JSON.stringify(userInfo));
      showToast(userInfo);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const revokeToken = async () => {
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    console.error("No access token found");
    return;
  }

  try {
    // Revocar el token en Google
    await fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Limpiar la sesión de tu app
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    toast.success("Has cerrado sesión correctamente");

    // Opcional: Redirigir al usuario a la página de inicio
    window.location.href = "/";
  } catch (error) {
    console.error("Error revoking token:", error);
    toast.error("Error cerrando sesión");
  }
};



  const showToast = (userInfo: any) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        onClick={() => {
          toast.dismiss(t.id);
          window.location.href = "/";
        }}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <Image
                className="h-10 w-10 rounded-full"
                src={userInfo.picture}
                alt={userInfo.name}
                width={100} 
                height={100} 
              />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {userInfo.name}
              </p>
              <p className="mt-1 text-sm text-gray-500">{userInfo.email}</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              window.location.href = "/";
            }}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    ));
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
