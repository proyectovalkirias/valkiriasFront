"use client"
import React from 'react';

const GOOGLE_CLIENT_ID = "634423829747-32kn123g67grqggkm2v14f6agaiiu6hp.apps.googleusercontent.com";
const REDIRECT_URI = "http://localhost:3001/Landing";

const Login = () => {
    const handleLogin = () => {
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
            REDIRECT_URI
        )}&scope=openid%20email%20profile`;
        window.location.href = googleAuthUrl; // Redirige al usuario a Google
    };

  return (
    <div>
      <button onClick={handleLogin}>Iniciar sesión con Google</button>
    </div>
  );
};

export default Login;
