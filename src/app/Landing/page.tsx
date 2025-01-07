"use client"
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const GoogleAuth = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar si estamos en el cliente antes de ejecutar cualquier código
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return; // Solo ejecutar en el cliente

    const fetchGoogleAuth = async () => {
      const { code } = router.query;

      if (!code) return; // Si no hay código, no hacer nada.

      try {
        // Realizar la solicitud al backend para obtener el token con el código de autorización
        const res = await axios.post(
          'http://localhost:3000/google/redirect', { code }
        );
        
        const { token } = res.data;
        
        // Guardar el token JWT en el almacenamiento local
        localStorage.setItem('token', token);

        console.log('Token recibido:', token);
        
        // Redirigir a la página principal o dashboard
        console.log('Redirigiendo a /dashboard...');
        router.push('/dashboard');
      } catch (error) {
        console.error('Error during Google authentication', error);
        router.push('/Login'); // En caso de error, redirigir al login
      }
    };

    // Solo ejecutar la autenticación si code está disponible en la query.
    if (router.query.code) {
      fetchGoogleAuth();
    }
  }, [isMounted, router.query.code]); // Asegurarse de que solo se ejecute en el cliente

  return <p>Authenticating...</p>;
};

export default GoogleAuth;