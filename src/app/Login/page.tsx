"use client"
import React from 'react';

const Login = () => {
  const handleGoogleLogin = () => {
    const clientID = '634423829747-32kn123g67grqggkm2v14f6agaiiu6hp.apps.googleusercontent.com';
    const redirectURI = 'http://localhost:3000/google/redirect';
    const scope = 'openid profile email';
    const responseType = 'code';

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=${responseType}&scope=${scope}`;
  };

  return (
    <div>
      <button onClick={handleGoogleLogin}>Iniciar sesión con Google</button>
    </div>
  );
};

export default Login;