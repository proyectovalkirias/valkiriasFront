"use client"
import React from 'react';

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = `https://localhost:3000/google`;
  };

  return (
    <div>
      <button onClick={handleGoogleLogin}>Iniciar sesión con Google</button>
    </div>
  );
};

export default Login;
