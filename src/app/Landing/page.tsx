"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

const GoogleAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Asegurarse de que el código solo se ejecute en el lado del cliente
  if (typeof window === 'undefined') {
    return null;
  }

  useEffect(() => {
    const fetchGoogleAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) return; // Si no hay código, no hacer nada.

      try {
        // 1. Obtener el ID Token de Google
        const googleRes = await axios.post('https://oauth2.googleapis.com/token', {
          code,
          client_id: 'TU_CLIENT_ID',
          client_secret: 'TU_CLIENT_SECRET',
          redirect_uri: 'TU_REDIRECT_URI',
          grant_type: 'authorization_code',
        });

        const { id_token } = googleRes.data;

        // 2. Decodificar el ID Token para obtener el email
        const userInfo = JSON.parse(atob(id_token.split('.')[1]));
        const email = userInfo.email;

        console.log('Correo obtenido de Google:', email);

        // 3. Verificar si el correo está registrado en tu backend
        const userRes = await axios.get(
          `https://valkiriasback.onrender.com/users/email/${email}`
        );

        if (userRes.data && userRes.data.isRegistered) {
          // El usuario está registrado, almacenar el token JWT
          const token = userRes.data.token;  // Asumiendo que tu backend te devuelve un token si está registrado

          // Guardar el token JWT en el almacenamiento local
          localStorage.setItem('token', token);

          console.log('Token recibido:', token);

          // Redirigir a la página de dashboard
          window.location.href = '/dashboard';
        } else {
          console.error('El correo no está registrado.');
          window.location.href = '/Register'; // Redirigir al registro si no está registrado
        }
      } catch (error) {
        console.error('Error durante la autenticación de Google', error);
        setError('Error durante la autenticación');
        window.location.href = '/Login'; // En caso de error, redirigir al login
      }
    };

    fetchGoogleAuth();
  }, []); // Este efecto solo se ejecuta una vez, al cargar el componente

  if (error) {
    return <p>{error}</p>;
  }

  return <p>Authenticating...</p>;
};

export default GoogleAuth;
