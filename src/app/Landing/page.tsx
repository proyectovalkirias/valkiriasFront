"use client";
import { useRouter } from "next/navigation"; 
import { useEffect } from "react";
import axios from "axios";

const GoogleAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchGoogleAuth = async () => {
      // Verifica si estamos en el cliente antes de acceder a router.query o localStorage
      if (typeof window === "undefined") return;

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) return;

      try {
        const res = await axios.post("https://valkiriasback.onrender.com/google/redirect", { code });
        const { token } = res.data;

        localStorage.setItem("token", token);
        console.log("Token recibido:", token);

        router.push("/Dashboard");
      } catch (error) {
        console.error("Error during Google authentication", error);
        router.push("/Login");
      }
    };

    fetchGoogleAuth();
  }, [router]);

  return <p>Authenticating...</p>;
};

export default GoogleAuth;
