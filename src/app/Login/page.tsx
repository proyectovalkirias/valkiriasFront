"use client"
import React from 'react';

const GOOGLE_CLIENT_ID = "634423829747-32kn123g67grqggkm2v14f6agaiiu6hp.apps.googleusercontent.com";
const REDIRECT_URI = "http://localhost:3001/Landing";

const Login = () => {

  const handleGoogleLogin = () => {
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=634423829747-32kn123g67grqggkm2v14f6agaiiu6hp.apps.googleusercontent.com&redirect_uri=http://localhost:3000/google/redirect&response_type=code&scope=openid profile email`;

  };


  return (
    <div>
      <button onClick={handleGoogleLogin}>Iniciar sesión con Google</button>
    </div>
  );
};

export default Login;
