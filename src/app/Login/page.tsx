"use client"
import React from 'react';

const GOOGLE_CLIENT_ID = "634423829747-32kn123g67grqggkm2v14f6agaiiu6hp.apps.googleusercontent.com";
const REDIRECT_URI = "https://localhost:3001/Landing"; 

const Login = () => {
  const handleGoogleLogin = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid profile email`;
    window.location.href = authUrl;
  };


  return (
    <div>
      <button onClick={handleGoogleLogin}>Iniciar sesión con Google</button>
    </div>
  );
};

export default Login;
