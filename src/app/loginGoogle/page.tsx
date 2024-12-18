"use client";
import React, { useEffect } from "react";

const Logingoogle: React.FC = () => {
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
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      const data = await response.json();

      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        fetchUserInfo(data.access_token);
      }
    } catch (error) {
      console.error('Error exchanging code:', error);
    }
  };

  const fetchUserInfo = async (accessToken: string) => {
    const userInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';

    try {
      const response = await fetch(userInfoUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userInfo = await response.json();
      localStorage.setItem('user_info', JSON.stringify(userInfo));
      alert(`Bienvenido, ${userInfo.name}! Tu email es: ${userInfo.email}`);
      window.location.href = "/";
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Procesando Inicio de Sesión...</h1>
      <p>Por favor, espera mientras procesamos tu inicio de sesión con Google.</p>
    </div>
  );
};

export default Logingoogle;